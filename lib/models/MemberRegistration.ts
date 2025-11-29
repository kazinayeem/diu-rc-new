import mongoose, { Schema, Document } from "mongoose";

export interface IMemberRegistration extends Document {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  batch: string;
  currentYear: string;
  cgpa?: string;
  previousExperience?: string;
  whyJoin: string;
  skills: string[];
  portfolio?: string;
  linkedin?: string;
  github?: string;

  // New Payment Fields
  paymentNumber: string;
  paymentMethod: "bkash" | "nagad" | "rocket";
  transactionId: string;
  paymentStatus: "pending" | "verified" | "rejected";

  status: "pending" | "approved" | "rejected";
  reviewedBy?: mongoose.Types.ObjectId;
}

const MemberRegistrationSchema = new Schema<IMemberRegistration>(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    currentYear: { type: String, required: true },
    cgpa: { type: String },
    previousExperience: String,
    whyJoin: { type: String, required: true },
    skills: [String],
    portfolio: String,
    linkedin: String,
    github: String,

    /** PAYMENT INFO */
    paymentNumber: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "rocket"],
      required: true,
    },
    transactionId: { type: String, required: true },

    /** PAYMENT STATUS */
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    /** REVIEW STATUS */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.MemberRegistration ||
  mongoose.model<IMemberRegistration>(
    "MemberRegistration",
    MemberRegistrationSchema
  );
