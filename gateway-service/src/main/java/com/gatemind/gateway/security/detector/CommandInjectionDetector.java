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
public class CommandInjectionDetector implements ThreatDetector {

    private final RequestDataExtractor extractor;

    private static final List<String> PATTERNS = List.of(
            // Literal operators
            "&&", "||", "|",
            // URL-encoded operators
            "%7c", "%26%26", "%7c%7c",  // |, &&, ||
            // Command separators
            ";", "%3b",
            // Shell execution
            "`", "$(", "%60", "%24%28",
            // Common commands
            "wget ", "curl ", "bash ", "sh ",
            "powershell", "cmd.exe",
            "whoami", "ifconfig", "ipconfig",
            "ping ", "nmap ", "nc ", "netcat",
            "/bin/sh", "/bin/bash"
    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange, String body) {
        RequestData request = extractor.extract(exchange);

        // Use raw query to catch encoded chars before they get normalized
        String rawQuery = exchange.getRequest().getURI().getRawQuery() != null
                ? exchange.getRequest().getURI().getRawQuery().toLowerCase() : "";
        String combined = request.getDecodedUrl() + " " + rawQuery + " " + body.toLowerCase();

        for (String pattern : PATTERNS) {
            if (combined.contains(pattern)) {
                return Optional.of(ThreatFinding.builder()
                        .threatType(ThreatType.COMMAND_INJECTION)
                        .reason("Detected Command Injection: " + pattern)
                        .build());
            }
        }
        return Optional.empty();
    }
}
