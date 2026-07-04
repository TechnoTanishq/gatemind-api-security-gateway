package com.gatemind.client.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private Long clientId;
    private String companyName;
    private String email;
    // Only populated on signup — null for all login responses
    private String apiKey;
}
