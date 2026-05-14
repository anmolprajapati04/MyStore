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
            // 1. Try finding by the target email (highest priority for identity)
            User superAdmin = userRepository.findByEmail(email).orElse(null);
            
            // 2. If not found, try finding by the target username
            if (superAdmin == null) {
                superAdmin = userRepository.findByUsername(username).orElse(null);
            }
            
            // 3. If still not found, try finding any existing Super Admin by role
            if (superAdmin == null) {
                superAdmin = userRepository.findByRole(Role.ROLE_SUPER_ADMIN).orElse(new User());
            }

            // Always enforce configured credentials and role
            superAdmin.setUsername(username);
            superAdmin.setEmail(email);
            superAdmin.setPassword(passwordEncoder.encode(password));
            superAdmin.setRole(Role.ROLE_SUPER_ADMIN);
            
            userRepository.save(superAdmin);
            System.out.println("Super Admin identity synchronized: " + email);
        };
    }
}
