import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import styles from "./EmployeeForm.module.scss";
import {
  createEmployee,
  updateEmployee,
  type ContractType,
  type Employee,
  type EmployeeInput,
  type EmploymentType,
} from "../../utils/employee";

interface EmployeeFormProps {
  employee?: Employee;
  onSaved?: (employee: Employee) => void;
  headerAction?: ReactNode;
}

interface FormValues {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  employeeAddress: string;
  contractType: ContractType;
  startDate: string;
  endDate: string;
  employmentType: EmploymentType;
  hourPerWeek: number;
}

function emptyForm(): FormValues {
  return {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    employeeAddress: "",
    contractType: "PERMANENT",
    startDate: "",
    endDate: "",
    employmentType: "FULL_TIME",
    hourPerWeek: 0,
  };
}

function formFromEmployee(employee?: Employee): FormValues {
  if (!employee) {
    return emptyForm();
  }

  return {
    firstname: employee.firstname,
    middlename: employee.middlename ?? "",
    lastname: employee.lastname,
    email: employee.email,
    phone: employee.phone,
    employeeAddress: employee.employeeAddress,
    contractType: employee.contractType,
    startDate: employee.startDate,
    endDate: employee.endDate ?? "",
    employmentType: employee.employmentType,
    hourPerWeek: employee.hourPerWeek,
  };
}

function EmployeeForm({ employee, onSaved, headerAction }: EmployeeFormProps) {
  const [form, setForm] = useState<FormValues>(() =>
    formFromEmployee(employee),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOngoing, setIsOngoing] = useState(true);

  useEffect(() => {
    setForm(formFromEmployee(employee));
    setError(null);
  }, [employee]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === "hourPerWeek" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const employeeInput: EmployeeInput = {
      ...form,
      middlename: form.middlename || null,
      endDate: form.endDate || null,
    };

    try {
      // Call the appropriate API function based on whether we're editing or creating
      const savedEmployee = employee
        ? await updateEmployee(employee.id, employeeInput)
        : await createEmployee(employeeInput);
      onSaved?.(savedEmployee);

      if (!employee) {
        setForm(emptyForm());
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save employee.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mode = employee ? "Edit" : "Add";
  const submitLabel = employee ? "Update Employee" : "Create Employee";
  const submittingLabel = employee ? "Updating…" : "Creating…";

  return (
    <div className={styles.employeeForm}>
      <div className={styles.headingRow}>
        <h2 className={styles.title}>{mode} Employee</h2>
        {headerAction}
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="firstname">First name</label>
        <input
          id="firstname"
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          required
        />

        <label htmlFor="middlename">Middle name (Optional)</label>
        <input
          id="middlename"
          name="middlename"
          value={form.middlename}
          onChange={handleChange}
        />

        <label htmlFor="lastname">Last name</label>
        <input
          id="lastname"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className={styles.phoneField}>
          <label htmlFor="phone">
            <span>Mobile number</span>
            <small>Must be an Australian number</small>
          </label>
          <div className={styles.phoneInput}>
            <span aria-hidden="true">+61</span>
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              placeholder="0412345678"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="employeeAddress">Address</label>
        <input
          id="employeeAddress"
          name="employeeAddress"
          value={form.employeeAddress}
          onChange={handleChange}
          required
        />

        <label htmlFor="contractType">Contract type</label>
        <select
          id="contractType"
          name="contractType"
          value={form.contractType}
          onChange={handleChange}
        >
          <option value="PERMANENT">Permanent</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <label htmlFor="startDate">Start date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="isOngoing">Ongoing</label>
        <input
          type="checkbox"
          id="isOngoing"
          name="isOngoing"
          checked={isOngoing}
          onChange={() => setIsOngoing(!isOngoing)}
        />

        {!isOngoing && (
          <>
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
            />
          </>
        )}

        <label htmlFor="employmentType">Employment type</label>
        <select
          id="employmentType"
          name="employmentType"
          value={form.employmentType}
          onChange={handleChange}
        >
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
        </select>

        <label htmlFor="hourPerWeek">Hours per week</label>
        <input
          id="hourPerWeek"
          name="hourPerWeek"
          type="number"
          min="1"
          value={form.hourPerWeek}
          onChange={handleChange}
          required
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
