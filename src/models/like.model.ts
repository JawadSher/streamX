import { Document, model, models, Schema } from "mongoose";

export interface ILike extends Document {
  userId: Schema.Types.ObjectId;
  likeable: Schema.Types.ObjectId;
  likeableType: "Audio" | "Video" | "Comment";
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
      refPath: "likeableType",
      required: [true, "Likeable reference is required"],
      index: true,
    },
    likeableType: {
      type: String,
      required: [true, "Likeable type is required"],
      enum: ["Audio", "Video", "Comment"],
    },
  },
  { timestamps: true }
);

const Like = models?.Like || model<ILike>("Like", likeSchema);
export default Like;
