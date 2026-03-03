import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide {
  imageUrl: string;
  order: number;
  isVisible: boolean;
}

export interface IAchievementItem {
  name: string;
  shortDescription: string;
  imageUrl: string;
  order: number;
  isVisible: boolean;
}

export interface IHomeContent extends Document {
  heroSlides: IHeroSlide[];
  achievements: IAchievementItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const AchievementSchema = new Schema<IAchievementItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const HomeContentSchema = new Schema<IHomeContent>(
  {
    heroSlides: {
      type: [HeroSlideSchema],
      default: [],
    },
    achievements: {
      type: [AchievementSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const HomeContent =
  mongoose.models.HomeContent ||
  mongoose.model<IHomeContent>("HomeContent", HomeContentSchema);

export default HomeContent;
