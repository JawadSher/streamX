"use client";

import { getUserProfile } from "@/app/actions/user-actions/getUserProfile.action";

export interface IGetUserProfile {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  avatarURL?: string | null;
  watchHistory?: string[] | null;
  watchLater?: string[] | null;
  likedVideos?: string[] | null;
  disLikedVideos?: string[] | null;
}

async function UserProfileDataFetcher({ userProfileData }: { userProfileData : IGetUserProfile}) {
  

  return null;
}

export default UserProfileDataFetcher;
