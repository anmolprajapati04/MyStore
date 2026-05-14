package com.ecommerce.auth.repository;

import com.ecommerce.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByUsernameOrEmail(String username, String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    Optional<User> findByRole(com.ecommerce.auth.model.Role role);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByRole(com.ecommerce.auth.model.Role role);
}
