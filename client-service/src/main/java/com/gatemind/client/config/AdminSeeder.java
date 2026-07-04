package com.gatemind.client.config;

import com.gatemind.client.entity.Admin;
import com.gatemind.client.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin account on first startup.
 * Change these credentials via environment variables in production:
 *   ADMIN_EMAIL, ADMIN_PASSWORD
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_EMAIL    = "admin@gatemind.com";
    private static final String DEFAULT_PASSWORD = "admin123";
    private static final String DEFAULT_USERNAME = "admin";

    @Override
    public void run(ApplicationArguments args) {
        if (adminRepository.findByEmail(DEFAULT_EMAIL).isEmpty()) {
            Admin admin = Admin.builder()
                    .username(DEFAULT_USERNAME)
                    .email(DEFAULT_EMAIL)
                    .passwordHash(passwordEncoder.encode(DEFAULT_PASSWORD))
                    .build();
            adminRepository.save(admin);
            log.info("✅ Default admin seeded — email: {}, password: {}", DEFAULT_EMAIL, DEFAULT_PASSWORD);
        } else {
            log.info("✅ Admin account already exists, skipping seed.");
        }
    }
}
