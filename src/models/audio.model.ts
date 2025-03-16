import { Document, model, models, Schema } from "mongoose";

export interface IAudio extends Document {
    userId: Schema.Types.ObjectId;
    title: string;
    description: string;
    audioId: Schema.Types.ObjectId;
    thumbnailId: Schema.Types.ObjectId;
    privacy: "public" | "private" | "unlisted" | "subscribersOnly";
    status: "uploaded" | "processing" | "published" | "deleted";
    likeCount: number;
    viewCount: number;
    commentCount: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const audioSchema = new Schema<IAudio>({
    userId:{
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
        index: true,
    },
    title:{
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [1, "Title must be at least 1 character long"],
        maxlength: [100, "Title must be at most 100 characters long"],
    },
    description:{
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [1, "Description must be at least 1 character long"],
        maxlength: [5000, "Description must be at most 5000 characters long"],
    },
    audioId:{
        type: Schema.Types.ObjectId,
        required: [true, "Video ID is required"],
        ref: "MediaFile",
        index: true,
    },
    thumbnailId:{
        type: Schema.Types.ObjectId,
        required: [true, "Thumbnail ID is required"],
        ref: "MediaFile",
        index: true,
    },
    privacy:{
        type: String,
        enum: ["public", "private", "unlisted", "subscribersOnly"],
        default: "public",
    },
    status:{
        type: String,
        enum: ["uploaded", "processing", "published", "deleted"],
        default: "uploaded",
    },
    likeCount:{
        type: Number,
        default: 0,
    },
    viewCount:{
        type: Number,
        default: 0,
    },
    commentCount:{
        type: Number,
        default: 0,
    },
    tags:{
        type: [String],
        default: [],
    },
}, {timestamps: true});

const Audio = models?.Audio || model<IAudio>("Audio", audioSchema);
export default Audio;