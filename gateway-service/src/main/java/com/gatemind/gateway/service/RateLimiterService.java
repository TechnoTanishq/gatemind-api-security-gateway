package com.gatemind.gateway.service;

import com.gatemind.gateway.config.RateLimitProperties;
import com.gatemind.gateway.dto.RateLimitResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisService redisService;
    private final RateLimitProperties properties;

    public Mono<RateLimitResult> isAllowed(String apiKey, String plan) {

        String redisKey = "rate:" + apiKey;

        long limit = getLimit(plan);

        Duration window = Duration.ofSeconds(properties.getWindowSeconds());

        return redisService.increment(redisKey)
                .flatMap(count -> {

                    Mono<Boolean> expireOperation = Mono.just(true);

                    if (count == 1) {
                        expireOperation = redisService.expire(redisKey, window);
                    }

                    return expireOperation.then(
                            redisService.getTtl(redisKey)
                                    .map(ttl -> RateLimitResult.builder()
                                            .allowed(count <= limit)
                                            .currentCount(count)
                                            .limit(limit)
                                            .remainingRequests(Math.max(0, limit - count))
                                            .resetAfterSeconds(ttl)
                                            .build())
                    );
                });
    }

    private long getLimit(String plan) {

        if (plan == null) {
            return properties.getRequests();
        }

        return switch (plan.toUpperCase()) {

            case "FREE" -> 100;

            case "PRO" -> 1000;

            case "ENTERPRISE" -> 10000;

            default -> properties.getRequests();
        };
    }
}