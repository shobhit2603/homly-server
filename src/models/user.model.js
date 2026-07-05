import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please provide a valid phone number (E.164 format)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: {
        values: ["TENANT", "OWNER", "ADMIN"],
        message: "{VALUE} is not a valid user role",
      },
      required: [true, "Role is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: {
        values: ["ACTIVE", "BLOCKED"],
        message: "{VALUE} is not a valid account status",
      },
      default: "ACTIVE",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  },
);

// Indexes for performance optimization on frequently queried fields
// userSchema.index({ role: 1 });
// userSchema.index({ accountStatus: 1 });

const User = mongoose.model("User", userSchema);

export default User;
