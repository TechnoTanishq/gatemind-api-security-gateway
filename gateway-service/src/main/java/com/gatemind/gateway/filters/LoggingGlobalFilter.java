package com.gatemind.gateway.filters;

import com.gatemind.gateway.common.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class LoggingGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        RequestContext context = (RequestContext)
                exchange.getAttributes()
                        .get(RequestContextFilter.CONTEXT);

        log.info("========== Incoming Request ==========");
        log.info("[{}] Method : {}", context.getCorrelationId(), context.getMethod());
        log.info("[{}] Path   : {}", context.getCorrelationId(), context.getPath());
        log.info("[{}] IP     : {}", context.getCorrelationId(), context.getClientIp());
        log.info("======================================");

        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    log.info("========== Outgoing Response ==========");
                    log.info("[{}] Status : {}", context.getCorrelationId(),
                            exchange.getResponse().getStatusCode());
                    log.info("======================================");
                }));
    }

    @Override
    public int getOrder() {
        return 2;
    }
}