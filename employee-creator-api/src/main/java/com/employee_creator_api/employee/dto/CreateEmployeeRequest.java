package com.employee_creator_api.employee.dto;

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.EmploymentType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateEmployeeRequest(
        @NotBlank @Size(max = 255) String firstname,
        @Size(max = 255) String middlename,
        @NotBlank @Size(max = 255) String lastname,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Pattern(regexp = "^(?:\\+61|0)4\\d{8}$", message = "must be an Australian mobile number") String phone,
        @NotBlank @Size(max = 255) String employeeAddress,
        @NotNull ContractType contractType,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotNull EmploymentType employmentType,
        @NotNull @Positive @Max(168) Integer hourPerWeek) {

    @AssertTrue(message = "end date must be on or after the start date")
    public boolean isEndDateValid() {
        return startDate == null || endDate == null || !endDate.isBefore(startDate);
    }
}
