package com.gatemind.gateway.common;

import lombok.Data;
import org.springframework.http.HttpMethod;

import java.time.Instant;

@Data
public class RequestContext {

    private String correlationId;

    private String clientIp;

    private HttpMethod method;

    private String path;

    private Instant requestTime;

    // Filled later

    private Long clientId;

    private String plan;

    private String status;

    private String companyName;

    private String backendBaseUrl;

    private String userId;

    private String apiKey;

    private Integer riskScore;

    private String decision;
}