import { Document, model, Schema } from "mongoose";

export interface IPlaylistMedia extends Document {
    playlistId: Schema.Types.ObjectId;
    mediaType: "video" | "audio";
    position: number;
    mediaId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const playlistMediaSchema = new Schema<IPlaylistMedia>({
    playlistId: {
        type: Schema.Types.ObjectId,
        required: [true, "Playlist ID is required"],
        ref: "Playlist",
        index: true,
    },
    mediaType: {
        type: String,
        enum: ["video", "audio"],
        required: [true, "Media type is required"],
    },
    position: {
        type: Number,
        required: [true, "Position is required"],
    },
    mediaId: {
        type: Schema.Types.ObjectId,
        required: [true, "Media ID is required"],
        ref: "MediaFile",
        index: true,
    },
}, { timestamps: true });

playlistMediaSchema.index({ playlistId: 1, position: 1, mediaId: 1 }, { unique: true });

const PlaylistMedia = model<IPlaylistMedia>("PlaylistMedia", playlistMediaSchema);
export default PlaylistMedia;