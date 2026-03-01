import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type AdminRole = "super-admin" | "manager";

export const ALL_PERMISSIONS = [
  "dashboard",
  "members",
  "member-registrations",
  "events",
  "research",
  "payment",
  "projects",
  "notices",
  "posts",
  "seminars",
  "workshops",
  "sponsors",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  permissions: Permission[];
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
      enum: ["super-admin", "manager"],
      default: "manager",
    },

    permissions: {
      type: [String],
      enum: ALL_PERMISSIONS,
      default: [],
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




AdminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});




AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};




AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1, isActive: 1 });




// Delete cached model to pick up schema changes after hot reload / redeploy
delete (mongoose.models as any).Admin;

const Admin: Model<IAdmin> =
  mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
