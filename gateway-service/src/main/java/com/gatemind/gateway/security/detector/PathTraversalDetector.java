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
public class PathTraversalDetector implements ThreatDetector {

    private final RequestDataExtractor extractor;

    private static final List<String> PATTERNS = List.of(

            "../",
            "..\\",
            "%2e%2e",
            "/etc/passwd",
            "/etc/shadow",
            "boot.ini",
            "c:\\windows"

    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange) {

        RequestData request = extractor.extract(exchange);

        for (String pattern : PATTERNS) {

            if (request.getDecodedUrl().contains(pattern)) {

                return Optional.of(
                        ThreatFinding.builder()
                                .threatType(ThreatType.PATH_TRAVERSAL)
                                .reason("Detected Path Traversal : " + pattern)
                                .build()
                );
            }
        }

        return Optional.empty();
    }
}