import type { RefObject } from "react";
import styles from "./DeleteConfirmation.module.scss";

interface DeleteConfirmationProps {
  message?: string;
  dialogRef: RefObject<HTMLDialogElement | null>;
  onConfirm: () => void;
}

function DeleteConfirmation({
  message = "Are you sure you want to delete this employee?",
  dialogRef,
  onConfirm,
}: DeleteConfirmationProps) {
  const handleConfirm = () => {
    onConfirm();
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog className={styles.dialog} ref={dialogRef}>
      <div className={styles.content}>
        <h2>Delete Confirmation</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={handleCancel}
          >
            No
          </button>
          <button
            className={styles.confirmButton}
            type="button"
            onClick={handleConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default DeleteConfirmation;
