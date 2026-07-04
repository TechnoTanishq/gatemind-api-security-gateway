package com.gatemind.client.controller;

import com.gatemind.client.dto.ApiKeyResponse;
import com.gatemind.client.dto.response.ClientProfileResponse;
import com.gatemind.client.security.AuthenticatedClient;
import com.gatemind.client.service.AuthService;
import com.gatemind.client.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Self-service endpoints for logged-in clients.
 * All routes require a valid JWT with ROLE_CLIENT.
 */
@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class MeController {

    private final AuthService authService;
    private final ClientService clientService;

    @GetMapping
    public ClientProfileResponse getProfile(@AuthenticationPrincipal AuthenticatedClient principal) {
        return authService.getProfile(principal.clientId());
    }

    @PostMapping("/rotate-key")
    public ApiKeyResponse rotateKey(@AuthenticationPrincipal AuthenticatedClient principal) {
        String newKey = clientService.rotateApiKey(principal.clientId());
        return new ApiKeyResponse(newKey);
    }
}
