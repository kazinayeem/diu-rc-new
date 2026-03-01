/**
 * Seed members and member registrations
 *
 * Usage: node scripts/seed-members-and-registrations.js
 *
 * Seeds:
 * - 100 members with image URLs
 * - 1000+ member registrations with payment info
 *
 * Make sure to set MONGODB_URI in .env.local
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// Schemas
const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, uppercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["president", "executive", "deputy", "general"],
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

const MemberRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    currentYear: { type: String, required: true },
    cgpa: String,
    previousExperience: String,
    whyJoin: { type: String, required: true },
    skills: [String],
    portfolio: String,
    linkedin: String,
    github: String,
    paymentOptionId: { type: String, required: true },
    paymentNumber: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Member =
  mongoose.models.Member || mongoose.model("Member", MemberSchema);

const MemberRegistration =
  mongoose.models.MemberRegistration ||
  mongoose.model("MemberRegistration", MemberRegistrationSchema);

// Sample data
const departments = [
  "Software Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
];

const batches = ["2021-22", "2022-23", "2023-24", "2024-25"];
const currentYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const skills = [
  "Python",
  "JavaScript",
  "C++",
  "Java",
  "ROS",
  "Arduino",
  "Machine Learning",
  "Computer Vision",
  "Embedded Systems",
  "IoT",
  "PCB Design",
  "Robotics",
  "SLAM",
  "Autonomous Systems",
  "Control Systems",
];

const joinReasons = [
  "Interested in robotics and automation",
  "Want to learn new technologies",
  "Curious about AI and machine learning",
  "Love building robots",
  "Want to contribute to innovation",
  "Passionate about STEM education",
  "Want to gain hands-on experience",
  "Interested in competitive robotics",
];

const names = [
  "Ahmed Khan",
  "Fatima Khan",
  "Md. Hasan",
  "Arif Ahmed",
  "Saira Akter",
  "Karim Hassan",
  "Nadia Islam",
  "Imran Ali",
  "Riya Sharma",
  "Sajib Kumar",
  "Ayesha Rahman",
  "Rohit Singh",
  "Priya Das",
  "Amir Khan",
  "Zainab Ahmed",
  "Rafi Ahmed",
  "Mina Begum",
  "Iqbal Hassan",
  "Leena Roy",
  "Tariq Khan",
];

const roleDistribution = (index) => {
  if (index === 0) return "president";
  if (index < 5) return "deputy";
  if (index < 20) return "executive";
  return "general";
};

/**
 * Generate random integer between min and max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random array item
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random skills (2-5 skills)
 */
function generateSkills() {
  const count = randomInt(2, 5);
  const selected = [];
  for (let i = 0; i < count; i++) {
    const skill = randomItem(skills);
    if (!selected.includes(skill)) {
      selected.push(skill);
    }
  }
  return selected;
}

/**
 * Seed members
 */
async function seedMembers() {
  console.log("🌱 Starting to seed members...");

  try {
    // Check existing members
    const existingCount = await Member.countDocuments();
    console.log(`Found ${existingCount} existing members`);

    // Clear existing members
    if (existingCount > 0) {
      await Member.deleteMany({});
      console.log("✓ Cleared existing members");
    }

    const membersToInsert = [];

    for (let i = 0; i < 100; i++) {
      const memberName = `${randomItem(names)} ${i + 1}`;
      const department = randomItem(departments);

      membersToInsert.push({
        name: memberName,
        studentId: `DIU${Math.random().toString().slice(2, 14).toUpperCase()}`,
        email: `member${i + 1}@diu.edu.bd`,
        phone: `+880${randomInt(1000000000, 9999999999)}`,
        department: department,
        batch: randomItem(batches),
        role: roleDistribution(i),
        position:
          i < 20
            ? `Executive Board Member ${i + 1}`
            : randomItem([
                "Core Member",
                "Contributor",
                "Developer",
                "Designer",
              ]),
        image: "https://www.kazinayeem.site/myimage.png", // Using provided URL
        bio: `Member ${i + 1} with passion for robotics and innovation`,
        socialLinks: {
          linkedin: `https://linkedin.com/in/member${i + 1}`,
          github: `https://github.com/member${i + 1}`,
          portfolio: i % 3 === 0 ? `https://member${i + 1}.dev` : undefined,
        },
        isActive: randomInt(1, 10) > 1, // 90% active
        joinedAt: new Date(2022 + Math.floor(i / 30), randomInt(0, 11), randomInt(1, 28)),
      });
    }

    const insertedMembers = await Member.insertMany(membersToInsert);
    console.log(`✅ Successfully seeded ${insertedMembers.length} members`);
    return insertedMembers;
  } catch (error) {
    console.error("❌ Error seeding members:", error.message);
    throw error;
  }
}

