package com.fsa.service;

import com.fsa.domain.Category;
import com.fsa.domain.Course;
import com.fsa.domain.User;
import com.fsa.domain.enums.CourseStatus;
import com.fsa.domain.enums.EnrollmentStatus;
import com.fsa.dto.course.CourseCreateRequest;
import com.fsa.dto.course.CourseResponse;
import com.fsa.repository.CategoryRepository;
import com.fsa.repository.CourseRepository;
import com.fsa.repository.EnrollmentRepository;
import com.fsa.repository.UserRepository;
import com.fsa.security.SecurityUtils;
import com.fsa.security.UserPrincipal;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository,
                         UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    private CourseResponse toResponse(Course c) {
        long ativos = enrollmentRepository.countByCourse_IdAndStatus(c.getId(), EnrollmentStatus.ATIVO);
        long vagas = Math.max(0, c.getLimiteAlunos() - ativos);
        List<Long> prereqIds = c.getPrerequisites() == null ? List.of() : c.getPrerequisites().stream().map(Course::getId).toList();
        return CourseResponse.builder()
                .id(c.getId())
                .nome(c.getNome())
                .descricao(c.getDescricao())
                .limiteAlunos(c.getLimiteAlunos())
                .valor(c.getValor())
                .horario(c.getHorario())
                .categoryId(c.getCategory() != null ? c.getCategory().getId() : null)
                .categoryNome(c.getCategory() != null ? c.getCategory().getNome() : null)
                .instructorId(c.getInstructor() != null ? c.getInstructor().getId() : null)
                .status(c.getStatus().getDb())
                .inscritosAtivos(ativos)
                .vagasDisponiveis(vagas)
                .prerequisiteIds(prereqIds)
                .build();
    }

    private void ensureEditPermission(Course c) {
        UserPrincipal up = SecurityUtils.getCurrentUser();
        if (up == null) throw new SecurityException("Não autenticado");
        boolean owner = c.getInstructor() != null && c.getInstructor().getId().equals(up.getId());
        if (!up.isAdminFlag() && !owner) {
            throw new SecurityException("Apenas ADMIN ou o instrutor pode editar");
        }
    }

    @Transactional
    public CourseResponse create(CourseCreateRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria inválida"));

        User instructor = null;
        if (req.getInstructorId() != null) {
            instructor = userRepository.findById(req.getInstructorId())
                    .orElseThrow(() -> new IllegalArgumentException("Instrutor inválido"));
            boolean isInstrutor = instructor.getRoles().stream().anyMatch(r -> "INSTRUTOR".equalsIgnoreCase(r.getCode()));
            if (!isInstrutor) {
                throw new IllegalArgumentException("Instrutor precisa do cargo INSTRUTOR");
            }
        }

        CourseStatus status = req.getStatus() == null ? CourseStatus.RASCUNHO : CourseStatus.fromDb(req.getStatus());

        Course c = Course.builder()
                .nome(req.getNome())
                .descricao(req.getDescricao())
                .limiteAlunos(req.getLimiteAlunos())
                .valor(req.getValor())
                .horario(req.getHorario())
                .category(category)
                .instructor(instructor)
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // prerequisitos
        if (req.getPrerequisiteIds() != null && !req.getPrerequisiteIds().isEmpty()) {
            List<Course> prereqs = courseRepository.findAllById(req.getPrerequisiteIds());
            c.setPrerequisites(Set.copyOf(prereqs));
        }

        c = courseRepository.save(c);
        return toResponse(c);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> list(Long id, Integer categoryId, Boolean disponibilidade, Long instrutorId,
                                     Boolean maisRecente, Boolean maisAntigos) {
        List<Course> base;
        if (id != null) {
            Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
            base = List.of(c);
        } else {
            Sort sort = Sort.unsorted();
            if (Boolean.TRUE.equals(maisRecente)) sort = Sort.by(Sort.Direction.DESC, "createdAt");
            else if (Boolean.TRUE.equals(maisAntigos)) sort = Sort.by(Sort.Direction.ASC, "createdAt");
            base = courseRepository.findAll(sort);
        }

        List<CourseResponse> out = new ArrayList<>();
        for (Course c : base) {
            if (categoryId != null && (c.getCategory() == null || !categoryId.equals(c.getCategory().getId()))) continue;
            if (instrutorId != null && (c.getInstructor() == null || !instrutorId.equals(c.getInstructor().getId()))) continue;
            // RN07: por padrão, não listar inativos
            if (c.getStatus() != CourseStatus.ATIVO) continue;
            CourseResponse resp = toResponse(c);
            if (Boolean.TRUE.equals(disponibilidade) && resp.getVagasDisponiveis() <= 0) continue;
            out.add(resp);
        }
        return out;
    }

    @Transactional(readOnly = true)
    public CourseResponse get(Long id) {
        return courseRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
    }

    @Transactional
    public CourseResponse update(Long id, CourseCreateRequest req) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        ensureEditPermission(c);
        if (req.getNome() != null) c.setNome(req.getNome());
        if (req.getDescricao() != null) c.setDescricao(req.getDescricao());
        if (req.getLimiteAlunos() != null) {
            long ativos = enrollmentRepository.countByCourse_IdAndStatus(c.getId(), EnrollmentStatus.ATIVO);
            if (req.getLimiteAlunos() < ativos) {
                throw new IllegalArgumentException("Vagas não pode ser menor que inscritos ativos");
            }
            c.setLimiteAlunos(req.getLimiteAlunos());
        }
        if (req.getValor() != null) c.setValor(req.getValor());
        if (req.getHorario() != null) c.setHorario(req.getHorario());
        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoria inválida"));
            c.setCategory(category);
        }
        if (req.getInstructorId() != null) {
            User instructor = userRepository.findById(req.getInstructorId())
                    .orElseThrow(() -> new IllegalArgumentException("Instrutor inválido"));
            boolean isInstrutor = instructor.getRoles().stream().anyMatch(r -> "INSTRUTOR".equalsIgnoreCase(r.getCode()));
            if (!isInstrutor) throw new IllegalArgumentException("Instrutor precisa do cargo INSTRUTOR");
            c.setInstructor(instructor);
        }
        if (req.getStatus() != null) c.setStatus(CourseStatus.fromDb(req.getStatus()));
        if (req.getPrerequisiteIds() != null) {
            List<Course> prereqs = courseRepository.findAllById(req.getPrerequisiteIds());
            c.setPrerequisites(Set.copyOf(prereqs));
        }
        c.setUpdatedAt(LocalDateTime.now());
        return toResponse(courseRepository.save(c));
    }

    @Transactional
    public CourseResponse updateInstrutor(Long id, Long instrutorId) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        ensureEditPermission(c);
        User instructor = userRepository.findById(instrutorId)
                .orElseThrow(() -> new IllegalArgumentException("Instrutor inválido"));
        boolean isInstrutor = instructor.getRoles().stream().anyMatch(r -> "INSTRUTOR".equalsIgnoreCase(r.getCode()));
        if (!isInstrutor) throw new IllegalArgumentException("Instrutor precisa do cargo INSTRUTOR");
        c.setInstructor(instructor);
        c.setUpdatedAt(LocalDateTime.now());
        return toResponse(courseRepository.save(c));
    }

    @Transactional
    public CourseResponse updateCategoria(Long id, Integer categoryId) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        ensureEditPermission(c);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria inválida"));
        c.setCategory(category);
        c.setUpdatedAt(LocalDateTime.now());
        return toResponse(courseRepository.save(c));
    }

    @Transactional
    public CourseResponse updateStatus(Long id, String status) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        ensureEditPermission(c);
        c.setStatus(CourseStatus.fromDb(status));
        c.setUpdatedAt(LocalDateTime.now());
        return toResponse(courseRepository.save(c));
    }

    @Transactional
    public CourseResponse updateVagas(Long id, Integer vagas) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        ensureEditPermission(c);
        long ativos = enrollmentRepository.countByCourse_IdAndStatus(c.getId(), EnrollmentStatus.ATIVO);
        if (vagas < ativos) throw new IllegalArgumentException("Vagas não pode ser menor que inscritos ativos");
        c.setLimiteAlunos(vagas);
        c.setUpdatedAt(LocalDateTime.now());
        return toResponse(courseRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        ensureEditPermission(c);
        long ativos = enrollmentRepository.countByCourse_IdAndStatus(c.getId(), EnrollmentStatus.ATIVO);
        if (ativos > 0) throw new IllegalStateException("Não pode deletar: curso com alunos ativos");
        courseRepository.delete(c);
    }
}

