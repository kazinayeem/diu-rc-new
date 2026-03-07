import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  event: string;
  eventType: "workshop" | "seminar" | "bootcamp" | "competition" | "training" | "course" | "other";
  category?: string;
  issueDate: Date;
  description?: string;
  skills?: string[];
  duration?: string;
  instructor?: string;
  certificateImageUrl?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
    },
    recipientEmail: {
      type: String,
      required: [true, "Recipient email is required"],
      trim: true,
      lowercase: true,
    },
    event: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    eventType: {
      type: String,
      enum: ["workshop", "seminar", "bootcamp", "competition", "training", "course", "other"],
      default: "workshop",
    },
    category: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      trim: true,
    },
    instructor: {
      type: String,
      trim: true,
    },
    certificateImageUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
CertificateSchema.index({ recipientEmail: 1 });
CertificateSchema.index({ event: 1 });
CertificateSchema.index({ issueDate: -1 });

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
