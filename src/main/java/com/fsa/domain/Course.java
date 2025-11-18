package com.fsa.domain;

import com.fsa.domain.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.*;

 
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "limite_alunos", nullable = false)
    private Integer limiteAlunos;


    @Column(nullable = false)
    private Integer creditos = 1;

    @Column(length = 160)
    private String horario;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    private User instructor;

    @Column(nullable = false)
    private CourseStatus status = CourseStatus.ATIVO;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "course_prerequisites",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequisite_course_id")
    )
    @Builder.Default
    private Set<Course> prerequisites = new HashSet<>();
}
