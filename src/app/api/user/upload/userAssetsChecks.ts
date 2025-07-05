import {
  checkAvatar,
  checkBanner,
  checkThumbnail,
} from "./assetsChecks-helper";

export interface IUserAsset {
  userAsset?: string;
  assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio";
  assetMemeType?: "image" | "video" | "audio";
}

export async function userAssetsChecks({
  userAsset,
  assetType,
  assetMemeType,
}: IUserAsset) {
  if (!userAsset)
    return {
      statusCode: 400,
      message: "User asset is not defined or not found",
      data: null,
    };

  if (assetMemeType === "image" && assetType === "avatar") {
    const error = checkAvatar(userAsset);
    if (error)
      return {
        statusCode: 400,
        message: error.message,
        data: null,
      };
  } else if (assetMemeType === "image" && assetType === "thumbnail") {
    const error = checkThumbnail(userAsset);
    if (error)
      return {
        statusCode: 400,
        message: error.message,
        data: null,
      };
  } else if (assetMemeType === "image" && assetType === "banner") {
    const error = checkBanner(userAsset);
    if (error)
      return {
        statusCode: 400,
        message: error.message,
        data: null,
      };
  }

  return {
    statusCode: 200,
    message: "Everything is OK",
    data: {
      userAsset,
      assetType,
      assetMemeType,
    },
  };
}
