package com.fsa.domain.converter;

import com.fsa.domain.enums.EnrollmentStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EnrollmentStatusConverter implements AttributeConverter<EnrollmentStatus, String> {
    @Override
    public String convertToDatabaseColumn(EnrollmentStatus attribute) {
        return attribute == null ? null : attribute.getDb();
    }

    @Override
    public EnrollmentStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : EnrollmentStatus.fromDb(dbData);
    }
}

