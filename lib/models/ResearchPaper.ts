import mongoose from "mongoose";

const ResearchPaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    authors: { type: [String], required: true },

    conference: { type: String, required: true },

    year: { type: Number, required: true },

    publisher: { type: String, default: "IEEE Xplore" },

    doi: { type: String },

    pdfLink: { type: String },

    abstract: { type: String },

    featured: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["published", "under-review", "draft"],
      default: "published",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ResearchPaper ||
  mongoose.model("ResearchPaper", ResearchPaperSchema);
