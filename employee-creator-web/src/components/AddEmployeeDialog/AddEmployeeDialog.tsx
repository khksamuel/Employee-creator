import type { RefObject } from "react";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import styles from "./AddEmployeeDialog.module.scss";

interface AddEmployeeDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
}

function AddEmployeeDialog({ dialogRef }: AddEmployeeDialogProps) {
  const handleSaved = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog className={styles.dialog} ref={dialogRef}>
      <div className={styles.content}>
        <EmployeeForm
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

export default AddEmployeeDialog;
