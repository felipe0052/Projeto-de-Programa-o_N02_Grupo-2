package com.fsa.dto.course;

import lombok.Builder;
import lombok.Data;

 
import java.util.List;

import com.fsa.dto.course.CourseImageResponse;
import com.fsa.dto.user.InstructorSummary;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String nome;
    private String descricao;
    private Integer limiteAlunos;
    private Integer creditos;
    private String horario;
    private Integer categoryId;
    private String categoryNome;
    private Long instructorId;
    private InstructorSummary instructor;
    private String status;
    private Long inscritosAtivos;
    private Long vagasDisponiveis;
    private List<Long> prerequisiteIds;
    private List<CourseImageResponse> imagens;
}
