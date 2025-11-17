package com.fsa.repository;

import com.fsa.domain.CourseImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseImageRepository extends JpaRepository<CourseImage, Long> {
    List<CourseImage> findByCourse_Id(Long courseId);
}