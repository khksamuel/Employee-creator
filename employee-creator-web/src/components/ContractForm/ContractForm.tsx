import {
  useEffect,
  useReducer,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContract,
  updateContract,
  type Contract,
  type ContractInput,
  type ContractType,
  type EmploymentType,
} from "../../utils/contract";
import styles from "./ContractForm.module.scss";

interface ContractFormProps {
  employeeId: number;
  contract?: Contract;
  onSaved?: (contract: Contract) => void;
  headerAction?: ReactNode;
}

interface FormValues {
  contractType: ContractType;
  startDate: string;
  endDate: string;
  employmentType: EmploymentType;
  hourPerWeek: string;
}

function formFromContract(contract?: Contract): FormValues {
  return {
    contractType: contract?.contractType ?? "PERMANENT",
    startDate: contract?.startDate ?? "",
    endDate: contract?.endDate ?? "",
    employmentType: contract?.employmentType ?? "FULL_TIME",
    hourPerWeek: contract?.hourPerWeek?.toString() ?? "",
  };
}

type FormAction =
  | { type: "reset"; contract?: Contract }
  | { type: "update"; field: keyof FormValues; value: string };

function formReducer(form: FormValues, action: FormAction): FormValues {
  if (action.type === "reset") return formFromContract(action.contract);
  return { ...form, [action.field]: action.value } as FormValues;
}

function ContractForm({
  employeeId,
  contract,
  onSaved,
  headerAction,
}: ContractFormProps) {
  const queryClient = useQueryClient();
  const [form, dispatch] = useReducer(formReducer, contract, formFromContract);
  const [error, setError] = useState<string>();

  useEffect(() => {
    dispatch({ type: "reset", contract });
  }, [contract]);

  const saveMutation = useMutation({
    mutationFn: (input: ContractInput) => {
      if (contract) {
        const update = {
          contractType: input.contractType,
          startDate: input.startDate,
          endDate: input.endDate,
          employmentType: input.employmentType,
          hourPerWeek: input.hourPerWeek,
        };
        return updateContract(contract.id, update);
      }
      return createContract(input);
    },
    onSuccess: (savedContract) => {
      queryClient.invalidateQueries({ queryKey: ["contracts", employeeId] });
      onSaved?.(savedContract);
      if (!contract) dispatch({ type: "reset" });
    },
  });

  const updateField =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: "update", field, value: event.target.value });
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hourPerWeek = Number(form.hourPerWeek);
    const validationError = !form.startDate
      ? "Start date is required."
      : form.endDate && form.endDate < form.startDate
        ? "End date must be on or after the start date."
        : !Number.isInteger(hourPerWeek) || hourPerWeek < 1 || hourPerWeek > 168
          ? "Hours per week must be between 1 and 168."
          : undefined;

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(undefined);
    try {
      await saveMutation.mutateAsync({
        employeeId,
        contractType: form.contractType,
        startDate: form.startDate,
        endDate: form.endDate || null,
        employmentType: form.employmentType,
        hourPerWeek,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save contract.",
      );
    }
  };

  const isEditing = Boolean(contract);

  return (
    <div className={styles.contractForm}>
      <div className={styles.headingRow}>
        <h2>{isEditing ? "Edit Contract" : "Add Contract"}</h2>
        {headerAction}
      </div>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="contractType">Contract type</label>
        <select
          id="contractType"
          value={form.contractType}
          onChange={updateField("contractType")}
        >
          <option value="PERMANENT">Permanent</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <label htmlFor="startDate">Start date</label>
        <input
          id="startDate"
          type="date"
          value={form.startDate}
          onChange={updateField("startDate")}
        />

        <label htmlFor="endDate">End date (Optional)</label>
        <input
          id="endDate"
          type="date"
          value={form.endDate}
          onChange={updateField("endDate")}
        />

        <label htmlFor="employmentType">Employment type</label>
        <select
          id="employmentType"
          value={form.employmentType}
          onChange={updateField("employmentType")}
        >
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
        </select>

        <label htmlFor="hourPerWeek">Hours per week</label>
        <input
          id="hourPerWeek"
          type="number"
          min="1"
          max="168"
          value={form.hourPerWeek}
          onChange={updateField("hourPerWeek")}
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending
            ? "Saving…"
            : isEditing
              ? "Update Contract"
              : "Create Contract"}
        </button>
      </form>
    </div>
  );
}

export default ContractForm;
