package com.gatemind.gateway.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.common.RequestContext;
import com.gatemind.gateway.common.RequestContextHolder;
import com.gatemind.gateway.dto.ErrorResponse;
import com.gatemind.gateway.security.model.ThreatFinding;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

public class ResponseUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    private ResponseUtil() {
    }

    public static Mono<Void> buildErrorResponse(
            ServerWebExchange exchange,
            HttpStatus status,
            ErrorCode errorCode,
            String message) {
        return buildErrorResponse(exchange, status, errorCode, message, null);
    }

    public static Mono<Void> buildErrorResponse(
            ServerWebExchange exchange,
            HttpStatus status,
            ErrorCode errorCode,
            String message,
            List<ThreatFinding> threats) {

        RequestContext context = RequestContextHolder.get(exchange);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .errorCode(errorCode)
                .message(message)
                .correlationId(context != null ? context.getCorrelationId() : null)
                .path(exchange.getRequest().getURI().getPath())
                .threats(threats)
                .build();

        try {
            byte[] body = objectMapper.writeValueAsBytes(response);

            exchange.getResponse().setStatusCode(status);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

            return exchange.getResponse()
                    .writeWith(Mono.just(
                            exchange.getResponse().bufferFactory().wrap(body)));

        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return exchange.getResponse().setComplete();
        }
    }
}