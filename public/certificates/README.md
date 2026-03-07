# Certificate Images Storage

This folder contains certificate images with recipient data embedded.

## File Naming Convention

Each certificate image should be named with its Certificate ID:

```
cert-DIURCCLF2025001.png
cert-DIURC3DF2025002.png
cert-DIURCPCB2025003.png
```

## Image Requirements

- **Format**: PNG (preferred) or JPG
- **Size**: Minimum 1200x850px (landscape)
- **Content**: Must include:
  - Recipient name
  - Event name
  - Issue date
  - Certificate ID
  - Club logos and signatures

## Example Certificate Structure

```
+------------------------------------------+
| DIU Robotics Club Logo                   |
|                                          |
|         CERTIFICATE                      |
|      of appreciation                     |
|                                          |
|      [Recipient Name]                    |
|                                          |
| has successfully completed the           |
| [Event Name]                             |
|                                          |
| Date: [Issue Date]                       |
| ID: [Certificate ID]                     |
|                                          |
| [Signatures]                             |
+------------------------------------------+
```

## Alternative Storage

For production, consider using:
- **Cloudinary**: `https://res.cloudinary.com/your-cloud/certificates/`
- **AWS S3**: `https://your-bucket.s3.amazonaws.com/certificates/`
- **Vercel Blob**: `https://your-blob.vercel-storage.com/certificates/`

Then reference these URLs in the admin panel when creating certificates.

## Important Notes

⚠️ **DO NOT** use the template file (ce.png) directly as a certificate.
✅ **DO** generate a unique image for each certificate with the data embedded.

See `/docs/CERTIFICATE_IMAGE_GENERATION.md` for more details.
