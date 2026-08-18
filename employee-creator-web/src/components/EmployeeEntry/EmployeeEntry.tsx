import { useRef } from "react";
import styles from "./EmployeeEntry.module.scss";
import { type Employee } from "../../utils/employee";
import EditEmployeeDialog from "../EditEmployeeDialog/EditEmployeeDialog";

function EmployeeEntry(props: { employee: Employee }) {
  const { employee } = props;
  const editDialogRef = useRef<HTMLDialogElement | null>(null);

  const handleEdit = () => {
    editDialogRef.current?.showModal();
  };

  const handleEmployeeSaved = (updatedEmployee: Employee) => {
    // Handle the updated employee if needed (e.g., refresh the list)
    console.log("Employee updated:", updatedEmployee);
  };

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
        <button
          className={styles.employeeActionsButton}
          onClick={handleEdit}
          type="button"
        >
          Edit
        </button>
        <button className={styles.employeeActionsButton}>Delete</button>
      </div>

      <EditEmployeeDialog
        employee={employee}
        dialogRef={editDialogRef}
        onSaved={handleEmployeeSaved}
      />
    </div>
  );
}

export default EmployeeEntry;
