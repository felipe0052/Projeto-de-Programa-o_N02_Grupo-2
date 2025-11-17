package com.fsa.service;

import com.fsa.domain.User;
import com.fsa.domain.Role;
import com.fsa.dto.auth.LoginRequest;
import com.fsa.dto.auth.LoginResponse;
import com.fsa.dto.auth.SignupRequest;
import com.fsa.repository.UserRepository;
import com.fsa.repository.RoleRepository;
import com.fsa.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
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

