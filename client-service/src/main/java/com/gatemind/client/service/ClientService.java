package com.gatemind.client.service;

import com.gatemind.client.dto.request.CreateClientRequest;
import com.gatemind.client.dto.response.ApiKeyValidationResponse;
import com.gatemind.client.dto.response.ClientListResponse;
import com.gatemind.client.dto.response.CreateClientResponse;
import com.gatemind.client.entity.enums.Plan;

import java.util.List;

public interface ClientService {

    CreateClientResponse registerClient(CreateClientRequest request);
    ApiKeyValidationResponse validateApiKey(String apiKey);
    List<ClientListResponse> getAllClients();
    String rotateApiKey(Long clientId);
    void suspendClient(Long clientId);
    void activateClient(Long clientId);
    void revokeClient(Long clientId);
    void updatePlan(Long clientId, Plan plan);
}