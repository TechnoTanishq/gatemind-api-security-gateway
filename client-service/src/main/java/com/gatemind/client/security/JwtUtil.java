package com.gatemind.client.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HexFormat;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${gatemind.jwt.secret}") String secret,
            @Value("${gatemind.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(HexFormat.of().parseHex(secret));
        this.expirationMs = expirationMs;
    }

    public String generate(Long clientId, String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("clientId", clientId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmail(String token) {
        return parse(token).getSubject();
    }

    public Long getClientId(String token) {
        return parse(token).get("clientId", Long.class);
    }

    public String getRole(String token) {
        return parse(token).get("role", String.class);
    }
}
