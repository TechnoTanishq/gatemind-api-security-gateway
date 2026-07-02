package com.gatemind.client.controller;

import com.gatemind.client.dto.response.ApiKeyValidationResponse;
import com.gatemind.client.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/api-keys")
@RequiredArgsConstructor
public class InternalController {

    private final ClientService clientService;

    @GetMapping("/validate")
    public ApiKeyValidationResponse validateApiKey(
            @RequestHeader("X-API-Key") String apiKey) {

        return clientService.validateApiKey(apiKey);

    }

}