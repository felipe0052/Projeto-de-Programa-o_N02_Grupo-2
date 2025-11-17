package com.fsa.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InstructorSummary {
    private Long id;
    private String nome;
    private String email;
}