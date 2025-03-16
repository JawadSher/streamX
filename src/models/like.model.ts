import { Document, model, models, Schema } from "mongoose";

export interface ILike extends Document {
  userId: Schema.Types.ObjectId;
  likeable: Schema.Types.ObjectId;
  likeableType: "audio" | "video" | "comment";
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
      index: true,
    },
    likeable: {
      type: Schema.Types.ObjectId,
      required: [true, "Likeable reference is required"],
      refPath: "likeableType",
      index: true,
    },
    likeableType: {
      type: String,
      required: [true, "Likeable type is required"],
      enum: ["audio", "video", "comment"],
    },
  },
  { timestamps: true }
);

const Like = models?.Like || model<ILike>("Like", likeSchema);
export default Like;
