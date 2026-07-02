package com.gatemind.gateway.analytics.service;

import com.gatemind.gateway.analytics.dto.SecurityEventRequest;
import com.gatemind.gateway.analytics.entity.SecurityEvent;
import com.gatemind.gateway.analytics.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SecurityEventService {

    private final SecurityEventRepository repository;

    public void save(SecurityEventRequest request){

        SecurityEvent event = SecurityEvent.builder()

                .timestamp(Instant.now())

                .clientId(request.getClientId())

                .companyName(request.getCompanyName())

                .apiKey(request.getApiKey())

                .correlationId(request.getCorrelationId())

                .ipAddress(request.getIpAddress())

                .method(request.getMethod())

                .path(request.getPath())

                .query(request.getQuery())

                .requestBody(request.getRequestBody())

                .userAgent(request.getUserAgent())

                .eventType(request.getEventType())

                .reason(request.getReason())

                .blocked(request.isBlocked())

                .riskScore(request.getRiskScore())

                .build();

        repository.save(event);
    }

}