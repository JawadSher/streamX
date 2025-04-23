"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ReactNode, ChangeEvent } from "react";

interface Props {
  label?: string;
  inputValue?: string;
  editable?: boolean;
  type?: string;
  name?: string;
  htmlFor?: string;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; 
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
}: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full px-2 h-fit relative">
      <Label htmlFor={htmlFor} className="text-lg font-medium">
        {label}
      </Label>

      <div className="relative w-full">
        <Input
          className="font-semibold dark:text-zinc-300 w-full pr-10"
          value={inputValue} 
          readOnly={!editable}
          type={type}
          name={name}
          id={htmlFor}
          onChange={onChange} 
        />
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