import { Document, model, models, Schema } from "mongoose";

export interface INotification extends Document {
    userId: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;
    notificationType: "like" | "comment" | "subscription" | "share" | "mention";
    notificationStatus: "unread" | "read";
    mediaType: "audio" | "video";
    mediaId: Schema.Types.ObjectId;
    content?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
        index: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: [true, "Sender ID is required"],
        ref: "User",
        index: true,
    },
    notificationType: {
        type: String,
        enum: ["like", "comment", "subscription", "share", "mention"],
        required: [true, "Notification type is required"],
    },
    notificationStatus: {
        type: String,
        enum: ["unread", "read"],
        default: "unread",
    },
    mediaType: {
        type: String,
        enum: ["audio", "video"],
        required: [true, "Media type is required"],
    },
    mediaId: {
        type: Schema.Types.ObjectId,
        required: [true, "Media ID is required"],
        ref: "MediaFile",
        index: true,
    },
    content: {
        type: String,
        trim: true,
        minlength: [1, "Content must be at least 1 character long"],
        maxlength: [500, "Content must be at most 500 characters long"],
    },
}, { timestamps: true });

const Notification = models?.Notification || model<INotification>("Notification", notificationSchema);
export default Notification;