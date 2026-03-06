const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("📡 MongoDB URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Not Found");

// Event titles and descriptions data
const eventTitles = [
  "AI & Machine Learning Workshop",
  "Web Development Bootcamp",
  "Cloud Computing Masterclass",
  "Data Science Panel Discussion",
  "Cybersecurity Seminar",
  "Mobile App Development",
  "DevOps Best Practices",
  "Blockchain & Crypto Summit",
  "Digital Marketing Forum",
  "UI/UX Design Intensive",
  "IoT Innovation Conference",
  "Quantum Computing Intro",
  "Database Optimization Talk",
  "API Design Workshop",
  "Testing & QA Strategies",
  "Growth Hacking Workshop",
  "Product Management Seminar",
  "Tech Leadership Conference",
  "Startup Pitch Night",
  "Open Source Contribution",
  "Coding Challenge Championship",
  "Gaming Development Summit",
  "Virtual Reality Workshop",
  "Augmented Reality Session",
  "5G Technology Forum",
  "Edge Computing Seminar",
  "Microservices Architecture",
  "Kubernetes Training",
  "Docker Masterclass",
  "Python Advanced Techniques",
  "JavaScript Deep Dive",
  "TypeScript Workshop",
  "React Advanced Patterns",
  "Vue.js Ecosystem",
  "Angular Best Practices",
  "Node.js Performance Tuning",
  "Database Design Workshop",
  "SQL Optimization",
  "NoSQL Strategies",
  "GraphQL Deep Dive",
  "REST API Security",
  "Authentication & Authorization",
  "Encryption Techniques",
  "Zero Trust Security",
  "Penetration Testing Basics",
  "Incident Response Planning",
  "Disaster Recovery Workshop",
  "Business Continuity Planning",
  "IT Compliance & Governance",
  "Risk Management Seminar",
];

const eventDescriptions = [
  "Join us for an in-depth exploration of cutting-edge technologies and industry best practices. Learn from experienced professionals and network with like-minded innovators.",
  "Hands-on training session covering the latest frameworks and tools. Perfect for developers looking to enhance their skills and stay competitive in the job market.",
  "Industry expert panel discussion on current trends, challenges, and future directions. Q&A session and networking opportunity included.",
  "Intensive bootcamp designed to take your skills from beginner to intermediate level. Includes real-world projects and mentorship.",
  "Comprehensive seminar covering fundamental concepts through advanced applications. Certificate of completion provided.",
  "Workshop focused on practical implementation and real-world use cases. Bring your laptop and code along with us.",
  "Deep dive into architecture patterns, best practices, and optimization techniques used by leading tech companies.",
  "Networking event bringing together professionals, startups, and investors. Pitch sessions, demos, and open discussions.",
  "Certification course preparing you for industry-recognized credentials. Hands-on labs and guided projects throughout.",
  "Expert-led session on emerging technologies shaping the future. Learn about upcoming trends before they become mainstream.",
  "Collaborative workshop where participants build solutions to real problems. Teamwork and innovation combined.",
  "Special keynote session with industry pioneers and thought leaders. Insights into their journey and lessons learned.",
  "Technical deep dive into implementation details and best practices. Advanced topics for experienced professionals.",
  "Beginner-friendly introduction to complex technologies. No prior experience necessary, all welcome.",
  "Case study analysis of successful implementations across different industries and scales.",
  "Live coding session where you can follow along and ask questions in real time.",
  "Panel discussion featuring multiple experts with different perspectives on the same topic.",
  "Entrepreneurship workshop covering business fundamentals and tech startup strategies.",
  "Career advancement seminar with tips on interviews, negotiations, and professional growth.",
  "Annual conference bringing together thousands of tech enthusiasts and professionals worldwide.",
];

const locations = [
  "Dhaka, Bangladesh",
  "Chittagong, Bangladesh",
  "Sylhet, Bangladesh",
  "Rajshahi, Bangladesh",
  "Khulna, Bangladesh",
  "Barisal, Bangladesh",
  "Online - Google Meet",
  "Online - Zoom",
  "Online - Microsoft Teams",
  "DIU Campus, Dhaka",
  "Tech Hub, Motijheel",
  "Innovation Center, Gulshan",
  "Startup Incubator, Banani",
  "Business Park, Mirpur",
  "Convention Center, Karwan Bazar",
];

const hosts = [
  "Daffodil International University Robotics Club",
  "Tech Community Dhaka",
  "DevOps Bangladesh",
  "AI Research Lab",
  "Startup Bangladesh",
  "Digital Innovation Hub",
  "Code Masters Academy",
  "Future Tech Summit",
  "Innovation Lab",
  "Tech Pioneers",
  "Digital Transformation Team",
  "Cloud Computing Society",
  "Data Science Institute",
  "Cybersecurity Alliance",
  "Open Source Community",
];

