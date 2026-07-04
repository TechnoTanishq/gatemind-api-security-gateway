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

    // Check both normalized and encoded variants
    private static final List<String> PATTERNS = List.of(
            "../", "..\\",
            "%2e%2e/", "%2e%2e\\",
            "..%2f", "..%5c",
            "%252e%252e",           // double-encoded
            "/etc/passwd", "/etc/shadow", "/etc/hosts",
            "boot.ini", "c:\\windows", "c:/windows",
            "/proc/self", "/var/www",
            "passwd", "shadow"       // catch normalized paths too
    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange, String body) {
        RequestData request = extractor.extract(exchange);

        // Also check the raw (non-normalized) path directly from the URI
        String rawPath = exchange.getRequest().getURI().getRawPath().toLowerCase();
        String rawQuery = exchange.getRequest().getURI().getRawQuery() != null
                ? exchange.getRequest().getURI().getRawQuery().toLowerCase() : "";
        String combined = request.getDecodedUrl() + " " + rawPath + " " + rawQuery + " " + body.toLowerCase();

        for (String pattern : PATTERNS) {
            if (combined.contains(pattern)) {
                return Optional.of(ThreatFinding.builder()
                        .threatType(ThreatType.PATH_TRAVERSAL)
                        .reason("Detected Path Traversal: " + pattern)
                        .build());
            }
        }
        return Optional.empty();
    }
}
