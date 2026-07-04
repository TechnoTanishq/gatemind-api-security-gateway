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
public class XssDetector implements ThreatDetector {

    private final RequestDataExtractor extractor;

    private static final List<String> XSS_PATTERNS = List.of(
            "<script", "</script>",
            "javascript:",
            "onload=", "onerror=", "onclick=", "onmouseover=",
            "<iframe", "<object", "<embed",
            "<img", "<svg",
            "alert(", "confirm(", "prompt(",
            "document.cookie", "document.write",
            "eval(",
            "%3cscript",            // URL-encoded <script
            "%3c%2fscript",         // URL-encoded </script>
            "&#x3c;script"          // HTML entity encoded
    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange, String body) {
        RequestData request = extractor.extract(exchange);
        String combined = request.getDecodedUrl() + " " + body.toLowerCase();

        for (String pattern : XSS_PATTERNS) {
            if (combined.contains(pattern)) {
                return Optional.of(ThreatFinding.builder()
                        .threatType(ThreatType.XSS)
                        .reason("Detected XSS pattern: " + pattern)
                        .build());
            }
        }
        return Optional.empty();
    }
}
