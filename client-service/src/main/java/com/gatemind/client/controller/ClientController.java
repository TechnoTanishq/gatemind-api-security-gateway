package com.gatemind.client.controller;

import com.gatemind.client.dto.ApiKeyResponse;
import com.gatemind.client.dto.UpdatePlanRequest;
import com.gatemind.client.dto.request.CreateClientRequest;
import com.gatemind.client.dto.response.ClientListResponse;
import com.gatemind.client.dto.response.CreateClientResponse;
import com.gatemind.client.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientListResponse>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateClientResponse registerClient(
            @Valid @RequestBody CreateClientRequest request) {

        return clientService.registerClient(request);
    }

    @PostMapping("/{id}/rotate-key")
    public ResponseEntity<ApiKeyResponse> rotateKey(
            @PathVariable Long id) {

        String apiKey = clientService.rotateApiKey(id);

        return ResponseEntity.ok(
                new ApiKeyResponse(apiKey)
        );
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<String> suspendClient(@PathVariable Long id) {

        clientService.suspendClient(id);

        return ResponseEntity.ok("Client suspended successfully.");
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<String> activateClient(@PathVariable Long id) {

        clientService.activateClient(id);

        return ResponseEntity.ok("Client activated successfully.");
    }

    @PostMapping("/{id}/revoke")
    public ResponseEntity<String> revokeClient(@PathVariable Long id) {

        clientService.revokeClient(id);

        return ResponseEntity.ok("Client revoked successfully.");
    }

    @PutMapping("/{id}/plan")
    public ResponseEntity<String> updatePlan(
            @PathVariable Long id,
            @RequestBody UpdatePlanRequest request) {

        clientService.updatePlan(id, request.getPlan());

        return ResponseEntity.ok("Plan updated successfully.");
    }




}