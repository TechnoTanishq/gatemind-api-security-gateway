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

            "&&",
            "||",
            ";",
            "|",
            "`",
            "$(",
            "wget",
            "curl",
            "bash",
            "powershell",
            "cmd.exe"

    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange) {

        RequestData request = extractor.extract(exchange);

        for (String pattern : PATTERNS) {

            if (request.getDecodedUrl().contains(pattern)) {

                return Optional.of(
                        ThreatFinding.builder()
                                .threatType(ThreatType.COMMAND_INJECTION)
                                .reason("Detected Command Injection : " + pattern)
                                .build()
                );
            }
        }

        return Optional.empty();
    }
}