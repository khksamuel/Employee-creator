package com.employee_creator_api.employee.dto;

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.EmploymentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateEmployeeRequest(
        @Size(min = 1, max = 255) String firstname,
        @Size(max = 255) String middlename,
        @Size(min = 1, max = 255) String lastname,
        @Email @Size(max = 255) String email,
        @Pattern(regexp = "^(?:\\+61|0)4\\d{8}$", message = "must be an Australian mobile number") String phone,
        @Size(min = 1, max = 255) String employeeAddress,
        ContractType contractType,
        LocalDate startDate,
        LocalDate endDate,
        EmploymentType employmentType,
        @Positive @Max(168) Integer hourPerWeek) {
}
