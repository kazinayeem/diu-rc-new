import mongoose, { Schema, Document } from "mongoose";

export interface IMemberRegistration extends Document {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  batch?: string;
  currentYear?: string;
  cgpa?: string;
  previousExperience?: string;
  whyJoin?: string;
  skills: string[];
  portfolio?: string;
  linkedin?: string;
  github?: string;

  paymentOptionId?: string;
  paymentNumber?: string;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus: "pending" | "approved" | "rejected";
  status: "pending" | "approved" | "rejected";
}

const MemberRegistrationSchema = new Schema<IMemberRegistration>(
  {
    // REQUIRED FIELDS
    name: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
      lowercase: true,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    department: {
      type: String,
      required: false,
      default: "None",
      trim: true,
    },

    // OPTIONAL PERSONAL INFO
    batch: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    currentYear: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    cgpa: {
      type: String,
      required: false,
      default: null,
    },
    previousExperience: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    whyJoin: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    skills: {
      type: [String],
      required: false,
      default: [],
    },
    portfolio: {
      type: String,
      required: false,
      default: null,
    },
    linkedin: {
      type: String,
      required: false,
      default: null,
    },
    github: {
      type: String,
      required: false,
      default: null,
    },

    // OPTIONAL PAYMENT INFO
    paymentOptionId: {
      type: String,
      required: false,
      default: null,
    },
    paymentNumber: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "bkash",
      trim: true,
    },
    transactionId: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },

    // STATUS FIELDS - AUTO-SET FOR ADMIN IMPORTS
    paymentStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "approved",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "approved",
    },
  },
  { 
    timestamps: true,
    validateBeforeSave: false,  // Disable automatic validation
  }
);

export default mongoose.models.MemberRegistration ||
  mongoose.model<IMemberRegistration>(
    "MemberRegistration",
    MemberRegistrationSchema
  );
