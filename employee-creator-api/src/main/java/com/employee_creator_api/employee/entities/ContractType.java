package com.employee_creator_api.employee.entities;

public enum ContractType {
    PERMANENT("permanent"),
    CONTRACT("contract");

    private final String value;

    ContractType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
