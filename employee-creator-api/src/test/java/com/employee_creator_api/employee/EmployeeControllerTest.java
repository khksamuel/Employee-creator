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

import com.employee_creator_api.employee.entities.ContractType;
import com.employee_creator_api.employee.entities.Employee;
import com.employee_creator_api.employee.entities.EmploymentType;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EmployeeService employeeService;

    @Test
    void getAllEmployeesReturnsActiveEmployeesByDefault() throws Exception {
        when(employeeService.getAllEmployees(false)).thenReturn(List.of(employee(1L, "Ada")));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstname").value("Ada"));

        verify(employeeService).getAllEmployees(false);
    }

    @Test
    void getAllEmployeesCanIncludeDeletedEmployees() throws Exception {
        when(employeeService.getAllEmployees(true)).thenReturn(List.of(employee(2L, "Grace")));

        mockMvc.perform(get("/api/employees").param("includeDeleted", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstname").value("Grace"));

        verify(employeeService).getAllEmployees(true);
    }

    @Test
    void getEmployeeByIdReturnsEmployee() throws Exception {
        when(employeeService.getEmployeeById(1L)).thenReturn(employee(1L, "Ada"));

        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("ada@example.com"));
    }

    @Test
    void createEmployeeReturnsCreatedEmployee() throws Exception {
        when(employeeService.createEmployee(any(Employee.class))).thenReturn(employee(3L, "Lin"));

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson("Lin")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.firstname").value("Lin"));
    }

    @Test
    void updateEmployeeReturnsUpdatedEmployee() throws Exception {
        Employee updated = employee(1L, "Ada");
        updated.setLastname("Lovelace");
        when(employeeService.updateEmployee(eq(1L), any(Employee.class))).thenReturn(updated);

        mockMvc.perform(patch("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"lastname\":\"Lovelace\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastname").value("Lovelace"));
    }

    @Test
    void deleteEmployeeReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());

        verify(employeeService).deleteEmployee(1L);
    }

    @Test
    void getEmployeeByIdReturnsNotFoundWhenEmployeeDoesNotExist() throws Exception {
        when(employeeService.getEmployeeById(99L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: 99"));

        mockMvc.perform(get("/api/employees/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getEmployeeByIdRejectsAnInvalidId() throws Exception {
        mockMvc.perform(get("/api/employees/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createEmployeeRejectsMalformedJson() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstname\":\"Ada\""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateEmployeeReturnsNotFoundWhenEmployeeDoesNotExist() throws Exception {
        when(employeeService.updateEmployee(eq(99L), any(Employee.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: 99"));

        mockMvc.perform(patch("/api/employees/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"lastname\":\"Lovelace\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteEmployeeReturnsNotFoundWhenEmployeeDoesNotExist() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found: 99"))
                .when(employeeService)
                .deleteEmployee(99L);

        mockMvc.perform(delete("/api/employees/99"))
                .andExpect(status().isNotFound());
    }

    private Employee employee(Long id, String firstname) {
        Employee employee = new Employee(
                firstname,
                "Hopper",
                firstname.toLowerCase() + "@example.com",
                "0400000000",
                "1 Example Street",
                ContractType.PERMANENT,
                LocalDate.of(2026, 1, 1),
                EmploymentType.FULL_TIME,
                38);
        employee.setId(id);
        return employee;
    }

    private String employeeJson(String firstname) {
        return """
                {
                  "firstname": "%s",
                  "lastname": "Hopper",
                  "email": "%s@example.com",
                  "phone": "0400000000",
                  "employeeAddress": "1 Example Street",
                  "contractType": "PERMANENT",
                  "startDate": "2026-01-01",
                  "employmentType": "FULL_TIME",
                  "hourPerWeek": 38
                }
                """.formatted(firstname, firstname.toLowerCase());
    }
}
