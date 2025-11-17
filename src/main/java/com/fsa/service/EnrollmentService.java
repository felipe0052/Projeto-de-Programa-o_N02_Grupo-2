package com.fsa.service;

import com.fsa.domain.Course;
import com.fsa.domain.Enrollment;
import com.fsa.domain.User;
import com.fsa.domain.enums.EnrollmentStatus;
import com.fsa.dto.enrollment.EnrollmentRequest;
import com.fsa.dto.enrollment.EnrollmentResponse;
import com.fsa.repository.CourseRepository;
import com.fsa.repository.EnrollmentRepository;
import com.fsa.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository, UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EnrollmentResponse enroll(Long courseId, EnrollmentRequest req) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        User user = userRepository.findById(req.getUserId()).orElseThrow(() -> new IllegalArgumentException("Usuário inválido"));

        boolean isInstrutor = user.getRoles().stream().anyMatch(r -> "INSTRUTOR".equalsIgnoreCase(r.getCode()));
        if (isInstrutor) {
            throw new IllegalArgumentException("Usuário com cargo INSTRUTOR não pode se inscrever em cursos");
        }

        long ativos = enrollmentRepository.countByCourse_IdAndStatus(course.getId(), EnrollmentStatus.ATIVO);
        if (ativos >= course.getLimiteAlunos()) {
            throw new IllegalStateException("Curso sem vagas");
        }

        Enrollment e = Enrollment.builder()
                .course(course)
                .user(user)
                .status(EnrollmentStatus.ATIVO)
                .registrationCode("MAT-" + java.util.UUID.randomUUID())
                .createdAt(LocalDateTime.now())
                .build();
        e = enrollmentRepository.save(e);
        return new EnrollmentResponse(e.getId(), user.getId(), course.getId(), e.getStatus().getDb());
    }

    @Transactional
    public void cancel(Long enrollmentId) {
        Enrollment e = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Matrícula não encontrada"));
        e.setStatus(EnrollmentStatus.CANCELADO);
        enrollmentRepository.save(e);
    }

    @Transactional
    public int cancelAllByCourse(Long courseId) {
        return enrollmentRepository.cancelAllActiveByCourse(courseId);
    }
}

