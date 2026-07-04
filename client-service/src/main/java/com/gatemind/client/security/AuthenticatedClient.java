package com.gatemind.client.security;

public record AuthenticatedClient(Long clientId, String email) {}
