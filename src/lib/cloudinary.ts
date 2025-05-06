import { v2 as cloudinary } from "cloudinary";
import { actionResponse } from "./actions-templates/ActionResponse";
import { actionError } from "./actions-templates/ActionError";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadOnCloudinary = async (fileLocalPath: string) => {
  try {
    if (!fileLocalPath) return actionError(400, "File is not found", null);

    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    if (!validExtensions.some((ext) => fileLocalPath.endsWith(ext))) {
      return actionError(400, "Unsupported file type", null);
    }

    const normalizedPath = fileLocalPath.replace(/\\/g, "/");
    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "image",
      folder: "streamx-assets",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return actionResponse(
      200,
      "File is uploaded on cloudinary successfully",
      response
    );
  } catch (error: any) {
    return actionError(400, error.message, null);
  }
};

export const deletFromCloudinary = async (fileURL: string) => {
  try {
    const urlParts = fileURL.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicIdWithoutExtension = fileName.split(".")[0];
    const publicId = `streamx-assets/${publicIdWithoutExtension}`;
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok")
      return actionError(400, "Failed to delete image from cloudinary", null);

    return actionResponse(
      200,
      "Image deleted successfully from cloudinary",
      null
    );
  } catch (error: any) {
    return actionError(400, error.message, null);
  }
};
