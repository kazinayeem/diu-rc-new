import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "ongoing", "under-development"],
      default: "under-development",
    },
    image: { type: String, required: false }, // thumbnail URL
    github: { type: String, required: false },
    demo: { type: String, required: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
