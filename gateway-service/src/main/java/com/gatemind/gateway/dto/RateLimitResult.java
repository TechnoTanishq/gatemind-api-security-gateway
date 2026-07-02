package com.gatemind.gateway.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RateLimitResult {

    private boolean allowed;

    private long currentCount;

    private long limit;

    private long remainingRequests;

    private long resetAfterSeconds;

}