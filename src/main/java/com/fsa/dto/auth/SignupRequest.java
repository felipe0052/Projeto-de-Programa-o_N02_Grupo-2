package com.fsa.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(max = 120)
    private String nome;

    @NotBlank @Email
    @Size(max = 190)
    private String email;

    @NotBlank
    private String roleCode; // "ALUNO" ou "INSTRUTOR"
}