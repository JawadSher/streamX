export interface IUserAssetsUpdate{
    userId?: string;
    assetType?: "avatar" | "thumbnail" | "banner" | "video" | "audio";
    assetMemeType?: "image" | "video" | "audio";
    assetURL?: string;
    assetSize?: number;
    assetProvider?: "local" | "aws" | "cloudinary" | "imagekit" | "google";
    assetStatus?: "active" | "deleted" | "processing" | "failed"
}