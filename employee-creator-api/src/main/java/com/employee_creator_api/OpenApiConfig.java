package com.employee_creator_api;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI employeeCreatorOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Employee Creator API")
                .version("v1")
                .description("API reference for managing employee records."));
    }
}
