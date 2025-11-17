package com.fsa.dto.enrollment;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnrollmentResponse {
    private Long id;
    private Long userId;
    private Long courseId;
    private String status;
}

