import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkshopRegistration extends Document {
  workshopId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  studentId?: string;
  department?: string;
  batch?: string;
  message?: string;
  isPaid: boolean;
  paymentStatus: 'pending' | 'paid' | 'rejected';
  paymentMethod?: 'bkash' | 'nagad';
  paymentNumber?: string;
  transactionId?: string;
  paymentApprovedBy?: mongoose.Types.ObjectId;
  paymentApprovedAt?: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkshopRegistrationSchema: Schema = new Schema(
  {
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Workshop ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'rejected'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['bkash', 'nagad'],
    },
    paymentNumber: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    paymentApprovedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
WorkshopRegistrationSchema.index({ workshopId: 1, email: 1 });
WorkshopRegistrationSchema.index({ email: 1 });
WorkshopRegistrationSchema.index({ status: 1 });

// Prevent duplicate registrations for same workshop
WorkshopRegistrationSchema.index({ workshopId: 1, email: 1 }, { unique: true });

const WorkshopRegistration: Model<IWorkshopRegistration> = 
  mongoose.models.WorkshopRegistration || 
  mongoose.model<IWorkshopRegistration>('WorkshopRegistration', WorkshopRegistrationSchema);

export default WorkshopRegistration;

