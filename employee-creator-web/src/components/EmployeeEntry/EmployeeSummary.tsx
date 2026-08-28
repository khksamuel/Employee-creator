import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { Contract } from "../../utils/contract";
import type { Employee } from "../../utils/employee";
import styles from "./EmployeeEntry.module.scss";

interface EmployeeSummaryProps {
  employee: Employee;
  initialContract?: Contract;
  isExpanded: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpanded: () => void;
  isDeleting: boolean;
}

function EmployeeSummary({
  employee,
  initialContract,
  isExpanded,
  onEdit,
  onDelete,
  onToggleExpanded,
  isDeleting,
}: EmployeeSummaryProps) {
  return (
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
          onClick={onEdit}
          type="button"
        >
          Edit
        </button>
        <button
          className={styles.employeeActionsButton}
          onClick={onDelete}
          type="button"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
        <button
          className={styles.expandButton}
          onClick={onToggleExpanded}
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
  );
}

export default EmployeeSummary;

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
