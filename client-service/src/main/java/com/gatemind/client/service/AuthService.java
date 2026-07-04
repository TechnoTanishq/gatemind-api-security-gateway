package com.gatemind.client.service;

import com.gatemind.client.dto.request.LoginRequest;
import com.gatemind.client.dto.request.SignupRequest;
import com.gatemind.client.dto.response.AuthResponse;
import com.gatemind.client.dto.response.ClientProfileResponse;
import com.gatemind.client.entity.Client;
import com.gatemind.client.entity.enums.ClientStatus;
import com.gatemind.client.exceptions.ClientNotFoundException;
import com.gatemind.client.exceptions.DuplicateClientException;
import com.gatemind.client.repository.ClientRepository;
import com.gatemind.client.security.JwtUtil;
import com.gatemind.client.util.ApiKeyGenerator;
import com.gatemind.client.util.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ApiKeyGenerator apiKeyGenerator;
    private final HashUtil hashUtil;

    public AuthResponse signup(SignupRequest request) {
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateClientException("An account with this email already exists.");
        }

        String apiKey = apiKeyGenerator.generateApiKey();

        Client client = Client.builder()
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .backendBaseUrl(request.getBackendBaseUrl())
                .apiKeyHash(hashUtil.sha256(apiKey))
                .plan(request.getPlan())
                .status(ClientStatus.ACTIVE)
                .build();

        clientRepository.save(client);

        // The raw API key is included ONLY in the signup response — never again
        String token = jwtUtil.generate(client.getId(), client.getEmail(), "CLIENT");
        return new AuthResponse(token, "CLIENT", client.getId(), client.getCompanyName(), client.getEmail(), apiKey);
    }

    public AuthResponse login(LoginRequest request) {
        Client client = clientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), client.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        if (client.getStatus() == ClientStatus.SUSPENDED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your account has been suspended.");
        }

        if (client.getStatus() == ClientStatus.REVOKED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your account has been revoked.");
        }

        String token = jwtUtil.generate(client.getId(), client.getEmail(), "CLIENT");

        return new AuthResponse(token, "CLIENT", client.getId(), client.getCompanyName(), client.getEmail(), null);
    }

    public ClientProfileResponse getProfile(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ClientNotFoundException("Client not found."));

        return ClientProfileResponse.builder()
                .clientId(client.getId())
                .companyName(client.getCompanyName())
                .email(client.getEmail())
                .backendBaseUrl(client.getBackendBaseUrl())
                .plan(client.getPlan())
                .status(client.getStatus())
                .createdAt(client.getCreatedAt())
                .build();
    }
}
