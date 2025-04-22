import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface Props {
  label?: string;
  inputValue?: string;
  editable?: boolean;
  type?: string;
}

const InputField = ({ label, inputValue, editable = true, type = 'text' }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full px-2 h-fit">
      <Label className="text-lg font-medium ">{label}</Label>
      <Input
        className="font-semibold dark:text-zinc-300 w-full"
        value={inputValue}
        readOnly={editable}
        type={type}
      />
    </div>
  );
};

export default InputField;
