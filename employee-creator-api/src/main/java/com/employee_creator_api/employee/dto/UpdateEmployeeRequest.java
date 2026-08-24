package com.employee_creator_api.employee.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateEmployeeRequest(
        @Size(min = 1, max = 255) String firstname,
        @Size(max = 255) String middlename,
        @Size(min = 1, max = 255) String lastname,
        @Email @Size(max = 255) String email,
        @Pattern(regexp = "^(?:\\+61|0)4\\d{8}$", message = "must be an Australian mobile number") String phone,
        @Size(min = 1, max = 255) String employeeAddress) {
}
