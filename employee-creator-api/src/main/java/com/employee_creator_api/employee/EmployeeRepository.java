package com.employee_creator_api.employee;

import com.employee_creator_api.employee.entities.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @EntityGraph(attributePaths = {"contractType", "employmentType"})
    @Query("SELECT e FROM Employee e WHERE e.deleted = false")
    List<Employee> findAllActiveEmployees();

    @EntityGraph(attributePaths = {"contractType", "employmentType"})
    @Query("SELECT e FROM Employee e WHERE e.id = :id AND e.deleted = false")
    Optional<Employee> findByIdAndDeletedFalse(Long id);

    @EntityGraph(attributePaths = {"contractType", "employmentType"})
    @Query("SELECT e FROM Employee e WHERE e.deleted = true")
    List<Employee> findAllDeletedEmployees();
}