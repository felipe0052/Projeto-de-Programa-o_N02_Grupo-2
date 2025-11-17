package com.fsa.controller;

import com.fsa.domain.CourseImage;
import com.fsa.repository.CourseImageRepository;
import com.fsa.service.ImageStorageService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/media/cursos")
public class MediaController {
    private final CourseImageRepository courseImageRepository;
    private final ImageStorageService imageStorageService;

    public MediaController(CourseImageRepository courseImageRepository, ImageStorageService imageStorageService) {
        this.courseImageRepository = courseImageRepository;
        this.imageStorageService = imageStorageService;
    }

    @GetMapping("/{courseId}/{filename}")
    public ResponseEntity<Resource> getCourseImage(@PathVariable("courseId") Long courseId,
                                                   @PathVariable("filename") String filename) throws IOException {
        CourseImage img = courseImageRepository.findByCourse_Id(courseId).stream()
                .filter(i -> filename.equals(i.getFilename()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Imagem não encontrada"));
        byte[] bytes = Files.readAllBytes(imageStorageService.resolvePath(img));
        ByteArrayResource resource = new ByteArrayResource(bytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=2592000")
                .contentType(MediaType.parseMediaType(img.getMimeType()))
                .body(resource);
    }
}

