package com.gatemind.gateway.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopThreatResponse {

    private String threatType;
    private Long count;

}