# Certificate Image Generation Guide

## Overview

For the verification system to work properly, each certificate should have a **unique image with the recipient's data embedded** (name, event, date, etc.) just like a real certificate.

## Two Approaches

### Approach 1: Manual Certificate Generation (Current)
1. Use design software (Canva, Photoshop, Figma) with the certificate template
2. Add recipient name, event details, date, etc. to the template
3. Export as PNG/JPG for each certificate
4. Upload to your server or cloud storage (Cloudinary, AWS S3, etc.)
5. Add the image URL when creating the certificate in admin panel

**Example workflow:**
- Template: `/public/ce.png` (blank template)
- Generated certificate: `https://yourcdn.com/certificates/cert-DIURCCLF2025001.png` (with data)

### Approach 2: Automated Certificate Generation (Recommended)

You can implement server-side certificate generation that overlays text on the template.

#### Option A: Using Canvas (Node.js)

```javascript
// Example: app/api/admin/certificates/generate/route.ts
import { createCanvas, loadImage, registerFont } from 'canvas';

export async function generateCertificate(data) {
  const canvas = createCanvas(1200, 850);
  const ctx = canvas.getContext('2d');
  
  // Load template
  const template = await loadImage('/public/ce.png');
  ctx.drawImage(template, 0, 0);
  
  // Add recipient name
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#1a365d';
  ctx.textAlign = 'center';
  ctx.fillText(data.recipientName, 600, 400);
  
  // Add event details
  ctx.font = '24px Arial';
  ctx.fillText(data.event, 600, 500);
  
  // Add date
  ctx.font = '18px Arial';
  ctx.fillText(new Date(data.issueDate).toLocaleDateString(), 600, 550);
  
  // Convert to buffer and upload
  const buffer = canvas.toBuffer('image/png');
  // Upload to Cloudinary or save to disk
  return uploadedUrl;
}
```

#### Option B: Using Puppeteer (HTML to Image)

```javascript
import puppeteer from 'puppeteer';

export async function generateCertificate(data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set certificate HTML with data
  await page.setContent(`
    <html>
      <body style="margin:0; background: url('/ce.png') center/cover;">
        <div style="text-align:center; padding-top: 300px;">
          <h1 style="font-size: 48px;">${data.recipientName}</h1>
          <p>${data.event}</p>
          <p>${new Date(data.issueDate).toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `);
  
  await page.setViewport({ width: 1200, height: 850 });
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();
  
  // Upload screenshot
  return uploadedUrl;
}
```

#### Option C: Using Sharp + SVG

```javascript
import sharp from 'sharp';

export async function generateCertificate(data) {
  const svg = `
    <svg width="1200" height="850">
      <!-- Background template -->
      <image href="/ce.png" x="0" y="0" width="1200" height="850"/>
      
      <!-- Recipient name -->
      <text x="600" y="400" 
            font-family="Arial" 
            font-size="48" 
            fill="#1a365d" 
            text-anchor="middle" 
            font-weight="bold">
        ${data.recipientName}
      </text>
      
      <!-- Event -->
      <text x="600" y="500" 
            font-family="Arial" 
            font-size="24" 
            fill="#1a365d" 
            text-anchor="middle">
        ${data.event}
      </text>
      
      <!-- Date -->
      <text x="600" y="550" 
            font-family="Arial" 
            font-size="18" 
            fill="#666" 
            text-anchor="middle">
        ${new Date(data.issueDate).toLocaleDateString()}
      </text>
    </svg>
  `;
  
  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();
    
  // Upload buffer
  return uploadedUrl;
}
```

## Integration with Admin Panel

### Automatic Generation on Certificate Creation

```javascript
// In app/api/admin/certificates/route.ts - POST handler

export async function POST(req: NextRequest) {
  // ... auth and validation ...
  
  // Generate certificate image with embedded data
  const certificateImageUrl = await generateCertificate({
    recipientName: body.recipientName,
    event: body.event,
    issueDate: body.issueDate,
    certificateId: body.certificateId,
  });
  
  // Create certificate record with generated image URL
  const certificate = await Certificate.create({
    ...body,
    certificateImageUrl, // Auto-generated image URL
    createdBy: session.user.id,
  });
  
  return NextResponse.json(certificate, { status: 201 });
}
```

## Current Setup

**Manual Upload Required:**
- Each certificate needs its image uploaded separately
- Store images in `/public/certificates/` or cloud storage
- Reference the URL when creating the certificate

**Example:**
1. Create certificate image with recipient data in Canva
2. Save as `cert-DIURCCLF2025001.png`
3. Upload to Cloudinary: `https://res.cloudinary.com/.../cert-DIURCCLF2025001.png`
4. Enter this URL in the admin form's "Certificate Image URL" field

## Quick Start (No Code Required)

### Using Canva
1. Go to Canva and upload the `ce.png` template
2. Add text layers for:
   - Recipient Name (center, large font)
   - Event Name
   - Date
   - Certificate ID
3. Export as PNG (high quality)
4. Upload to your hosting
5. Use the URL in the admin panel

### Bulk Certificates
For multiple certificates:
1. Use Canva's "Bulk Create" feature with a CSV file
2. Or use mail merge tools with Google Slides/PowerPoint
3. Export all as individual images
4. Upload to cloud storage
5. Import certificates via CSV with image URLs

## Storage Options

- **Cloudinary**: Free tier, easy API
- **AWS S3**: Scalable, reliable
- **Vercel Blob Storage**: Integrated with Next.js
- **Local `/public/certificates/`**: Simple, works for small scale

## Best Practices

1. **Image Quality**: Use at least 1200x850px for certificates
2. **File Format**: PNG for quality, JPG for smaller size
3. **Naming**: Use certificate ID in filename: `cert-{certificateId}.png`
4. **Backup**: Keep a backup of all generated certificates
5. **Version Control**: Store template versions separately

## Example Certificate Naming

```
cert-DIURCCLF2025001.png  → Competitive Line Follower Workshop
cert-DIURC3DF2025001.png  → 3D Design Workshop
cert-DIURCPCB2025001.png  → PCB Design Workshop
```

## Testing

After generating a certificate:
1. Go to `/verify`
2. Enter the certificate ID
3. Verify the image shows with all data correctly displayed
4. Check that the image loads quickly and looks professional
