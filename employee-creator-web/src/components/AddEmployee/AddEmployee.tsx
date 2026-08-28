import { useRef } from "react";
import styles from "./AddEmployee.module.scss";
import AddEmployeeDialog from "../AddEmployeeDialog/AddEmployeeDialog";

function AddEmployee() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div className={styles.addEmployee}>
      <div>
        <h2>Employee directory</h2>
        <p className={styles.addEmployeeText}>
          Select an employee to review or update their details.
        </p>
      </div>
      <button
        className={styles.addEmployeeButton}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span aria-hidden="true">+</span> Add employee
      </button>
      <AddEmployeeDialog dialogRef={dialogRef} />
    </div>
  );
}

export default AddEmployee;
