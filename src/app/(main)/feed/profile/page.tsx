
import { getUserData } from "@/app/actions/user-actions/getUserData.action";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import DislikedVideos from "@/components/profile-page-components/disliked-videos";
import History from "@/components/profile-page-components/history";
import LikedVideos from "@/components/profile-page-components/liked-videos";
import Playlists from "@/components/profile-page-components/playlists";
import UserProfile from "@/components/profile-page-components/user-profile";
import WatchLater from "@/components/profile-page-components/watch-later";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { fullname } from "@/lib/fullname";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth();
  if (!session?.user?._id) return redirect(API_ROUTES.SIGN_IN);

  const userData = (await getUserData()) as IRedisDBUser;
  const fullName = fullname({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    userName: userData?.userName,
  });

  return (
    <div className="flex flex-col w-full h-full flex-grow gap-3">
      <UserProfile
        fullName={fullName}
        userName={userData.userName}
        avatarURL={userData?.avatarURL || "/defaultUser.png"}
      />
      <History />
      <Playlists />
      <WatchLater />
      <LikedVideos />
      <DislikedVideos />
    </div>
  );
};

export default Profile;
