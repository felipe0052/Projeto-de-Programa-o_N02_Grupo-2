package com.fsa.dto.course;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseImageResponse {
    private Long id;
    private String url;
    private String mimeType;
    private Long sizeBytes;
}