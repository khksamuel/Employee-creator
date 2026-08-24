package com.employee_creator_api.employee.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateEmployeeRequest(
        @NotBlank @Size(max = 255) String firstname,
        @Size(max = 255) String middlename,
        @NotBlank @Size(max = 255) String lastname,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Pattern(regexp = "^(?:\\+61|0)4\\d{8}$", message = "must be an Australian mobile number") String phone,
        @NotBlank @Size(max = 255) String employeeAddress) {
}
