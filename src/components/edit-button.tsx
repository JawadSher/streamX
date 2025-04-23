import { cssFillProperty } from "@/constants/navConfig"
import { Button } from "./ui/button"

const EditButton = () => {
  return (
    <Button className="bg-transparent border-0 text-0 w-fit h-full p-0 hover:bg-transparent cursor-pointer">
          <span className={`${cssFillProperty} pt-1`}>edit</span>
        </Button>
  )
}

export default EditButton