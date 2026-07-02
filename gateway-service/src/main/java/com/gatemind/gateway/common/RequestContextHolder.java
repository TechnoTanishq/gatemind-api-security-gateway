package com.gatemind.gateway.common;

import org.springframework.web.server.ServerWebExchange;

public final class RequestContextHolder {

    private RequestContextHolder(){}

    public static RequestContext get(ServerWebExchange exchange) {
        return (RequestContext) exchange.getAttributes()
                .get(GatewayConstants.REQUEST_CONTEXT);
    }
}