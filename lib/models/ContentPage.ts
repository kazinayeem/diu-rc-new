import mongoose, { Schema, Document } from "mongoose";

export interface IContentPage extends Document {
  slug: string; // terms, privacy, refunds, etc
  title: string;
  content: string; // Rich HTML content from Quill
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentPageSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      lowercase: true,
      enum: ["terms", "privacy", "refunds"],
    },
    title: {
      type: String,
      required: [true, "Page title is required"],
    },
    content: {
      type: String,
      default: "",
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

export default mongoose.models.ContentPage ||
  mongoose.model<IContentPage>("ContentPage", ContentPageSchema);
