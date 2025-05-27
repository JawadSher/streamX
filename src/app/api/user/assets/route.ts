import { userAssetsChecks } from "./userAssetsChecks";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { capitalize } from "@/lib/capitalize";
import { imageFileTypeChecker } from "@/lib/imageFileTypeChecker";
import { deleteFromLocalServer } from "./deleteFromLocalServer";
import notifyKakfa from "@/lib/notifyKafka";
import { IUserAssetsUpdate } from "@/interfaces/userAssetsUpdate";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/verifyAuth";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { uploadToLocalServer } from "./uploadToLocalServer";

export interface IUserAsset {
  userAsset?: File | null;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio" | undefined;
  assetMemeType?: "image" | "video" | "audio" | undefined;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token?._id || !token) {
    return ApiError(400, "Unauthorized request", null);
  }

  let filePath = null;
  try {
    const formData = await request.formData();
    const userAsset = formData.get("userAsset");
    const assetType = formData.get("assetType");
    const assetMemeType = formData.get("assetMemeType");

    if (!userAsset || !(userAsset instanceof File)) {
      return ApiError(400, "User asset is required and must be a file", null);
    }

    if (
      typeof assetType !== "string" ||
      !["avatar", "thumbnail", "banner", "video", "audio"].includes(assetType)
    ) {
      return ApiError(400, "Invalid or missing assetType", null);
    }

    if (
      typeof assetMemeType !== "string" ||
      !["image", "video", "audio"].includes(assetMemeType)
    ) {
      return ApiError(400, "Invalid or missing assetMemeType", null);
    }

    const localResponse = await uploadToLocalServer(userAsset);
    if (localResponse.statusCode !== 200 || !localResponse.status) {
      return ApiError(localResponse.statusCode, localResponse?.message, null);
    }

    filePath = localResponse.filePath;
    if (!filePath) {
      return ApiError(400, "File is lost is the local server", null);
    }

    let isFileValid = null;
    if (
      (assetType === "avatar" && assetMemeType === "image") ||
      (assetType === "thumbnail" && assetMemeType === "image") ||
      (assetType === "banner" && assetMemeType === "image")
    ) {
      isFileValid = await imageFileTypeChecker(filePath);

      if (!isFileValid) {
        return ApiError(400, "Invalid file format", null);
      }
    }

    const result = await userAssetsChecks({
      userAsset: filePath,
      assetType: assetType as IUserAsset["assetType"],
      assetMemeType: assetMemeType as IUserAsset["assetMemeType"],
    });

    if (result.statusCode === 400) return ApiError(400, result.message, null);
    const cloudinaryResponse = await uploadOnCloudinary(filePath);
    if (cloudinaryResponse.statusCode !== 200) {
      return ApiError(400, cloudinaryResponse.message, null);
    }

    const data: IUserAssetsUpdate = {
      userId: token._id,
      assetType: assetType as IUserAsset["assetType"],
      assetMemeType: assetMemeType as IUserAsset["assetMemeType"],
      assetURL: cloudinaryResponse?.body?.secure_url,
      assetSize: cloudinaryResponse?.body?.bytes,
      assetProvider: "cloudinary",
      assetStatus: "active",
    };

    await notifyKakfa({
      action: "user-assets-update",
      userData: data,
    });

    return ApiResponse(200, `${capitalize(assetType!)} uploaded successfully`, {
      avatar: cloudinaryResponse?.body?.secure_url
    });
  } catch (error: any) {
    return ApiError(400, error.message, null);
  } finally {
    await deleteFromLocalServer(filePath!);
  }
}
