const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("📡 MongoDB URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Not Found");

// Event Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  content: { type: String },
  image: { type: String },
  eventDate: { type: Date, required: true },
  eventTime: { type: String },
  location: { type: String },
  mode: { type: String, enum: ['online', 'offline'] },
  eventLink: { type: String },
  type: { type: String, enum: ['event', 'workshop', 'seminar', 'bootcamp'], required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  featured: { type: Boolean, default: false },
  registrationOpen: { type: Boolean, default: true },
  registrationLimit: { type: Number, min: 0 },
  isPaid: { type: Boolean, default: false },
  registrationFee: { type: Number, min: 0, default: 0 },
  paymentMethods: [{
    method: { type: String, enum: ['bkash', 'nagad'] },
    number: { type: String },
    instructions: { type: String }
  }],
  hosts: [{
    name: { type: String },
    designation: { type: String },
    image: { type: String }
  }],
  guests: [{
    name: { type: String },
    designation: { type: String },
    image: { type: String }
  }],
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

// Sample data arrays
const titles = {
  event: [
    "AI Innovation Summit", "Tech Career Fair", "Student Coding Competition",
    "Industry Networking Night", "Research Symposium", "Tech Talk Series",
    "Alumni Meetup", "Project Showcase", "Hackathon Finals", "Tech Fest",
    "Innovation Challenge", "Demo Day", "Open House", "Science Fair",
    "Engineering Expo", "Tech Quiz Competition", "Ideation Workshop",
    "Pitch Competition", "Career Guidance Session", "Industry Visit"
  ],
  seminar: [
    "Machine Learning Fundamentals", "Cloud Computing Architecture", 
    "Cybersecurity Best Practices", "Data Science Applications",
    "Blockchain Technology", "IoT Innovations", "Quantum Computing Intro",
    "5G Technology", "Edge Computing", "Digital Transformation",
    "AI Ethics & Privacy", "Big Data Analytics", "Computer Vision",
    "Natural Language Processing", "Robotics & Automation",
    "Smart City Solutions", "Fintech Revolution", "Healthcare Technology",
    "Sustainable Tech", "Future of Work"
  ],
  workshop: [
    "Web Development Bootcamp", "Mobile App Development", "Python Programming",
    "JavaScript Mastery", "React Deep Dive", "Node.js Backend",
    "Database Design", "API Development", "DevOps Practices",
    "Docker & Kubernetes", "Git & GitHub", "UI/UX Design",
    "Figma Workshop", "Testing & QA", "System Design",
    "Microservices Architecture", "GraphQL Implementation", "AWS Cloud",
    "Firebase Integration", "Flutter Development"
  ],
  bootcamp: [
    "Full Stack Development", "Data Science Intensive", "Cybersecurity Training",
    "Machine Learning Bootcamp", "Cloud Engineering", "DevOps Certification",
    "Mobile Development Track", "AI Engineering", "Blockchain Development",
    "Game Development", "Digital Marketing", "Product Management",
    "Ethical Hacking", "Network Security", "Systems Administration",
    "Database Administration", "Business Intelligence", "Robotics Engineering",
    "3D Modeling & Animation", "Video Production"
  ]
};

const descriptions = [
  "Join us for an immersive learning experience with industry experts. Network with professionals and enhance your skills through hands-on projects.",
  "Comprehensive session covering essential concepts and practical applications. Perfect for students and professionals looking to advance their careers.",
  "Interactive program designed to provide in-depth knowledge and real-world experience. Certificate of completion provided to all participants.",
  "Learn from the best in the industry through live demonstrations, case studies, and Q&A sessions. Limited seats available.",
  "Intensive training program with mentorship opportunities. Build portfolio projects and connect with potential employers.",
  "Expert-led session focusing on current industry trends and future technologies. Includes hands-on labs and practical exercises.",
  "Collaborative learning environment with peer-to-peer interaction. Work on real projects and gain practical experience.",
  "Deep dive into advanced topics with experienced instructors. Suitable for intermediate to advanced learners.",
  "Beginner-friendly program covering fundamentals to advanced concepts. No prior experience required.",
  "Career-focused training with job placement assistance. Includes resume building and interview preparation."
];

const locations = [
  "DIU Permanent Campus, Ashulia", "DIU Main Campus, Dhanmondi", 
  "DIU City Campus, Panthapath", "Online (Zoom)", "Online (Google Meet)",
  "DIU Auditorium", "DIU Seminar Hall", "DIU Computer Lab",
  "DIU Conference Room", "DIU Innovation Hub"
];

const content = `<h2>About This Program</h2>
<p>This comprehensive program is designed to provide participants with cutting-edge knowledge and practical skills in their chosen field. Through a combination of lectures, hands-on exercises, and real-world projects, participants will gain the expertise needed to excel in today's competitive tech landscape.</p>

<h3>What You'll Learn</h3>
<ul>
<li>Core concepts and fundamental principles</li>
<li>Industry best practices and standards</li>
<li>Hands-on implementation techniques</li>
<li>Real-world problem-solving strategies</li>
<li>Latest tools and technologies</li>
</ul>

<h3>Prerequisites</h3>
<p>Basic computer literacy and enthusiasm to learn. Specific technical requirements will be communicated before the event starts.</p>

<h3>What to Bring</h3>
<ul>
<li>Laptop (if applicable)</li>
<li>Notebook and pen</li>
<li>Enthusiasm and curiosity</li>
</ul>`;

const hosts = [
  { name: "Dr. Ahmed Rahman", designation: "Professor, CSE Department", image: "" },
  { name: "Prof. Sarah Khan", designation: "Head of Department", image: "" },
  { name: "Dr. Mahmud Hassan", designation: "Associate Professor", image: "" },
  { name: "Prof. Fatima Ahmed", designation: "Senior Faculty Member", image: "" },
  { name: "Dr. Kamal Hossain", designation: "Assistant Professor", image: "" }
];

const guests = [
  { name: "John Smith", designation: "Senior Software Engineer, Google", image: "" },
  { name: "Jane Doe", designation: "Tech Lead, Microsoft", image: "" },
  { name: "Ali Ahmed", designation: "CTO, TechCorp", image: "" },
  { name: "Maria Garcia", designation: "Product Manager, Amazon", image: "" },
  { name: "David Chen", designation: "Data Scientist, Meta", image: "" },
  { name: "Sarah Johnson", designation: "DevOps Engineer, Netflix", image: "" }
];

const tags = [
  ['programming', 'development', 'coding'],
  ['ai', 'machine-learning', 'data-science'],
  ['web', 'frontend', 'backend'],
  ['mobile', 'android', 'ios'],
  ['cloud', 'aws', 'devops'],
  ['security', 'cybersecurity', 'ethical-hacking'],
  ['database', 'sql', 'nosql'],
  ['blockchain', 'crypto', 'web3'],
  ['iot', 'embedded', 'hardware'],
  ['networking', 'infrastructure', 'systems']
];

const paymentMethods = [
  { method: 'bkash', number: '01712345678', instructions: 'Send money to this number and enter the transaction ID' },
  { method: 'nagad', number: '01812345678', instructions: 'Send money via Nagad and provide the transaction ID' }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomTime() {
  const hours = Math.floor(Math.random() * 12) + 9; // 9 AM to 9 PM
  const minutes = Math.random() > 0.5 ? '00' : '30';
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes} ${period}`;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seedEvents() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear all existing events
    console.log("🗑️  Removing all existing events...");
    const deleteResult = await Event.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing events`);

    const now = new Date();
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const allEvents = [];
    let counter = 0;

    // Create events for each type
    for (const type of ['event', 'seminar', 'workshop', 'bootcamp']) {
      console.log(`\n📝 Creating 100 ${type}s...`);
      
      for (let i = 0; i < 100; i++) {
        const titlePool = titles[type];
        const baseTitle = titlePool[i % titlePool.length];
        const uniqueTitle = i < titlePool.length 
          ? baseTitle 
          : `${baseTitle} ${Math.floor(i / titlePool.length) + 1}`;
        
        const eventDate = randomDate(now, oneYearFromNow);
        const isPaid = Math.random() > 0.5; // 50% paid, 50% free
        const hasLimit = Math.random() > 0.3; // 70% have limits
        const isOnline = Math.random() > 0.5;
        const isFeatured = Math.random() > 0.9; // 10% featured
        
        const event = {
          title: uniqueTitle,
          slug: slugify(uniqueTitle) + '-' + Date.now() + '-' + counter++,
          description: randomElement(descriptions),
          content: content,
          image: `https://images.unsplash.com/photo-${1517486808712 + (i * 100000)}?w=800&q=80`,
          eventDate: eventDate,
          eventTime: randomTime(),
          location: isOnline ? 'Online' : randomElement(locations.filter(l => !l.includes('Online'))),
          mode: isOnline ? 'online' : 'offline',
          eventLink: isOnline ? `https://meet.google.com/${Math.random().toString(36).substring(7)}` : undefined,
          type: type,
          status: eventDate > now ? 'upcoming' : 'completed',
          featured: isFeatured,
          registrationOpen: eventDate > now,
          registrationLimit: hasLimit ? Math.floor(Math.random() * 100) + 20 : undefined,
          isPaid: isPaid,
          registrationFee: isPaid ? [100, 200, 300, 500, 1000, 1500, 2000][Math.floor(Math.random() * 7)] : 0,
          paymentMethods: isPaid ? paymentMethods : [],
          hosts: randomElements(hosts, Math.floor(Math.random() * 2) + 1),
          guests: Math.random() > 0.5 ? randomElements(guests, Math.floor(Math.random() * 2) + 1) : [],
          tags: randomElement(tags)
        };

        allEvents.push(event);
      }
    }

    // Insert all events
    console.log(`\n💾 Inserting ${allEvents.length} total events...`);
    await Event.insertMany(allEvents);
    
    console.log("\n✅ Seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Total Events: ${allEvents.length}`);
    console.log(`   - Events: 100`);
    console.log(`   - Seminars: 100`);
    console.log(`   - Workshops: 100`);
    console.log(`   - Bootcamps: 100`);
    console.log(`   - Paid Events: ${allEvents.filter(e => e.isPaid).length}`);
    console.log(`   - Free Events: ${allEvents.filter(e => !e.isPaid).length}`);
    console.log(`   - With Registration Limit: ${allEvents.filter(e => e.registrationLimit).length}`);
    console.log(`   - Unlimited Registration: ${allEvents.filter(e => !e.registrationLimit).length}`);
    console.log(`   - Featured: ${allEvents.filter(e => e.featured).length}`);

  } catch (error) {
    console.error("❌ Error seeding events:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
}

seedEvents();
