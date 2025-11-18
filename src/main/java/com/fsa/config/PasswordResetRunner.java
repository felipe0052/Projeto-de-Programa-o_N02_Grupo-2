package com.fsa.config;

import com.fsa.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class PasswordResetRunner implements ApplicationRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        reset(4L);
        reset(5L);
    }

    private void reset(Long id) {
        userRepository.findById(id).ifPresent(u -> {
            u.setPasswordHash(passwordEncoder.encode("senha"));
            userRepository.save(u);
        });
    }
}