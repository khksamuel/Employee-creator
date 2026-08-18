import type { RefObject } from "react";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import styles from "./AddEmployeeDialog.module.scss";

interface AddEmployeeDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
}

function AddEmployeeDialog({ dialogRef }: AddEmployeeDialogProps) {
  return (
    <dialog className={styles.dialog} ref={dialogRef}>
      <div className={styles.content}>
        <EmployeeForm
          onSaved={() => dialogRef.current?.close()}
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
