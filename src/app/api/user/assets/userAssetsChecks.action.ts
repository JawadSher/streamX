import { checkAvatar, checkBanner, checkThumbnail } from "./assetsChecks-helper";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { ApiError } from "@/lib/api/ApiError";

export interface IUserAsset {
  userAsset?: string;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio";
  assetMemeType?: "image" | "video" | "audio";
}

export async function userAssetsChecks({
  userAsset,
  assetType,
  assetMemeType,
}: IUserAsset): Promise<NextResponse> {
  if (!userAsset)
    return ApiError(400, "User asset is not defined or not found", null);

  if (assetMemeType === "image" && assetType === "avatar") {
    const error = checkAvatar(userAsset);
    if (error) return ApiError(400, error.message, null);
  } else if (assetMemeType === "image" && assetType === "thumbnail") {
    const error = checkThumbnail(userAsset);
    if (error) return ApiError(400, error.message, null);
  } else if (assetMemeType === "image" && assetType === "banner") {
    const error = checkBanner(userAsset);
    if (error) return ApiError(400, error.message, null);
  }

  return ApiResponse(200, "Everything is OK", {
    userAsset,
    assetType,
    assetMemeType,
  });
}
