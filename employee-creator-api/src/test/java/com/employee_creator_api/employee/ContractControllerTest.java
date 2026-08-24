package com.employee_creator_api.employee;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.employee_creator_api.employee.dto.CreateContractRequest;
import com.employee_creator_api.employee.dto.UpdateContractRequest;
import com.employee_creator_api.employee.entities.Contract;
import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.Employee;
import com.employee_creator_api.employee.entities.EmploymentType;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ContractController.class)
class ContractControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private ContractService contractService;

    @Test
    void getsContractsForAnEmployee() throws Exception {
        when(contractService.getAllContracts(1L)).thenReturn(List.of(contract(1L, 1L)));

        mockMvc.perform(get("/api/contracts").param("employeeId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].employeeId").value(1));

        verify(contractService).getAllContracts(1L);
    }

    @Test
    void createsContract() throws Exception {
        when(contractService.createContract(any(CreateContractRequest.class))).thenReturn(contract(2L, 1L));

        mockMvc.perform(post("/api/contracts").contentType(MediaType.APPLICATION_JSON).content(contractJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.employeeId").value(1));
    }

    @Test
    void updatesContract() throws Exception {
        when(contractService.updateContract(eq(1L), any(UpdateContractRequest.class))).thenReturn(contract(1L, 1L));

        mockMvc.perform(patch("/api/contracts/1").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hourPerWeek\":20}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hourPerWeek").value(38));
    }

    @Test
    void deletesContract() throws Exception {
        mockMvc.perform(delete("/api/contracts/1")).andExpect(status().isNoContent());
        verify(contractService).deleteContract(1L);
    }

    @Test
    void returnsNotFoundForMissingContract() throws Exception {
        doThrow(new ContractNotFoundException(99L)).when(contractService).deleteContract(99L);

        mockMvc.perform(delete("/api/contracts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Contract not found: 99"));
    }

    private Contract contract(Long id, Long employeeId) {
        Employee employee = new Employee("Ada", "Lovelace", "ada@example.com", "0400000000", "1 Example Street");
        employee.setId(employeeId);
        Contract contract = new Contract();
        contract.setId(id);
        contract.setEmployee(employee);
        contract.setContractType(ContractType.PERMANENT);
        contract.setStartDate(LocalDate.of(2026, 1, 1));
        contract.setEmploymentType(EmploymentType.FULL_TIME);
        contract.setHourPerWeek(38);
        return contract;
    }

    private String contractJson() {
        return """
                {"employeeId":1,"contractType":"PERMANENT","startDate":"2026-01-01",
                 "employmentType":"FULL_TIME","hourPerWeek":38}
                """;
    }
}
