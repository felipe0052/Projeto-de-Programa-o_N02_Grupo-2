package com.fsa.controller;

import com.fsa.domain.Course;
import com.fsa.domain.CourseImage;
import com.fsa.dto.course.CourseImageResponse;
import com.fsa.repository.CourseImageRepository;
import com.fsa.repository.CourseRepository;
import com.fsa.service.CourseService;
import com.fsa.service.ImageStorageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/cursos/{courseId}/imagens")
public class CourseImageController {
    private final CourseRepository courseRepository;
    private final CourseImageRepository courseImageRepository;
    private final ImageStorageService imageStorageService;
    private final CourseService courseService;

    public CourseImageController(CourseRepository courseRepository,
                                 CourseImageRepository courseImageRepository,
                                 ImageStorageService imageStorageService,
                                 CourseService courseService) {
        this.courseRepository = courseRepository;
        this.courseImageRepository = courseImageRepository;
        this.imageStorageService = imageStorageService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseImageResponse>> list(@PathVariable("courseId") Long courseId) {
        Course c = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        List<CourseImage> imgs = imageStorageService.listByCourse(courseId);
        String base = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        List<CourseImageResponse> out = imgs.stream().map(i -> CourseImageResponse.builder()
                .id(i.getId())
                .url(base + "/media/cursos/" + courseId + "/" + i.getFilename())
                .mimeType(i.getMimeType())
                .sizeBytes(i.getSizeBytes())
                .build()).toList();
        return ResponseEntity.ok(out);
    }

    @PostMapping
    public ResponseEntity<List<CourseImageResponse>> upload(@PathVariable("courseId") Long courseId,
                                                            @RequestParam("files") List<MultipartFile> files) throws IOException {
        Course c = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        courseService.ensureEditPermission(c);
        List<CourseImageResponse> out = files.stream().map(f -> {
            try {
                CourseImage saved = imageStorageService.storeCourseImage(c, f);
                String base = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
                return CourseImageResponse.builder()
                        .id(saved.getId())
                        .url(base + "/media/cursos/" + courseId + "/" + saved.getFilename())
                        .mimeType(saved.getMimeType())
                        .sizeBytes(saved.getSizeBytes())
                        .build();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }).toList();
        return ResponseEntity.ok(out);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> delete(@PathVariable("courseId") Long courseId,
                                       @PathVariable("imageId") Long imageId) throws IOException {
        Course c = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        CourseImage img = courseImageRepository.findById(imageId).orElseThrow(() -> new IllegalArgumentException("Imagem não encontrada"));
        if (!img.getCourse().getId().equals(courseId)) throw new IllegalArgumentException("Imagem não pertence ao curso");
        courseService.ensureEditPermission(c);
        imageStorageService.deleteCourseImage(img);
        return ResponseEntity.noContent().build();
    }
}
