package com.employee_creator_api.employee;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.Employee;
import com.employee_creator_api.employee.entities.EmploymentType;
import com.employee_creator_api.employee.dto.UpdateEmployeeRequest;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void deleteEmployeeSoftDeletesAnActiveEmployee() {
        Employee employee = employee(false);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        employeeService.deleteEmployee(1L);

        verify(employeeRepository).save(employee);
        org.junit.jupiter.api.Assertions.assertTrue(employee.getDeleted());
    }

    @Test
    void deleteEmployeeIsIdempotentForAnAlreadyDeletedEmployee() {
        Employee employee = employee(true);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertDoesNotThrow(() -> employeeService.deleteEmployee(1L));

        verify(employeeRepository, never()).save(employee);
    }

    @Test
    void deleteEmployeeThrowsDomainExceptionWhenEmployeeDoesNotExist() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeService.deleteEmployee(99L));

        org.junit.jupiter.api.Assertions.assertEquals("Employee not found: 99", exception.getMessage());
    }

    @Test
    void updateEmployeeThrowsDomainExceptionForAnInvalidDateRange() {
        Employee employee = employee(false);
        when(employeeRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(employee));
        UpdateEmployeeRequest request = new UpdateEmployeeRequest(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                LocalDate.of(2025, 12, 31),
                null,
                null);

        InvalidEmployeeDateException exception = assertThrows(
                InvalidEmployeeDateException.class,
                () -> employeeService.updateEmployee(1L, request));

        org.junit.jupiter.api.Assertions.assertEquals("End date must be on or after the start date", exception.getMessage());
        verify(employeeRepository, never()).save(employee);
    }

    private Employee employee(boolean deleted) {
        Employee employee = new Employee(
                "Ada",
                "Lovelace",
                "ada@example.com",
                "0400000000",
                "1 Example Street",
                ContractType.PERMANENT,
                LocalDate.of(2026, 1, 1),
                EmploymentType.FULL_TIME,
                38);
        employee.setId(1L);
        employee.setDeleted(deleted);
        return employee;
    }
}
