package com.fsa.service;

import com.fsa.domain.User;
import com.fsa.domain.Role;
import com.fsa.dto.auth.LoginRequest;
import com.fsa.dto.auth.LoginResponse;
import com.fsa.dto.auth.SignupRequest;
import com.fsa.repository.UserRepository;
import com.fsa.repository.RoleRepository;
import com.fsa.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(req.getSenha(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponse(
                user.getId(),
                user.getNome(),
                user.isAdmin(),
                user.getRoles().stream().map(r -> r.getCode()).collect(Collectors.toList()),
                token
        );
    }

    @Transactional
    public LoginResponse signup(SignupRequest req) {
        userRepository.findByEmail(req.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email já cadastrado");
        });

        Role role = roleRepository.findByCode(req.getRoleCode())
                .orElseThrow(() -> new IllegalArgumentException("Papel inválido"));

        User user = User.builder()
                .nome(req.getNome())
                .email(req.getEmail())
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        user.getRoles().add(role);
        user.setPasswordHash(passwordEncoder.encode(req.getSenha()));

        user = userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new LoginResponse(
                user.getId(),
                user.getNome(),
                user.isAdmin(),
                user.getRoles().stream().map(r -> r.getCode()).collect(Collectors.toList()),
                token
        );
    }
}

