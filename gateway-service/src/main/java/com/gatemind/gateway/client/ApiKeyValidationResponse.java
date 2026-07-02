package com.gatemind.gateway.client;

import lombok.Data;

@Data
public class ApiKeyValidationResponse {

    private boolean valid;

    private Long clientId;

    private String plan;

    private String status;

    private String companyName;

}