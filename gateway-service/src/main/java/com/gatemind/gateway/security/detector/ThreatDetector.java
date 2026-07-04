package com.gatemind.gateway.security.detector;

import com.gatemind.gateway.security.model.ThreatFinding;
import org.springframework.web.server.ServerWebExchange;

import java.util.Optional;

public interface ThreatDetector {

    Optional<ThreatFinding> detect(ServerWebExchange exchange, String body);

}
