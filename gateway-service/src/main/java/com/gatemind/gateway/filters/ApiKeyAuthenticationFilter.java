package com.gatemind.gateway.filters;

import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.util.ResponseUtil;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class ApiKeyAuthenticationFilter implements GlobalFilter, Ordered {

    private static final String API_KEY_HEADER = "X-API-Key";
    private static final String VALID_API_KEY = "gate-123456";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        String apiKey = request.getHeaders().getFirst(API_KEY_HEADER);

        if (apiKey == null || !apiKey.equals(VALID_API_KEY)) {

            return ResponseUtil.buildErrorResponse(
                    exchange,
                    HttpStatus.UNAUTHORIZED,
                    ErrorCode.INVALID_API_KEY,
                    "API Key is missing or invalid."
            );
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 3;
    }
}