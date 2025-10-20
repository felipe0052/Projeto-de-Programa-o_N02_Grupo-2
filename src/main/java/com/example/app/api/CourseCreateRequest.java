package com.example.app.api;

import com.example.app.domain.Course;
import java.util.Set;

public class CourseCreateRequest {
    private Course course;
    private Long responsibleInstructorId;
    private Integer mainCategoryId;
    private Set<Long> additionalInstructorIds;
    private Set<Integer> additionalCategoryIds;
    private Set<Long> prerequisiteIds;

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Long getResponsibleInstructorId() { return responsibleInstructorId; }
    public void setResponsibleInstructorId(Long responsibleInstructorId) { this.responsibleInstructorId = responsibleInstructorId; }

    public Integer getMainCategoryId() { return mainCategoryId; }
    public void setMainCategoryId(Integer mainCategoryId) { this.mainCategoryId = mainCategoryId; }

    public Set<Long> getAdditionalInstructorIds() { return additionalInstructorIds; }
    public void setAdditionalInstructorIds(Set<Long> additionalInstructorIds) { this.additionalInstructorIds = additionalInstructorIds; }

    public Set<Integer> getAdditionalCategoryIds() { return additionalCategoryIds; }
    public void setAdditionalCategoryIds(Set<Integer> additionalCategoryIds) { this.additionalCategoryIds = additionalCategoryIds; }

    public Set<Long> getPrerequisiteIds() { return prerequisiteIds; }
    public void setPrerequisiteIds(Set<Long> prerequisiteIds) { this.prerequisiteIds = prerequisiteIds; }
}