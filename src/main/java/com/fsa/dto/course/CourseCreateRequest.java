package com.fsa.dto.course;

import jakarta.validation.constraints.*;
import lombok.Data;

 
import java.util.List;

@Data
public class CourseCreateRequest {
    @NotBlank
    private String nome;
    private String descricao;
    @NotNull @Positive
    private Integer limiteAlunos;
    @NotNull @Min(1)
    private Integer creditos;
    private String horario;
    @NotNull
    private Integer categoryId;
    private Long instructorId;
    private String status;
    private List<Long> prerequisiteIds;
}
