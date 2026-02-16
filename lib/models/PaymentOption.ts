import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentOption extends Document {
  name: string;
  number: string;
  instruction: string;
  isActive: boolean;
}

const PaymentOptionSchema = new Schema<IPaymentOption>(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    instruction: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentOption ||
  mongoose.model<IPaymentOption>("PaymentOption", PaymentOptionSchema);
