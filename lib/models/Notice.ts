import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  type: 'general' | 'important' | 'urgent';
  priority: number;
  isActive: boolean;
  expiresAt?: Date;
  attachment?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['general', 'important', 'urgent'],
      default: 'general',
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
    attachment: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


NoticeSchema.index({ isActive: 1, type: 1, priority: -1 });
NoticeSchema.index({ expiresAt: 1 });

const Notice: Model<INotice> = mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);

export default Notice;

