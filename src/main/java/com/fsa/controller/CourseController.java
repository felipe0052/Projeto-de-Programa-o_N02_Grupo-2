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

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/cursos")
public class CourseController {
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
            @RequestParam(required = false) Long id,
            @RequestParam(required = false, name = "categoria") Integer categoryId,
            @RequestParam(required = false, name = "disponibilidade") Boolean disponibilidade,
            @RequestParam(required = false, name = "instrutor") Long instrutorId,
            @RequestParam(required = false, name = "maisRecente") Boolean maisRecente,
            @RequestParam(required = false, name = "maisAntigos") Boolean maisAntigos
    ) {
        return ResponseEntity.ok(courseService.list(id, categoryId, disponibilidade, instrutorId, maisRecente, maisAntigos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> update(@PathVariable Long id, @RequestBody CourseCreateRequest req) {
        return ResponseEntity.ok(courseService.update(id, req));
    }

    @PutMapping("/{id}/instrutor")
    public ResponseEntity<CourseResponse> updateInstrutor(@PathVariable Long id, @RequestParam Long instrutorId) {
        return ResponseEntity.ok(courseService.updateInstrutor(id, instrutorId));
    }

    @PutMapping("/{id}/categoria")
    public ResponseEntity<CourseResponse> updateCategoria(@PathVariable Long id, @RequestParam Integer categoriaId) {
        return ResponseEntity.ok(courseService.updateCategoria(id, categoriaId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CourseResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(courseService.updateStatus(id, status));
    }

    @PutMapping("/{id}/vagas")
    public ResponseEntity<CourseResponse> updateVagas(@PathVariable Long id, @RequestParam Integer vagas) {
        return ResponseEntity.ok(courseService.updateVagas(id, vagas));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // POST /cursos/{id}/inscricoes  (inscrever id)
    @PostMapping("/{id}/inscricoes")
    public ResponseEntity<EnrollmentResponse> enroll(@PathVariable Long id, @RequestBody @Valid EnrollmentRequest req) {
        return ResponseEntity.ok(enrollmentService.enroll(id, req));
    }

    // DELETE /cursos/{id}/inscricoes  (desinscrever all)
    @DeleteMapping("/{id}/inscricoes")
    public ResponseEntity<Void> cancelAll(@PathVariable Long id) {
        enrollmentService.cancelAllByCourse(id);
        return ResponseEntity.noContent().build();
    }
}

