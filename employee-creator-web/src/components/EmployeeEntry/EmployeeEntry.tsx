import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./EmployeeEntry.module.scss";
import { deleteEmployee, type Employee } from "../../utils/employee";
import { deleteContract, type Contract } from "../../utils/contract";
import EditEmployeeDialog from "../EditEmployeeDialog/EditEmployeeDialog";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import ContractDialog from "../ContractDialog/ContractDialog";

interface EmployeeEntryProps {
  employee: Employee;
  contracts: Contract[];
}

function EmployeeEntry({ employee, contracts }: EmployeeEntryProps) {
  const editDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement | null>(null);
  const addContractDialogRef = useRef<HTMLDialogElement | null>(null);
  const editContractDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteContractConfirmRef = useRef<HTMLDialogElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract>();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteEmployee(employee.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
  const deleteContractMutation = useMutation({
    mutationFn: (contractId: number) => deleteContract(contractId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contracts", employee.id] }),
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

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    editContractDialogRef.current?.showModal();
  };

  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
    deleteContractConfirmRef.current?.showModal();
  };

  const handleConfirmDeleteContract = async () => {
    if (!selectedContract) return;
    try {
      await deleteContractMutation.mutateAsync(selectedContract.id);
    } catch (error) {
      console.error("Failed to delete contract:", error);
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
      <div className={styles.employeeSummary}>
        <div className={styles.employeeInfo}>
          <p className={styles.employeeName}>
            {employee.firstname} {employee.middlename} {employee.lastname}
          </p>
          {initialContract ? (
            <p className={styles.employeeMeta}>
              {initialContract.contractType} -{" "}
              {yearsSince(initialContract.startDate)} years
            </p>
          ) : (
            <p className={styles.employeeMeta}>No contracts</p>
          )}
          <p className={styles.employeeEmail}>{employee.email}</p>
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
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            type="button"
            aria-expanded={isExpanded}
            aria-controls={`employee-${employee.id}-contracts`}
            aria-label={
              isExpanded ? "Hide contract details" : "Show contract details"
            }
          >
            <span className={styles.expandLabel}>
              {isExpanded ? "Hide details" : "Details"}
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={isExpanded ? styles.expandIconOpen : undefined}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <section
          className={styles.contractDetails}
          id={`employee-${employee.id}-contracts`}
          aria-label={`${employee.firstname} ${employee.lastname}'s contracts`}
        >
          <div className={styles.contractHeading}>
            <h3>Contracts</h3>
            <button
              className={styles.contractActionButton}
              type="button"
              onClick={() => addContractDialogRef.current?.showModal()}
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
                      onClick={() => handleEditContract(contract)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.contractActionButton}
                      type="button"
                      onClick={() => handleDeleteContract(contract)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <ContractDialog
        employeeId={employee.id}
        dialogRef={addContractDialogRef}
      />
      <ContractDialog
        employeeId={employee.id}
        contract={selectedContract}
        dialogRef={editContractDialogRef}
      />
      <EditEmployeeDialog employee={employee} dialogRef={editDialogRef} />

      <DeleteConfirmation
        message={`Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`}
        dialogRef={deleteConfirmRef}
        onConfirm={handleConfirmDelete}
      />
      <DeleteConfirmation
        message="Are you sure you want to delete this contract?"
        dialogRef={deleteContractConfirmRef}
        onConfirm={handleConfirmDeleteContract}
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
    (today.getMonth() === start.getMonth() &&
      today.getDate() >= start.getDate());

  if (!anniversaryHasPassed) years -= 1;
  return Math.max(years, 0);
}

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
