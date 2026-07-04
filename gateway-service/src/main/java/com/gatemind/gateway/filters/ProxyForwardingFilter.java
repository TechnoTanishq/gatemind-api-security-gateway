package com.gatemind.gateway.filters;

import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Set;

/**
 * Runs last in the pipeline (Order=6).
 * By this point the request has already been:
 *   - authenticated      (ApiKeyAuthenticationFilter)
 *   - rate-limited       (RateLimiterFilter)
 *   - threat-scanned     (ThreatDetectionFilter)
 *
 * This filter:
 *   1. Reads the backendBaseUrl stored in exchange attributes by ApiKeyAuthenticationFilter
 *   2. Builds the full target URL: backendBaseUrl + original path + query
 *   3. Forwards the request verbatim (method, headers, body) using WebClient
 *   4. Streams the upstream response (status, headers, body) back to the caller
 *
 * The caller never knows GateMind sits in between.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProxyForwardingFilter implements GlobalFilter, Ordered {

    // Headers that must not be forwarded to the upstream backend
    private static final Set<String> HOP_BY_HOP_HEADERS = Set.of(
            "connection", "keep-alive", "transfer-encoding",
            "te", "trailers", "upgrade",
            "proxy-authorization", "proxy-authenticate",
            "x-api-key"   // strip our own auth header from upstream requests
    );

    private final WebClient.Builder webClientBuilder;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Admin and internal routes are handled by static Spring Cloud Gateway routes,
        // not by the reverse proxy — skip forwarding for them.
        if (path.startsWith("/analytics") || path.startsWith("/api/v1/clients")
                || path.startsWith("/admin") || path.startsWith("/auth") || path.startsWith("/me")) {
            return chain.filter(exchange);
        }

        String backendBaseUrl = exchange.getAttribute("backendBaseUrl");

        // If no backend URL is registered this client cannot be proxied.
        if (backendBaseUrl == null || backendBaseUrl.isBlank()) {
            log.warn("No backendBaseUrl found for this client — cannot forward request.");
            return ResponseUtil.buildErrorResponse(
                    exchange,
                    HttpStatus.BAD_GATEWAY,
                    ErrorCode.INTERNAL_ERROR,
                    "No backend URL registered for this client."
            );
        }

        ServerHttpRequest inbound = exchange.getRequest();
        ServerHttpResponse outbound = exchange.getResponse();

        // Build target URI: backendBaseUrl + path + query string
        String rawPath = inbound.getURI().getRawPath();
        String query   = inbound.getURI().getRawQuery();
        String targetUrl = backendBaseUrl + rawPath + (query != null ? "?" + query : "");

        log.info("→ Forwarding {} {} → {}", inbound.getMethod(), rawPath, targetUrl);

        // Copy inbound headers, dropping hop-by-hop and our own auth header
        HttpHeaders forwardHeaders = new HttpHeaders();
        inbound.getHeaders().forEach((name, values) -> {
            if (!HOP_BY_HOP_HEADERS.contains(name.toLowerCase())) {
                forwardHeaders.addAll(name, values);
            }
        });

        // Build and execute the upstream request
        WebClient webClient = webClientBuilder.build();

        return webClient
                .method(inbound.getMethod())
                .uri(URI.create(targetUrl))
                .headers(h -> h.addAll(forwardHeaders))
                .body(inbound.getBody(), DataBuffer.class)
                .exchangeToMono(upstreamResponse -> {

                    // Mirror the upstream status code
                    outbound.setStatusCode(upstreamResponse.statusCode());

                    // Mirror upstream response headers, skipping hop-by-hop
                    upstreamResponse.headers().asHttpHeaders().forEach((name, values) -> {
                        if (!HOP_BY_HOP_HEADERS.contains(name.toLowerCase())) {
                            outbound.getHeaders().addAll(name, values);
                        }
                    });

                    log.info("← Upstream responded with {}", upstreamResponse.statusCode());

                    // Stream body back to original caller
                    return outbound.writeWith(upstreamResponse.bodyToFlux(DataBuffer.class));
                })

                .onErrorResume(ex -> {
                    log.error("Upstream request failed: {}", ex.getMessage());
                    return ResponseUtil.buildErrorResponse(
                            exchange,
                            HttpStatus.BAD_GATEWAY,
                            ErrorCode.INTERNAL_ERROR,
                            "Upstream backend is unavailable or returned an error."
                    );
                });
    }

    @Override
    public int getOrder() {
        return 6;
    }
}
