/**
 * Seed default payment options
 *
 * Usage: node scripts/seed-payment-options.js
 *
 * Make sure to set MONGODB_URI in .env.local
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const PaymentOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    instruction: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PaymentOption =
  mongoose.models.PaymentOption ||
  mongoose.model("PaymentOption", PaymentOptionSchema);

const defaults = [
  {
    name: "bKash",
    number: "01700000001",
    instruction: "Send money and keep the transaction ID.",
  },
  {
    name: "Nagad",
    number: "01800000002",
    instruction: "Send money and keep the transaction ID.",
  },
  {
    name: "Rocket",
    number: "01900000003",
    instruction: "Send money and keep the transaction ID.",
  },
  {
    name: "BRAC Bank",
    number: "0200000000001",
    instruction: "Transfer and keep the reference ID.",
  },
  {
    name: "IBBL Bank",
    number: "0210000000002",
    instruction: "Transfer and keep the reference ID.",
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    const existing = await PaymentOption.find({});
    if (existing.length === 0) {
      await PaymentOption.insertMany(defaults);
      console.log("Seeded payment options.");
    } else {
      console.log("Payment options already exist. No changes made.");
    }
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
