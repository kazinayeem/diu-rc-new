import mongoose, { Schema, Document } from "mongoose";

export interface IContactUs extends Document {
  email: string;
  phone: string;
  address: string;
  description?: string; // Optional additional info
  socialLinks?: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactUsSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: String,
      linkedin: String,
      facebook: String,
      twitter: String,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactUs ||
  mongoose.model<IContactUs>("ContactUs", ContactUsSchema);
