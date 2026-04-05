import mongoose, { Schema, Document } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string; // Rich HTML content from Quill
  order: number;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FAQ ||
  mongoose.model<IFAQ>("FAQ", FAQSchema);
