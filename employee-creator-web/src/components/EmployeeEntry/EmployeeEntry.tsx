import { useRef, useState } from "react";
import styles from "./EmployeeEntry.module.scss";
import { type Employee, updateEmployee } from "../../utils/employee";
import EditEmployeeDialog from "../EditEmployeeDialog/EditEmployeeDialog";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

function EmployeeEntry(props: { employee: Employee; onDeleted?: () => void }) {
  const { employee, onDeleted } = props;
  const editDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    editDialogRef.current?.showModal();
  };

  const handleEmployeeSaved = (updatedEmployee: Employee) => {
    // Handle the updated employee if needed (e.g., refresh the list)
    console.log("Employee updated:", updatedEmployee);
  };

  const handleDelete = () => {
    deleteConfirmRef.current?.showModal();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Soft delete by updating the deleted flag
      await updateEmployee(employee.id, { deleted: true });
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setIsDeleting(false);
    }
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
        <button
          className={styles.employeeActionsButton}
          onClick={handleDelete}
          type="button"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      <EditEmployeeDialog
        employee={employee}
        dialogRef={editDialogRef}
        onSaved={handleEmployeeSaved}
      />

      <DeleteConfirmation
        message={`Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`}
        dialogRef={deleteConfirmRef}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default EmployeeEntry;
