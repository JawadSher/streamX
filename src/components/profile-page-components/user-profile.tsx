// import Form from "next/form";
import { Button } from "../ui/button";
import { UserAvatar } from "../user-avatar";
import Container from "./container";

interface Props {
  fullName?: string;
  userName?: string;
  avatarURL: string;
}

const UserProfile = async ({ fullName, userName, avatarURL }: Props) => {
  return (
    <Container className="gap-2 items-center">
      <UserAvatar avatarURL={avatarURL} fullName="Hello world" />

      <div className="flex flex-col flex-wrap gap-3  ">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-700">
            {fullName || "Unknown"}
          </h1>
          <h3 className="font-normal dark:text-gray-400 text-gray-700">
            {userName || "@unknown"}
          </h3>
        </div>

        {/* <Form action={xxxxxxx}> */}
        <Button
          disabled
          className="cursor-pointer flex items-center gap-1 px-3 rounded-3xl w-fit h-[25px] font-normal text-sm overflow-clip dark:bg-zinc-800 dark:text-gray-200 relative"
        >
          Switch Account
        </Button>
        {/* </Form> */}
      </div>
    </Container>
  );
};

export default UserProfile;
