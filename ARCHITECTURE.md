# Architecture Documentation

## System Architecture

### Overview
The DIU Robotic Club Website is built using a modern full-stack architecture with Next.js 14 App Router, providing both server-side rendering and client-side interactivity.

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication and session management
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Services
- **Cloudinary** - Image hosting and CDN

## Project Structure

```
diu-rc/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes (backend)
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── members/              # Member management API
│   │   ├── events/               # Event management API
│   │   ├── seminars/              # Seminar management API
│   │   ├── notices/              # Notice management API
│   │   ├── posts/                # Post management API
│   │   ├── gallery/               # Gallery management API
│   │   ├── upload/                # Image upload endpoint
│   │   └── admin/                 # Admin-specific endpoints
│   ├── admin/                     # Admin dashboard pages
│   │   ├── layout.tsx             # Admin layout with sidebar
│   │   ├── login/                 # Admin login page
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── members/               # Member management page
│   │   ├── events/                 # Event management page
│   │   ├── seminars/               # Seminar management page
│   │   ├── notices/                # Notice management page
│   │   ├── posts/                  # Post management page
│   │   ├── gallery/                # Gallery management page
│   │   └── settings/               # Settings page
│   ├── events/                    # Public events page
│   ├── seminars/                   # Public seminars page
│   ├── members/                    # Public members page
│   ├── gallery/                    # Public gallery page
│   ├── research/                   # Public research page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Homepage
│   └── globals.css                 # Global styles
├── components/                     # React components
│   ├── admin/                      # Admin dashboard components
│   │   ├── Sidebar.tsx             # Admin sidebar navigation
│   │   ├── Topbar.tsx              # Admin top bar
│   │   ├── AnalyticsCard.tsx       # Dashboard stat cards
│   │   ├── DataTable.tsx           # Reusable data table
│   │   └── forms/                  # Admin forms
│   │       ├── MemberForm.tsx
│   │       └── EventForm.tsx
│   ├── public/                     # Public website components
│   │   ├── Navbar.tsx              # Site navigation
│   │   ├── Footer.tsx              # Site footer
│   │   ├── Hero.tsx                # Hero section
│   │   ├── EventCard.tsx           # Event display card
│   │   ├── SeminarCard.tsx         # Seminar display card
│   │   └── MemberCard.tsx          # Member profile card
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx              # Button component
│   │   └── Card.tsx                # Card component
│   └── providers/                  # Context providers
│       └── SessionProvider.tsx     # NextAuth session provider
├── lib/                            # Utility libraries
│   ├── models/                     # Mongoose models
│   │   ├── Member.ts               # Member schema
│   │   ├── Event.ts                # Event schema
│   │   ├── Seminar.ts              # Seminar schema
│   │   ├── Notice.ts               # Notice schema
│   │   ├── Post.ts                 # Post schema
│   │   ├── Gallery.ts              # Gallery schema
│   │   └── Admin.ts                # Admin schema
│   ├── db.ts                       # MongoDB connection
│   ├── auth.ts                     # NextAuth configuration
│   ├── cloudinary.ts               # Cloudinary integration
│   ├── utils.ts                    # Utility functions
│   └── middleware.ts               # Auth middleware
├── types/                          # TypeScript type definitions
│   └── next-auth.d.ts              # NextAuth type extensions
└── public/                         # Static assets
```

## Data Flow

### Public Pages
1. User visits a public page (e.g., `/events`)
2. Next.js Server Component fetches data from API
3. Data is rendered on the server
4. Page is sent to client with pre-rendered content

### Admin Dashboard
1. User attempts to access admin route
2. Layout checks authentication via `getServerSession`
3. If authenticated, render admin dashboard
4. Client-side components fetch data via API routes
5. Forms submit data to API routes
6. API routes validate and save to MongoDB

## API Design

### RESTful Endpoints

#### Members
- `GET /api/members` - List all members (with pagination and filters)
- `GET /api/members/[id]` - Get single member
- `POST /api/members` - Create member (admin only)
- `PUT /api/members/[id]` - Update member (admin only)
- `DELETE /api/members/[id]` - Delete member (admin only)

#### Events
- `GET /api/events` - List all events
- `GET /api/events/[id]` - Get single event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/[id]` - Update event (admin only)
- `DELETE /api/events/[id]` - Delete event (admin only)

Similar patterns for Seminars, Notices, Posts, and Gallery.

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints
- Uses JWT strategy for sessions
- Credentials provider for admin login

## Database Schema

### Member
```typescript
{
  name: string;
  studentId: string (unique);
  email: string (unique);
  phone: string;
  role: 'main' | 'executive' | 'deputy' | 'general';
  position?: string;
  department: string;
  batch: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  isActive: boolean;
  joinedAt: Date;
  timestamps: true
}
```

### Event
```typescript
{
  title: string;
  slug: string (unique);
  description: string;
  content?: string;
  image?: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  registrationLink?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  attendees?: number;
  tags?: string[];
  createdBy: ObjectId (ref: Admin);
  timestamps: true
}
```

Similar schemas for Seminar, Notice, Post, Gallery, and Admin.

## Security

### Authentication
- NextAuth.js handles authentication
- JWT tokens for session management
- Password hashing with bcryptjs
- Protected admin routes via middleware

### Authorization
- Role-based access control (super-admin, admin, moderator)
- API routes check session before allowing modifications
- Public routes are read-only

### Data Validation
- Mongoose schema validation
- TypeScript type checking
- Input sanitization in forms

## Performance Optimizations

1. **Server-Side Rendering** - Public pages are pre-rendered
2. **Image Optimization** - Next.js Image component with Cloudinary
3. **Database Indexing** - Indexes on frequently queried fields
4. **Pagination** - Large datasets are paginated
5. **Caching** - API responses can be cached where appropriate

## Deployment Considerations

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `CLOUDINARY_*` - Cloudinary credentials

### Build Process
1. TypeScript compilation
2. Next.js build
3. Static optimization
4. Server-side code bundling

## Future Enhancements

1. **Email Notifications** - Send emails for events/notices
2. **Search Functionality** - Full-text search
3. **File Uploads** - Support for PDFs and documents
4. **Analytics** - Track page views and user engagement
5. **Multi-language Support** - Internationalization
6. **Mobile App** - React Native companion app

