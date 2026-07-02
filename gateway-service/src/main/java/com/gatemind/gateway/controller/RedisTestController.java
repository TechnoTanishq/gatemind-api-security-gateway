package com.gatemind.gateway.controller;

import com.gatemind.gateway.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;

import java.time.Duration;

@RestController
@RequestMapping("/redis")
@RequiredArgsConstructor
public class RedisTestController {

    private final RedisService redisService;

    @GetMapping("/increment")
    public Mono<Long> increment() {

        return redisService.increment("test-counter")
                .flatMap(value -> {

                    if (value == 1) {
                        return redisService
                                .expire("test-counter", Duration.ofMinutes(1))
                                .thenReturn(value);
                    }

                    return Mono.just(value);
                });
    }
}