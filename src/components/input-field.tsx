"use client";

import { ReactNode, InputHTMLAttributes } from "react";
import { VerifyAccountForm } from "./account-page-components/verify-account-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FieldError } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputValue?: string;
  editable?: boolean;
  children?: ReactNode;
  validationError?: string | FieldError;
  disabled?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
  isVerified?: boolean | null;
  userEmail?: string;
  name?: string;
  isEmailField?: boolean;
}

const InputField = ({
  name,
  label,
  inputValue = "",
  editable = false,
  type = "text",
  children,
  validationError,
  disabled,
  className = "",
  rightElement,
  isVerified = true,
  isEmailField = false,
  ...rest
}: Props) => {
  const id = uuidv4();

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 items-center">
        {label && (
          <Label htmlFor={id} className="text-base font-medium">
            {label}
          </Label>
        )}
        {validationError && (
          <p className="text-sm text-red-600 font-medium">
            {validationError.toString()}
          </p>
        )}
        {isEmailField && !isVerified && <VerifyAccountForm />}
      </div>
      <div className="flex rounded-md shadow-xs relative">
        <Input
          id={id}
          type={type}
          readOnly={!editable}
          disabled={disabled}
          placeholder={inputValue}
          className={`rounded-e-none font-semibold dark:text-zinc-300 ${className}`}
          {...rest}
        />

        {(rightElement || children) && (
          <span className="border-input text-muted-foreground inline-flex items-center rounded-e-md border px-3 text-sm">
            {rightElement || children}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
