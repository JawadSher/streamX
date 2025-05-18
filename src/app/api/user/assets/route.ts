import { userAssetsChecks } from "./userAssetsChecks.action";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { capitalize } from "@/lib/capitalize";
import { uploadToLocalServer } from "./uploadToLocalServer";
import { imageFileTypeChecker } from "@/lib/imageFileTypeChecker";
import { deleteFromLocalServer } from "./deleteFromLocalServer";
import notifyKakfa from "@/lib/notifyKafka";
import { IUserAssetsUpdate } from "@/interfaces/userAssetsUpdate";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/verifyAuth";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";

export interface IUserAsset {
  userAsset?: File | null;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio" | undefined;
  assetMemeType?: "image" | "video" | "audio" | undefined;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token?._id || !token) {
    return ApiError(400, "Unauthorized request", null);
  }

  let filePath = null;
  try {
    const formData = await request.formData();
    const userAsset = formData.get("userAsset") as IUserAsset["userAsset"];
    const assetType = formData.get("assetType") as IUserAsset["assetType"];
    const assetMemeType = formData.get(
      "assetMemeType"
    ) as IUserAsset["assetMemeType"];

    if (!userAsset) {
      return ApiError(400, "User asset is required to upload", null);
    }

    const localResponse = await uploadToLocalServer(userAsset);
    if (localResponse.status !== 200) {
      return ApiError(localResponse.status, localResponse.message, null);
    }

    filePath = localResponse.data.data.filePath;
    let isFileValid = null;
    if (
      (assetType === "avatar" && assetMemeType === "image") ||
      (assetType === "thumbnail" && assetMemeType === "image") ||
      (assetType === "banner" && assetMemeType === "image")
    ) {
      console.log(localResponse);
      isFileValid = await imageFileTypeChecker(filePath);

      if (!isFileValid) {
        return ApiError(400, "Invalid file format", null);
      }
    }

    const result = await userAssetsChecks({
      userAsset: filePath,
      assetType,
      assetMemeType,
    });

    if (result.status === 400) return ApiError(400, result.message, null);
    const cloudinaryResponse = await uploadOnCloudinary(filePath);
    if (cloudinaryResponse.statusCode !== 200) {
      return ApiError(400, cloudinaryResponse.message, null);
    }

    const data: IUserAssetsUpdate = {
      userId: token._id,
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

    return ApiResponse(
      200,
      `${capitalize(assetType!)} uploaded successfully`,
      null
    );
  } catch (error: any) {
    return ApiError(400, error.message, null);
  } finally {
    await deleteFromLocalServer(filePath);
  }
}
