export interface User {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  channelName?: string | null;
  watchHistory?: string[] | null;
  watchLater?: string[] | null;
  likedVideos?: string[] | null;
  disLikedVideos?: string[] | null;
  email?: string | null;
  bio?: string | null;
  country?: string | null;
  accountStatus?: string | null;
  isVerified?: boolean | null;
  avatarURL?: string | null;
  bannerURL?: string | null;
  phoneNumber?: string | null;
  userName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

