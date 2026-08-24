package com.employee_creator_api.employee.dto;

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.EmploymentType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record CreateContractRequest(
        @NotNull Long employeeId,
        @NotNull ContractType contractType,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotNull EmploymentType employmentType,
        @NotNull @Positive @Max(168) Integer hourPerWeek) {

    @AssertTrue(message = "end date must be on or after the start date")
    public boolean isEndDateValid() {
        return endDate == null || !endDate.isBefore(startDate);
    }
}
