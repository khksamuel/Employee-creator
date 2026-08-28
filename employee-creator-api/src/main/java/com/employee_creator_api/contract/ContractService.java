package com.employee_creator_api.contract;

import com.employee_creator_api.contract.dto.CreateContractRequest;
import com.employee_creator_api.contract.dto.UpdateContractRequest;
import com.employee_creator_api.contract.entities.Contract;
import com.employee_creator_api.employee.InvalidEmployeeDateException;
import com.employee_creator_api.employee.EmployeeNotFoundException;
import com.employee_creator_api.employee.EmployeeRepository;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ContractService {

    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;

    public ContractService(ContractRepository contractRepository, EmployeeRepository employeeRepository) {
        this.contractRepository = contractRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<Contract> getAllContracts(Long employeeId) {
        employeeRepository.findByIdAndDeletedFalse(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException(employeeId));
        return contractRepository.findByEmployee_Id(employeeId);
    }

    @Transactional(readOnly = true)
    public Contract getContractById(Long id) {
        return findContract(id);
    }

    public Contract createContract(CreateContractRequest request) {
        Contract contract = new Contract();
        contract.setEmployee(employeeRepository.findByIdAndDeletedFalse(request.employeeId())
                .orElseThrow(() -> new EmployeeNotFoundException(request.employeeId())));
        contract.setContractType(request.contractType());
        contract.setStartDate(request.startDate());
        contract.setEndDate(request.endDate());
        contract.setEmploymentType(request.employmentType());
        contract.setHourPerWeek(request.hourPerWeek());
        return contractRepository.save(contract);
    }

    public Contract updateContract(Long id, UpdateContractRequest request) {
        Contract contract = findContract(id);
        if (request.contractType() != null)
            contract.setContractType(request.contractType());
        if (request.startDate() != null)
            contract.setStartDate(request.startDate());
        if (request.endDate() != null)
            contract.setEndDate(request.endDate());
        if (request.employmentType() != null)
            contract.setEmploymentType(request.employmentType());
        if (request.hourPerWeek() != null)
            contract.setHourPerWeek(request.hourPerWeek());
        validateDates(contract);
        return contractRepository.save(contract);
    }

    public void deleteContract(Long id) {
        contractRepository.delete(findContract(id));
    }

    private Contract findContract(Long id) {
        return contractRepository.findById(id).orElseThrow(() -> new ContractNotFoundException(id));
    }

    private void validateDates(Contract contract) {
        if (contract.getEndDate() != null && contract.getEndDate().isBefore(contract.getStartDate())) {
            throw new InvalidEmployeeDateException();
        }
    }
}
