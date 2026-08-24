package com.employee_creator_api.employee;

public class InvalidEmployeeDateException extends RuntimeException {

    public InvalidEmployeeDateException() {
        super("End date must be on or after the start date");
    }
}
