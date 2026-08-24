import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    hourPerWeek: 38,
  };
}

function formFromEmployee(employee?: Employee): FormValues {
  if (!employee) return emptyForm();

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
  const queryClient = useQueryClient();
  const [isOngoing, setIsOngoing] = useState(() => !employee?.endDate);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: formFromEmployee(employee) });

  useEffect(() => {
    reset(formFromEmployee(employee));
    setIsOngoing(!employee?.endDate);
  }, [employee, reset]);

  const saveMutation = useMutation({
    mutationFn: (employeeInput: EmployeeInput) =>
      employee
        ? updateEmployee(employee.id, employeeInput)
        : createEmployee(employeeInput),
    onSuccess: (savedEmployee) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSaved?.(savedEmployee);

      if (!employee) {
        reset(emptyForm());
        setIsOngoing(true);
      }
    },
  });

  const onSubmit = async (form: FormValues) => {
    const employeeInput: EmployeeInput = {
      ...form,
      middlename: form.middlename || null,
      endDate: isOngoing || !form.endDate ? null : form.endDate,
    };

    try {
      await saveMutation.mutateAsync(employeeInput);
    } catch (submissionError) {
      setError("root", {
        message:
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to save employee.",
      });
    }
  };

  const handleOngoingChange = () => {
    const nextIsOngoing = !isOngoing;
    setIsOngoing(nextIsOngoing);
    if (nextIsOngoing) {
      setValue("endDate", "", { shouldValidate: true });
    }
  };

  const validationError =
    errors.root?.message ??
    errors.firstname?.message ??
    errors.lastname?.message ??
    errors.email?.message ??
    errors.phone?.message ??
    errors.employeeAddress?.message ??
    errors.startDate?.message ??
    errors.endDate?.message ??
    errors.hourPerWeek?.message;
  const mode = employee ? "Edit" : "Add";
  const submitLabel = employee ? "Update Employee" : "Create Employee";
  const submittingLabel = employee ? "Updating…" : "Creating…";

  return (
    <div className={styles.employeeForm}>
      <div className={styles.headingRow}>
        <h2 className={styles.title}>{mode} Employee</h2>
        {headerAction}
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="firstname">First name</label>
        <input id="firstname" {...register("firstname", { required: "First name is required." })} />

        <label htmlFor="middlename">Middle name (Optional)</label>
        <input id="middlename" {...register("middlename")} />

        <label htmlFor="lastname">Last name</label>
        <input id="lastname" {...register("lastname", { required: "Last name is required." })} />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required.",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
          })}
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
              inputMode="tel"
              placeholder="0412345678"
              {...register("phone", {
                required: "Mobile number is required.",
                pattern: {
                  value: /^0?4\d{8}$/,
                  message: "Enter a valid Australian mobile number, for example 0412345678.",
                },
              })}
            />
          </div>
        </div>

        <label htmlFor="employeeAddress">Address</label>
        <input
          id="employeeAddress"
          {...register("employeeAddress", { required: "Address is required." })}
        />

        <label htmlFor="contractType">Contract type</label>
        <select id="contractType" {...register("contractType")}>
          <option value="PERMANENT">Permanent</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <label htmlFor="startDate">Start date</label>
        <input
          id="startDate"
          type="date"
          {...register("startDate", { required: "Start date is required." })}
        />

        <label htmlFor="isOngoing">Ongoing</label>
        <input
          type="checkbox"
          id="isOngoing"
          checked={isOngoing}
          onChange={handleOngoingChange}
        />

        {!isOngoing && (
          <>
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              type="date"
              {...register("endDate", {
                validate: (value) =>
                  !value ||
                  value >= getValues("startDate") ||
                  "End date must be on or after the start date.",
              })}
            />
          </>
        )}

        <label htmlFor="employmentType">Employment type</label>
        <select id="employmentType" {...register("employmentType")}>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
        </select>

        <label htmlFor="hourPerWeek">Hours per week</label>
        <input
          id="hourPerWeek"
          type="number"
          min="1"
          max="168"
          {...register("hourPerWeek", {
            valueAsNumber: true,
            required: "Hours per week is required.",
            min: { value: 1, message: "Hours per week must be between 1 and 168." },
            max: { value: 168, message: "Hours per week must be between 1 and 168." },
          })}
        />

        {validationError && (
          <p className={styles.error} role="alert">
            {validationError}
          </p>
        )}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? submittingLabel : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
