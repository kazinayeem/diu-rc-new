import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import * as XLSX from "xlsx";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import Admin from "@/lib/models/Admin";

// Helper to normalize column names
const normalizeColumnName = (col: string): string => {
  return col.toLowerCase().trim().replace(/\s+/g, "_");
};

// Map common column variations to our expected fields
const mapColumnToField = (columnName: string): string | null => {
  const normalized = normalizeColumnName(columnName);
  
  const columnMap: { [key: string]: string } = {
    // Certificate ID variations
    "id": "certificate_id",
    "certificate_id": "certificate_id",
    "cert_id": "certificate_id",
    "certificate_no": "certificate_id",
    "cert_no": "certificate_id",
    "certificate_number": "certificate_id",
    
    // Name Filled variations
    "name_filled_up": "name_filled",
    "name_filled": "name_filled",
    "filled_name": "name_filled",
    "certificate_name": "name_filled",
    
    // Name variations
    "name": "name",
    "recipient_name": "name",
    "student_name": "name",
    "full_name": "name",
    
    // Email variations
    "email": "email",
    "email_address": "email",
    "recipient_email": "email",
    "student_email": "email",
    
    // Workshop/Event variations
    "workshop": "workshop",
    "event": "workshop",
    "event_name": "workshop",
    "workshop_name": "workshop",
    "course": "workshop",
    "program": "workshop",
    
    // Date variations
    "date": "issue_date",
    "issue_date": "issue_date",
    "issued_date": "issue_date",
    "date_issued": "issue_date",
    "completion_date": "issue_date",
  };
  
  return columnMap[normalized] || null;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = (file.name || "").toLowerCase();
    const allowed = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    if (!allowed) {
      return NextResponse.json(
        { error: "Only .xlsx and .xls files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(Buffer.from(bytes), {
      type: "buffer",
      cellDates: false,
      raw: false,
    });

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      blankrows: true,
      raw: false,
    });

    // Filter out completely empty rows (where all columns are empty)
    const validRows = rows.filter(row => 
      Object.values(row).some(val => val && String(val).trim() !== "")
    );

    if (validRows.length === 0) {
      return NextResponse.json({ error: "No data rows found in Excel file" }, { status: 400 });
    }

    // Map the columns from the Excel file
    const firstRow = validRows[0];
    const columnMapping: { [excelCol: string]: string } = {};
    
    for (const excelCol of Object.keys(firstRow)) {
      const mappedField = mapColumnToField(excelCol);
      if (mappedField) {
        columnMapping[excelCol] = mappedField;
      }
    }

    // Validate that we have the required fields
    const mappedFields = Object.values(columnMapping);
    const requiredFields = ["certificate_id", "name", "email", "workshop", "issue_date"];
    const missingFields = requiredFields.filter(field => !mappedFields.includes(field));
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required columns: ${missingFields.join(", ")}. Please ensure your Excel file has columns for: Certificate ID, Name, Email, Workshop/Event, and Issue Date.`,
          requiredFields,
          detectedColumns: Object.keys(firstRow),
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the admin user ID from session
    const admin = await Admin.findOne({ email: session.user.email });
    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const documents = rows.map((row) => {
      const doc: any = {
        isActive: true,
        createdBy: admin._id,
      };
      
      for (const [excelCol, mappedField] of Object.entries(columnMapping)) {
        const value = String(row[excelCol] ?? "").trim();
        
        // Map imported fields to Certificate model fields
        if (mappedField === "certificate_id") {
          doc.certificateId = value.toUpperCase();
        } else if (mappedField === "name") {
          doc.recipientName = value;
        } else if (mappedField === "name_filled") {
          // Store as description if provided
          if (value) doc.description = value;
        } else if (mappedField === "email") {
          doc.recipientEmail = value.toLowerCase();
        } else if (mappedField === "workshop") {
          doc.event = value;
        } else if (mappedField === "issue_date") {
          // Parse the date - more lenient parsing
          const dateStr = value;
          let parsedDate: Date | null = null;
          
          // Try ISO format first (2026-04-05)
          if (parsedDate === null) {
            const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
            if (isoMatch) {
              parsedDate = new Date(isoMatch[0]);
            }
          }
          
          // Try MM/DD/YYYY format
          if (parsedDate === null) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              const m = parseInt(parts[0], 10);
              const d = parseInt(parts[1], 10);
              const y = parseInt(parts[2], 10);
              if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
                parsedDate = new Date(y, m - 1, d);
              }
            }
          }
          
          // Try DD/MM/YYYY format (common in some countries)
          if (parsedDate === null) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              const d = parseInt(parts[0], 10);
              const m = parseInt(parts[1], 10);
              const y = parseInt(parts[2], 10);
              if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d <= 31 && m <= 12) {
                parsedDate = new Date(y, m - 1, d);
              }
            }
          }
          
          // Use parsed date if valid, otherwise use current date
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            doc.issueDate = parsedDate;
          } else if (dateStr) {
            // Try generic date parsing as last resort
            const genericDate = new Date(dateStr);
            if (!isNaN(genericDate.getTime())) {
              doc.issueDate = genericDate;
            } else {
              // Default to current date if parsing fails
              doc.issueDate = new Date();
            }
          } else {
            // If no date value provided, use current date
            doc.issueDate = new Date();
          }
        }
      }
      
      // Set default eventType if not provided (can be updated later)
      if (!doc.eventType) {
        doc.eventType = "workshop";
      }
      
      return doc;
    });

    // Filter out invalid documents (missing required fields)
    const invalidDocuments = documents.filter(doc => 
      !doc.certificateId || !doc.recipientName || !doc.recipientEmail || !doc.event
    );
    
    const validDocuments = documents.filter(doc => 
      doc.certificateId && doc.recipientName && doc.recipientEmail && doc.event
    );

    const invalidCount = validDocuments.length === 0 && documents.length > 0 
      ? documents.length 
      : invalidDocuments.length;
      
    let importedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    // If all documents are invalid, return detailed error info
    if (validDocuments.length === 0 && documents.length > 0) {
      // Check what's wrong
      const sampleInvalid = documents[0];
      return NextResponse.json(
        {
          error: "All rows have missing required fields. Check your column names.",
          debug: {
            columnMapping,
            detectedColumns: Object.keys(firstRow),
            sampleRow: {
              certificateId: sampleInvalid.certificateId,
              recipientName: sampleInvalid.recipientName,
              recipientEmail: sampleInvalid.recipientEmail,
              event: sampleInvalid.event,
              issueDate: sampleInvalid.issueDate,
            },
            totalRowsAttempted: documents.length,
          },
          requiredFields: ["certificate_id", "name", "email", "workshop", "issue_date"],
          hint: "Make sure your Excel columns match one of the accepted names shown in the Format Guide.",
        },
        { status: 400 }
      );
    }

    // Insert valid documents one by one to track duplicates
    for (const doc of validDocuments) {
      try {
        // Check if certificate already exists
        const existing = await Certificate.findOne({ certificateId: doc.certificateId });
        if (existing) {
          duplicateCount++;
          continue;
        }
        
        await Certificate.create(doc);
        importedCount++;
      } catch (error) {
        errorCount++;
        console.error("Error inserting certificate:", error);
      }
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      totalRowsDetected: validRows.length,
      imported: importedCount,
      duplicates: duplicateCount,
      invalid: invalidCount,
      errors: errorCount,
      emptyRowsIgnored: rows.length - validRows.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Import failed";
    console.error("Certificate Excel import error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
