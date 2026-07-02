package com.gatemind.gateway.filters;

import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.security.model.ThreatDetectionResult;
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

@Slf4j
@Component
@RequiredArgsConstructor
public class ThreatDetectionFilter implements GlobalFilter, Ordered {

    private final ThreatDetectionService threatDetectionService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        ThreatDetectionResult result =
                threatDetectionService.detect(exchange);

        if (result.isMalicious()) {

            log.warn("Threat(s) detected : {}", result.getFindings());

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

    @Override
    public int getOrder() {
        return 5;
    }
}