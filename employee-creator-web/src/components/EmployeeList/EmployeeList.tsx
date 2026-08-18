import { useEffect, useState } from "react";
import { type Employee, getEmployees } from "../../utils/employee";
import EmployeeEntry from "../EmployeeEntry/EmployeeEntry";
import styles from "./EmployeeList.module.scss";

function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    getEmployees().then((employeeList: Employee[]) => {
      setEmployees(employeeList);
    });
  }, []);

  return (
    <div className={styles.employeeList}>
      {employees.map((employee) => (
        <EmployeeEntry key={employee.id} employee={employee} />
      ))}
    </div>
  );
}

export default EmployeeList;
