package com.employee_creator_api.employee.entities;

public enum EmploymentType {
    FULL_TIME("full-time"),
    PART_TIME("part-time");

    private final String value;

    EmploymentType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
