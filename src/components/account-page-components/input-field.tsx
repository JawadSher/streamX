import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface Props{
  label?: string;
  inputValue?: string;
  editable?: boolean;
}
const InputField = ({ label, inputValue, editable=true }: Props) => {
  return (
    <div className='flex flex-col items-start justify-center gap-1'>
      <Label className='text-[16px]'>{label}</Label>
      <Input className="font-semibold dark:text-zinc-300" value={inputValue} readOnly={editable}/>
    </div>
  )
}

export default InputField;