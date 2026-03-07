# Quick Certificate Generation Checklist

## Required for Each Certificate

✅ **Certificate Image** - The most important part!
- Must include recipient name embedded in the image
- Must include event name
- Must include issue date
- Should look like the actual certificate

## Quick Steps

### 1. Design Certificate (Use Canva or Similar)
1. Open your certificate template (ce.png)
2. Add recipient name: **"Masrufa Tainim"**
3. Add event: **"Robo Camp 2025"**
4. Add role/description: **"has served as a Judge for the Project Showcasing"**
5. Add date: **"March 7, 2026"**
6. Export as PNG

### 2. Upload Certificate Image
- Upload to Cloudinary, AWS S3, or `/public/certificates/`
- Get the URL: `https://yourcdn.com/certificates/cert-001.png`

### 3. Create Certificate Record in Admin Panel
- Certificate ID: `DIURCRC2026001`
- Recipient Name: `Masrufa Tainim`
- Recipient Email: `masrufa@example.com`
- Event: `Robo Camp 2025`
- Event Type: `bootcamp`
- Issue Date: `2026-03-07`
- **Certificate Image URL**: `https://yourcdn.com/certificates/cert-001.png`

### 4. Test Verification
- Go to `/verify`
- Enter: `DIURCRC2026001`
- You should see the certificate image with all data visible!

## Example Template Variables

When creating certificate designs, include these fields:

```
Recipient Name: [Dynamic - Changes per certificate]
Event: [Dynamic - Changes per certificate]  
Date: [Dynamic - Changes per certificate]
Certificate ID: [Dynamic - Unique per certificate]

Organization: DIU Robotics Club [Static]
Signatures: [Static - Can be on template]
Logos: [Static - Can be on template]
```

## Bulk Certificate Generation

For multiple certificates at once:

1. **Using Canva Bulk Create:**
   - Create CSV with columns: name, event, date, id
   - Upload to Canva
   - Generate all certificates at once
   - Download zip file with all images

2. **Using Google Sheets + Automation:**
   - Prepare data in Google Sheets
   - Use Google Slides template
   - Use "Autocrat" or "Form Publisher" add-ons
   - Export all as images

3. **Using Code (Advanced):**
   - See CERTIFICATE_IMAGE_GENERATION.md
   - Implement automated generation API
   - Generate on certificate creation

## Common Mistakes to Avoid

❌ Using the blank template (/ce.png) for all certificates
❌ Storing only data without certificate image
❌ Forgetting to upload the generated certificate image
❌ Using the same image URL for multiple certificates

✅ Each certificate = Unique image with data embedded
✅ Upload image first, then create database record
✅ Test verification after creating each batch
✅ Keep backups of all certificate images

## File Naming Convention

```
cert-DIURCRC2026001.png  ← Certificate for ID: DIURCRC2026001
cert-DIURCCLF2025002.png ← Certificate for ID: DIURCCLF2025002
cert-DIURC3DF2025001.png ← Certificate for ID: DIURC3DF2025001
```

This way, you can easily find and match certificate images to their records!
