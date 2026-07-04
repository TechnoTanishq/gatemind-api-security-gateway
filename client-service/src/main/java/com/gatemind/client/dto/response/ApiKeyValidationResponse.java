package com.gatemind.client.dto.response;

import com.gatemind.client.entity.enums.ClientStatus;
import com.gatemind.client.entity.enums.Plan;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiKeyValidationResponse {

    private boolean valid;

    private Long clientId;

    private String companyName;

    private String backendBaseUrl;

    private Plan plan;

    private ClientStatus status;


}