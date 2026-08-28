import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContract, type Contract } from "../../utils/contract";
import ContractDialog from "../ContractDialog/ContractDialog";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import styles from "./EmployeeEntry.module.scss";

interface ContractDetailsProps {
  employeeId: number;
  employeeName: string;
  contracts: Contract[];
}

function ContractDetails({
  employeeId,
  employeeName,
  contracts,
}: ContractDetailsProps) {
  const addDialogRef = useRef<HTMLDialogElement | null>(null);
  const editDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract>();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (contractId: number) => deleteContract(contractId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contracts", employeeId] }),
  });

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    editDialogRef.current?.showModal();
  };

  const handleDelete = (contract: Contract) => {
    setSelectedContract(contract);
    deleteConfirmRef.current?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!selectedContract) return;
    try {
      await deleteMutation.mutateAsync(selectedContract.id);
    } catch (error) {
      console.error("Failed to delete contract:", error);
    }
  };

  return (
    <>
      <section
        className={styles.contractDetails}
        id={`employee-${employeeId}-contracts`}
        aria-label={`${employeeName}'s contracts`}
      >
        <div className={styles.contractHeading}>
          <h3>Contracts</h3>
          <button
            className={styles.contractActionButton}
            type="button"
            onClick={() => addDialogRef.current?.showModal()}
          >
            Add contract
          </button>
        </div>
        {contracts.length === 0 ? (
          <p>No contracts recorded.</p>
        ) : (
          <ul>
            {contracts.map((contract) => (
              <li key={contract.id}>
                <span>{formatContractType(contract.contractType)} </span>
                <span>{formatEmploymentType(contract.employmentType)} </span>
                <span>{contract.hourPerWeek} hours/week </span>
                <span>
                  {contract.startDate} - {contract.endDate ?? "Ongoing"}
                </span>
                <div className={styles.contractActions}>
                  <button
                    className={styles.contractActionButton}
                    type="button"
                    onClick={() => handleEdit(contract)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.contractActionButton}
                    type="button"
                    onClick={() => handleDelete(contract)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ContractDialog employeeId={employeeId} dialogRef={addDialogRef} />
      <ContractDialog
        employeeId={employeeId}
        contract={selectedContract}
        dialogRef={editDialogRef}
      />
      <DeleteConfirmation
        message="Are you sure you want to delete this contract?"
        dialogRef={deleteConfirmRef}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default ContractDetails;

function formatContractType(contractType: Contract["contractType"]): string {
  return contractType.charAt(0) + contractType.slice(1).toLowerCase();
}

function formatEmploymentType(
  employmentType: Contract["employmentType"],
): string {
  return employmentType
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
