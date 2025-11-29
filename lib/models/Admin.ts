import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "super-admin" | "admin" | "moderator";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema<IAdmin> = new Schema(
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
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["super-admin", "admin", "moderator"],
      default: "admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// 🔐 HASH PASSWORD BEFORE SAVE
// ======================================================
AdminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ======================================================
// 🔐 PASSWORD COMPARE METHOD
// ======================================================
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

// ======================================================
// INDEXES
// ======================================================
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1, isActive: 1 });

// ======================================================
// MODEL EXPORT
// ======================================================
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
