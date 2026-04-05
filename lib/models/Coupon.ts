import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string; // Coupon code (e.g., SUMMER20, FLAT500)
  eventId: mongoose.Types.ObjectId; // Reference to Event
  description: string; // Description of the coupon
  discountType: "percentage" | "fixed"; // Type of discount
  discountValue: number; // Discount amount (percentage or fixed price)
  maxUses?: number; // Maximum number of times coupon can be used
  usedCount: number; // Number of times coupon has been used
  minimumPrice?: number; // Minimum price to apply coupon
  maximumDiscount?: number; // Maximum discount amount for percentage-based coupons
  expiryDate?: Date; // Date when coupon expires
  isActive: boolean; // Is coupon active
  createdBy: mongoose.Types.ObjectId; // Reference to Admin
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Code must be at least 3 characters"],
      maxlength: [50, "Code cannot exceed 50 characters"],
      match: [/^[A-Z0-9_-]+$/, "Code can only contain uppercase letters, numbers, hyphens, and underscores"],
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
    },

    discountType: {
      type: String,
      enum: {
        values: ["percentage", "fixed"],
        message: "Discount type must be either 'percentage' or 'fixed'",
      },
      required: [true, "Discount type is required"],
    },

    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value must be positive"],
      validate: {
        validator: function(value : any) {
          if (this.discountType === "percentage") {
            return value > 0 && value <= 100;
          }
          return value > 0;
        },
        message: "For percentage discounts, value must be between 0 and 100. For fixed discounts, must be positive.",
      },
    },

    maxUses: {
      type: Number,
      min: [1, "Max uses must be at least 1"],
      default: null, // null means unlimited
    },

    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative"],
    },

    minimumPrice: {
      type: Number,
      min: [0, "Minimum price must be positive"],
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      min: [0, "Maximum discount must be positive"],
      default: null, // null means unlimited for percentage-based coupons
    },

    expiryDate: {
      type: Date,
      default: null, // null means never expires
      validate: {
        validator: function(date : any) {
          if (!date) return true; // Allow null
          return new Date(date) > new Date();
        },
        message: "Expiry date must be in the future",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Creator ID is required"],
    },
  },
  { timestamps: true }
);

// Compound index for checking coupon validity
CouponSchema.index({ code: 1, eventId: 1 });
CouponSchema.index({ eventId: 1, isActive: 1 });
CouponSchema.index({ expiryDate: 1 });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
