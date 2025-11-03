package com.fsa.dto.course;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String nome;
    private String descricao;
    private Integer limiteAlunos;
    private BigDecimal valor;
    private String horario;
    private Integer categoryId;
    private String categoryNome;
    private Long instructorId;
    private String status;
    private Long inscritosAtivos;
    private Long vagasDisponiveis;
    private List<Long> prerequisiteIds;
}

