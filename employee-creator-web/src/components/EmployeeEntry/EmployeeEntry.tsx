import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contract } from "../../utils/contract";
import { deleteEmployee, type Employee } from "../../utils/employee";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import EditEmployeeDialog from "../EditEmployeeDialog/EditEmployeeDialog";
import ContractDetails from "./ContractDetails";
import EmployeeSummary from "./EmployeeSummary";
import styles from "./EmployeeEntry.module.scss";

interface EmployeeEntryProps {
  employee: Employee;
  contracts: Contract[];
}

function EmployeeEntry({ employee, contracts }: EmployeeEntryProps) {
  const editDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteEmployee(employee.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });

  const initialContract = contracts.reduce<Contract | undefined>(
    (earliestContract, contract) =>
      !earliestContract || contract.startDate < earliestContract.startDate
        ? contract
        : earliestContract,
    undefined,
  );

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  return (
    <div className={styles.employeeEntry}>
      <EmployeeSummary
        employee={employee}
        initialContract={initialContract}
        isExpanded={isExpanded}
        onEdit={() => editDialogRef.current?.showModal()}
        onDelete={() => deleteConfirmRef.current?.showModal()}
        onToggleExpanded={() => setIsExpanded((expanded) => !expanded)}
        isDeleting={deleteMutation.isPending}
      />

      {isExpanded && (
        <ContractDetails
          employeeId={employee.id}
          employeeName={`${employee.firstname} ${employee.lastname}`}
          contracts={contracts}
        />
      )}

      <EditEmployeeDialog employee={employee} dialogRef={editDialogRef} />
      <DeleteConfirmation
        message={`Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`}
        dialogRef={deleteConfirmRef}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default EmployeeEntry;
