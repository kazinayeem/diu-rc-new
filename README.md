# Daffodil International University Robotics Club Website

A comprehensive, fully dynamic website for the Daffodil International University Robotics Club built with Next.js 14 (App Router), Tailwind CSS, MongoDB/Mongoose, and NextAuth.

## 🚀 Features

### Public Website
- **Homepage** with club introduction, mission, vision, and achievements
- **Dynamic Sections** for:
  - Seminars
  - Events
  - Workshops
  - Research projects
  - Club members preview
- **Responsive UI** with modern Tailwind CSS design
- **Clean, Premium UI** inspired by modern design systems

### Admin Dashboard
- **Member Management**
  - Register Main, Executive, Deputy, and General Members
  - Role-based access control
  - Full CRUD operations
- **Content Management**
  - Post Seminars
  - Post Events
  - Post Notices
  - Post Research activities
  - Post Gallery images
  - Full CRUD operations from dashboard
- **Dashboard Features**
  - Secure authentication with NextAuth
  - Modern Sidebar + Topbar UI
  - Analytics cards for member stats
  - Table management with pagination
  - Cloudinary image upload integration

## 📁 Project Structure

```
diu-rc/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # NextAuth routes
│   │   ├── members/           # Member CRUD
│   │   ├── events/            # Event CRUD
│   │   ├── seminars/          # Seminar CRUD
│   │   ├── notices/           # Notice CRUD
│   │   ├── posts/             # Post CRUD
│   │   ├── gallery/           # Gallery CRUD
│   │   ├── upload/            # Image upload
│   │   └── admin/             # Admin routes
│   ├── admin/                 # Admin dashboard pages
│   │   ├── login/             # Admin login
│   │   ├── members/            # Member management
│   │   ├── events/             # Event management
│   │   ├── seminars/           # Seminar management
│   │   └── ...                 # Other admin pages
│   ├── events/                 # Public events page
│   ├── seminars/               # Public seminars page
│   ├── members/                # Public members page
│   ├── gallery/                # Public gallery page
│   ├── research/               # Public research page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   ├── admin/                  # Admin components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── AnalyticsCard.tsx
│   │   ├── DataTable.tsx
│   │   └── forms/              # Admin forms
│   ├── public/                 # Public components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── EventCard.tsx
│   │   ├── SeminarCard.tsx
│   │   └── MemberCard.tsx
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── providers/               # Context providers
│       └── SessionProvider.tsx
├── lib/
│   ├── models/                 # Mongoose models
│   │   ├── Member.ts
│   │   ├── Event.ts
│   │   ├── Seminar.ts
│   │   ├── Notice.ts
│   │   ├── Post.ts
│   │   ├── Gallery.ts
│   │   └── Admin.ts
│   ├── db.ts                   # MongoDB connection
│   ├── auth.ts                 # NextAuth configuration
│   ├── cloudinary.ts           # Cloudinary integration
│   ├── utils.ts                # Utility functions
│   └── middleware.ts           # Auth middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🗄️ Database Models

### Member
- Personal information (name, studentId, email, phone)
- Role (main, executive, deputy, general)
- Department, batch, position
- Bio, social links, profile image
- Active status, join date

### Event
- Title, description, content
- Event date, time, location
- Registration link
- Status (upcoming, ongoing, completed, cancelled)
- Featured flag, attendees count
- Tags, image

### Seminar
- Title, description, content
- Seminar date, time, location
- Speaker information (name, bio, image)
- Registration link
- Status, featured flag
- Tags, image

### Notice
- Title, content
- Type (general, important, urgent)
- Priority, active status
- Expiration date
- Attachment

### Post
- Title, slug, excerpt, content
- Category (research, project, achievement, news, blog)
- Status (draft, published, archived)
- Featured flag, views count
- Tags, image
- Author reference

### Gallery
- Title, description
- Image URL
- Category (event, workshop, seminar, project, general)
- Featured flag
- Uploader reference

### Admin
- Name, email, password (hashed)
- Role (super-admin, admin, moderator)
- Active status
- Last login timestamp

## 🔌 API Routes

### Public Routes
- `GET /api/members` - Get all members (with filters)
- `GET /api/events` - Get all events
- `GET /api/seminars` - Get all seminars
- `GET /api/notices` - Get active notices
- `GET /api/posts` - Get published posts
- `GET /api/gallery` - Get gallery images

### Admin Routes (Protected)
- `POST /api/members` - Create member
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- Similar routes for seminars, notices, posts, gallery
- `POST /api/upload` - Upload image to Cloudinary
- `GET /api/admin/stats` - Get dashboard statistics

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diu-rc
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/diu-robotic-club
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # JWT
   JWT_SECRET=your-jwt-secret-key-here
   ```

