"use client";

import { Pencil } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  fieldName?: string;
  setEditableField?: (text: string) => void;
  disabled?: boolean;
  className?: string;
  iconSize?: number; 
}

const EditButton = ({
  fieldName,
  setEditableField,
  disabled,
  className = "",
  iconSize = 28, 
}: Props) => {
  return (
    <Button
      type="button"
      disabled={disabled}
      className={`bg-transparent border-0 p-0 w-auto h-auto hover:bg-transparent cursor-pointer ${className}`}
      onClick={() => setEditableField && fieldName && setEditableField(fieldName)}
    >
      <Pencil size={iconSize} className="w-auto h-auto" color="white" />
    </Button>
  );
};

export default EditButton;
