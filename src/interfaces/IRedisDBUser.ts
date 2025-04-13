import mongoose from "mongoose";

export interface IRedisDBUser{
    _id?: string | mongoose.Types.ObjectId | null ;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    channelName?: string | null;
    bio?: string | null;
    country?: string | null;
    accountStatus?: string | null;
    isVerified?: boolean | null;
    avatarURL?: string | null;
    bannerURL?: string | null;
    phoneNumber?: string | null;
    userName?: string | null;
    watchHistory?: string[];
}