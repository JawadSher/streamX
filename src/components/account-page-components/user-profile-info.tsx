import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { fullname } from "@/lib/fullname";
import FirstSection from "./first-section";
import SecondSection from "./second-section";

interface UserProfileInfoProps {
  userInfo: IRedisDBUser | null;
}

const UserProfileInfo = ({ userInfo }: UserProfileInfoProps) => {
  const fullName = fullname({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    userName: userInfo?.userName,
  });

  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <FirstSection avatarURL={userInfo?.avatarURL} fullName={fullName} />
      <SecondSection
        userName={userInfo?.userName}
        email={userInfo?.email}
        country={userInfo?.country}
        accountStatus={userInfo?.accountStatus}
        phoneNumber={userInfo?.phoneNumber}
        isVerified={userInfo?.isVerified}
        createdAt={Number(userInfo?.createdAt)}
      />
    </div>
  );
};

export default UserProfileInfo;
