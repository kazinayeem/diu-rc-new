import mongoose, { Document, Schema } from "mongoose";

export interface ISMTPSettings extends Document {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SMTPSettingsSchema = new Schema<ISMTPSettings>(
  {
    service: {
      type: String,
      default: "gmail",
      enum: ["gmail", "custom"],
    },
    host: {
      type: String,
      default: "smtp.gmail.com",
    },
    port: {
      type: Number,
      default: 587,
    },
    secure: {
      type: Boolean,
      default: false,
    },
    auth: {
      user: {
        type: String,
        required: true,
      },
      pass: {
        type: String,
        required: true,
      },
    },
    from: {
      name: {
        type: String,
        default: "DIU Robotics Club",
      },
      email: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SMTPSettings =
  mongoose.models.SMTPSettings || mongoose.model<ISMTPSettings>("SMTPSettings", SMTPSettingsSchema);

export default SMTPSettings;
