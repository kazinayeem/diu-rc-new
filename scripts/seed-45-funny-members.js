/**
 * Seed 45 Members with Funny Names and Different Positions
 *
 * Usage: node scripts/seed-45-funny-members.js
 *
 * Seeds 45 members with:
 * - Funny creative names
 * - Same image URL for all (https://diurc.vercel.app/sh.jpg)
 * - Different positions from expanded role list
 * - Random departments and batches
 *
 * Make sure to set MONGODB_URI in .env.local
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// Member Schema
const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, uppercase: true },
    email: { type: String, lowercase: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      default: "general",
    },
    position: String,
    department: { type: String, required: true },
    batch: { type: String, required: true },
    image: String,
    bio: String,
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Member =
  mongoose.models.Member || mongoose.model("Member", MemberSchema);

// Funny names collection
const funnyNames = [
  "Byte Bandit",
  "Code Ninja",
  "Debug Diva",
  "Algorithm Annie",
  "Binary Bob",
  "Cache Money",
  "Ctrl Alt Elite",
  "Data Dazzler",
  "Exception Handler",
  "Function Fury",
  "Git Guru",
  "Hardware Harry",
  "IoT Iggy",
  "JavaScript Jedi",
  "Kernel Ken",
  "Loop Legend",
  "Memory Master",
  "Null Pointer Nancy",
  "Object Oliver",
  "Pixel Perfect Pete",
  "Query Queen",
  "RAM Racer",
  "Stack Overflow Steve",
  "Thread Thunder",
  "Unicode Unicorn",
  "Variable Victor",
  "Widget Wizard",
  "XML Xavier",
  "YAML Yoda",
  "Zero Day Zara",
  "API Ace",
  "Boolean Betty",
  "Compiler Carl",
  "Docker Duke",
  "Endpoint Eddie",
  "Firewall Fiona",
  "GPU Gloria",
  "Hash Hugo",
  "Interface Ivy",
  "JSON Jerry",
  "Kubernetes Kate",
  "Lambda Larry",
  "Middleware Max",
  "Node Ninja",
  "Overflow Oscar",
];

// All available roles from the expanded list
const roles = [
  { role: "advisor", position: "Technical Advisor" },
  { role: "advisor", position: "Academic Advisor" },
  { role: "convener", position: "Club Convener" },
  { role: "president", position: "Club President" },
  { role: "vice-president", position: "Vice President Operations" },
  { role: "vice president", position: "Vice President Innovation" },
  { role: "general secretary", position: "General Secretary" },
  { role: "treasurer", position: "Club Treasurer" },
  { role: "joint secretary", position: "Joint Secretary" },
  { role: "assistant general secretary", position: "Assistant General Secretary" },
  { role: "organizing secretary", position: "Organizing Secretary" },
  { role: "assistant organizing secretary", position: "Assistant Organizing Secretary" },
  { role: "training secretary", position: "Training & Development Head" },
  { role: "training secretory", position: "Training Coordinator" },
  { role: "assistant training secretary", position: "Assistant Training Secretary" },
  { role: "media and press secretary", position: "Media & Press Secretary" },
  { role: "senior assistant media and press secretary", position: "Senior Media Assistant" },
  { role: "assistant media and press secretary", position: "Social Media Manager" },
  { role: "public relation and communication secretary", position: "PR & Communication Head" },
  { role: "assistant public relation and communication secretary", position: "Assistant PR Secretary" },
  { role: "executive", position: "Executive Board Member" },
  { role: "executive", position: "Project Lead" },
  { role: "executive", position: "Technical Lead" },
  { role: "deputy", position: "Deputy Team Leader" },
  { role: "deputy", position: "Deputy Coordinator" },
  { role: "general", position: "Core Team Member" },
  { role: "general", position: "Research Associate" },
  { role: "general", position: "Workshop Coordinator" },
  { role: "general", position: "Event Organizer" },
  { role: "member", position: "Active Member" },
  { role: "member", position: "Junior Member" },
  { role: "member", position: "Contributing Member" },
  { role: "executive", position: "Innovation Officer" },
  { role: "executive", position: "Competition Manager" },
  { role: "deputy", position: "Deputy Operations Head" },
  { role: "general", position: "Content Creator" },
  { role: "general", position: "Design Lead" },
  { role: "general", position: "Outreach Coordinator" },
  { role: "member", position: "Volunteer Member" },
  { role: "member", position: "Student Ambassador" },
  { role: "general", position: "Lab Manager" },
  { role: "executive", position: "Strategic Planning Officer" },
  { role: "general", position: "Hackathon Coordinator" },
  { role: "deputy", position: "Deputy Research Head" },
  { role: "general", position: "Alumni Relations Officer" },
];

// Departments
const departments = [
  "CSE",
  "SWE",
  "EEE",
  "Mechanical",
  "Civil",
  "BBA",
  "English",
  "Law",
  "Pharmacy",
  "Architecture",
];

// Batches
const batches = [
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
];

// Generate random student ID
function generateStudentId(index) {
  const year = 221 + Math.floor(index / 15);
  const serial = String(10000 + index).padStart(5, "0");
  return `${year}-15-${serial}`;
}

// Generate random phone
function generatePhone() {
  return `+880171${Math.floor(1000000 + Math.random() * 9000000)}`;
}

// Generate random email
function generateEmail(name, studentId) {
  const cleanName = name.toLowerCase().replace(/\s+/g, ".");
  return `${cleanName}${studentId.slice(-4)}@diu.edu.bd`;
}

// Generate members
async function seedMembers() {
  try {
    console.log("🚀 Starting seed process...");
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Generate 45 members
    const members = [];
    for (let i = 0; i < 45; i++) {
      const name = funnyNames[i];
      const studentId = generateStudentId(i);
      const roleData = roles[i % roles.length];

      members.push({
        name,
        studentId,
        email: generateEmail(name, studentId),
        phone: generatePhone(),
        role: roleData.role,
        position: roleData.position,
        department: departments[Math.floor(Math.random() * departments.length)],
        batch: batches[Math.floor(Math.random() * batches.length)],
        image: "https://diurc.vercel.app/sh.jpg",
        bio: `${name} is an enthusiastic member of Daffodil International University Robotics Club, passionate about technology and innovation.`,
        isActive: true,
        socialLinks: {
          linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "-")}`,
          github: `https://github.com/${name.toLowerCase().replace(/\s+/g, "-")}`,
        },
      });
    }

    console.log(`📝 Generated ${members.length} members with funny names`);

    // Insert members
    console.log("💾 Inserting members into database...");
    const result = await Member.insertMany(members, { ordered: false });

    console.log(`✅ Successfully inserted ${result.length} members`);
    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Total Members: ${result.length}`);
    console.log(`   Image URL: https://diurc.vercel.app/sh.jpg`);
    console.log(`   Unique Positions: ${new Set(members.map(m => m.position)).size}`);
    console.log(`   Departments: ${departments.join(", ")}`);
    console.log("\n✨ All members are active and ready!");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding members:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seeder
seedMembers();
