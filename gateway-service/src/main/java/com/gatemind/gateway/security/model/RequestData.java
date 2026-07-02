package com.gatemind.gateway.security.model;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class RequestData {

    private String method;

    private String path;

    private String fullUrl;

    private String decodedUrl;

    private String userAgent;

    private String clientIp;

    private Map<String, String> headers;

}