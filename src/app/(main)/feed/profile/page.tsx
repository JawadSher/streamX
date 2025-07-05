"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/ApiRoutes";
import { useUserProfile } from "@/hooks/apollo/user/user-profile/use-user-profile-queries";
import { setUserProfile } from "@/store/features/user/userSlice";
import { RootState } from "@/store/store";
import { fullname } from "@/lib/fullname";
import { imagePaths } from "@/lib/ImagePaths";

import UserProfile from "@/components/profile-page-components/user-profile";
import History from "@/components/profile-page-components/history";
import Playlists from "@/components/profile-page-components/playlists";
import WatchLater from "@/components/profile-page-components/watch-later";
import LikedVideos from "@/components/profile-page-components/liked-videos";
import DislikedVideos from "@/components/profile-page-components/disliked-videos";
import { useRouter } from "next/navigation";

const Profile = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session?.user?._id || status !== "authenticated") {
    return router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
  }

  const { data, loading, error } = useUserProfile();
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch user profile", {
        duration: 3000,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data?.getProfile?.statusCode === 200 || data?.getProfile?.success) {
      dispatch(setUserProfile(data.getProfile.data));
    }
  }, [data, dispatch]);

  const userData = useSelector((state: RootState) => state.user.userData);
  const profileData = useSelector(
    (state: RootState) => state.user.userProfileData
  );

  const fullName = fullname({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    userName: userData?.userName,
  });

  const avatarURL = userData?.avatarURL || imagePaths.defaultUserLogo;

  if (loading || !profileData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full flex-grow gap-3">
      <UserProfile
        fullName={fullName}
        userName={userData?.userName}
        avatarURL={avatarURL}
      />
      <History watchHistory={profileData.watchHistory || []} />
      <Playlists />
      <WatchLater watchLater={profileData.watchLater || []} />
      <LikedVideos likedVideos={profileData.likedVideos || []} />
      <DislikedVideos disLikedVideos={profileData.disLikedVideos || []} />
    </div>
  );
};

export default Profile;
