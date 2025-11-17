package com.fsa.dto.course;

import jakarta.validation.constraints.*;
import lombok.Data;

 
import java.util.List;
import java.math.BigDecimal;

@Data
public class CourseCreateRequest {
    @NotBlank
    private String nome;
    private String descricao;
    @NotNull @Positive
    private Integer limiteAlunos;
    @NotNull @DecimalMin(value = "0.00")
    private BigDecimal valor;
    @NotNull @Min(1)
    private Integer creditos;
    private String horario;
    @NotNull
    private Integer categoryId;
    private Long instructorId;
    private String status;
    private List<Long> prerequisiteIds;
}
