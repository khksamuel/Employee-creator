import type { RefObject } from "react";
import type { Contract } from "../../utils/contract";
import ContractForm from "../ContractForm/ContractForm";
import styles from "./ContractDialog.module.scss";

interface ContractDialogProps {
  employeeId: number;
  contract?: Contract;
  dialogRef: RefObject<HTMLDialogElement | null>;
}

function ContractDialog({
  employeeId,
  contract,
  dialogRef,
}: ContractDialogProps) {
  const handleSaved = () => dialogRef.current?.close();

  return (
    <dialog className={styles.dialog} ref={dialogRef}>
      <div className={styles.content}>
        <ContractForm
          employeeId={employeeId}
          contract={contract}
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

export default ContractDialog;
