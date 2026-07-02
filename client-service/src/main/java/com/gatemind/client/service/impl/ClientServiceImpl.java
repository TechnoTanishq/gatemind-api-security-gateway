package com.gatemind.client.service.impl;

import com.gatemind.client.dto.request.CreateClientRequest;
import com.gatemind.client.dto.response.ApiKeyValidationResponse;
import com.gatemind.client.dto.response.CreateClientResponse;
import com.gatemind.client.entity.Client;
import com.gatemind.client.entity.enums.ClientStatus;
import com.gatemind.client.entity.enums.Plan;
import com.gatemind.client.exceptions.DuplicateClientException;
import com.gatemind.client.repository.ClientRepository;
import com.gatemind.client.service.ClientService;
import com.gatemind.client.util.ApiKeyGenerator;
import com.gatemind.client.util.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    private final ApiKeyGenerator apiKeyGenerator;

    private final HashUtil hashUtil;

    @Override
    public CreateClientResponse registerClient(CreateClientRequest request) {

        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateClientException("Email already registered.");
        }

        String apiKey = apiKeyGenerator.generateApiKey();

        String apiKeyHash = hashUtil.sha256(apiKey);

        Client client = Client.builder()
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .apiKeyHash(apiKeyHash)
                .plan(request.getPlan())
                .status(ClientStatus.ACTIVE)
                .build();

        clientRepository.save(client);

        return CreateClientResponse.builder()
                .clientId(client.getId())
                .companyName(client.getCompanyName())
                .email(client.getEmail())
                .plan(client.getPlan().name())
                .apiKey(apiKey)
                .build();
    }

    @Override
    public ApiKeyValidationResponse validateApiKey(String apiKey) {

        String hash = hashUtil.sha256(apiKey);

        return clientRepository.findByApiKeyHash(hash)
                .map(client -> ApiKeyValidationResponse.builder()
                        .valid(client.getStatus() == ClientStatus.ACTIVE)
                        .clientId(client.getId())
                        .companyName(client.getCompanyName())   // <-- Add
                        .plan(client.getPlan())
                        .status(client.getStatus())
                        .build())
                .orElse(
                        ApiKeyValidationResponse.builder()
                                .valid(false)
                                .build()
                );
    }


    public String rotateApiKey(Long clientId) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Generate new API Key
        String newApiKey = apiKeyGenerator.generateApiKey();

        // Hash it
        String hashedKey = hashUtil.sha256(newApiKey);

        // Save hash
        client.setApiKeyHash(hashedKey);

        clientRepository.save(client);

        return newApiKey;
    }

    public void suspendClient(Long clientId) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setStatus(ClientStatus.SUSPENDED);

        clientRepository.save(client);
    }

    public void activateClient(Long clientId) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setStatus(ClientStatus.ACTIVE);

        clientRepository.save(client);
    }

    public void revokeClient(Long clientId) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setStatus(ClientStatus.REVOKED);

        clientRepository.save(client);
    }

    public void updatePlan(Long clientId, Plan plan) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setPlan(plan);

        clientRepository.save(client);
    }


}