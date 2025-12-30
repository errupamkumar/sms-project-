package com.sms.auth.config;

import com.sms.auth.entity.Role;
import com.sms.auth.entity.User;
import com.sms.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@school.com");
                admin.setMobile("9999999999");
                admin.setRole(Role.SUPER_ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("Super Admin created: admin / admin123");
            }
        };
    }
}
