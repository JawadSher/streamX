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
import { uploadToLocalServer } from "./uploadToLocalServer";
import { isValidObjectId } from "mongoose";
import { NextApiResponse } from "@/lib/api/NextApiResponse";

export interface IUserAsset {
  userAsset?: File | null;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio" | undefined;
  assetMemeType?: "image" | "video" | "audio" | undefined;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const token = await verifyAuth(request);
  if (!token?._id || !token || !isValidObjectId(token._id)) {
    return ApiError({
      statusCode: 400,
      code: "UNAUTHORIZED",
      success: false,
      isGraphql: false,
      message: "Unauthorized request",
      data: null,
    });
  }

  let filePath = null;
  try {
    const formData = await request.formData();
    const userAsset = formData.get("userAsset");
    const assetType = formData.get("assetType");
    const assetMemeType = formData.get("assetMemeType");

    if (!userAsset || !(userAsset instanceof File)) {
      return ApiError({
        statusCode: 400,
        success: false,
        isGraphql: false,
        code: "ASSET_REQUIRED",
        message: "User asset is required and must be a file",
        data: null,
      });
    }

    if (
      typeof assetType !== "string" ||
      !["avatar", "thumbnail", "banner", "video", "audio"].includes(assetType)
    ) {
      return ApiError({
        statusCode: 400,
        success: false,
        isGraphql: false,
        code: "INVALID_ASSET_TYPE",
        message: "Invalid or missing assetType",
        data: null,
      });
    }

    if (
      typeof assetMemeType !== "string" ||
      !["image", "video", "audio"].includes(assetMemeType)
    ) {
      return ApiError({
        statusCode: 400,
        success: false,
        isGraphql: false,
        code: "INVALID_ASSET_MEME_TYPE",
        message: "Invalid or missing assetMemeType",
        data: null,
      });
    }

    const localResponse = await uploadToLocalServer(userAsset);
    if (localResponse.statusCode !== 200 || !localResponse.status) {
      return ApiError({
        statusCode: localResponse.statusCode,
        success: false,
        isGraphql: false,
        code: "LOCAL_SERVER_RESPONSE",
        message: localResponse?.message,
        data: null,
      });
    }

    filePath = localResponse.filePath;
    if (!filePath) {
      return ApiError({
        statusCode: 400,
        success: false,
        isGraphql: false,
        code: "FILE_LOST_ON_SERVER",
        message: "File is lost is the local server",
        data: null,
      });
    }

    let isFileValid = null;
    if (
      (assetType === "avatar" && assetMemeType === "image") ||
      (assetType === "thumbnail" && assetMemeType === "image") ||
      (assetType === "banner" && assetMemeType === "image")
    ) {
      isFileValid = await imageFileTypeChecker(filePath);

      if (!isFileValid) {
        return ApiError({
          statusCode: 400,
          success: false,
          isGraphql: false,
          code: "INVALID_FILE_FORMATE",
          message: "Invalid file format",
          data: null,
        });
      }
    }

    const result = await userAssetsChecks({
      userAsset: filePath,
      assetType: assetType as IUserAsset["assetType"],
      assetMemeType: assetMemeType as IUserAsset["assetMemeType"],
    });

    if (result.statusCode === 400)
      return ApiError({
        statusCode: 400,
        success: false,
        isGraphql: false,
        code: "ASSET_CHECKS_FAIL",
        message: result.message,
        data: null,
      });
    const cloudinaryResponse = await uploadOnCloudinary(filePath);
    if (cloudinaryResponse.statusCode !== 200) {
      return ApiError({
        statusCode: 400,
        success: false,
        isGraphql: false,
        code: "CLOUDINARY_ERROR",
        message: cloudinaryResponse.message,
        data: null,
      });
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

    return NextApiResponse({
      statusCode: 200,
      success: true,
      code: "FILE_UPLOADED",
      message: `${capitalize(assetType!)} uploaded successfully`,
      data: {
        avatar: cloudinaryResponse?.body?.secure_url,
      },
    });
  } catch (error: any) {
    return ApiError({
      statusCode: 400,
      success: false,
      isGraphql: false,
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
      data: null,
    });
  } finally {
    await deleteFromLocalServer(filePath!);
  }
}
