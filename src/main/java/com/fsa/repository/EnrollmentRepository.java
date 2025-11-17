package com.fsa.repository;

import com.fsa.domain.Enrollment;
import com.fsa.domain.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    long countByCourse_IdAndStatus(Long courseId, EnrollmentStatus status);

    List<Enrollment> findByUser_IdAndStatus(Long userId, EnrollmentStatus status);

    @Modifying
    @Query("update Enrollment e set e.status = 'CANCELADO' where e.course.id = :courseId and e.status = 'ATIVO'")
    int cancelAllActiveByCourse(@Param("courseId") Long courseId);
}

