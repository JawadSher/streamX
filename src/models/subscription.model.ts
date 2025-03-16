import { model, models, Schema } from "mongoose";

export interface ISubcription extends Document {
    subscriberId: Schema.Types.ObjectId;
    channelId: Schema.Types.ObjectId;
    notificationType: "all" | "highlights" | "none";
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubcription>({
    subscriberId:{
        type: Schema.Types.ObjectId,
        required: [true, "Subscriber ID is required"],
        ref: "User",
        index: true,
    },
    channelId:{
        type: Schema.Types.ObjectId,
        required: [true, "Channel ID is required"],
        ref: "User",
        index: true,
    },
    notificationType:{
        type: String,
        enum: ["all", "highlights", "none"],
        default: "all",
    }
}, {timestamps: true})

subscriptionSchema.index({subscriberId: 1, channelId: 1}, {unique: true});
const Subscription = models?.Subscription || model<ISubcription>("Subscription", subscriptionSchema);
export default Subscription;