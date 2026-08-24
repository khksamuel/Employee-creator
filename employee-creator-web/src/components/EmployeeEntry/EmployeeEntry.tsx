import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./EmployeeEntry.module.scss";
import { deleteEmployee, type Employee } from "../../utils/employee";
import type { Contract } from "../../utils/contract";
import EditEmployeeDialog from "../EditEmployeeDialog/EditEmployeeDialog";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

interface EmployeeEntryProps {
  employee: Employee;
  contracts: Contract[];
}

function EmployeeEntry({ employee, contracts }: EmployeeEntryProps) {
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

  const initialContract = contracts.reduce<Contract | undefined>(
    (earliestContract, contract) =>
      !earliestContract || contract.startDate < earliestContract.startDate
        ? contract
        : earliestContract,
    undefined,
  );

  return (
    <div className={styles.employeeEntry}>
      <div className={styles.employeeInfo}>
        <p>
          {employee.firstname} {employee.middlename} {employee.lastname}
        </p>
        {initialContract ? (
          <p>
            {initialContract.contractType} - {yearsSince(initialContract.startDate)} years
          </p>
        ) : (
          <p>No contracts</p>
        )}
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

function yearsSince(startDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  let years = today.getFullYear() - start.getFullYear();
  const anniversaryHasPassed =
    today.getMonth() > start.getMonth() ||
    (today.getMonth() === start.getMonth() && today.getDate() >= start.getDate());

  if (!anniversaryHasPassed) years -= 1;
  return Math.max(years, 0);
}