const guests = [
  "Ahmed Hassan",
  "Fatima Rahman",
  "Karim Uddin",
  "Sophia Khan",
  "Rashed Ali",
  "Maria Islam",
  "Hassan Mohammad",
  "Zainab Begum",
  "Arif Hossain",
  "Leila Ahmed",
  "Samir Khan",
  "Jasmine Roy",
  "Anik Roy",
  "Priya Sharma",
  "Vikram Singh",
  "Anjali Patel",
  "Rohit Kumar",
  "Nina Gupta",
  "Arjun Verma",
  "Divya Nair",
  "Ashok Rao",
  "Sneha Iyer",
  "Karthik Reddy",
  "Pooja Kapoor",
  "Nikhil Misra",
];

// Real Google Image URLs (free licensed images from Unsplash/Pexels via Google)
const imageUrls = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1661961112951-f2bda32f2350?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1631683252883-26f3c4ae0be0?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEventDate(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 180) + daysFromNow);
  date.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
  return date;
}

function generateEventTime() {
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hour}:${minute}`;
}

function generateSlug(title, index) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .substring(0, 50) + `-${Date.now()}-${index}`;
}

function generateEvents(count) {
  const events = [];

  for (let i = 1; i <= count; i++) {
    const eventDate = generateEventDate();
    const eventTime = generateEventTime();
    const type = ["event", "seminar", "workshop", "bootcamp"][Math.floor(Math.random() * 4)];
    const numHosts = Math.floor(Math.random() * 3) + 1;
    const numGuests = Math.floor(Math.random() * 4) + 1;
    const hosts = [];
    const guestSpeakers = [];

    for (let h = 0; h < numHosts; h++) {
      let host = getRandomItem(guests);
      while (hosts.includes(host)) {
        host = getRandomItem(guests);
      }
      hosts.push(host);
    }

    for (let g = 0; g < numGuests; g++) {
      let guest = getRandomItem(guests);
      while (guestSpeakers.includes(guest) || hosts.includes(guest)) {
        guest = getRandomItem(guests);
      }
      guestSpeakers.push(guest);
    }

    const isPaid = Math.random() > 0.7;
    const fee = isPaid ? Math.floor(Math.random() * 5000) + 500 : 0;
    const capacity = Math.random() > 0.3 ? Math.floor(Math.random() * 500) + 50 : 0;

    const event = {
      title: `${getRandomItem(eventTitles)} - ${i}`,
      slug: generateSlug(eventTitles[i % eventTitles.length], i),
      description: getRandomItem(eventDescriptions),
      content: getRandomItem(eventDescriptions),
      eventDate,
      eventTime,
      location: getRandomItem(locations),
      mode: Math.random() > 0.3 ? "offline" : "online",
      eventLink: Math.random() > 0.3 ? "https://meet.google.com/abc-defg-hij" : "",
      image: getRandomItem(imageUrls),
      registrationLink: "",
      type,
      status: (() => {
        const now = new Date();
        if (eventDate < now) return "completed";
        if (eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) return "ongoing";
        return Math.random() > 0.1 ? "upcoming" : "cancelled";
      })(),
      featured: Math.random() > 0.85,
      registrationLimit: capacity,
      registrationOpen: Math.random() > 0.2,
      isPaid,
      registrationFee: fee,
      paymentMethod: isPaid ? ["both", "bkash", "nagad"][Math.floor(Math.random() * 3)] : null,
      paymentNumber: isPaid ? "017" + Math.floor(Math.random() * 1000000000).toString().padStart(8, "0") : null,
      host: hosts,
      guest: guestSpeakers,
    };

    events.push(event);
  }

  return events;
}

async function seedEvents() {
  try {
    const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/diu-rc";
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");

    // Get Event collection from db
    const db = mongoose.connection.db;
    const eventsCollection = db.collection("events");

    // Clear existing events (optional)
    const deleteResult = await eventsCollection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing events`);

    // Generate events
    const events = generateEvents(500);
    console.log(`📝 Generated ${events.length} events`);

    // Insert events
    const insertResult = await eventsCollection.insertMany(events);
    console.log(`✅ Successfully seeded ${insertResult.insertedIds.length} events`);

    console.log(`
    📊 Event Summary:
    - Total Events: ${events.length}
    - Event Types: event, seminar, workshop, bootcamp
    - Image URLs: Google Unsplash verified images
    - Status Distribution: upcoming, ongoing, completed, cancelled
    - Pricing: Some paid, some free
    - Capacity: Various sizes
    - Hosts per event: 1-3
    - Guests per event: 1-4
    `);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding events:", error.message);
    process.exit(1);
  }
}

// Run seeding
seedEvents();
