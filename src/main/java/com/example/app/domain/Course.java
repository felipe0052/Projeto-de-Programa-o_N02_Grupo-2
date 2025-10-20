package com.example.app.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "limite_alunos", nullable = false)
    private Integer limiteAlunos = 0;

    @Column(name = "valor", nullable = false)
    private BigDecimal valor = BigDecimal.ZERO;

    @Column(name = "horario", length = 160)
    private String horario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category mainCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    private User responsibleInstructor;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CourseStatus status = CourseStatus.ativo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(name = "course_prerequisites",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequisite_course_id"))
    private Set<Course> prerequisites = new HashSet<>();

    // Additional instructors association
    @ManyToMany
    @JoinTable(name = "course_instructors",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "instructor_id"))
    private Set<User> instructors = new HashSet<>();

    // Additional categories association
    @ManyToMany
    @JoinTable(name = "course_categories",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Integer getLimiteAlunos() { return limiteAlunos; }
    public void setLimiteAlunos(Integer limiteAlunos) { this.limiteAlunos = limiteAlunos; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public Category getMainCategory() { return mainCategory; }
    public void setMainCategory(Category mainCategory) { this.mainCategory = mainCategory; }

    public User getResponsibleInstructor() { return responsibleInstructor; }
    public void setResponsibleInstructor(User responsibleInstructor) { this.responsibleInstructor = responsibleInstructor; }

    public CourseStatus getStatus() { return status; }
    public void setStatus(CourseStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Course> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(Set<Course> prerequisites) { this.prerequisites = prerequisites; }

    public Set<User> getInstructors() { return instructors; }
    public void setInstructors(Set<User> instructors) { this.instructors = instructors; }

    public Set<Category> getCategories() { return categories; }
    public void setCategories(Set<Category> categories) { this.categories = categories; }
}