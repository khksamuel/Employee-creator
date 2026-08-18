package com.employee_creator_api.employee;

import com.employee_creator_api.employee.entities.Employee;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees(boolean includeDeleted) {
        return includeDeleted ? employeeRepository.findAll() : employeeRepository.findAllActiveEmployees();
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return findActiveEmployee(id);
    }

    public Employee createEmployee(Employee employee) {
        employee.setId(null);
        employee.setDeleted(false);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee employee = findActiveEmployee(id);

        if (updatedEmployee.getFirstname() != null) {
            employee.setFirstname(updatedEmployee.getFirstname());
        }
        if (updatedEmployee.getMiddlename() != null) {
            employee.setMiddlename(updatedEmployee.getMiddlename());
        }
        if (updatedEmployee.getLastname() != null) {
            employee.setLastname(updatedEmployee.getLastname());
        }
        if (updatedEmployee.getEmail() != null) {
            employee.setEmail(updatedEmployee.getEmail());
        }
        if (updatedEmployee.getPhone() != null) {
            employee.setPhone(updatedEmployee.getPhone());
        }
        if (updatedEmployee.getEmployeeAddress() != null) {
            employee.setEmployeeAddress(updatedEmployee.getEmployeeAddress());
        }
        if (updatedEmployee.getContractType() != null) {
            employee.setContractType(updatedEmployee.getContractType());
        }
        if (updatedEmployee.getStartDate() != null) {
            employee.setStartDate(updatedEmployee.getStartDate());
        }
        if (updatedEmployee.getEndDate() != null) {
            employee.setEndDate(updatedEmployee.getEndDate());
        }
        if (updatedEmployee.getEmploymentType() != null) {
            employee.setEmploymentType(updatedEmployee.getEmploymentType());
        }
        if (updatedEmployee.getHourPerWeek() != null) {
            employee.setHourPerWeek(updatedEmployee.getHourPerWeek());
        }

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = findActiveEmployee(id);
        employee.softDelete();
        employeeRepository.save(employee);
    }

    private Employee findActiveEmployee(Long id) {
        return employeeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: " + id));
    }
}
