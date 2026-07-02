package com.gatemind.gateway.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gatemind.gateway.client.CachedClient;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

import static reactor.netty.http.HttpConnectionLiveness.log;

@Service
@RequiredArgsConstructor
public class ClientCacheService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final Duration TTL = Duration.ofMinutes(10);

    public CachedClient get(String apiKeyHash) {

        try {

            String json = redisTemplate.opsForValue().get(apiKeyHash);


            if (json == null) {
                log.info("❌ Redis Cache MISS");
                return null;
            }

            log.info("✅ Redis Cache HIT");

            return objectMapper.readValue(json, CachedClient.class);

        } catch (Exception e) {

            return null;

        }

    }

    public void save(String apiKeyHash, CachedClient client) {

        try {

            String json = objectMapper.writeValueAsString(client);

            redisTemplate.opsForValue()
                    .set(apiKeyHash, json, TTL);

        } catch (Exception ignored) {

        }

    }

}