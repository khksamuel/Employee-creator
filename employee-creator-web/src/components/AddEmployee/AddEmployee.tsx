import { useRef } from "react";
import styles from "./AddEmployee.module.scss";
import AddEmployeeDialog from "../AddEmployeeDialog/AddEmployeeDialog";

interface AddEmployeeProps {
  onEmployeeSaved: () => void;
}

function AddEmployee({ onEmployeeSaved }: AddEmployeeProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div className={styles.addEmployee}>
      <p className={styles.addEmployeeText}>
        Please click on 'Edit' to find more details of each employee
      </p>
      <button
        className={styles.addEmployeeButton}
        onClick={() => dialogRef.current?.showModal()}
      >
        Add Employee
      </button>
      <AddEmployeeDialog dialogRef={dialogRef} onEmployeeSaved={onEmployeeSaved} />
    </div>
  );
}

export default AddEmployee;
