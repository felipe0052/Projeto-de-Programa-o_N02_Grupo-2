package com.example.app.api;

import com.example.app.domain.Course;
import com.example.app.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Cursos", description = "API para gerenciamento de cursos")
public class CourseApiController {

    private final CourseService courseService;

    public CourseApiController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    @Operation(summary = "Lista todos os cursos")
    public List<Course> list() {
        return courseService.listAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca curso por ID")
    public ResponseEntity<Course> get(@PathVariable Long id) {
        return courseService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cria um curso com vínculos e validações")
    public ResponseEntity<Course> create(@RequestBody CourseCreateRequest req) {
        Course saved = courseService.create(
                req.getCourse(),
                req.getResponsibleInstructorId(),
                req.getMainCategoryId(),
                req.getAdditionalInstructorIds(),
                req.getAdditionalCategoryIds(),
                req.getPrerequisiteIds()
        );
        return ResponseEntity.created(URI.create("/api/courses/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um curso por ID aplicando vínculos e validações")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody CourseCreateRequest req) {
        Course saved = courseService.update(
                id,
                req.getCourse(),
                req.getResponsibleInstructorId(),
                req.getMainCategoryId(),
                req.getAdditionalInstructorIds(),
                req.getAdditionalCategoryIds(),
                req.getPrerequisiteIds()
        );
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Exclui um curso por ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}