package com.gatemind.gateway.security.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ThreatDetectionResult {

    private boolean malicious;

    private List<ThreatFinding> findings;

}