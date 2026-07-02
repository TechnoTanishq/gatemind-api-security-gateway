package com.gatemind.gateway.security.util;

import com.gatemind.gateway.security.model.RequestData;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
public class RequestDataExtractor {

    public RequestData extract(ServerWebExchange exchange) {

        HttpHeaders httpHeaders = exchange.getRequest().getHeaders();

        Map<String, String> headers = new HashMap<>();

        httpHeaders.forEach((key, value) ->
                headers.put(key, String.join(",", value)));

        return RequestData.builder()

                .method(exchange.getRequest().getMethod().name())

                .path(exchange.getRequest().getURI().getPath())

                .fullUrl(exchange.getRequest().getURI().toString())

                .decodedUrl(
                        URLDecoder.decode(
                                exchange.getRequest().getURI().toString(),
                                StandardCharsets.UTF_8
                        ).toLowerCase()
                )

                .userAgent(
                        httpHeaders.getFirst(HttpHeaders.USER_AGENT)
                )

                .clientIp(
                        exchange.getRequest()
                                .getRemoteAddress()
                                .getAddress()
                                .getHostAddress()
                )

                .headers(headers)

                .build();
    }

}