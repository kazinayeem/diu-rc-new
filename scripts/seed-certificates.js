/**
 * Seed script for Certificates — creates sample certificates from workshop data
 *
 * Usage: node scripts/seed-certificates.js
 *
 * This will create certificates for participants from the workshops/seminars/bootcamps
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    recipientName: { type: String, required: true, trim: true },
    recipientEmail: { type: String, required: true, trim: true, lowercase: true },
    event: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: ["workshop", "seminar", "bootcamp", "competition", "training", "course", "other"],
      default: "workshop",
    },
    category: { type: String, trim: true },
    issueDate: { type: Date, required: true },
    description: { type: String, trim: true },
    skills: { type: [String], default: [] },
    duration: { type: String, trim: true },
    instructor: { type: String, trim: true },
    certificateImageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

const Certificate =
  mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);

// Sample certificate data based on actual workshop data
const CERTIFICATES = [
  // Competitive Line Follower Workshop - 10 August 2025
  {
    certificateId: "DIURCCLF2025001",
    recipientName: "MD MOSADDEK ALI LAM",
    recipientEmail: "252-15-356@diu.edu.bd",
    event: "Competitive Line Follower Workshop",
    eventType: "workshop",
    category: "Robotics",
    issueDate: new Date("2025-08-10"),
    description: "Successfully completed the Competitive Line Follower Workshop, demonstrating proficiency in robot design, sensor integration, and autonomous navigation.",
    skills: ["Arduino Programming", "Sensor Integration", "Robot Design", "Circuit Building"],
    duration: "3 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCCLF2025002",
    recipientName: "MD Ahnulla Sarder",
    recipientEmail: "252-15-251@diu.edu.bd",
    event: "Competitive Line Follower Workshop",
    eventType: "workshop",
    category: "Robotics",
    issueDate: new Date("2025-08-10"),
    description: "Successfully completed the Competitive Line Follower Workshop, demonstrating proficiency in robot design, sensor integration, and autonomous navigation.",
    skills: ["Arduino Programming", "Sensor Integration", "Robot Design", "Circuit Building"],
    duration: "3 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCCLF2025003",
    recipientName: "Md. Tawhid Hassan",
    recipientEmail: "tawhid242-33-190@diu.edu.bd",
    event: "Competitive Line Follower Workshop",
    eventType: "workshop",
    category: "Robotics",
    issueDate: new Date("2025-08-10"),
    description: "Successfully completed the Competitive Line Follower Workshop, demonstrating proficiency in robot design, sensor integration, and autonomous navigation.",
    skills: ["Arduino Programming", "Sensor Integration", "Robot Design", "Circuit Building"],
    duration: "3 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },

  // 3D Design to Fabrication Workshop - 25 October 2025
  {
    certificateId: "DIURC3DF2025001",
    recipientName: "Kh.Jannat ara",
    recipientEmail: "253-33-0990@diu.edu.bd",
    event: "3D Design to Fabrication: A Journey with Autodesk Fusion",
    eventType: "workshop",
    category: "3D Design",
    issueDate: new Date("2025-10-25"),
    description: "Completed comprehensive training in 3D modeling and fabrication using Autodesk Fusion 360, covering design principles, parametric modeling, and manufacturing workflows.",
    skills: ["Autodesk Fusion 360", "3D Modeling", "CAD Design", "Manufacturing"],
    duration: "5 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURC3DF2025002",
    recipientName: "Kawser Ahmed",
    recipientEmail: "253-35-299@diu.edu.bd",
    event: "3D Design to Fabrication: A Journey with Autodesk Fusion",
    eventType: "workshop",
    category: "3D Design",
    issueDate: new Date("2025-10-25"),
    description: "Completed comprehensive training in 3D modeling and fabrication using Autodesk Fusion 360, covering design principles, parametric modeling, and manufacturing workflows.",
    skills: ["Autodesk Fusion 360", "3D Modeling", "CAD Design", "Manufacturing"],
    duration: "5 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURC3DF2025003",
    recipientName: "Sajid Ali",
    recipientEmail: "253-15-147@diu.edu.bd",
    event: "3D Design to Fabrication: A Journey with Autodesk Fusion",
    eventType: "workshop",
    category: "3D Design",
    issueDate: new Date("2025-10-25"),
    description: "Completed comprehensive training in 3D modeling and fabrication using Autodesk Fusion 360, covering design principles, parametric modeling, and manufacturing workflows.",
    skills: ["Autodesk Fusion 360", "3D Modeling", "CAD Design", "Manufacturing"],
    duration: "5 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },

  // PCB Design Workshop - 1st November 2025
  {
    certificateId: "DIURCPCB2025001",
    recipientName: "Mst Zaha Anika",
    recipientEmail: "zaha241-15-8319@diu.edu.bd",
    event: "PCB Design Workshop: From Concept to Fabrication",
    eventType: "workshop",
    category: "Electronics",
    issueDate: new Date("2025-11-01"),
    description: "Mastered PCB design fundamentals including schematic capture, layout design, and manufacturing preparation for professional printed circuit boards.",
    skills: ["PCB Design", "KiCAD", "Schematic Design", "Circuit Layout", "Electronics"],
    duration: "4 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCPCB2025002",
    recipientName: "B M A mehedi",
    recipientEmail: "abhi241-15-217@diu.edu.bd",
    event: "PCB Design Workshop: From Concept to Fabrication",
    eventType: "workshop",
    category: "Electronics",
    issueDate: new Date("2025-11-01"),
    description: "Mastered PCB design fundamentals including schematic capture, layout design, and manufacturing preparation for professional printed circuit boards.",
    skills: ["PCB Design", "KiCAD", "Schematic Design", "Circuit Layout", "Electronics"],
    duration: "4 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCPCB2025003",
    recipientName: "MD A BNA SAYED",
    recipientEmail: "sayed203051120@diu.edu.bd",
    event: "PCB Design Workshop: From Concept to Fabrication",
    eventType: "workshop",
    category: "Electronics",
    issueDate: new Date("2025-11-01"),
    description: "Mastered PCB design fundamentals including schematic capture, layout design, and manufacturing preparation for professional printed circuit boards.",
    skills: ["PCB Design", "KiCAD", "Schematic Design", "Circuit Layout", "Electronics"],
    duration: "4 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCPCB2025004",
    recipientName: "Golam Morshed Renom",
    recipientEmail: "253-50-0192@diu.edu.bd",
    event: "PCB Design Workshop: From Concept to Fabrication",
    eventType: "workshop",
    category: "Electronics",
    issueDate: new Date("2025-11-01"),
    description: "Mastered PCB design fundamentals including schematic capture, layout design, and manufacturing preparation for professional printed circuit boards.",
    skills: ["PCB Design", "KiCAD", "Schematic Design", "Circuit Layout", "Electronics"],
    duration: "4 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCPCB2025005",
    recipientName: "Md.Mostafe Wasid",
    recipientEmail: "wasid241-33-171@diu.edu.bd",
    event: "PCB Design Workshop: From Concept to Fabrication",
    eventType: "workshop",
    category: "Electronics",
    issueDate: new Date("2025-11-01"),
    description: "Mastered PCB design fundamentals including schematic capture, layout design, and manufacturing preparation for professional printed circuit boards.",
    skills: ["PCB Design", "KiCAD", "Schematic Design", "Circuit Layout", "Electronics"],
    duration: "4 Days",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },

  // Additional sample certificates for variety
  {
    certificateId: "DIURCSEM2025001",
    recipientName: "MD Towfiqul Islam Samrat",
    recipientEmail: "samrat242-15-244@diu.edu.bd",
    event: "Advanced Robotics Seminar",
    eventType: "seminar",
    category: "Robotics",
    issueDate: new Date("2025-09-15"),
    description: "Participated in an intensive seminar on advanced robotics covering AI integration, machine learning, and autonomous systems.",
    skills: ["AI in Robotics", "Machine Learning", "Autonomous Systems", "Computer Vision"],
    duration: "1 Day",
    instructor: "Expert Panel",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
  {
    certificateId: "DIURCBOOT2025001",
    recipientName: "Wymun Farhan Khan",
    recipientEmail: "khan242-33-051@diu.edu.bd",
    event: "IoT Development Bootcamp",
    eventType: "bootcamp",
    category: "IoT",
    issueDate: new Date("2025-12-01"),
    description: "Completed intensive bootcamp covering IoT device development, cloud integration, and real-world project implementation.",
    skills: ["IoT", "ESP32", "MQTT", "Cloud Integration", "Embedded Systems"],
    duration: "2 Weeks",
    instructor: "DIU Robotics Club",
    certificateImageUrl: "/ce.png",
    isActive: true,
  },
];

async function seedCertificates() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get first admin user as creator
    const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema({}));
    const admin = await Admin.findOne({ role: "super-admin" });
    
    if (!admin) {
      console.error("❌ No super-admin found. Please create an admin first.");
      process.exit(1);
    }

    console.log(`📝 Using admin: ${admin.name} (${admin.email})`);

    // Delete existing certificates
    const deleted = await Certificate.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing certificates`);

    // Add createdBy to all certificates
    const certificatesWithCreator = CERTIFICATES.map(cert => ({
      ...cert,
      createdBy: admin._id,
    }));

    // Insert new certificates
    const inserted = await Certificate.insertMany(certificatesWithCreator);
    console.log(`✅ Inserted ${inserted.length} certificates`);

    console.log("\n📋 Sample Certificate IDs:");
    inserted.slice(0, 5).forEach((cert) => {
      console.log(`   ${cert.certificateId} - ${cert.recipientName}`);
    });

    console.log("\n🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

seedCertificates();
