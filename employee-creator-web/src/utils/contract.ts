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

export async function getContracts(employeeId: number): Promise<Contract[]> {
  return (await apiFetch<Contract[]>(`/contracts?employeeId=${employeeId}`)) ?? [];
}
