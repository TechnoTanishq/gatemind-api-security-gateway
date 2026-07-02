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
public class SqlInjectionDetector implements ThreatDetector {

    private final RequestDataExtractor extractor;

    private static final List<String> SQL_PATTERNS = List.of(

            "' or ",

            "\" or ",

            "union select",

            "drop table",

            "insert into",

            "delete from",

            "--",

            ";--",

            "xp_cmdshell",

            "information_schema"

    );

    @Override
    public Optional<ThreatFinding> detect(ServerWebExchange exchange) {

        RequestData request = extractor.extract(exchange);

        for (String pattern : SQL_PATTERNS) {

            if (request.getDecodedUrl().contains(pattern)) {

                return Optional.of(

                        ThreatFinding.builder()
                                .threatType(ThreatType.SQL_INJECTION)
                                .reason("Detected SQL Injection pattern : " + pattern)
                                .build()

                );

            }

        }

        return Optional.empty();
    }

}