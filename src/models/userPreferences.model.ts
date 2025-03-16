import { Document, model, models, Schema } from "mongoose";

export interface IUserPreferences extends Document {
  userId: Schema.Types.ObjectId;
  theme: "light" | "dark";
  language: "en" | "es";
  createdAt: Date;
  updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferences>({
    userId:{
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
        index: true,
    },
    theme:{
        type: String,
        enum: ["light", "dark"],
        default: "light",
    },
    language:{
        type: String,
        enum: ["en", "es"],
        default: "en",
    }
}, {timestamps: true});

const UserPreferences = models?.UserPreferences || model<IUserPreferences>("UserPreferences", userPreferencesSchema);
export default UserPreferences;