package com.gatemind.gateway.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopIpResponse {

    private String ipAddress;
    private Long count;

}