import React, { useState } from "react";
import styles from "./FormInput.module.scss";

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  validationFn,
  description,
  prefix,
  inputWrapperClassName,
  placeholder,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationFn?: (value: string) => boolean;
  description?: string;
  prefix?: string;
  inputWrapperClassName?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const [isValid, setIsValid] = useState(true);
  const ErrorMessageDictionary: { [key: string]: string } = {
    firstname: "First name is required.",
    lastname: "Last name is required.",
    email: "Enter a valid email address.",
    phone: "Enter a valid Australian mobile number, for example 0412345678.",
    employeeAddress: "Address is required.",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (validationFn) {
      setIsValid(validationFn(newValue));
    }
    onChange(e);
  };

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{label}</label>
      {description && <small>{description}</small>}
      <div className={`${styles.inputWrapper} ${inputWrapperClassName || ""}`}>
        {prefix && <span aria-hidden="true">{prefix}</span>}
        <input
          id={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          inputMode={inputMode}
        />
      </div>
      {!isValid && (
        <small className={styles.errorMessage}>
          {ErrorMessageDictionary[name] || "Invalid input"}
        </small>
      )}
    </div>
  );
}

export default FormInput;
