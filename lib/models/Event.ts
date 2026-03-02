import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  mode: "online" | "offline"; 
  eventLink?: string; 
  registrationLink?: string;
  registrationLimit?: number;
  registrationOpen: boolean;
  isPaid: boolean;
  registrationFee?: number;
  paymentMethods?: Array<{
    method: "bkash" | "nagad";
    number: string;
    instructions?: string;
  }>;
  type: "event" | "workshop" | "seminar" | "bootcamp";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  featured: boolean;
  attendees?: number;
  tags?: string[];
  hosts?: Array<{
    name: string;
    image?: string;
  }>;
  guests?: Array<{
    name: string;
    image?: string;
  }>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
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
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    content: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },

    eventTime: {
      type: String,
      required: [true, "Event time is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    
    eventLink: {
      type: String,
      trim: true,
    },

    registrationLink: {
      type: String,
      trim: true,
    },

    registrationLimit: {
      type: Number,
      min: [0, "Registration limit must be positive"],
    },

    registrationOpen: {
      type: Boolean,
      default: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    registrationFee: {
      type: Number,
      min: [0, "Registration fee must be positive"],
      default: 0,
    },

    paymentMethods: [
      {
        method: {
          type: String,
          enum: ["bkash", "nagad"],
        },
        number: {
          type: String,
          trim: true,
        },
        instructions: {
          type: String,
          default: "",
        },
      },
    ],

    type: {
      type: String,
      enum: ["event", "workshop", "seminar", "bootcamp"],
      default: "event",
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
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

    hosts: [
      {
        name: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],

    guests: [
      {
        name: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);


EventSchema.index({ status: 1, eventDate: 1 });
EventSchema.index({ featured: 1 });
EventSchema.index({ slug: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