4. **Run the development server**
  ## 🔁 State management and API (Redux + RTK Query)

  This project now uses Redux Toolkit and RTK Query for client-side API calls and caching.

  - Store configuration: `lib/store.ts` — the RTK Query API reducer and middleware are wired into the store and provided at the top level via `app/StoreProvider.tsx` (which is added to `app/layout.tsx`).
  - Central API: `lib/api/api.ts` — a single RTK Query `api` with endpoints defined for Members, Events, Seminars, Notices, Posts, Projects, Research Papers, Member Registrations, Workshops, Uploads and Admin stats.

  How to use the generated hooks in client components:

  1. Import the desired hook exported from `@/lib/api/api`. Hooks follow the naming convention:
     - Queries: `useGetMembersQuery`, `useGetEventsQuery`, etc.
     - Mutations: `useCreateMemberMutation`, `useUpdateEventMutation`, `useDeletePostMutation`, etc.

  2. Call the hook inside a client component:

  ```tsx
  import { useGetEventsQuery } from "@/lib/api/api";

  function LatestEvents() {
    const { data, isLoading } = useGetEventsQuery({ query: "limit=3&sort=latest" });
    const events = data?.data || [];

    if (isLoading) return <div>Loading…</div>;
    return <div>{events.map(e => <div key={e._id}>{e.title}</div>)}</div>;
  }
  ```

  Mutation example (in a form component):

  ```tsx
  import { useCreateEventMutation } from "@/lib/api/api";

  function EventForm() {
    const [createEvent, { isLoading }] = useCreateEventMutation();

    async function submit(data) {
      await createEvent(data).unwrap();
    }
  }
  ```

  If a mutation invalidates a tag (e.g., `Events`), any active queries that provide the same tag will automatically refetch.

  Migration notes:
  - I converted the main client-side API usage (admin forms/pages and public components) to use RTK Query hooks. Server-side data fetching (Next.js server components) still uses fetch — that is correct and appropriate for server-rendered data.
  - If you want more endpoints typed, replace the HOF `any` types in `lib/api/api.ts` with your domain models in `lib/models/*`.

  If you'd like, I can continue converting every single page to use RTK Query (there are some server-only fetches that remain intentionally server-side), add TypeScript models and runtime tests, or extract per-resource API files — tell me which next step you want.

  Note: I converted many client-side pages and admin screens to use the central RTK Query API and Redux. Files updated to use RTK Query/hooks include:

  - Public pages: `app/publications/page.tsx`, `app/projects/page.tsx`, `app/members/page.tsx`, `app/events/page.tsx`, `app/workshops/page.tsx`, `app/teams/page.tsx`, `components/public/LatestEvents.tsx`, `components/public/LatestWorkshops.tsx`.
  - Admin pages & forms: `app/admin/events/*`, `app/admin/members/*`, `app/admin/projects/*`, `app/admin/research/*`, `app/admin/seminars/*`, `app/admin/notices/*`, `app/admin/posts/*`, `app/admin/member-registrations/*`, `app/admin/workshops/*`.

  Client components now use RTK Query hooks (e.g. `useGetEventsQuery`, `useCreateEventMutation`) — any mutations invalidate tags and cause automatic refetches.

  Remaining server-side fetches (kept intentionally server-rendered): `app/page.tsx`, `app/seminars/page.tsx`, `app/research/page.tsx`. These are server components and fetching on the server is correct — if you'd like them converted to client + RTK Query instead, I can do that next.

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Creating the First Admin User

You'll need to create an admin user manually in MongoDB or create a script:

```javascript
// scripts/create-admin.js
const mongoose = require('mongoose');
const Admin = require('./lib/models/Admin');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const admin = new Admin({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // Will be hashed automatically
    role: 'super-admin',
    isActive: true,
  });
  
  await admin.save();
  console.log('Admin created successfully!');
  process.exit();
}

createAdmin();
```

## 🎨 UI Components

### Public Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Site footer with links and contact info
- **Hero** - Eye-catching hero section
- **EventCard** - Event display card
- **SeminarCard** - Seminar display card
- **MemberCard** - Member profile card

### Admin Components
- **Sidebar** - Admin navigation sidebar
- **Topbar** - Admin header with search and user info
- **AnalyticsCard** - Dashboard statistics card
- **DataTable** - Reusable data table with pagination
- **Forms** - CRUD forms for all entities

## 🔐 Authentication

The application uses NextAuth.js for authentication:
- JWT-based sessions
- Credentials provider
- Protected admin routes
- Session management

## 📦 Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication
- **Cloudinary** - Image hosting and management
- **Lucide React** - Icon library

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Ensure Node.js 18+ is supported
- Set all environment variables
- Build command: `npm run build`
- Start command: `npm start`

## 📝 License

This project is created for Daffodil International University Robotics Club.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or support, contact the Daffodil International University Robotics Club.

---

Built with ❤️ for Daffodil International University Robotics Club

