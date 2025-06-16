import mongoose from "mongoose";

export interface IRedisDBUser {
  _id?: string | mongoose.Types.ObjectId | null;
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
  createdAt?: Date | number | string | null;
  updatedAt?: Date | number | string | null;
  coolDownData?: {
    success: boolean;
    coolDownTime: Date | string | number | null;
  };
}
