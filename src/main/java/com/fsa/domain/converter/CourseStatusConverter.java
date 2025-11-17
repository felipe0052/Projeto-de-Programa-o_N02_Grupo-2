package com.fsa.domain.converter;

import com.fsa.domain.enums.CourseStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CourseStatusConverter implements AttributeConverter<CourseStatus, String> {
    @Override
    public String convertToDatabaseColumn(CourseStatus attribute) {
        return attribute == null ? null : attribute.getDb();
    }

    @Override
    public CourseStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : CourseStatus.fromDb(dbData);
    }
}

