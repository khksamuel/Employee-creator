package com.employee_creator_api.employee;

import com.employee_creator_api.employee.dto.CreateContractRequest;
import com.employee_creator_api.employee.dto.UpdateContractRequest;
import com.employee_creator_api.employee.entities.Contract;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) { this.contractService = contractService; }

    @GetMapping
    public List<Contract> getAllContracts(@RequestParam Long employeeId) {
        return contractService.getAllContracts(employeeId);
    }

    @GetMapping("/{id}")
    public Contract getContractById(@PathVariable Long id) { return contractService.getContractById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contract createContract(@Valid @RequestBody CreateContractRequest request) {
        return contractService.createContract(request);
    }

    @PatchMapping("/{id}")
    public Contract updateContract(@PathVariable Long id, @Valid @RequestBody UpdateContractRequest request) {
        return contractService.updateContract(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContract(@PathVariable Long id) { contractService.deleteContract(id); }
}
