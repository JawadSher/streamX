import { Document, model, models, Schema } from "mongoose";

export interface IReport extends Document {
  reporterId: Schema.Types.ObjectId;
  reportedContentId: Schema.Types.ObjectId;
  reportType:
    | "spam"
    | "hateSpeech"
    | "violence"
    | "harassment"
    | "nudity"
    | "falseInformation"
    | "copyright"
    | "other";
  reportDescription: string;
  reportStatus: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
    reporterId: {
        type: Schema.Types.ObjectId,
        required: [true, "Reporter ID is required"],
        ref: "User",
        index: true,
    },
    reportedContentId: {
        type: Schema.Types.ObjectId,
        required: [true, "Reported content ID is required"],
        ref: "MediaFile",
        index: true,
    },
    reportType: {
        type: String,
        enum: [
        "spam",
        "hateSpeech",
        "violence",
        "harassment",
        "nudity",
        "falseInformation",
        "copyright",
        "other",
        ],
        required: [true, "Report type is required"],
    },
    reportDescription: {
        type: String,
        required: [true, "Report description is required"],
        trim: true,
        minLength: [10, "Report description must be at least 10 characters"],
        maxLength: [500, "Report description must be at most 500 characters"],
    },
    reportStatus: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
}, {timestamps: true});

const Report = models?.Report || model<IReport>("Report", reportSchema);
export default Report;