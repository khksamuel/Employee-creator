package com.employee_creator_api.employee;

import com.employee_creator_api.employee.entities.Contract;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByEmployeeId(Long employeeId);
}
