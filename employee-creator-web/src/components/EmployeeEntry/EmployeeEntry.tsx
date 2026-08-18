import styles from "./EmployeeEntry.module.scss";
import { type Employee } from "../../utils/employee";

function EmployeeEntry(props: { employee: Employee }) {
  const { employee } = props;

  return (
    <div className={styles.employeeEntry}>
      <div className={styles.employeeInfo}>
        <p>
          {employee.firstname} {employee.middlename} {employee.lastname}
        </p>
        <p>
          {employee.contractType} -{" "}
          {Math.floor(
            (new Date().getTime() - new Date(employee.startDate).getTime()) /
              (1000 * 3600 * 24 * 365),
          )}{" "}
          years
        </p>
        <p>{employee.email}</p>
      </div>

      <div className={styles.employeeActions}>
        <button className={styles.employeeActionsButton}>Edit</button>
        <button className={styles.employeeActionsButton}>Delete</button>
      </div>
    </div>
  );
}

export default EmployeeEntry;
