import { Document, model, models, Schema } from "mongoose";

export interface IPlaylist extends Document {
    userId: Schema.Types.ObjectId;
    name: string;
    description: string;
    privacy: "public" | "private";
    thumbnailId: Schema.Types.ObjectId;
    mediaFiles: Schema.Types.ObjectId[];
    mediaCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const playlistSchema = new Schema<IPlaylist>({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
        index: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [1, "Name must be at least 1 character long"],
        maxlength: [100, "Name must be at most 100 characters long"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [1, "Description must be at least 1 character long"],
        maxlength: [5000, "Description must be at most 5000 characters long"],
    },
    privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    thumbnailId: {
        type: Schema.Types.ObjectId,
        required: [true, "Thumbnail ID is required"],
        ref: "MediaFile",
        index: true,
    },
    mediaFiles:[
        {
            type: Schema.Types.ObjectId,
            required: [true, "PlaylistMedia ID is required"],
            ref: "PlaylistMedia",
            index: true,
        },
    ],
    mediaCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Playlist = models?.Playlist || model<IPlaylist>("Playlist", playlistSchema);
export default Playlist;