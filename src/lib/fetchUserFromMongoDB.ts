import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { connectDB } from "./database";

interface Props {
  userId?: string;
  email?: string;
  userName?: string;
}

export async function fetchUserFromMongoDB({
  userId,
  email,
  userName,
}: Props = {}) {
  const matchConditions = [];
  if (userId && userId.length > 0) {
    try {
      matchConditions.push({ _id: new mongoose.Types.ObjectId(userId) });
    } catch (error) {
      console.log(error);
      throw new Error("Invalid userId format");
    }
  }
  if (email && email.length > 0) matchConditions.push({ email });
  if (userName && userName.length > 0) matchConditions.push({ userName });

  await connectDB();
  const userInfo = await UserModel.aggregate([
    {
      $match: {
        $or: matchConditions,
      },
    },
    {
      $lookup: {
        from: "mediafiles",
        localField: "_id",
        foreignField: "userId",
        pipeline: [
          {
            $match: {
              fileType: {
                $in: ["avatar", "banner"],
              },
            },
          },
        ],
        as: "mediaFiles",
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        userName: 1,
        channelName: 1,
        email: 1,
        isVerified: 1,
        bio: 1,
        country: 1,
        phoneNumber: 1,
        createdAt: 1,
        updatedAt: 1,
        accountStatus: 1,
        watchHistory: 1,
        avatarURL: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$mediaFiles",
                cond: {
                  $eq: ["$$this.fileType", "avatar"],
                },
              },
            },
            0,
          ],
        },
        bannerURL: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$mediaFiles",
                cond: {
                  $eq: ["$$this.fileType", "banner"],
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        userName: 1,
        channelName: 1,
        email: 1,
        isVerified: 1,
        bio: 1,
        country: 1,
        phoneNumber: 1,
        accountStatus: 1,
        watchHistory: 1,
        createdAt: 1,
        updatedAt: 1,
        avatarURL: "$avatarURL.fileURL",
        bannerURL: "$bannerURL.fileURL",
      },
    },
  ]);

  return userInfo[0] || null;
}
