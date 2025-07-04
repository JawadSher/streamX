"use client";

import DislikedVideos from "@/components/profile-page-components/disliked-videos";
import History from "@/components/profile-page-components/history";
import LikedVideos from "@/components/profile-page-components/liked-videos";
import Playlists from "@/components/profile-page-components/playlists";
import UserProfile from "@/components/profile-page-components/user-profile";
import WatchLater from "@/components/profile-page-components/watch-later";
import { ROUTES } from "@/constants/ApiRoutes";
import { fullname } from "@/lib/fullname";
import { imagePaths } from "@/lib/ImagePaths";
import { updateUser } from "@/store/features/user/userSlice";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";

const Profile = () => {
  const {data:session} = useSession();
  if (!session?.user?._id) return redirect(ROUTES.PAGES_ROUTES.SIGN_IN);

  
  let fullName = "";
  // if ("data" in response && response.statusCode === 200) {
  //   const userData = response.data;
  //   fullName = fullname({
  //     firstName: userData.firstName,
  //     lastName: userData.lastName,
  //     userName: userData.userName,
  //   });
  // }

  return (
    <div className="flex flex-col w-full h-full flex-grow gap-3">
      {/* <UserProfile
        fullName={fullName}
        userName={response.data.userName}
        avatarURL={response.data?.avatar || imagePaths.defaultUserLogo}
      />
      <History watchHistory={response.data.watchHistory} />
      <Playlists />
      <WatchLater watchLater={response.data.watchLater} />
      <LikedVideos likedVideos={response.data.likedVideos} />
      <DislikedVideos disLikedVideos={response.data.disLikedVideos} /> */}
    </div>
  );
};

export default Profile;
