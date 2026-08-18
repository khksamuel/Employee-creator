import { useEffect, useState } from "react";
import { type Employee, getEmployees } from "../../utils/employee";
import EmployeeEntry from "../EmployeeEntry/EmployeeEntry";
import styles from "./EmployeeList.module.scss";

interface EmployeeListProps {
  updateToken: number;
  onEmployeesChanged: () => void;
}

function EmployeeList({ updateToken, onEmployeesChanged }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    getEmployees().then((employeeList: Employee[]) => {
      setEmployees(employeeList);
    });
  }, [updateToken]);

  return (
    <div className={styles.employeeList}>
      {employees.map((employee) => (
        <EmployeeEntry
          key={employee.id}
          employee={employee}
          onEmployeesChanged={onEmployeesChanged}
        />
      ))}
    </div>
  );
}

export default EmployeeList;
