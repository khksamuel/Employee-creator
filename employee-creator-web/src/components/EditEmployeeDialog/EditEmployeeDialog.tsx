import type { RefObject } from "react";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import styles from "./EditEmployeeDialog.module.scss";
import type { Employee } from "../../utils/employee";

interface EditEmployeeDialogProps {
  employee: Employee;
  dialogRef: RefObject<HTMLDialogElement | null>;
  onSaved?: (employee: Employee) => void;
}

function EditEmployeeDialog({
  employee,
  dialogRef,
  onSaved,
}: EditEmployeeDialogProps) {
  const handleSaved = (updatedEmployee: Employee) => {
    dialogRef.current?.close();
    onSaved?.(updatedEmployee);
  };

  return (
    <dialog className={styles.dialog} ref={dialogRef}>
      <div className={styles.content}>
        <EmployeeForm
          employee={employee}
          onSaved={handleSaved}
          headerAction={
            <button
              className={styles.closeButton}
              type="button"
              onClick={() => dialogRef.current?.close()}
            >
              Back
            </button>
          }
        />
      </div>
    </dialog>
  );
}

export default EditEmployeeDialog;
