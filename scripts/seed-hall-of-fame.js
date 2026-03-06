/**
 * Seed script for Hall of Fame entries
 *
 * Usage: node scripts/seed-hall-of-fame.js
 *
 * Make sure MONGODB_URI is set in .env.local
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const HallOfFameSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    imageUrl:    { type: String, required: true, trim: true },
    achievement: { type: String, required: true, trim: true },
    position:    { type: String, required: true, trim: true },
    year:        { type: String, required: true, trim: true },
    linkedinUrl: { type: String, trim: true, default: "" },
    isVisible:   { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HallOfFame =
  mongoose.models.HallOfFame ||
  mongoose.model("HallOfFame", HallOfFameSchema);

// ── Seed data from the original HTML carousel ─────────────────────────────────
// imageUrl uses a placehold.co fallback; update via Admin → Hall of Fame after seeding.
const ENTRIES = [
  {
    name: "Jabed Hossen",
    imageUrl: "https://placehold.co/300x300/1E415A/FFFFFF?text=JH",
    achievement:
      "Full Funded Scholarship – MSc in Data Science, Università degli Studi di Milano-Bicocca",
    position: "President",
    year: "2024",
    linkedinUrl: "https://www.linkedin.com/in/md-jabed-hosen-18099b16b",
    isVisible: true,
    order: 1,
  },
  {
    name: "Sabbir bin Shazid",
    imageUrl: "https://placehold.co/300x300/1E415A/FFFFFF?text=SS",
    achievement: "Junior IoT Engineer, Kerberos",
    position: "Vice President",
    year: "2024",
    linkedinUrl: "https://www.linkedin.com/in/sabbir-bin-shazid-620aab1b3",
    isVisible: true,
    order: 2,
  },
  {
    name: "Md Shafi",
    imageUrl: "https://placehold.co/300x300/1E415A/FFFFFF?text=MS",
    achievement: "Full funded Erasmus Mundus Scholar under DREAM",
    position: "Vice President",
    year: "2024",
    linkedinUrl: "https://www.linkedin.com/in/md-safi-0277a6204",
    isVisible: true,
    order: 3,
  },
  {
    name: "Shovon Parvez",
    imageUrl: "https://placehold.co/300x300/1E415A/FFFFFF?text=SP",
    achievement: "Rehabilitation Engineer at CRP Bangladesh",
    position: "President",
    year: "2023",
    linkedinUrl: "https://www.linkedin.com/in/shovan-parvez-861b88200",
    isVisible: true,
    order: 4,
  },
  {
    name: "Sajal Das",
    imageUrl: "https://placehold.co/300x300/1E415A/FFFFFF?text=SD",
    achievement: "Data Engineer at Optimizely",
    position: "President",
    year: "2023",
    linkedinUrl: "https://www.linkedin.com/in/sajaldoes",
    isVisible: true,
    order: 5,
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌  MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("✅  Connected to MongoDB");

  let created = 0;
  let skipped = 0;

  for (const entry of ENTRIES) {
    const existing = await HallOfFame.findOne({ name: entry.name });
    if (existing) {
      console.log(`⏭️   Skipped (already exists): ${entry.name}`);
      skipped++;
    } else {
      await HallOfFame.create(entry);
      console.log(`✅  Created: ${entry.name}`);
      created++;
    }
  }

  console.log(`\n🎓  Seeding complete — ${created} created, ${skipped} skipped`);
  console.log(
    "💡  Tip: update imageUrl via Admin Panel → Hall of Fame after adding real photos.\n"
  );

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
