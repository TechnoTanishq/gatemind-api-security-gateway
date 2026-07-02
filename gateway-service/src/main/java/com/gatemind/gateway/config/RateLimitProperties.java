package com.gatemind.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "gatemind.rate-limit")
public class RateLimitProperties {

    private long requests;

    private long windowSeconds;

}