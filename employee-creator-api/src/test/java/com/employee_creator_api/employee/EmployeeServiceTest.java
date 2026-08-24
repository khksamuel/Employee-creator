package com.employee_creator_api.employee;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.employee_creator_api.employee.entities.Employee;
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

    private Employee employee(boolean deleted) {
        Employee employee = new Employee(
                "Ada",
                "Lovelace",
                "ada@example.com",
                "0400000000",
                "1 Example Street");
        employee.setId(1L);
        employee.setDeleted(deleted);
        return employee;
    }
}
