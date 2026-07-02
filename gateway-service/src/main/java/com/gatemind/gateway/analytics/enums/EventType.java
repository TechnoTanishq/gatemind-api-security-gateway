package com.gatemind.gateway.analytics.enums;

public enum EventType {

    SQL_INJECTION,

    XSS,

    PATH_TRAVERSAL,

    COMMAND_INJECTION,

    SUSPICIOUS_USER_AGENT,

    RATE_LIMIT_EXCEEDED,

    INVALID_API_KEY,

    CLIENT_SUSPENDED,

    CLIENT_REVOKED,

    AI_BLOCKED
}