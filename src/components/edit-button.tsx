import { cssFillProperty } from "@/constants/navConfig";
import { Button } from "./ui/button";

interface Props {
  fieldName: string; // 👈 the field to make editable
  setEditableField: (text: string) => void;
}

const EditButton = ({ fieldName, setEditableField }: Props) => {
  return (
    <Button
      className="bg-transparent border-0 text-0 w-fit h-full p-0 hover:bg-transparent cursor-pointer"
      onClick={() => setEditableField(fieldName)}
    >
      <span className={`${cssFillProperty} pt-1`}>edit</span>
    </Button>
  );
};

export default EditButton;
