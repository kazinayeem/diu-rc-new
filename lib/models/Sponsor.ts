import mongoose, { Schema, Document } from "mongoose";

export interface ISponsor extends Document {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier: "platinum" | "gold" | "silver" | "community";
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorSchema: Schema<ISponsor> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    logoUrl: {
      type: String,
      required: [true, "Logo URL is required"],
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: "",
    },
    tier: {
      type: String,
      enum: ["platinum", "gold", "silver", "community"],
      default: "community",
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

const Sponsor =
  mongoose.models.Sponsor ||
  mongoose.model<ISponsor>("Sponsor", SponsorSchema);

export default Sponsor;
