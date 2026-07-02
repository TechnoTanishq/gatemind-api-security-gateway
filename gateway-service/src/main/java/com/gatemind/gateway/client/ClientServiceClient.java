package com.gatemind.gateway.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

import static reactor.netty.http.HttpConnectionLiveness.log;


@Component
@RequiredArgsConstructor
public class ClientServiceClient {

    private final WebClient.Builder builder;

    @Value("${clients.service.base-url}")
    private String baseUrl;

    public Mono<ApiKeyValidationResponse> validate(String apiKey){
        log.info("Calling Client Service...");
        return builder.build()
                .get()
                .uri(baseUrl + "/internal/api-keys/validate")
                .header("X-API-KEY", apiKey)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(),
                        response -> Mono.empty())
                .bodyToMono(ApiKeyValidationResponse.class)
                .defaultIfEmpty(new ApiKeyValidationResponse())
                .timeout(Duration.ofSeconds(3));
    }

}