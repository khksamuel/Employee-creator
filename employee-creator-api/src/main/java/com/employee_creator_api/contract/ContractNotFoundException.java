package com.employee_creator_api.contract;

public class ContractNotFoundException extends RuntimeException {

    public ContractNotFoundException(Long contractId) {
        super("Contract not found: " + contractId);
    }
}
