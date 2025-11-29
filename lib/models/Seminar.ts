import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISeminar extends Document {
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  seminarDate: Date;
  seminarTime: string;
  location: string;
  speaker: string;
  speakerBio?: string;
  speakerImage?: string;
  registrationLink?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  attendees?: number;
  tags?: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SeminarSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Seminar title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    seminarDate: {
      type: Date,
      required: [true, 'Seminar date is required'],
    },
    seminarTime: {
      type: String,
      required: [true, 'Seminar time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    speaker: {
      type: String,
      required: [true, 'Speaker name is required'],
      trim: true,
    },
    speakerBio: {
      type: String,
      maxlength: [500, 'Speaker bio cannot exceed 500 characters'],
    },
    speakerImage: {
      type: String,
      default: '',
    },
    registrationLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    attendees: {
      type: Number,
      default: 0,
    },
    tags: [String],
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

// Indexes
SeminarSchema.index({ status: 1, seminarDate: 1 });
SeminarSchema.index({ featured: 1 });
SeminarSchema.index({ slug: 1 });

const Seminar: Model<ISeminar> = mongoose.models.Seminar || mongoose.model<ISeminar>('Seminar', SeminarSchema);

export default Seminar;

