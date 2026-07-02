package com.gatemind.gateway.filters;

import com.gatemind.gateway.client.ApiKeyValidationResponse;
import com.gatemind.gateway.client.CachedClient;
import com.gatemind.gateway.client.ClientServiceClient;
import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.common.RequestContext;
import com.gatemind.gateway.common.RequestContextHolder;
import com.gatemind.gateway.service.ClientCacheService;
import com.gatemind.gateway.util.HashUtil;
import com.gatemind.gateway.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter implements GlobalFilter, Ordered {

    private static final String API_KEY_HEADER = "X-API-Key";

    private final ClientServiceClient clientServiceClient;
    private final ClientCacheService clientCacheService;
    private final HashUtil hashUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        String apiKey = exchange.getRequest()
                .getHeaders()
                .getFirst(API_KEY_HEADER);

        // Check header
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseUtil.buildErrorResponse(
                    exchange,
                    HttpStatus.UNAUTHORIZED,
                    ErrorCode.INVALID_API_KEY,
                    "API Key is missing."
            );
        }

        // Generate Redis cache key
        String cacheKey = hashUtil.sha256(apiKey);

        // Check Redis first
        CachedClient cachedClient = clientCacheService.get(cacheKey);

        if (cachedClient != null) {

            log.info("✅ API Key validated from Redis cache.");

            RequestContext ctx = RequestContextHolder.get(exchange);
            if (ctx != null) {
                ctx.setClientId(cachedClient.getClientId());
                ctx.setApiKey(apiKey);
                ctx.setPlan(cachedClient.getPlan());
                ctx.setStatus(cachedClient.getStatus());
                ctx.setCompanyName(cachedClient.getCompanyName());
            }

            exchange.getAttributes().put("clientId", cachedClient.getClientId());
            exchange.getAttributes().put("plan", cachedClient.getPlan());
            exchange.getAttributes().put("status", cachedClient.getStatus());

            return chain.filter(exchange);
        }

        log.info("❌ Redis Cache MISS. Calling Client Service...");

        // Cache miss -> call client-service
        return clientServiceClient.validate(apiKey)

                .flatMap((ApiKeyValidationResponse response) -> {

                    if (response == null || !response.isValid()) {

                        return ResponseUtil.buildErrorResponse(
                                exchange,
                                HttpStatus.UNAUTHORIZED,
                                ErrorCode.INVALID_API_KEY,
                                "API Key is invalid."
                        );
                    }

                    CachedClient client = new CachedClient(
                            response.getClientId(),
                            response.getPlan(),
                            response.getStatus(),
                            response.getCompanyName()
                    );

                    clientCacheService.save(cacheKey, client);

                    log.info("✅ Client cached in Redis.");

                    RequestContext ctx = RequestContextHolder.get(exchange);
                    if (ctx != null) {
                        ctx.setClientId(response.getClientId());
                        ctx.setApiKey(apiKey);
                        ctx.setPlan(response.getPlan());
                        ctx.setStatus(response.getStatus());
                        ctx.setCompanyName(response.getCompanyName());
                    }

                    exchange.getAttributes().put("clientId", response.getClientId());
                    exchange.getAttributes().put("plan", response.getPlan());
                    exchange.getAttributes().put("status", response.getStatus());

                    return chain.filter(exchange);

                })

                .onErrorResume(ex -> {

                    log.error("Client Service unavailable", ex);

                    return ResponseUtil.buildErrorResponse(
                            exchange,
                            HttpStatus.SERVICE_UNAVAILABLE,
                            ErrorCode.INTERNAL_ERROR,
                            "Client Service unavailable."
                    );

                });
    }

    @Override
    public int getOrder() {
        return 3;
    }
}