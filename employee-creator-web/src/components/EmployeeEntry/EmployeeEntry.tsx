import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./EmployeeEntry.module.scss";
import { deleteEmployee, type Employee } from "../../utils/employee";
import EditEmployeeDialog from "../EditEmployeeDialog/EditEmployeeDialog";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

function EmployeeEntry(props: { employee: Employee }) {
  const { employee } = props;
  const editDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement | null>(null);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteEmployee(employee.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });

  const handleEdit = () => {
    editDialogRef.current?.showModal();
  };

  const handleDelete = () => {
    deleteConfirmRef.current?.showModal();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to delete employee:", error);
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
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting…" : "Delete"}
        </button>
      </div>

      <EditEmployeeDialog
        employee={employee}
        dialogRef={editDialogRef}
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
