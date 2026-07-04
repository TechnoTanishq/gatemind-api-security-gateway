package com.gatemind.gateway.security.service;

import com.gatemind.gateway.security.detector.ThreatDetector;
import com.gatemind.gateway.security.model.ThreatDetectionResult;
import com.gatemind.gateway.security.model.ThreatFinding;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThreatDetectionService {

    private final List<ThreatDetector> detectors;

    public ThreatDetectionResult detect(ServerWebExchange exchange) {
        return detect(exchange, "");
    }

    public ThreatDetectionResult detect(ServerWebExchange exchange, String body) {

        List<ThreatFinding> findings = new ArrayList<>();

        for (ThreatDetector detector : detectors) {
            detector.detect(exchange, body)
                    .ifPresent(findings::add);
        }

        return ThreatDetectionResult.builder()
                .malicious(!findings.isEmpty())
                .findings(findings)
                .build();
    }

}