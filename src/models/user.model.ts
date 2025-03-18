import { Schema, Document, models, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  channelName: string;
  phoneNumber: string;
  email: string;
  password: string;
  country:
    | "None"
    | "Afghanistan"
    | "Pakistan"
    | "India"
    | "United States"
    | "United Kingdom"
    | "Canada"
    | "Australia"
    | "Germany"
    | "France"
    | "Brazil"
    | "China"
    | "Japan"
    | "Russia"
    | "South Korea"
    | "Italy"
    | "Mexico"
    | "South Africa"
    | "Nigeria"
    | "Egypt"
    | "Turkey"
    | "Indonesia"
    | "Bangladesh"
    | "Vietnam"
    | "Philippines"
    | "Thailand"
    | "Malaysia"
    | "Argentina"
    | "Colombia"
    | "Spain"
    | "Netherlands"
    | "Saudi Arabia"
    | "United Arab Emirates"
    | "Sweden"
    | "Norway"
    | "Denmark"
    | "Finland"
    | "Belgium"
    | "Switzerland"
    | "Austria"
    | "New Zealand"
    | "Singapore"
    | "Hong Kong";
  bio: string;
  isVerified: boolean;
  verificationCode?: string | null;
  accountStatus: "active" | "suspended" | "deleted";
  lastLogin: Date;
  watchHistory: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [50, "First name must be at most 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [2, "Last name must be at least 2 characters"],
      maxLength: [50, "Last name must be at most 50 characters"],
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      minLength: [2, "Username must be at least 2 characters"],
      maxLength: [60, "Username must be at most 60 characters"],
    },
    channelName: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
      minLength: [2, "Channel name must be at least 2 characters"],
      maxLength: [60, "Channel name must be at most 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      maxLength: [70, "Email must be at most 70 characters"],
      match: [
        /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid gmail address (e.g., username@gmail.com)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [10, "Password must be at least 10 characters"],
      maxLength: [256, "Password must be at most 256 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,256}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
      ],
    },
    country: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      default: "None",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
      minLength: [11, "Phone number must be at least 11 characters"],
      maxLength: [11, "Phone number must be at most 11 characters"],
      match: [/^0\d{10}$/, "Please enter a valid 11-digit phone number"],
    },
    bio: {
      type: String,
      trim: true,
      default: "Hay guys am new in the streamX community",
      maxLength: [500, "Bio must be at most 500 characters"],
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationCode: {
      type: String,
      trim: true,
      default: null,
      minLength: [6, "Verification code must be at least 6 characters"],
      maxLength: [6, "Verification code must be at most 6 characters"],
    },
    accountStatus: {
      type: String,
      required: true,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: () => new Date(),
    },
    watchHistory: {
      type: [Schema.Types.ObjectId],
      ref: "Video",
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log("Error hashing password: ", error);
    next(error as Error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  try {
    console.log("Comparing password:", password, "with hash:", this.password);
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error comparing password: ", error);
    return false;
  }
};

const User = models?.User || model<IUser>("User", userSchema);
export default User;
