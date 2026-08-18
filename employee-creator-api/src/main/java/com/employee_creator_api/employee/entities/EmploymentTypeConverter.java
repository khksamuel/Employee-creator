package com.employee_creator_api.employee.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EmploymentTypeConverter implements AttributeConverter<EmploymentType, String> {

    @Override
    public String convertToDatabaseColumn(EmploymentType employmentType) {
        return employmentType == null ? null : employmentType.getValue();
    }

    @Override
    public EmploymentType convertToEntityAttribute(String value) {
        if (value == null) {
            return null;
        }
        for (EmploymentType employmentType : EmploymentType.values()) {
            if (employmentType.getValue().equals(value)) {
                return employmentType;
            }
        }
        throw new IllegalArgumentException("Unknown employment type: " + value);
    }
}
