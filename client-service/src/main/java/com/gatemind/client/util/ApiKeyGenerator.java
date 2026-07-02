package com.gatemind.client.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class ApiKeyGenerator {

    private static final String PREFIX = "gm_live_";

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int KEY_LENGTH = 32;

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateApiKey() {

        StringBuilder builder = new StringBuilder(PREFIX);

        for (int i = 0; i < KEY_LENGTH; i++) {

            builder.append(
                    CHARACTERS.charAt(
                            secureRandom.nextInt(CHARACTERS.length())
                    )
            );
        }

        return builder.toString();
    }
}