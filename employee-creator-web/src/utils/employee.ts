import apiFetch from "./api";

export type ContractType = "PERMANENT" | "CONTRACT";
export type EmploymentType = "FULL_TIME" | "PART_TIME";

export interface Employee {
  id: number;
  firstname: string;
  middlename?: string | null;
  lastname: string;
  email: string;
  phone: string;
  employeeAddress: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string | null;
  employmentType: EmploymentType;
  hourPerWeek: number;
  deleted: boolean;
}

export type EmployeeInput = Omit<Employee, "id" | "deleted">;
export type EmployeeUpdate = Partial<EmployeeInput>;

export async function getEmployees(
  includeDeleted = false,
): Promise<Employee[]> {
  const employees = await apiFetch<Employee[]>(
    `/employees?includeDeleted=${includeDeleted}`,
  );
  return employees ?? [];
}

export async function getEmployee(id: number): Promise<Employee> {
  return (await apiFetch<Employee>(`/employees/${id}`)) as Employee;
}

export async function createEmployee(
  employee: EmployeeInput,
): Promise<Employee> {
  return (await apiFetch<Employee>("/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  })) as Employee;
}

export async function updateEmployee(
  id: number,
  employee: EmployeeUpdate,
): Promise<Employee> {
  return (await apiFetch<Employee>(`/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  })) as Employee;
}

export async function deleteEmployee(id: number): Promise<void> {
  await apiFetch<void>(`/employees/${id}`, { method: "DELETE" });
}
