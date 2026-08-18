package com.employee_creator_api.employee.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ContractTypeConverter implements AttributeConverter<ContractType, String> {

    @Override
    public String convertToDatabaseColumn(ContractType contractType) {
        return contractType == null ? null : contractType.getValue();
    }

    @Override
    public ContractType convertToEntityAttribute(String value) {
        if (value == null) {
            return null;
        }
        for (ContractType contractType : ContractType.values()) {
            if (contractType.getValue().equals(value)) {
                return contractType;
            }
        }
        throw new IllegalArgumentException("Unknown contract type: " + value);
    }
}
