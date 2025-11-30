import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMember extends Document {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  role: 'president' | 'executive' | 'deputy' | 'general';
  position?: string;
  department: string;
  batch: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['president', 'executive', 'deputy', 'general'],
      required: [true, 'Role is required'],
      default: 'general',
    },
    position: {
      type: String,
      trim: true,
      maxlength: [100, 'Position cannot exceed 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, 'Batch is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
MemberSchema.index({ role: 1, isActive: 1 });
MemberSchema.index({ studentId: 1 });
MemberSchema.index({ email: 1 });

const Member: Model<IMember> = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;

