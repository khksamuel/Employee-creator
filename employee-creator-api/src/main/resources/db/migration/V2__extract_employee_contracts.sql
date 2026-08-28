CREATE TABLE contract (
    contract_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    contract_type ENUM('PERMANENT', 'CONTRACT') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    employment_type ENUM('FULL_TIME', 'PART_TIME') NOT NULL,
    hour_per_week INT UNSIGNED NOT NULL,
    CONSTRAINT fk_contract_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
);

INSERT INTO contract (
    employee_id, contract_type, start_date, end_date, employment_type, hour_per_week
)
SELECT
    employee_id,
    UPPER(contract_type),
    start_date,
    end_date,
    REPLACE(UPPER(employment_type), '-', '_'),
    hour_per_week
FROM employee;

ALTER TABLE employee
    DROP COLUMN contract_type,
    DROP COLUMN start_date,
    DROP COLUMN end_date,
    DROP COLUMN employment_type,
    DROP COLUMN hour_per_week;
