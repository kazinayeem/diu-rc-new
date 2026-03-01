const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const guests = [
  "Ahmed Hassan", "Fatima Rahman", "Karim Uddin", "Sophia Khan", "Rashed Ali",
  "Maria Islam", "Hassan Mohammad", "Zainab Begum", "Arif Hossain", "Leila Ahmed",
  "Samir Khan", "Jasmine Roy", "Anik Roy", "Priya Sharma", "Vikram Singh",
  "Anjali Patel", "Rohit Kumar", "Nina Gupta", "Arjun Verma", "Divya Nair",
];

const imageUrls = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1661961112951-f2bda32f2350?w=800&q=80",
  "https://images.unsplash.com/photo-1631683252883-26f3c4ae0be0?w=800&q=80",
];

const descriptions = [
  "Master advanced techniques and best practices in this intensive seminar.",
  "Learn from industry experts about the latest trends and innovations.",
  "Hands-on workshop with real-world projects and practical applications.",
  "Interactive session covering fundamental to advanced concepts.",
  "Networking opportunity with professionals and thought leaders.",
  "In-depth exploration of cutting-edge technologies and frameworks.",
  "Expert-led discussion on practical implementation strategies.",
  "Comprehensive training program designed for skill development.",
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(title, type, index) {
  return `${type}-${title.toLowerCase().replace(/\s+/g, "-").substring(0, 30)}-${index}`;
}

function generateData(type, count) {
  const data = [];
  const titles = {
    seminar: [
      "AI Ethics & Responsible AI", "Cybersecurity Threats 2026", "Cloud Architecture",
      "Data Privacy Regulations", "Machine Learning Fundamentals", "DevOps Best Practices",
      "API Security Patterns", "Blockchain Basics", "IoT Solutions", "Web3 Overview"
    ],
    workshop: [
      "React Advanced Patterns", "Node.js Performance", "Docker Mastery", "Kubernetes Training",
      "GraphQL Deep Dive", "TypeScript Advanced", "Next.js Full Stack", "Python for Data Science",
      "Vue.js Ecosystem", "Android Development"
    ],
    bootcamp: [
      "Full Stack Development", "Data Science Bootcamp", "Cloud Engineering", "Mobile Development",
      "Cybersecurity Intensive", "AI/ML Engineering", "DevOps Fundamentals", "Game Development",
      "Blockchain Development", "Web3 Development"
    ]
  };

  const titleList = titles[type] || titles.seminar;

  for (let i = 1; i <= count; i++) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 180) + 10);

    const item = {
      title: `${titleList[i % titleList.length]} - ${i}`,
      slug: generateSlug(titleList[i % titleList.length], type, i),
      description: getRandomItem(descriptions),
      content: getRandomItem(descriptions),
      eventDate,
      eventTime: `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:00`,
      location: ["Dhaka", "Online", "DIU Campus", "Tech Hub"][Math.floor(Math.random() * 4)],
      mode: Math.random() > 0.3 ? "offline" : "online",
      eventLink: "https://meet.google.com/abc-defg-hij",
      image: getRandomItem(imageUrls),
      registrationLink: "",
      type: type === "seminar" ? "seminar" : type === "workshop" ? "workshop" : type === "bootcamp" ? "bootcamp" : "event",
      status: ["upcoming", "ongoing", "completed"][Math.floor(Math.random() * 3)],
      featured: Math.random() > 0.8,
      registrationLimit: Math.random() > 0.4 ? Math.floor(Math.random() * 200) + 50 : 0,
      registrationOpen: Math.random() > 0.2,
      isPaid: Math.random() > 0.6,
      registrationFee: Math.random() > 0.6 ? Math.floor(Math.random() * 5000) + 500 : 0,
      paymentMethod: ["both", "bkash", "nagad"][Math.floor(Math.random() * 3)],
      paymentNumber: "017" + Math.floor(Math.random() * 1000000000).toString().padStart(8, "0"),
      host: [
        getRandomItem(guests),
        getRandomItem(guests),
        getRandomItem(guests)
      ],
      guest: [
        getRandomItem(guests),
        getRandomItem(guests),
        getRandomItem(guests)
      ],
    };

    data.push(item);
  }

  return data;
}

async function seedData() {
  try {
    const dbUrl = process.env.MONGODB_URI;
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const eventsCollection = db.collection("events");

    // Generate and seed seminars
    console.log("📝 Generating 100 seminars...");
    const seminars = generateData("seminar", 100);
    await eventsCollection.insertMany(seminars);
    console.log("✅ 100 seminars seeded");

    // Generate and seed workshops
    console.log("📝 Generating 100 workshops...");
    const workshops = generateData("workshop", 100);
    await eventsCollection.insertMany(workshops);
    console.log("✅ 100 workshops seeded");

    // Generate and seed bootcamps
    console.log("📝 Generating 100 bootcamps...");
    const bootcamps = generateData("bootcamp", 100);
    await eventsCollection.insertMany(bootcamps);
    console.log("✅ 100 bootcamps seeded");

    console.log(`
    ✅ Successfully seeded:
    - 100 Seminars
    - 100 Workshops  
    - 100 Bootcamps
    
    Total: 300 programs with full data
    `);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

seedData();
