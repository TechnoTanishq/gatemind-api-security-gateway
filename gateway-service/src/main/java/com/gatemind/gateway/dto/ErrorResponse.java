package com.gatemind.gateway.dto;

import com.gatemind.gateway.common.ErrorCode;
import com.gatemind.gateway.security.model.ThreatFinding;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ErrorResponse {

    private Instant timestamp;

    private int status;

    private String error;

    private ErrorCode errorCode;

    private String message;

    private String correlationId;

    private String path;

    private List<ThreatFinding> threats;
}