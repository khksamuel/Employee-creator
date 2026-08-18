CREATE SCHEMA IF NOT EXISTS employee_creator;

CREATE TABLE IF NOT EXISTS employee_creator.employee (
    employee_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    middlename VARCHAR(255),
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE, -- assuming australian phone number format no country code
    employee_address VARCHAR(255) NOT NULL,
    contract_type ENUM('permanent', 'contract') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- null if ongoing
    employment_type ENUM('full-time', 'part-time') NOT NULL,
    hour_per_week INT UNSIGNED NOT NULL
);
