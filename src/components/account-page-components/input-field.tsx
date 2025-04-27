"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ReactNode, ChangeEvent } from "react";
import { VerifyAccountForm } from "./verify-account-form";

interface Props {
  label?: string;
  inputValue?: string;
  editable?: boolean;
  type?: string;
  name?: string;
  htmlFor?: string;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  validationError?: string;
  disabled?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
  isVerified?: boolean | null;
  userEmail?: string;
  userId?: string;
}

const InputField = ({
  label,
  inputValue = "",
  editable = false,
  type = "text",
  name = "",
  htmlFor = "",
  children,
  onChange,
  validationError,
  disabled,
  className = "",
  rightElement,
  isVerified = true,
  userId
}: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full px-2 h-fit relative">
      <div className="flex gap-3 items-center">
        <Label htmlFor={htmlFor} className="text-lg font-medium">
          {label}
        </Label>
        {validationError && <p className="text-red-600">{validationError}</p>}
        {name === "email" && !isVerified && <VerifyAccountForm userEmail={inputValue!} userId={userId!} />}
      </div>

      <div className="relative w-full">
        <Input
          className={`${className} font-semibold dark:text-zinc-300 w-full pr-10`}
          value={inputValue}
          readOnly={!editable}
          type={type}
          name={name}
          id={htmlFor}
          onChange={onChange}
          disabled={disabled}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer h-full flex items-center">
            {rightElement}
          </div>
        )}
        {children && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer h-full flex items-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
