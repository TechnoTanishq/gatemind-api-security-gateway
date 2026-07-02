package com.gatemind.gateway.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class RecentThreatResponse {

    private Instant timestamp;

    private String companyName;

    private String eventType;

    private String path;

    private String ipAddress;

    private String reason;

}