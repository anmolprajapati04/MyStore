package com.ecommerce.auth.config;

import com.ecommerce.auth.model.Role;
import com.ecommerce.auth.model.User;
import com.ecommerce.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SuperAdminInitializer {

    @Bean
    CommandLineRunner ensureSingleSuperAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.super-admin.username:admin}") String username,
            @Value("${app.super-admin.email:admin@mystore.com}") String email,
            @Value("${app.super-admin.password:Admin@123}") String password) {
        return args -> {
            if (userRepository.existsByRole(Role.ROLE_SUPER_ADMIN)) {
                return;
            }

            if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
                System.out.println("Warning: Default super admin username/email already taken. Skipping auto-initialization.");
                return;
            }

            User superAdmin = new User(username, passwordEncoder.encode(password), email, Role.ROLE_SUPER_ADMIN);
            userRepository.save(superAdmin);
        };
    }
}
