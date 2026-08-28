package com.employee_creator_api.contract;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.employee_creator_api.contract.entities.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByEmployee_Id(Long employeeId);
}
