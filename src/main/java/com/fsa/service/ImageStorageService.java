package com.fsa.service;

import com.fsa.config.StorageProperties;
import com.fsa.domain.Course;
import com.fsa.domain.CourseImage;
import com.fsa.repository.CourseImageRepository;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ImageStorageService {
    private final StorageProperties storageProperties;
    private final CourseImageRepository courseImageRepository;

    public ImageStorageService(StorageProperties storageProperties, CourseImageRepository courseImageRepository) {
        this.storageProperties = storageProperties;
        this.courseImageRepository = courseImageRepository;
    }

    public List<CourseImage> listByCourse(Long courseId) {
        return courseImageRepository.findByCourse_Id(courseId);
    }

    public CourseImage storeCourseImage(Course course, MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Arquivo vazio");
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String ext = extractExtension(original);
        String safeExt = ext == null ? "" : "." + ext.toLowerCase();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String filename = uuid + safeExt;
        String mime = detectMime(file);

        Path base = Paths.get(storageProperties.getBaseDir()).toAbsolutePath();
        Path dir = base.resolve("courses").resolve(String.valueOf(course.getId()));
        Files.createDirectories(dir);
        Path target = dir.resolve(filename);
        Files.write(target, file.getBytes());

        CourseImage ci = CourseImage.builder()
                .course(course)
                .filename(filename)
                .mimeType(mime)
                .sizeBytes(file.getSize())
                .storagePath(target.toString())
                .createdAt(LocalDateTime.now())
                .build();
        return courseImageRepository.save(ci);
    }

    public void deleteCourseImage(CourseImage img) throws IOException {
        Path p = Paths.get(img.getStoragePath());
        try {
            Files.deleteIfExists(p);
        } finally {
            courseImageRepository.delete(img);
        }
    }

    public Path resolvePath(CourseImage img) {
        return Paths.get(img.getStoragePath());
    }

    private String detectMime(MultipartFile file) {
        String mime = file.getContentType();
        if (mime == null || mime.isBlank()) return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        return mime;
    }

    private String extractExtension(String name) {
        int dot = name.lastIndexOf('.')
                ;
        if (dot == -1 || dot == name.length() - 1) return null;
        return name.substring(dot + 1);
    }
}