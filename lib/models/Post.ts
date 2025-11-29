import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: 'research' | 'project' | 'achievement' | 'news' | 'blog';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  paperLink?: string;
  authors?: string[];
  publicationDate?: Date;
  journal?: string;
  tags?: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
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
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['research', 'project', 'achievement', 'news', 'blog'],
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    paperLink: {
      type: String,
      trim: true,
    },
    authors: [String],
    publicationDate: {
      type: Date,
    },
    journal: {
      type: String,
      trim: true,
      maxlength: [200, 'Journal name cannot exceed 200 characters'],
    },
    tags: [String],
    author: {
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
PostSchema.index({ status: 1, category: 1 });
PostSchema.index({ featured: 1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ views: -1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;

