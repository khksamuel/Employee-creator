-- Seeder for employee_creator.employee table
-- 6 entries in total, 2 were soft deleted with the deleted flag

INSERT INTO
    employee_creator.employee (
        firstname,
        middlename,
        lastname,
        email,
        phone,
        employee_address,
        contract_type,
        start_date,
        end_date,
        employment_type,
        hour_per_week,
        deleted
    )
VALUES (
        'John',
        'Michael',
        'Smith',
        'john.smith@company.com',
        '0412345678',
        '123 Main Street, Sydney NSW 2000',
        'permanent',
        '2022-01-15',
        NULL,
        'full-time',
        40,
        0
    ),
    (
        'Sarah',
        'Elizabeth',
        'Johnson',
        'sarah.johnson@company.com',
        '0487654321',
        '456 Oak Avenue, Melbourne VIC 3000',
        'permanent',
        '2021-06-20',
        NULL,
        'full-time',
        40,
        0
    ),
    (
        'Emily',
        NULL,
        'Williams',
        'emily.williams@company.com',
        '0423456789',
        '789 Elm Street, Brisbane QLD 4000',
        'contract',
        '2023-09-01',
        '2024-12-31',
        'part-time',
        25,
        1
    ),
    (
        'David',
        'James',
        'Brown',
        'david.brown@company.com',
        '0434567890',
        '321 Pine Road, Perth WA 6000',
        'permanent',
        '2020-03-10',
        NULL,
        'full-time',
        40,
        1
    ),
    (
        'Jessica',
        'Marie',
        'Davis',
        'jessica.davis@company.com',
        '0445678901',
        '654 Maple Drive, Adelaide SA 5000',
        'contract',
        '2023-11-15',
        NULL,
        'part-time',
        20,
        0
    ),
    (
        'Michael',
        'Robert',
        'Miller',
        'michael.miller@company.com',
        '0456789012',
        '987 Birch Lane, Hobart TAS 7000',
        'permanent',
        '2022-07-05',
        NULL,
        'full-time',
        40,
        0
    );