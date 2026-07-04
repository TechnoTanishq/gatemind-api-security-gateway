package com.gatemind.client.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateClientResponse {

    private Long clientId;

    private String companyName;

    private String email;

    private String backendBaseUrl;

    private String apiKey;

    private String plan;
}