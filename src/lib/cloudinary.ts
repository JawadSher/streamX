import { cloudinaryEnv } from "@/configs/env-exports";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: cloudinaryEnv.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryEnv.CLOUDINARY_API_KEY,
  api_secret: cloudinaryEnv.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadOnCloudinary = async (fileLocalPath: string) => {
  try {
    if (!fileLocalPath)
      return {
        statusCode: 400,
        message: "File is not found",
        body: null,
      };

    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    if (!validExtensions.some((ext) => fileLocalPath.endsWith(ext))) {
      return {
        statusCode: 400,
        message: "Unsupported file type",
        body: null,
      };
    }

    const normalizedPath = fileLocalPath.replace(/\\/g, "/");
    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "image",
      folder: "streamx-assets",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return {
      statusCode: 200,
      message: "File is uploaded on cloudinary successfully",
      body: response,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      body: null,
    };
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
      return {
        statusCode: 400,
        message: "Failed to delete image from cloudinary",
        body: null,
      };

    return {
      statusCode: 200,
      message: "Image deleted successfully from cloudinary",
      body: null,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      body: null,
    };
  }
};
