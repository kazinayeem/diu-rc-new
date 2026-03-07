# Certificate Management System

This project includes a complete certificate management and verification system for DIU Robotics Club.

## Important: Certificate Images

**⚠️ Each certificate must have a unique image with the recipient's data embedded**, similar to a real physical certificate. The certificate image should contain:
- Recipient name
- Event name and details
- Issue date
- Certificate ID
- Signatures and logos

See [CERTIFICATE_IMAGE_GENERATION.md](./CERTIFICATE_IMAGE_GENERATION.md) for detailed instructions on generating certificate images.

## Features

### Admin Panel
- **Certificates Section**: Manage all certificates from `/admin/certificates`
  - Create new certificates
  - Edit existing certificates
  - Delete certificates
  - Search and filter by event type
  - View all certificate details

### Certificate Fields
- Certificate ID (unique identifier)
- Recipient Name & Email
- Event Name & Type (workshop, seminar, bootcamp, competition, training, course, other)
- Category
- Issue Date
- Description
- Skills covered (comma-separated)
- Duration
- Instructor
- Certificate Image URL
- Active status

### Verification Page
- Public verification at `/verify`
- Search certificates by ID
- Display certificate details dynamically:
  - Certificate image (if available)
  - Recipient information
  - Event details
  - Skills covered
  - Issue date
  - Duration and instructor

## API Endpoints

### Admin Endpoints (Require Authentication)
- `GET /api/admin/certificates` - List all certificates (with pagination and filters)
- `POST /api/admin/certificates` - Create a new certificate
- `GET /api/admin/certificates/:id` - Get a single certificate
- `PUT /api/admin/certificates/:id` - Update a certificate
- `DELETE /api/admin/certificates/:id` - Delete a certificate

### Public Endpoint
- `GET /api/certificates/verify?id={certificateId}` - Verify a certificate by ID

## Database Model

The Certificate model includes:
```javascript
{
  certificateId: String (unique, uppercase),
  recipientName: String,
  recipientEmail: String,
  event: String,
  eventType: String (enum),
  category: String,
  issueDate: Date,
  description: String,
  skills: [String],
  duration: String,
  instructor: String,
  certificateImageUrl: String,
  isActive: Boolean,
  createdBy: ObjectId (ref: Admin),
  timestamps: true
}
```

## Seeding Data

To seed sample certificates:
```bash
node scripts/seed-certificates.js
```

This will create sample certificates for:
- Competitive Line Follower Workshop
- 3D Design to Fabrication Workshop
- PCB Design Workshop
- Advanced Robotics Seminar
- IoT Development Bootcamp

## Certificate Image

Place your certificate template image as `ce.png` in the `/public` directory. This image will be displayed on the verification page for certificates that have `certificateImageUrl` set to `/ce.png`.

## Sample Certificate IDs

After seeding, you can test with these IDs:
- DIURCCLF2025001
- DIURC3DF2025001
- DIURCPCB2025001
- DIURCSEM2025001
- DIURCBOOT2025001
