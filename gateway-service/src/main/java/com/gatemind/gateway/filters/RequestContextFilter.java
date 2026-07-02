package com.gatemind.gateway.filters;

import com.gatemind.gateway.common.RequestContext;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Component
public class RequestContextFilter implements GlobalFilter, Ordered {

    public static final String CONTEXT = "REQUEST_CONTEXT";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        RequestContext context = new RequestContext();

        context.setCorrelationId(
                request.getHeaders().getFirst("X-Correlation-ID") != null
                        ? request.getHeaders().getFirst("X-Correlation-ID")
                        : UUID.randomUUID().toString());

        context.setMethod(request.getMethod());

        context.setPath(request.getURI().getPath());

        context.setRequestTime(Instant.now());

        if (request.getRemoteAddress() != null) {
            context.setClientIp(
                    request.getRemoteAddress()
                            .getAddress()
                            .getHostAddress());
        }

        exchange.getAttributes().put(CONTEXT, context);

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 1;
    }
}