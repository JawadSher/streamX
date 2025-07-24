function InputFieldError({ error }: { error: string | string[] | undefined }) {
  return <p className="text-sm text-red-600 font-medium">{error}</p>;
}

export default InputFieldError;
