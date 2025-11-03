package com.fsa.service;

import com.fsa.domain.User;
import com.fsa.dto.auth.LoginRequest;
import com.fsa.dto.auth.LoginResponse;
import com.fsa.repository.UserRepository;
import com.fsa.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
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
}

