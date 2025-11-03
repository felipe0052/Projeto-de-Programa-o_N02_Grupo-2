package com.fsa.dto.course;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CourseCreateRequest {
    @NotBlank
    private String nome;
    private String descricao;
    @NotNull @Positive
    private Integer limiteAlunos;
    @NotNull @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal valor;
    private String horario;
    @NotNull
    private Integer categoryId;
    private Long instructorId;
    private String status;
    private List<Long> prerequisiteIds;
}

