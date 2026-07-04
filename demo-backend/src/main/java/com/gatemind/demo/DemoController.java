package com.gatemind.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Simulates a customer's real backend application.
 * Normally called directly. After GateMind onboarding,
 * all traffic flows through the gateway transparently.
 */
@RestController
@RequestMapping("/movies")
public class DemoController {

    @GetMapping
    public List<Map<String, Object>> listMovies() {
        return List.of(
            Map.of("id", 1, "title", "Inception",     "genre", "Sci-Fi"),
            Map.of("id", 2, "title", "The Dark Knight","genre", "Action"),
            Map.of("id", 3, "title", "Interstellar",  "genre", "Sci-Fi")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMovie(@PathVariable int id) {
        return switch (id) {
            case 1 -> ResponseEntity.ok(Map.of("id", 1, "title", "Inception",      "genre", "Sci-Fi",  "year", 2010));
            case 2 -> ResponseEntity.ok(Map.of("id", 2, "title", "The Dark Knight","genre", "Action", "year", 2008));
            case 3 -> ResponseEntity.ok(Map.of("id", 3, "title", "Interstellar",   "genre", "Sci-Fi",  "year", 2014));
            default -> ResponseEntity.notFound().build();
        };
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> addMovie(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(Map.of(
            "id",    99,
            "title", body.getOrDefault("title", "Unknown"),
            "genre", body.getOrDefault("genre", "Unknown")
        ));
    }
}
