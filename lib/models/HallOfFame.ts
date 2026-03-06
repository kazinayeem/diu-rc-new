import mongoose, { Schema, Document } from "mongoose";

export interface IHallOfFame extends Document {
  name: string;
  imageUrl: string;
  achievement: string;
  position: string;
  year: string;
  linkedinUrl?: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HallOfFameSchema: Schema<IHallOfFame> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    achievement: {
      type: String,
      required: [true, "Achievement is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const HallOfFame =
  mongoose.models.HallOfFame ||
  mongoose.model<IHallOfFame>("HallOfFame", HallOfFameSchema);

export default HallOfFame;
