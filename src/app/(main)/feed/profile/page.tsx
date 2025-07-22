"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/ApiRoutes";
import { useUserProfile } from "@/hooks/apollo/user/user-profile/use-user-profile-queries";
import { RootState } from "@/store/store";
import { fullname } from "@/lib/fullname";
import { imagePaths } from "@/constants/ImagePaths";

import UserProfile from "@/components/profile-page-components/user-profile";
import History from "@/components/profile-page-components/history";
import Playlists from "@/components/profile-page-components/playlists";
import WatchLater from "@/components/profile-page-components/watch-later";
import LikedVideos from "@/components/profile-page-components/liked-videos";
import DislikedVideos from "@/components/profile-page-components/disliked-videos";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { data, loading, error } = useUserProfile();
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const userData = useSelector((state: RootState) => state.user.userData);

  const fullName = fullname({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    userName: userData?.userName,
  });

  const avatarURL = userData?.avatarURL || imagePaths.defaultUserLogo;

  useEffect(() => {
    if (!session?.user?._id && status !== "loading") {
      router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
    }
  }, [session, status, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch user profile", {
        duration: 3000,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data?.getProfile?.statusCode === 200 || data?.getProfile?.success) {
      setUserProfileData(data.getProfile.data);
    }
  }, [data]);

  if (status === "loading" || loading || !session?.user?._id) {
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
      <History watchHistory={userProfileData?.watchHistory || []} />
      <Playlists />
      <WatchLater watchLater={userProfileData?.watchLater || []} />
      <LikedVideos likedVideos={userProfileData?.likedVideos || []} />
      <DislikedVideos disLikedVideos={userProfileData?.disLikedVideos || []} />
    </div>
  );
};

export default Profile;
