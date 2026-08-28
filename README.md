# Employee Creator

Employee Creator is a full-stack employee management project. The frontend is a React/Vite app, and the backend is a Spring Boot REST API backed by MySQL.

Employees hold personal and contact details. Employment terms are stored as contracts, allowing each employee to have multiple contracts.

## Tech stack

- React, TypeScript, Vite, React Query
- Java 26, Spring Boot 4, Spring Data JPA, Maven
- MySQL 8
- OpenAPI / Swagger UI

## Project structure

```text
employee-creator-web/   React frontend
employee-creator-api/   Spring Boot API and database SQL
run.sh / run.bat        Start both applications
test.sh / test.bat      Run backend and frontend tests
```

## Requirements

- Java 26
- Maven 3.9+
- Node.js and npm
- MySQL 8+

## Quick start

Create the database once:

```sql
CREATE DATABASE employee_creator;
```

Copy the API environment template and supply your MySQL password:

```sh
cd employee-creator-api
cp .env.example .env
```

On Windows, create `employee-creator-api/.env` manually from `.env.example` if `cp` is unavailable. The defaults expect MySQL on `localhost:3306` with database name `employee_creator` and user `root`.

Install frontend dependencies:

```sh
cd employee-creator-web
npm install
```

Start both applications with demo data from the repository root:

```sh
# only tested Linux
./run.sh demo
```


```bat
run.bat demo
```

Flyway creates and upgrades the `employee` and `contract` tables on API startup. Demo mode then loads the sample data; it is safe to run repeatedly because the seed script uses idempotent inserts.

To start without applying the setup or seed scripts, omit `demo`:

```sh
# only tested Linux
./run.sh
```

```bat
run.bat
```

The `.sh` scripts have been tested on Linux only. They may work on macOS, but macOS compatibility has not been verified. Use the `.bat` scripts on Windows.

The API is available at `http://localhost:8080`; Vite normally starts at `http://localhost:5173`. The frontend proxies `/api` requests to the API. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

## Database migrations

Schema changes are managed by Flyway and live in `employee-creator-api/src/main/resources/db/migration/`.

- `V1__create_legacy_employee_schema.sql` records the original single-table schema.
- `V2__extract_employee_contracts.sql` creates `contract`, migrates the employment fields, and removes them from `employee`.

On an empty `employee_creator` database, starting the API applies both migrations automatically. Flyway records them in `flyway_schema_history`; do not edit an applied migration. Add a new versioned file for each later schema change.

If you already have the *current* two-table schema created by the former scripts, back it up and run the API once with these environment variables:

```sh
SPRING_FLYWAY_BASELINE_ON_MIGRATE=true
SPRING_FLYWAY_BASELINE_VERSION=2
```

Flyway will create its history table and record the existing schema at V2; remove the variables after that first successful run. A legacy database with the original single employee table should use baseline version `1` instead, allowing Flyway to run V2.

Demo data is no longer a schema migration. It is at `src/main/resources/db/demo/demo-data.sql` and runs only with the `demo` profile.

## API

### Employees

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/employees` | List active employees |
| `GET` | `/api/employees?includeDeleted=true` | Include soft-deleted employees |
| `GET` | `/api/employees/{id}` | Get an employee |
| `POST` | `/api/employees` | Create an employee |
| `PATCH` | `/api/employees/{id}` | Update an employee |
| `DELETE` | `/api/employees/{id}` | Soft-delete an employee |

### Contracts

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/contracts?employeeId={id}` | List contracts for an employee |
| `GET` | `/api/contracts/{id}` | Get a contract |
| `POST` | `/api/contracts` | Create a contract for an active employee |
| `PATCH` | `/api/contracts/{id}` | Update a contract |
| `DELETE` | `/api/contracts/{id}` | Delete a contract |

Example contract request:

```json
{
  "employeeId": 1,
  "contractType": "PERMANENT",
  "startDate": "2026-01-01",
  "employmentType": "FULL_TIME",
  "hourPerWeek": 38
}
```

Contract responses include `employeeId` rather than embedding an employee object.

## Tests

Run both test suites from the repository root:

```sh
# only tested Linux
./test.sh
```

```bat
test.bat
```

Or run them independently:

```sh
cd employee-creator-api && mvn test
cd employee-creator-web && npm test
```

## Frontend scope

The current frontend provides employee management. Contract CRUD is available in the backend API only; no contract CRUD interface has been added.
