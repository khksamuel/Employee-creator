import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./EmployeeForm.module.scss";
import {
  createEmployee,
  updateEmployee,
  type Employee,
  type EmployeeInput,
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
}

function emptyForm(): FormValues {
  return {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    employeeAddress: "",
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
  };
}

function EmployeeForm({ employee, onSaved, headerAction }: EmployeeFormProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: formFromEmployee(employee) });

  useEffect(() => {
    reset(formFromEmployee(employee));
  }, [employee, reset]);

  const saveMutation = useMutation({
    mutationFn: (employeeInput: EmployeeInput) =>
      employee
        ? updateEmployee(employee.id, employeeInput)
        : createEmployee(employeeInput),
    onSuccess: (savedEmployee) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSaved?.(savedEmployee);

      if (!employee) reset(emptyForm());
    },
  });

  const onSubmit = async (form: FormValues) => {
    const employeeInput: EmployeeInput = {
      ...form,
      middlename: form.middlename || null,
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

  const validationError =
    errors.root?.message ??
    errors.firstname?.message ??
    errors.lastname?.message ??
    errors.email?.message ??
    errors.phone?.message ??
    errors.employeeAddress?.message;
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
