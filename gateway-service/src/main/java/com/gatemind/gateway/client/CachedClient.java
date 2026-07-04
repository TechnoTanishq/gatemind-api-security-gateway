package com.gatemind.gateway.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CachedClient {

    private Long clientId;

    private String plan;

    private String status;

    private String companyName;

    private String backendBaseUrl;
}