package com.gatemind.gateway.analytics.entity;

import com.gatemind.gateway.analytics.enums.EventType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "security_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant timestamp;

    private String correlationId;

    private Long clientId;

    private String companyName;

    private String apiKey;

    private String ipAddress;

    private String method;

    private String path;

    @Column(length = 3000)
    private String query;

    @Column(length = 5000)
    private String requestBody;

    @Column(length = 1000)
    private String userAgent;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @Column(length = 2000)
    private String reason;

    private boolean blocked;

    private Double riskScore;
}