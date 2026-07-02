package com.gatemind.gateway.filters;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CorrelationIdFilter implements GlobalFilter, Ordered {

    public static final String CORRELATION_ID = "X-Correlation-ID";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        String correlationId = UUID.randomUUID().toString();

        ServerWebExchange modifiedExchange = exchange.mutate()
                .request(builder ->
                        builder.header(CORRELATION_ID, correlationId))
                .build();

        return chain.filter(modifiedExchange)
                .then(Mono.fromRunnable(() ->
                        modifiedExchange.getResponse()
                                .getHeaders()
                                .add(CORRELATION_ID, correlationId)));
    }

    @Override
    public int getOrder() {
        return 0;
    }
}