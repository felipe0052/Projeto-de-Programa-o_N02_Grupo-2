package com.fsa.service;

import com.fsa.domain.Category;
import com.fsa.domain.Course;
import com.fsa.domain.User;
import com.fsa.domain.CourseImage;
import com.fsa.dto.course.CourseImageResponse;
import com.fsa.domain.enums.CourseStatus;
import com.fsa.domain.enums.EnrollmentStatus;
import com.fsa.dto.course.CourseCreateRequest;
import com.fsa.dto.course.CourseResponse;
import com.fsa.repository.CategoryRepository;
import com.fsa.repository.CourseRepository;
import com.fsa.repository.EnrollmentRepository;
import com.fsa.repository.UserRepository;
import com.fsa.repository.CourseImageRepository;
import com.fsa.security.SecurityUtils;
import com.fsa.security.UserPrincipal;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class CourseService {
    private static final Logger log = LoggerFactory.getLogger(CourseService.class);
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseImageRepository courseImageRepository;

    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository,
                         UserRepository userRepository, EnrollmentRepository enrollmentRepository,
                         CourseImageRepository courseImageRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseImageRepository = courseImageRepository;
    }

    private CourseResponse toResponse(Course c) {
        long ativos = enrollmentRepository.countByCourse_IdAndStatus(c.getId(), EnrollmentStatus.ATIVO);
        long vagas = Math.max(0, c.getLimiteAlunos() - ativos);
        List<Long> prereqIds = c.getPrerequisites() == null ? List.of() : c.getPrerequisites().stream().map(Course::getId).toList();
        List<CourseImage> imgs = courseImageRepository.findByCourse_Id(c.getId());
        String base = org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        List<CourseImageResponse> imgResp = imgs.stream().map(i -> CourseImageResponse.builder()
                .id(i.getId())
                .url(base + "/media/cursos/" + c.getId() + "/" + i.getFilename())
                .mimeType(i.getMimeType())
                .sizeBytes(i.getSizeBytes())
                .build()).toList();
        if (log.isDebugEnabled()) {
            log.debug("Course toResponse id={} imagens_count={}", c.getId(), imgResp.size());
        }
        com.fsa.dto.user.InstructorSummary inst = null;
        if (c.getInstructor() != null) {
            inst = com.fsa.dto.user.InstructorSummary.builder()
                    .id(c.getInstructor().getId())
                    .nome(c.getInstructor().getNome())
                    .email(c.getInstructor().getEmail())
                    .build();
        }
        return CourseResponse.builder()
                .id(c.getId())
                .nome(c.getNome())
                .descricao(c.getDescricao())
                .limiteAlunos(c.getLimiteAlunos())
                .valor(c.getValor())
                .creditos(c.getCreditos())
                .horario(c.getHorario())
                .categoryId(c.getCategory() != null ? c.getCategory().getId() : null)
                .categoryNome(c.getCategory() != null ? c.getCategory().getNome() : null)
                .instructorId(c.getInstructor() != null ? c.getInstructor().getId() : null)
                .instructor(inst)
                .status(c.getStatus().getDb())
                .inscritosAtivos(ativos)
                .vagasDisponiveis(vagas)
                .prerequisiteIds(prereqIds)
                .imagens(imgResp)
                .build();
    }

    public void ensureEditPermission(Course c) {
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

        UserPrincipal up = SecurityUtils.getCurrentUser();
        if (up == null) throw new SecurityException("Não autenticado");
        if (!up.isAdminFlag()) {
            boolean ownerCreating = instructor != null && instructor.getId().equals(up.getId());
            if (!ownerCreating) {
                throw new SecurityException("Apenas ADMIN ou o instrutor pode criar");
            }
        }

        CourseStatus status = req.getStatus() == null ? CourseStatus.RASCUNHO : CourseStatus.fromDb(req.getStatus());
        if (status == CourseStatus.ENCERRADO) {
            throw new IllegalArgumentException("Não é permitido criar curso com status ENCERRADO");
        }


        Course c = Course.builder()
                .nome(req.getNome())
                .descricao(req.getDescricao())
                .limiteAlunos(req.getLimiteAlunos())
                .valor(req.getValor())
                .creditos(req.getCreditos())
                .horario(req.getHorario())
                .category(category)
                .instructor(instructor)
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        if (req.getPrerequisiteIds() != null && !req.getPrerequisiteIds().isEmpty()) {
            List<Course> prereqs = courseRepository.findAllById(req.getPrerequisiteIds());
            c.setPrerequisites(Set.copyOf(prereqs));
        }

        c = courseRepository.save(c);
        return toResponse(c);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> list(Long id, Integer categoryId, Boolean disponibilidade, Long instrutorId,
                                     Boolean maisRecente, Boolean maisAntigos, Long inscritoPor) {
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
        UserPrincipal up = SecurityUtils.getCurrentUser();
        List<Long> enrolledIds = null;
        if (inscritoPor != null) {
            enrolledIds = enrollmentRepository.findByUser_IdAndStatus(inscritoPor, EnrollmentStatus.ATIVO)
                    .stream().map(e -> e.getCourse().getId()).toList();
        }
        for (Course c : base) {
            if (categoryId != null && (c.getCategory() == null || !categoryId.equals(c.getCategory().getId()))) continue;
            if (instrutorId != null && (c.getInstructor() == null || !instrutorId.equals(c.getInstructor().getId()))) continue;
            if (enrolledIds != null && !enrolledIds.contains(c.getId())) continue;
            boolean owner = up != null && c.getInstructor() != null && c.getInstructor().getId().equals(up.getId());
            boolean canSeeDraft = up != null && (up.isAdminFlag() || owner);
            if (c.getStatus() == CourseStatus.ENCERRADO) continue;
            if (c.getStatus() == CourseStatus.RASCUNHO && !canSeeDraft) continue;
            CourseResponse resp = toResponse(c);
            if (Boolean.TRUE.equals(disponibilidade) && resp.getVagasDisponiveis() <= 0) continue;
            out.add(resp);
        }
        return out;
    }

    @Transactional(readOnly = true)
    public CourseResponse get(Long id) {
        Course c = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        if (c.getStatus() == CourseStatus.RASCUNHO) {
            UserPrincipal up = SecurityUtils.getCurrentUser();
            if (up == null) throw new SecurityException("Não autenticado");
            boolean owner = c.getInstructor() != null && c.getInstructor().getId().equals(up.getId());
            if (!up.isAdminFlag() && !owner) {
                throw new SecurityException("Apenas ADMIN ou o instrutor pode visualizar rascunho");
            }
        }
        return toResponse(c);
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
        if (req.getValor() != null) {
            c.setValor(req.getValor());
        }
        if (req.getCreditos() != null) {
            if (req.getCreditos() <= 0) throw new IllegalArgumentException("Créditos deve ser maior ou igual a 1");
            c.setCreditos(req.getCreditos());
        }
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
