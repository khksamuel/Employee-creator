import apiFetch from "./api";

export type ContractType = "PERMANENT" | "CONTRACT";
export type EmploymentType = "FULL_TIME" | "PART_TIME";

export interface Contract {
  id: number;
  employeeId: number;
  contractType: ContractType;
  startDate: string;
  endDate?: string | null;
  employmentType: EmploymentType;
  hourPerWeek: number;
}

export type ContractInput = Omit<Contract, "id">;
export type ContractUpdate = Partial<Omit<ContractInput, "employeeId">>;

export async function getContracts(employeeId: number): Promise<Contract[]> {
  return (await apiFetch<Contract[]>(`/contracts?employeeId=${employeeId}`)) ?? [];
}

export async function getContract(id: number): Promise<Contract> {
  return (await apiFetch<Contract>(`/contracts/${id}`)) as Contract;
}

export async function createContract(
  contract: ContractInput,
): Promise<Contract> {
  return (await apiFetch<Contract>("/contracts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contract),
  })) as Contract;
}

export async function updateContract(
  id: number,
  contract: ContractUpdate,
): Promise<Contract> {
  return (await apiFetch<Contract>(`/contracts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contract),
  })) as Contract;
}

export async function deleteContract(id: number): Promise<void> {
  await apiFetch<void>(`/contracts/${id}`, { method: "DELETE" });
}
