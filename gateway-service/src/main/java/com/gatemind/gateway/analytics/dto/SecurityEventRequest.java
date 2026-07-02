package com.gatemind.gateway.analytics.dto;

import com.gatemind.gateway.analytics.enums.EventType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SecurityEventRequest {

    private Long clientId;

    private String companyName;

    private String apiKey;

    private String correlationId;

    private String ipAddress;

    private String method;

    private String path;

    private String query;

    private String requestBody;

    private String userAgent;

    private EventType eventType;

    private String reason;

    private boolean blocked;

    private Double riskScore;
}