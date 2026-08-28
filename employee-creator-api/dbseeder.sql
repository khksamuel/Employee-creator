-- Demo employees and contracts. INSERT IGNORE makes this safe to run repeatedly.
INSERT IGNORE INTO
    employee_creator.employee (
        employee_id,
        firstname,
        middlename,
        lastname,
        email,
        phone,
        employee_address,
        deleted
    )
VALUES (
        1,
        'John',
        'Michael',
        'Smith',
        'john.smith@company.com',
        '0412345678',
        '123 Main Street, Sydney NSW 2000',
        0
    ),
    (
        2,
        'Sarah',
        'Elizabeth',
        'Johnson',
        'sarah.johnson@company.com',
        '0487654321',
        '456 Oak Avenue, Melbourne VIC 3000',
        0
    ),
    (
        3,
        'Emily',
        NULL,
        'Williams',
        'emily.williams@company.com',
        '0423456789',
        '789 Elm Street, Brisbane QLD 4000',
        0
    ),
    (
        4,
        'David',
        'James',
        'Brown',
        'david.brown@company.com',
        '0434567890',
        '321 Pine Road, Perth WA 6000',
        1
    ),
    (
        5,
        'Jessica',
        'Marie',
        'Davis',
        'jessica.davis@company.com',
        '0445678901',
        '654 Maple Drive, Adelaide SA 5000',
        0
    ),
    (
        6,
        'Michael',
        'Robert',
        'Miller',
        'michael.miller@company.com',
        '0456789012',
        '987 Birch Lane, Hobart TAS 7000',
        0
    );

INSERT IGNORE INTO
    employee_creator.contract (
        contract_id,
        employee_id,
        contract_type,
        start_date,
        end_date,
        employment_type,
        hour_per_week
    )
VALUES (
        1,
        1,
        'PERMANENT',
        '2022-01-15',
        NULL,
        'FULL_TIME',
        40
    ),
    (
        2,
        2,
        'PERMANENT',
        '2021-06-20',
        NULL,
        'FULL_TIME',
        40
    ),
    (
        3,
        3,
        'CONTRACT',
        '2023-09-01',
        '2024-12-31',
        'PART_TIME',
        25
    ),
    (
        4,
        4,
        'PERMANENT',
        '2020-03-10',
        NULL,
        'FULL_TIME',
        40
    ),
    (
        5,
        5,
        'CONTRACT',
        '2023-11-15',
        NULL,
        'PART_TIME',
        20
    ),
    (
        6,
        6,
        'PERMANENT',
        '2022-07-05',
        NULL,
        'FULL_TIME',
        40
    ),
    (
        7,
        3,
        'CONTRACT',
        '2023-09-01',
        NULL,
        'FULL_TIME',
        40
    );