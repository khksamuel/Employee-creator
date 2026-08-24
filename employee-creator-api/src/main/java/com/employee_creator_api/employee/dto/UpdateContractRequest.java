package com.employee_creator_api.employee.dto;

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.EmploymentType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record UpdateContractRequest(
        ContractType contractType,
        LocalDate startDate,
        LocalDate endDate,
        EmploymentType employmentType,
        @Positive @Max(168) Integer hourPerWeek) {
}
