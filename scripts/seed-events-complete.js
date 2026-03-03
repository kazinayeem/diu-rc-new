/**
 * Seed 200+ Events, Workshops, Bootcamps, and Seminars
 *
 * Usage: node scripts/seed-events-complete.js
 *
 * Seeds:
 * - 250+ Events
 * - 250+ Workshops
 * - 200+ Bootcamps
 * - 200+ Seminars
 *
 * Uses consistent image URL: https://diurc.vercel.app/sh.jpg
 * First clears all existing events/workshops/bootcamps/seminars
 *
 * Make sure to set MONGODB_URI in .env.local
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// Event Schema
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: String,
    content: String,
    type: {
      type: String,
      enum: ["event", "workshop", "bootcamp", "seminar"],
      default: "event",
    },
    eventDate: { type: Date, required: true },
    eventTime: String,
    location: String,
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "offline" },
    eventLink: String,
    image: String,
    registrationLink: String,
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    featured: { type: Boolean, default: false },
    registrationLimit: Number,
    registrationOpen: { type: Boolean, default: true },
    isPaid: { type: Boolean, default: false },
    registrationFee: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["both", "bkash", "nagad"], default: "both" },
    paymentNumber: String,
    host: [String],
    guest: [String],
    createdBy: String,
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

// Data generators
const guests = [
  "Ahmed Hassan", "Fatima Rahman", "Karim Uddin", "Sophia Khan", "Rashed Ali",
  "Maria Islam", "Hassan Mohammad", "Zainab Begum", "Arif Hossain", "Leila Ahmed",
  "Samir Khan", "Jasmine Roy", "Anik Roy", "Priya Sharma", "Vikram Singh",
  "Anjali Patel", "Rohit Kumar", "Nina Gupta", "Arjun Verma", "Divya Nair",
];

const locations = ["Dhaka", "Online", "DIU Campus", "Tech Hub", "Conference Room A", "Virtual"];
const modes = ["online", "offline", "hybrid"];
const statuses = ["upcoming", "ongoing", "completed"];
const paymentMethods = ["both", "bkash", "nagad"];

const descriptions = {
  event: [
    "Major industry conference with keynote speakers and networking opportunities.",
    "Annual celebration of tech innovation and community achievements.",
    "Grand showcase of projects and talent from the club.",
    "Networking mixer with professionals and alumni.",
    "Special guest session with industry leaders and innovators.",
  ],
  workshop: [
    "Hands-on workshop covering practical applications and real-world projects.",
    "Interactive training session led by expert instructors.",
    "Deep dive into advanced concepts with hands-on exercises.",
    "Practical training program with live coding demonstrations.",
    "Comprehensive workshop on cutting-edge technologies and frameworks.",
  ],
  bootcamp: [
    "Intensive bootcamp program for comprehensive skill development.",
    "Multi-week immersive training program with mentorship.",
    "Career-focused bootcamp with job placement assistance.",
    "Fast-track intensive training in latest technologies.",
    "Full-time bootcamp with real projects and industry mentors.",
  ],
  seminar: [
    "Expert seminar on latest trends and best practices.",
    "Distinguished speaker session on industry innovations.",
    "Research seminar with leading academics and practitioners.",
    "Knowledge-sharing session on cutting-edge technologies.",
    "Professional development seminar for career advancement.",
  ]
};

const titleTemplates = {
  event: [
    "Annual Tech Summit", "Innovation Showcase", "Career Fair", "Networking Gala",
    "Community Meetup", "Guest Lecture", "Awards Ceremony", "Product Launch",
    "Forum Discussion", "Team Building Event", "Workshop Day", "Conference",
  ],
  workshop: [
    "Web Development Bootcamp", "React Master Class", "Node.js Advanced", "Python Programming",
    "DevOps Essential", "Cloud Computing", "Database Design", "API Development",
    "Mobile App Dev", "Machine Learning", "Data Analysis", "System Design",
  ],
  bootcamp: [
    "Full Stack Development", "Data Science Intensive", "Cloud Engineering", "Mobile Development",
    "Cybersecurity Intensive", "AI/ML Engineering", "DevOps Bootcamp", "Game Development",
    "Blockchain Development", "Web3 Bootcamp", "Frontend Intensive", "Backend Bootcamp",
  ],
  seminar: [
    "AI & Machine Learning", "Cloud Architecture", "Cybersecurity Threats", "DevOps Best Practices",
    "Data Privacy Regulations", "Blockchain Basics", "IoT Solutions", "Web3 Overview",
    "API Design Patterns", "Performance Optimization", "Testing Strategies", "Leadership Skills",
  ]
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(title, type, index) {
  return `${type}-${title.toLowerCase().replace(/\s+/g, "-").substring(0, 30)}-${index}`;
}

function generateEventData(type, count) {
  const events = [];
  const titles = titleTemplates[type];

  for (let i = 1; i <= count; i++) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 365) + 5);

    events.push({
      title: `${getRandomItem(titles)} - ${i}`,
      slug: generateSlug(getRandomItem(titles), type, i),
      description: getRandomItem(descriptions[type]),
      content: getRandomItem(descriptions[type]),
      type: type,
      eventDate,
      eventTime: `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      location: getRandomItem(locations),
      mode: getRandomItem(modes),
      eventLink: "https://meet.google.com/abc-defg-hij",
      image: "https://diurc.vercel.app/sh.jpg",
      registrationLink: "",
      status: getRandomItem(statuses),
      featured: Math.random() > 0.85,
      registrationLimit: Math.random() > 0.3 ? Math.floor(Math.random() * 300) + 50 : 0,
      registrationOpen: Math.random() > 0.1,
      isPaid: Math.random() > 0.6,
      registrationFee: Math.random() > 0.6 ? Math.floor(Math.random() * 5000) + 500 : 0,
      paymentMethod: getRandomItem(paymentMethods),
      paymentNumber: "017" + Math.floor(Math.random() * 1000000000).toString().padStart(8, "0"),
      host: [
        getRandomItem(guests),
        getRandomItem(guests),
      ],
      guest: [
        getRandomItem(guests),
        getRandomItem(guests),
        getRandomItem(guests),
      ],
    });
  }

  return events;
}

async function seedEvents() {
  try {
    console.log("🚀 Starting comprehensive event seeding...");
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear all existing events
    console.log("🗑️  Clearing all existing events...");
    const deleteResult = await Event.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing events`);

    // Generate and insert events
    console.log("\n📝 Generating events data...");
    
    let allEvents = [];
    
    console.log("   • Generating 250 regular events...");
    allEvents = allEvents.concat(generateEventData("event", 250));
    
    console.log("   • Generating 250 workshop events...");
    allEvents = allEvents.concat(generateEventData("workshop", 250));
    
    console.log("   • Generating 200 bootcamp events...");
    allEvents = allEvents.concat(generateEventData("bootcamp", 200));
    
    console.log("   • Generating 200 seminar events...");
    allEvents = allEvents.concat(generateEventData("seminar", 200));

    console.log(`\n💾 Inserting ${allEvents.length} events into database...`);
    const insertResult = await Event.insertMany(allEvents, { ordered: false });

    console.log(`\n✅ Successfully inserted ${insertResult.length} events`);
    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Total Events: ${insertResult.length}`);
    console.log(`   • Regular Events: 250`);
    console.log(`   • Workshops: 250`);
    console.log(`   • Bootcamps: 200`);
    console.log(`   • Seminars: 200`);
    console.log(`   Image URL: https://diurc.vercel.app/sh.jpg`);
    console.log(`   Status types: upcoming, ongoing, completed`);
    console.log(`   Mode types: online, offline, hybrid`);
    console.log("\n✨ All events are ready!");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seeder
seedEvents();
