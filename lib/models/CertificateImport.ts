import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICertificateImport extends Document {
  id: number;
  certificate_id: string;
  name_filled: string;
  name: string;
  email: string;
  workshop: string;
  issue_date: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateImportSchema = new Schema(
  {
    id: { type: Number },
    certificate_id: { type: String, default: "" },
    name_filled: { type: String, default: "" },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    workshop: { type: String, default: "" },
    issue_date: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "certificate_imports",
  }
);

CertificateImportSchema.index({ id: 1 });

const CertificateImport: Model<ICertificateImport> =
  mongoose.models.CertificateImport ||
  mongoose.model<ICertificateImport>("CertificateImport", CertificateImportSchema);

export default CertificateImport;
