package com.employee_creator_api.employee;

import com.employee_creator_api.employee.entities.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDeletedFalse();

    Optional<Employee> findByIdAndDeletedFalse(Long id);
}
