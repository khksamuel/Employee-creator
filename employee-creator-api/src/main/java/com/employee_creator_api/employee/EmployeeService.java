package com.employee_creator_api.employee;

import com.employee_creator_api.employee.entities.Employee;
import com.employee_creator_api.employee.dto.CreateEmployeeRequest;
import com.employee_creator_api.employee.dto.UpdateEmployeeRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees(boolean includeDeleted) {
        return includeDeleted ? employeeRepository.findAll() : employeeRepository.findByDeletedFalse();
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return findActiveEmployee(id);
    }

    public Employee createEmployee(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        employee.setFirstname(request.firstname());
        employee.setMiddlename(request.middlename());
        employee.setLastname(request.lastname());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setEmployeeAddress(request.employeeAddress());
        employee.setDeleted(false);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, UpdateEmployeeRequest updatedEmployee) {
        Employee employee = findActiveEmployee(id);

        if (updatedEmployee.firstname() != null) {
            employee.setFirstname(updatedEmployee.firstname());
        }
        if (updatedEmployee.middlename() != null) {
            employee.setMiddlename(updatedEmployee.middlename());
        }
        if (updatedEmployee.lastname() != null) {
            employee.setLastname(updatedEmployee.lastname());
        }
        if (updatedEmployee.email() != null) {
            employee.setEmail(updatedEmployee.email());
        }
        if (updatedEmployee.phone() != null) {
            employee.setPhone(updatedEmployee.phone());
        }
        if (updatedEmployee.employeeAddress() != null) {
            employee.setEmployeeAddress(updatedEmployee.employeeAddress());
        }
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        if (!Boolean.TRUE.equals(employee.getDeleted())) {
            employee.softDelete();
            employeeRepository.save(employee);
        }
    }

    private Employee findActiveEmployee(Long id) {
        return employeeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }
}
