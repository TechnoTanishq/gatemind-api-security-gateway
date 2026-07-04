package com.gatemind.client.service;

import com.gatemind.client.dto.request.AdminLoginRequest;
import com.gatemind.client.dto.response.AuthResponse;
import com.gatemind.client.entity.Admin;
import com.gatemind.client.repository.AdminRepository;
import com.gatemind.client.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        String token = jwtUtil.generate(admin.getId(), admin.getEmail(), "ADMIN");

        return new AuthResponse(token, "ADMIN", admin.getId(), admin.getUsername(), admin.getEmail(), null);
    }
}
