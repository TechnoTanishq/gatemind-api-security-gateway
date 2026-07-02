package com.gatemind.gateway.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopClientResponse {

    private String companyName;
    private Long count;

}