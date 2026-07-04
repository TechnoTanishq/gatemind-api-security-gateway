package com.gatemind.client.config;

// CORS is handled entirely by the Gateway Service (CorsWebFilter on port 8080).
// This class is intentionally empty — do NOT add a CorsFilter here.
// Adding one causes duplicate Access-Control-Allow-Origin headers which
// the browser rejects with "contains multiple values".
public class CorsConfig {
}
