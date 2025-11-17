package com.fsa.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String nome;
    private boolean admin;
    private List<String> roles;
    private String jwt;
}

