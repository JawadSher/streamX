import { getUserData } from "@/app/actions/getUserData";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import DislikedVideos from "@/components/profile-page-components/disliked-videos";
import History from "@/components/profile-page-components/history";
import LikedVideos from "@/components/profile-page-components/liked-videos";
import Playlists from "@/components/profile-page-components/playlists";
import UserProfile from "@/components/profile-page-components/user-profile";
import WatchLater from "@/components/profile-page-components/watch-later";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { fullname } from "@/lib/fullname";
import { redirect } from "next/navigation";
import React from "react";

const Profile = async () => {
  const session = await auth();
  if (!session?.user?._id) return redirect("/sign-in");

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
        avatarURL={userData?.avatarURL || "/public/defaultUser.png"}
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
