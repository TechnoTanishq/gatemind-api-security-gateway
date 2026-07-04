package com.gatemind.client.dto.response;

import com.gatemind.client.entity.enums.ClientStatus;
import com.gatemind.client.entity.enums.Plan;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClientProfileResponse {
    private Long clientId;
    private String companyName;
    private String email;
    private String backendBaseUrl;
    private Plan plan;
    private ClientStatus status;
    private LocalDateTime createdAt;
    // NOTE: apiKeyHash is never returned — only the plain key is returned once at registration
}
