import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  image: string;
  category: 'event' | 'workshop' | 'seminar' | 'project' | 'general';
  featured: boolean;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      enum: ['event', 'workshop', 'seminar', 'project', 'general'],
      default: 'general',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
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
GallerySchema.index({ category: 1, featured: 1 });
GallerySchema.index({ createdAt: -1 });

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;

