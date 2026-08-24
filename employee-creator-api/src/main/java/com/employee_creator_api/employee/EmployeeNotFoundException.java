package com.employee_creator_api.employee;

public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(Long employeeId) {
        super("Employee not found: " + employeeId);
    }
}
