CREATE SCHEMA IF NOT EXISTS employee_creator;

CREATE TABLE IF NOT EXISTS employee_creator.employee (
    employee_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    middlename VARCHAR(255),
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    employee_address VARCHAR(255) NOT NULL,
    deleted TINYINT(1) NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employee_creator.contract (
    contract_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    contract_type ENUM('PERMANENT', 'CONTRACT') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    employment_type ENUM('FULL_TIME', 'PART_TIME') NOT NULL,
    hour_per_week INT UNSIGNED NOT NULL,
    CONSTRAINT fk_contract_employee FOREIGN KEY (employee_id) REFERENCES employee_creator.employee (employee_id)
);