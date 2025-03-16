import { Document, model, models, Schema } from "mongoose";

export interface IMediaFile extends Document {
    userId: Schema.Types.ObjectId;
    fileURL: string | null;
    cdnURL?: string | null;
    fileType?: 'avatar' | 'videoThumbnail' | 'bannerImage' | 'audio';
    mimeType: 'image' | 'video' | 'audio';
    fileSize?: bigint;
    storageProvider?: 'local' | 'aws' | 'cloudinary' | 'imagekit';
    status: 'active' | 'deleted' | 'processing' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const mediaFileSchema = new Schema<IMediaFile>({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User"
    },
    fileURL: {
        type: String,
        required: [true, "File URL is required"],
        trim: true
    },
    cdnURL: {
        type: String,
        trim: true
    },
    fileType: {
        type: String,
        enum: ['avatar', 'videoThumbnail', 'bannerImage', 'audio'],
        default: 'avatar'
    },
    mimeType: {
        type: String,
        enum: ['image', 'video', 'audio'],
        required: [true, "MIME type is required"]
    },
    fileSize: {
        type: Number
    },
    storageProvider: {
        type: String,
        enum: ['local', 'aws', 'cloudinary', 'imagekit'],
        default: 'local'
    },
    status: {
        type: String,
        enum: ['active', 'deleted', 'processing', 'failed'],
        default: 'active'
    }
}, {timestamps: true});

const MediaFile = models?.MediaFile || model<IMediaFile>("MediaFile", mediaFileSchema);
export default MediaFile;