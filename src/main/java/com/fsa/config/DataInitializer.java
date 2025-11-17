package com.fsa.config;

import com.fsa.domain.Role;
import com.fsa.repository.RoleRepository;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DataInitializer {
    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void init() {
        ensureRole("ALUNO");
        ensureRole("INSTRUTOR");
    }

    private void ensureRole(String code) {
        roleRepository.findByCode(code).orElseGet(() -> roleRepository.save(Role.builder().code(code).build()));
    }
}