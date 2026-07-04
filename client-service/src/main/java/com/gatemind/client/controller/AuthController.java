package com.gatemind.client.controller;

import com.gatemind.client.dto.request.AdminLoginRequest;
import com.gatemind.client.dto.request.LoginRequest;
import com.gatemind.client.dto.request.SignupRequest;
import com.gatemind.client.dto.response.AuthResponse;
import com.gatemind.client.service.AdminAuthService;
import com.gatemind.client.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AdminAuthService adminAuthService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/admin/login")
    public AuthResponse adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        return adminAuthService.login(request);
    }
}
