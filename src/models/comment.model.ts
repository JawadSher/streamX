import { Document, model, models, Schema } from "mongoose";

export interface IComment extends Document {
    userId: Schema.Types.ObjectId;
    mediaType: "audio" | "video";
    mediaId: Schema.Types.ObjectId;
    comment: string;
    commentStatus: "active" | "deleted" | "hidden";
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
        index: true,
    },
    mediaType: {
        type: String,
        enum: ["audio", "video"],
        required: [true, "Media type is required"],
    },
    mediaId: {
        type: Schema.Types.ObjectId,
        ref: "MediaFile",
        required: [true, "Media ID is required"],
        index: true,
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
        trim: true,
        minlength: [1, "Comment must be at least 1 character long"],
        maxlength: [500, "Comment must be at most 500 characters long"],
    },
    commentStatus: {
        type: String,
        enum: ["active", "deleted", "hidden"],
        default: "active",
    },
}, {timestamps: true});

const Comment = models?.Comment || model<IComment>("Comment", commentSchema);
export default Comment;
