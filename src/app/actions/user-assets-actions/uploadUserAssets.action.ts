"use server";

import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { actionError } from "@/lib/actions-templates/ActionError";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { userAssetsChecks } from "./userAssetsChecks.action";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { capitalize } from "@/lib/capitalize";
import { uploadToLocalServer } from "./uploadToLocalServer";
import { imageFileTypeChecker } from "@/lib/imageFileTypeChecker";
import { deleteFromLocalServer } from "./deleteFromLocalServer";
import notifyKakfa from "@/lib/notifyKafka";
import { IUserAssetsUpdate } from "@/interfaces/userAssetsUpdate";

export interface IUserAsset {
  userAsset?: File;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio";
  assetMemeType?: "image" | "video" | "audio";
}

export async function uploadUserAssets({
  userAsset,
  assetType,
  assetMemeType,
}: IUserAsset): Promise<ActionResponseType | ActionErrorType> {
  const session = await auth();
  if (!session?.user?._id)
    return actionError(400, "Unauthorized request", null);

  if (!userAsset) {
    return actionError(400, "User asset is required to upload", null);
  }

  let filePath = null;
  try {
    const localResponse = await uploadToLocalServer(userAsset);
    if (localResponse.statusCode !== 200) {
      return actionError(localResponse.statusCode, localResponse.message, null);
    }

    filePath = localResponse.data.filePath;
    let isFileValid = null;
    if (
      (assetType === "avatar" && assetMemeType === "image") ||
      (assetType === "thumbnail" && assetMemeType === "image") ||
      (assetType === "banner" && assetMemeType === "image")
    ) {
      console.log(localResponse);
      isFileValid = await imageFileTypeChecker(filePath);

      if (!isFileValid) {
        return actionError(400, "Invalid file format", null);
      }
    }

    const result = await userAssetsChecks({
      userAsset: filePath,
      assetType,
      assetMemeType,
    });

    if (result.statusCode === 400)
      return actionError(400, result.message, null);

    const cloudinaryResponse = await uploadOnCloudinary(filePath);

    if (cloudinaryResponse.statusCode !== 200) {
      return actionError(400, cloudinaryResponse.message, null);
    }

    const data: IUserAssetsUpdate = {
      userId: session.user._id,
      assetType,
      assetMemeType,
      assetURL: cloudinaryResponse.data.secure_url,
      assetSize: cloudinaryResponse.data.bytes,
      assetProvider: "cloudinary",
      assetStatus: "active",
    };

    await notifyKakfa({
      action: "user-assets-update",
      userData: data,
    });

    return actionResponse(
      200,
      `${capitalize(assetType!)} uploaded successfully`,
      null
    );
  } catch (error: any) {
    return actionError(400, error.message, null);
  } finally {
    await deleteFromLocalServer(filePath);
  }
}
