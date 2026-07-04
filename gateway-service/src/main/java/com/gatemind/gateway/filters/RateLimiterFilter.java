package com.gatemind.gateway.filters;

import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.common.GatewayConstants;
import com.gatemind.gateway.service.RateLimiterService;
import com.gatemind.gateway.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class RateLimiterFilter implements GlobalFilter, Ordered {

    private final RateLimiterService rateLimiterService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        if (path.startsWith("/analytics") || path.startsWith("/api/v1/clients")
                || path.startsWith("/admin") || path.startsWith("/auth") || path.startsWith("/me")) {
            return chain.filter(exchange);
        }

        String apiKey = exchange.getRequest()
                .getHeaders()
                .getFirst(GatewayConstants.API_KEY_HEADER);
        String plan = exchange.getAttribute("plan");

        return rateLimiterService.isAllowed(apiKey, plan)

                .flatMap(result -> {

                    if (!result.isAllowed()) {

                        return ResponseUtil.buildErrorResponse(
                                exchange,
                                org.springframework.http.HttpStatus.TOO_MANY_REQUESTS,
                                ErrorCode.RATE_LIMIT_EXCEEDED,
                                "Rate limit exceeded."
                        );

                    }

                    exchange.getResponse().getHeaders()
                            .add("X-RateLimit-Limit",
                                    String.valueOf(result.getLimit()));

                    exchange.getResponse().getHeaders()
                            .add("X-RateLimit-Remaining",
                                    String.valueOf(result.getRemainingRequests()));

                    exchange.getResponse().getHeaders()
                            .add("X-RateLimit-Reset",
                                    String.valueOf(result.getResetAfterSeconds()));

                    return chain.filter(exchange);

                });

    }

    @Override
    public int getOrder() {
        return 4;
    }
}