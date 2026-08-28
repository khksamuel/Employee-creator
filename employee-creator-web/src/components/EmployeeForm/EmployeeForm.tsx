import {
  useEffect,
  useReducer,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./EmployeeForm.module.scss";
import FormInput from "./FormInput";
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

type FormAction =
  | { type: "reset"; employee?: Employee }
  | { type: "update"; field: keyof FormValues; value: string };

function formReducer(form: FormValues, action: FormAction): FormValues {
  if (action.type === "reset") return formFromEmployee(action.employee);
  return { ...form, [action.field]: action.value };
}

const isRequired = (value: string) => value.trim().length > 0;
const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
const isAustralianMobile = (value: string) => /^0?4\d{8}$/.test(value);

function EmployeeForm({ employee, onSaved, headerAction }: EmployeeFormProps) {
  const queryClient = useQueryClient();
  const [form, dispatch] = useReducer(formReducer, employee, formFromEmployee);
  const [validationError, setValidationError] = useState<string>();

  useEffect(() => {
    dispatch({ type: "reset", employee });
  }, [employee]);

  const saveMutation = useMutation({
    mutationFn: (employeeInput: EmployeeInput) =>
      employee
        ? updateEmployee(employee.id, employeeInput)
        : createEmployee(employeeInput),
    onSuccess: (savedEmployee) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSaved?.(savedEmployee);

      if (!employee) dispatch({ type: "reset" });
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstInvalidField = [
      [form.firstname, isRequired, "First name is required."],
      [form.lastname, isRequired, "Last name is required."],
      [form.email, isEmail, "Enter a valid email address."],
      [
        form.phone,
        isAustralianMobile,
        "Enter a valid Australian mobile number, for example 0412345678.",
      ],
      [form.employeeAddress, isRequired, "Address is required."],
    ].find(
      ([value, validator]) =>
        !(validator as (input: string) => boolean)(value as string),
    );

    if (firstInvalidField) {
      setValidationError(firstInvalidField[2] as string);
      return;
    }

    setValidationError(undefined);
    const employeeInput: EmployeeInput = {
      ...form,
      middlename: form.middlename || null,
    };

    try {
      await saveMutation.mutateAsync(employeeInput);
    } catch (submissionError) {
      setValidationError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save employee.",
      );
    }
  };

  const updateField =
    (name: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "update", field: name, value: event.target.value });
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
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <FormInput
          label="First name"
          name="firstname"
          value={form.firstname}
          onChange={updateField("firstname")}
          validationFn={isRequired}
        />
        <FormInput
          label="Middle name (Optional)"
          name="middlename"
          value={form.middlename}
          onChange={updateField("middlename")}
        />
        <FormInput
          label="Last name"
          name="lastname"
          value={form.lastname}
          onChange={updateField("lastname")}
          validationFn={isRequired}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField("email")}
          validationFn={isEmail}
        />
        <div className={styles.phoneField}>
          <FormInput
            label="Mobile number"
            name="phone"
            value={form.phone}
            onChange={updateField("phone")}
            validationFn={isAustralianMobile}
            description="Must be an Australian number"
            prefix="+61"
            inputWrapperClassName={styles.phoneInput}
            placeholder="0412345678"
            inputMode="tel"
          />
        </div>
        <FormInput
          label="Address"
          name="employeeAddress"
          value={form.employeeAddress}
          onChange={updateField("employeeAddress")}
          validationFn={isRequired}
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