/**
 * Seed member registrations
 */
async function seedMemberRegistrations() {
  console.log("\n🌱 Starting to seed member registrations...");

  try {
    // Get payment options
    const PaymentOptionSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        number: { type: String, required: true },
        instruction: { type: String, required: true },
      },
      { timestamps: true }
    );

    const PaymentOption =
      mongoose.models.PaymentOption ||
      mongoose.model("PaymentOption", PaymentOptionSchema);

    const paymentOptions = await PaymentOption.find().limit(4);

    if (paymentOptions.length === 0) {
      console.log("⚠️  No payment options found. Creating default ones...");
      await PaymentOption.insertMany([
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
      ]);
      return seedMemberRegistrations(); // Retry
    }

    // Check existing registrations
    const existingCount = await MemberRegistration.countDocuments();
    console.log(`Found ${existingCount} existing registrations`);

    // Clear existing registrations if needed
    if (existingCount > 0) {
      await MemberRegistration.deleteMany({});
      console.log("✓ Cleared existing registrations");
    }

    const registrationsToInsert = [];
    const statuses = ["pending", "approved", "rejected"];
    const paymentStatuses = ["pending", "verified", "rejected"];
    const paymentMethods = ["bKash", "Nagad", "Rocket"];

    for (let i = 0; i < 1200; i++) {
      const registrationName = `${randomItem(names)} Reg${i + 1}`;
      const registration = {
        name: registrationName,
        studentId: `REG${Math.random().toString().slice(2, 14).toUpperCase()}`,
        email: `registration${i + 1}@diu.edu.bd`,
        phone: `+880${randomInt(1000000000, 9999999999)}`,
        department: randomItem(departments),
        batch: randomItem(batches),
        currentYear: randomItem(currentYears),
        cgpa: (randomInt(250, 400) / 100).toFixed(2),
        previousExperience:
          randomInt(1, 100) > 60 ? `${randomInt(1, 5)} years of experience` : undefined,
        whyJoin: randomItem(joinReasons),
        skills: generateSkills(),
        portfolio:
          randomInt(1, 100) > 70 ? `https://portfolio${i + 1}.dev` : undefined,
        linkedin:
          randomInt(1, 100) > 50
            ? `https://linkedin.com/in/registration${i + 1}`
            : undefined,
        github:
          randomInt(1, 100) > 40
            ? `https://github.com/registration${i + 1}`
            : undefined,
        paymentOptionId:
          paymentOptions[randomInt(0, paymentOptions.length - 1)]._id.toString(),
        paymentNumber: `+880${randomInt(1000000000, 9999999999)}`,
        paymentMethod: randomItem(paymentMethods),
        transactionId: `TXN${Math.random().toString().slice(2, 18).toUpperCase()}`,
        paymentStatus: randomItem(paymentStatuses),
        status: randomItem(statuses),
      };

      registrationsToInsert.push(registration);
    }

    const insertedRegistrations = await MemberRegistration.insertMany(
      registrationsToInsert,
      { ordered: false }
    ).catch((err) => {
      // Continue with partial inserts even if there are duplicate key errors
      console.warn(
        `⚠️  Some registrations were not inserted due to duplicates: ${err.writeErrors.length} errors`
      );
      return err.result.insertedDocs || [];
    });

    console.log(
      `✅ Successfully seeded ${registrationsToInsert.length} member registrations`
    );
  } catch (error) {
    console.error("❌ Error seeding member registrations:", error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: "majority",
    });
    console.log("✓ Connected to MongoDB\n");

    await seedMembers();
    await seedMemberRegistrations();

    console.log("\n✅ Seeding completed successfully!");
    console.log("\nSummary:");
    console.log("- 100 members seeded to /admin/members");
    console.log("- 1200 member registrations seeded to /admin/member-registrations");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

main();
