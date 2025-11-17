package com.fsa.controller;

import com.fsa.dto.course.CourseCreateRequest;
import com.fsa.dto.course.CourseResponse;
import com.fsa.dto.enrollment.EnrollmentRequest;
import com.fsa.dto.enrollment.EnrollmentResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.fsa.service.CourseService;
import com.fsa.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/cursos")
public class CourseController {
    private static final Logger log = LoggerFactory.getLogger(CourseController.class);
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    

    public CourseController(CourseService courseService, EnrollmentService enrollmentService) {
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<CourseResponse> create(@RequestBody @Valid CourseCreateRequest req) {
        return ResponseEntity.ok(courseService.create(req));
    }


    @GetMapping
    public ResponseEntity<List<CourseResponse>> list(
            @RequestParam(required = false, name = "id") Long id,
            @RequestParam(required = false, name = "categoria") Integer categoryId,
            @RequestParam(required = false, name = "disponibilidade") Boolean disponibilidade,
            @RequestParam(required = false, name = "instrutor") Long instrutorId,
            @RequestParam(required = false, name = "inscritoPor") Long inscritoPor,
            @RequestParam(required = false, name = "maisRecente") Boolean maisRecente,
            @RequestParam(required = false, name = "maisAntigos") Boolean maisAntigos
    ) {
        List<CourseResponse> list = courseService.list(id, categoryId, disponibilidade, instrutorId, maisRecente, maisAntigos, inscritoPor);
        if (log.isDebugEnabled()) {
            log.debug("Course list size={} categoria={} instrutor={} disponibilidade={} inscritoPor={}", list.size(), categoryId, instrutorId, disponibilidade, inscritoPor);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(courseService.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> update(@PathVariable("id") Long id, @RequestBody @Valid CourseCreateRequest req) {
        return ResponseEntity.ok(courseService.update(id, req));
    }

    @PutMapping("/{id}/instrutor")
    public ResponseEntity<CourseResponse> updateInstrutor(@PathVariable("id") Long id, @RequestParam(name = "instrutorId") Long instrutorId) {
        return ResponseEntity.ok(courseService.updateInstrutor(id, instrutorId));
    }

    @PutMapping("/{id}/categoria")
    public ResponseEntity<CourseResponse> updateCategoria(@PathVariable("id") Long id, @RequestParam(name = "categoriaId") Integer categoriaId) {
        return ResponseEntity.ok(courseService.updateCategoria(id, categoriaId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CourseResponse> updateStatus(@PathVariable("id") Long id, @RequestParam(name = "status") String status) {
        return ResponseEntity.ok(courseService.updateStatus(id, status));
    }

    @PutMapping("/{id}/vagas")
    public ResponseEntity<CourseResponse> updateVagas(@PathVariable("id") Long id, @RequestParam(name = "vagas") Integer vagas) {
        return ResponseEntity.ok(courseService.updateVagas(id, vagas));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/inscricoes")
    public ResponseEntity<EnrollmentResponse> enroll(@PathVariable("id") Long id, @RequestBody @Valid EnrollmentRequest req) {
        return ResponseEntity.ok(enrollmentService.enroll(id, req));
    }

    @DeleteMapping("/{id}/inscricoes")
    public ResponseEntity<Void> cancelAll(@PathVariable("id") Long id) {
        enrollmentService.cancelAllByCourse(id);
        return ResponseEntity.noContent().build();
    }
}
