import { useQueries, useQuery } from "@tanstack/react-query";
import { getEmployees } from "../../utils/employee";
import { getContracts } from "../../utils/contract";
import EmployeeEntry from "../EmployeeEntry/EmployeeEntry";
import styles from "./EmployeeList.module.scss";

function EmployeeList() {
  const { data: employees = [], error: employeesError, isPending: employeesPending } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(),
  });
  const contractQueries = useQueries({
    queries: employees.map((employee) => ({
      queryKey: ["contracts", employee.id],
      queryFn: () => getContracts(employee.id),
      enabled: !employeesPending,
    })),
  });
  const contractsPending = contractQueries.some((query) => query.isPending);
  const contractsError = contractQueries.some((query) => query.isError);

  if (employeesPending || contractsPending) {
    return <p className={styles.status}>Loading employees…</p>;
  }

  if (employeesError || contractsError) {
    return <p className={styles.status} role="alert">Unable to load employees and contracts.</p>;
  }

  return (
    <div className={styles.employeeList}>
      <div className={styles.listHeader} aria-hidden="true">
        <span>Employee</span><span>Employment</span><span>Contact</span><span>Actions</span>
      </div>
      {employees.length === 0 && <p className={styles.empty}>No employee records yet. Add an employee to begin.</p>}
      {employees.map((employee, index) => (
        <EmployeeEntry
          key={employee.id}
          employee={employee}
          contracts={contractQueries[index]?.data ?? []}
        />
      ))}
    </div>
  );
}

export default EmployeeList;
