package com.gatemind.gateway.security.detector;

import com.gatemind.gateway.security.model.RequestData;
import com.gatemind.gateway.security.model.ThreatFinding;
import com.gatemind.gateway.security.model.ThreatType;
import com.gatemind.gateway.security.util.RequestDataExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SuspiciousUserAgentDetector implements ThreatDetector {

    private final RequestDataExtractor extractor;

    private static final List<String> AGENTS = List.of(

            "sqlmap",
            "nikto",
            "nmap",
            "masscan",
            "python-requests",
            "go-http-client",
            "curl"

    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange) {

        RequestData request = extractor.extract(exchange);

        String userAgent = request.getUserAgent();

        if (userAgent == null) {
            return Optional.empty();
        }

        userAgent = userAgent.toLowerCase();

        for (String agent : AGENTS) {

            if (userAgent.contains(agent)) {

                return Optional.of(
                        ThreatFinding.builder()
                                .threatType(ThreatType.SUSPICIOUS_USER_AGENT)
                                .reason("Detected Suspicious User-Agent : " + agent)
                                .build()
                );
            }
        }

        return Optional.empty();
    }
}