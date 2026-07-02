package com.gatemind.gateway.filters;

import com.gatemind.gateway.analytics.dto.SecurityEventRequest;
import com.gatemind.gateway.analytics.enums.EventType;
import com.gatemind.gateway.analytics.service.SecurityEventService;
import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.common.RequestContext;
import com.gatemind.gateway.common.RequestContextHolder;
import com.gatemind.gateway.security.model.ThreatDetectionResult;
import com.gatemind.gateway.security.model.ThreatFinding;
import com.gatemind.gateway.security.service.ThreatDetectionService;
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

import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class ThreatDetectionFilter implements GlobalFilter, Ordered {

    private final ThreatDetectionService threatDetectionService;
    private final SecurityEventService securityEventService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ThreatDetectionResult result = threatDetectionService.detect(exchange);

        if (result.isMalicious()) {

            log.warn("Threat(s) detected : {}", result.getFindings());

            saveSecurityEvent(exchange, result);

            return ResponseUtil.buildErrorResponse(
                    exchange,
                    HttpStatus.FORBIDDEN,
                    ErrorCode.HIGH_RISK_REQUEST,
                    "Threat(s) detected",
                    result.getFindings()
            );
        }

        return chain.filter(exchange);
    }

    private void saveSecurityEvent(ServerWebExchange exchange, ThreatDetectionResult result) {
        try {
            RequestContext ctx = RequestContextHolder.get(exchange);

            String reasons = result.getFindings().stream()
                    .map(ThreatFinding::getReason)
                    .collect(Collectors.joining(", "));

            String eventTypeName = result.getFindings().stream()
                    .findFirst()
                    .map(f -> f.getThreatType().name())
                    .orElse("UNKNOWN");

            EventType eventType;
            try {
                eventType = EventType.valueOf(eventTypeName);
            } catch (IllegalArgumentException e) {
                eventType = EventType.AI_BLOCKED;
            }

            SecurityEventRequest request = SecurityEventRequest.builder()
                    .correlationId(ctx != null ? ctx.getCorrelationId() : null)
                    .clientId(ctx != null ? ctx.getClientId() : null)
                    .companyName(ctx != null ? ctx.getCompanyName() : null)
                    .apiKey(ctx != null ? ctx.getApiKey() : null)
                    .ipAddress(ctx != null ? ctx.getClientIp() : null)
                    .method(exchange.getRequest().getMethod().name())
                    .path(exchange.getRequest().getURI().getPath())
                    .query(exchange.getRequest().getURI().getQuery())
                    .userAgent(exchange.getRequest().getHeaders().getFirst("User-Agent"))
                    .eventType(eventType)
                    .reason(reasons)
                    .blocked(true)
                    .build();

            securityEventService.save(request);

        } catch (Exception e) {
            log.error("Failed to save security event: {}", e.getMessage());
        }
    }

    @Override
    public int getOrder() {
        return 5;
    }
}
