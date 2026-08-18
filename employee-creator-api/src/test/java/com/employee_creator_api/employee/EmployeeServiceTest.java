package com.employee_creator_api.employee;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.Employee;
import com.employee_creator_api.employee.entities.EmploymentType;
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
