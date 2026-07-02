package com.gatemind.gateway.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final ReactiveStringRedisTemplate redisTemplate;

    public Mono<Long> increment(String key) {
        return redisTemplate.opsForValue().increment(key);
    }

    public Mono<Boolean> expire(String key, Duration duration) {
        return redisTemplate.expire(key, duration);
    }

    public Mono<String> get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Mono<Boolean> delete(String key) {
        return redisTemplate.delete(key)
                .map(count -> count > 0);
    }

    public Mono<Long> getTtl(String key) {
        return redisTemplate.getExpire(key)
                .map(duration -> duration.getSeconds());
    }
}