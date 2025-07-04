import fs from "fs";
import sizeOf from "image-size";

export const checkAvatar = (avatarPath: string) => {
  const fileStats = fs.statSync(avatarPath);
  if (fileStats.size > 4 * 1024 * 1024) {
    return { message: "Avatar size should be under 4MB" };
  }

  const fileBuffer = fs.readFileSync(avatarPath);
  const dimensions = sizeOf(fileBuffer);
  if (dimensions.width > 1280 || dimensions.height > 1280) {
    return { message: "Avatar resolution should be 1280x1280 or less" };
  }

  return null;
};

export const checkThumbnail = (thumbnailPath: string) => {
  const fileStats = fs.statSync(thumbnailPath);
  if (fileStats.size > 5 * 1024 * 1024) {
    return { message: "Thumbnail size should be under 5MB" };
  }

  const fileBuffer = fs.readFileSync(thumbnailPath);
  const dimensions = sizeOf(fileBuffer);
  if (dimensions.width > 1280 || dimensions.height > 720) {
    return { message: "Thumbnail resolution should be 1280x720 or less" };
  }

  return null;
};

export const checkBanner = (bannerPath: string) => {
  const fileStats = fs.statSync(bannerPath);
  if (fileStats.size > 10 * 1024 * 1024) {
    return { message: "Banner size should be under 10MB" };
  }

  const fileBuffer = fs.readFileSync(bannerPath);
  const dimensions = sizeOf(fileBuffer);
  if (dimensions.width > 1920 || dimensions.height > 1080) {
    return { message: "Banner resolution should be 1920x1080 or less" };
  }

  return null;
};
