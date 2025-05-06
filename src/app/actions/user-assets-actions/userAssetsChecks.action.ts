"use server";

import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { ActionResponseType, ActionErrorType } from "@/lib/Types";
import { checkAvatar, checkBanner, checkThumbnail } from "./assetsChecksHelper";
import { actionError } from "@/lib/actions-templates/ActionError";

export interface IUserAsset {
  userAsset?: string;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio";
  assetMemeType?: "image" | "video" | "audio";
}

export async function userAssetsChecks({
  userAsset,
  assetType,
  assetMemeType,
}: IUserAsset): Promise<ActionResponseType | ActionErrorType> {
  if (!userAsset)
    return actionError(400, "User asset is not defined or not found", null);

  if (assetMemeType === "image" && assetType === "avatar") {
    const error = checkAvatar(userAsset);
    if (error) return actionError(400, error.message, null);
  } else if (assetMemeType === "image" && assetType === "thumbnail") {
    const error = checkThumbnail(userAsset);
    if (error) return actionError(400, error.message, null);
  } else if (assetMemeType === "image" && assetType === "banner") {
    const error = checkBanner(userAsset);
    if (error) return actionError(400, error.message, null);
  }

  return actionResponse(200, "Everything is OK", {
    userAsset,
    assetType,
    assetMemeType,
  });
}
