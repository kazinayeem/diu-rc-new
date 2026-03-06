/**
 * Seed script for Sponsors — deletes ALL existing and inserts 12 real tech companies
 *
 * Usage: node scripts/seed-sponsors.js
 *
 * Logos are served via Clearbit Logo API (logo.clearbit.com) — always up-to-date, no hotlinking issues.
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const SponsorSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    logoUrl:    { type: String, required: true, trim: true },
    websiteUrl: { type: String, trim: true, default: "" },
    tier:       { type: String, enum: ["platinum", "gold", "silver", "community"], default: "community" },
    isVisible:  { type: Boolean, default: true },
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Sponsor =
  mongoose.models.Sponsor || mongoose.model("Sponsor", SponsorSchema);

const SPONSORS = [
  // ── Platinum ─────────────────────────────────────────────────────────────
  {
    name: "Google",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    websiteUrl: "https://google.com",
    tier: "platinum",
    order: 1,
  },
  {
    name: "Amazon Web Services",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    websiteUrl: "https://aws.amazon.com",
    tier: "platinum",
    order: 2,
  },
  {
    name: "Microsoft",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    websiteUrl: "https://microsoft.com",
    tier: "platinum",
    order: 3,
  },

  // ── Gold ─────────────────────────────────────────────────────────────────
  {
    name: "NVIDIA",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    websiteUrl: "https://nvidia.com",
    tier: "gold",
    order: 4,
  },
  {
    name: "Meta",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    websiteUrl: "https://meta.com",
    tier: "gold",
    order: 5,
  },
  {
    name: "Docker",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg",
    websiteUrl: "https://docker.com",
    tier: "gold",
    order: 6,
  },

  // ── Silver ────────────────────────────────────────────────────────────────
  {
    name: "Kubernetes",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
    websiteUrl: "https://kubernetes.io",
    tier: "silver",
    order: 7,
  },
  {
    name: "GitHub",
    logoUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    websiteUrl: "https://github.com",
    tier: "silver",
    order: 8,
  },
  {
    name: "TensorFlow",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
    websiteUrl: "https://tensorflow.org",
    tier: "silver",
    order: 9,
  },

  // ── Community ────────────────────────────────────────────────────────────
  {
    name: "Arduino",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg",
    websiteUrl: "https://arduino.cc",
    tier: "community",
    order: 10,
  },
  {
    name: "Raspberry Pi",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Raspberry_Pi_Logo.svg",
    websiteUrl: "https://raspberrypi.com",
    tier: "community",
    order: 11,
  },
  {
    name: "Hugging Face",
    logoUrl: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
    websiteUrl: "https://huggingface.co",
    tier: "community",
    order: 12,
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌  MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("✅  Connected to MongoDB\n");

  // Wipe existing
  const { deletedCount } = await Sponsor.deleteMany({});
  console.log(`🗑️   Deleted ${deletedCount} existing sponsor(s)\n`);

  // Insert all
  const inserted = await Sponsor.insertMany(SPONSORS);
  console.log(`✅  Inserted ${inserted.length} sponsors:\n`);

  const tiers = ["platinum", "gold", "silver", "community"];
  for (const tier of tiers) {
    const group = SPONSORS.filter((s) => s.tier === tier);
    if (group.length) {
      console.log(`  [${tier.toUpperCase()}]`);
      group.forEach((s) => console.log(`    • ${s.name}`));
    }
  }

  console.log("\n🎉  Done!\n");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
