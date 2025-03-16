import { Document, model, models, Schema } from "mongoose";

export interface IDislike extends Document {
  userId: Schema.Types.ObjectId;
  dislikeable: Schema.Types.ObjectId;
  dislikeableType: "audio" | "video" | "comment";
  createdAt: Date;
  updatedAt: Date;
}

const dislikeSchema = new Schema<IDislike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
      index: true,
    },
    dislikeable: {
      type: Schema.Types.ObjectId,
      required: [true, "Dislikeable reference is required"],
      refPath: "dislikeableType",
      index: true,
    },
    dislikeableType: {
      type: String,
      required: [true, "Dislikeable type is required"],
      enum: ["audio", "video", "comment"],
    },
  },
  { timestamps: true }
);

const Dislike = models?.Dislike || model<IDislike>("Dislike", dislikeSchema);
export default Dislike;
