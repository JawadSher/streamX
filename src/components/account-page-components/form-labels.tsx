import { Label } from "@radix-ui/react-label";
import React from "react";
import InputFieldError from "../input-field-error";

function FormLabel({ label, error, htmlFor }: { label: string; htmlFor: string; error?: any }) {
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor={htmlFor} className="text-base font-medium">
        {label}
      </Label>
      {error && <InputFieldError error={error?.message} />}
    </div>
  );
}

export default FormLabel;
