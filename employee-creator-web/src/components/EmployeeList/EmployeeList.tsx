import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../../utils/employee";
import EmployeeEntry from "../EmployeeEntry/EmployeeEntry";
import styles from "./EmployeeList.module.scss";

function EmployeeList() {
  const { data: employees = [], error, isPending } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(),
  });

  if (isPending) {
    return <p>Loading employees…</p>;
  }

  if (error) {
    return <p role="alert">Unable to load employees.</p>;
  }

  return (
    <div className={styles.employeeList}>
      {employees.map((employee) => (
        <EmployeeEntry key={employee.id} employee={employee} />
      ))}
    </div>
  );
}

export default EmployeeList;
