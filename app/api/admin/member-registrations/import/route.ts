import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";
import { initializeImport, updateProgress, completeImport, failImport } from "@/lib/importProgress";

// Helper function for safe string trimming - handles any data type
const safeTrim = (v: any): string => String(v ?? "").trim();

export async function POST(req: NextRequest) {
  let session;
  const importId = `import_${Date.now()}`;

  try {
    session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { data } = body;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid data format or empty data" },
        { status: 400 }
      );
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: any[] = [];
    const totalRows = data.length;
    let processed = 0;

    // Initialize progress tracker
    initializeImport(importId, totalRows);

    // Process each row individually with per-row error handling and real-time progress
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        const rowNumber = i + 2; // Row numbers start at 2 (1 is header, 0-indexed array)

        // Extract and safely convert all fields
        const name = safeTrim(row.name || row["Full Name"]);
        let studentId = safeTrim(row.studentId || row["Student ID"]);
        let email = safeTrim(row.email || row["DIU Email"]).toLowerCase();
        const phone = safeTrim(row.phone || row["Mobile Phone"]);
        let department = safeTrim(row.department || row.Department);
        const batch = safeTrim(row.batch || row.Batch);
        const currentYear = safeTrim(row.currentYear || row["Current Year"]);
        const cgpa = Number(row.cgpa || row.CGPA) || 0; // Default to 0 if empty
        const previousExperience = safeTrim(row.previousExperience || row["Previous Experience"]);
        const whyJoin = safeTrim(row.whyJoin || row["Why Join"]);
        const skills = safeTrim(row.skills || row.Skills)
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s);
        const paymentMethod = safeTrim(row.paymentMethod || row["Payment Method"]) || "bkash";
        const paymentNumber = safeTrim(row.paymentNumber || row["Payment Number"]);
        const transactionId = safeTrim(row.transactionId || row["Transaction ID"]);

        // Apply defaults for missing critical fields - DO NOT FAIL
        if (!studentId) {
          // Generate unique ID for missing studentId: 0000-{timestamp}-{random}
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000);
          studentId = `0000-${timestamp}-${random}`;
        }
        if (!department) {
          department = "None"; // Default department if missing
        }

        // Apply default for missing email - generate unique placeholder email
        if (!email) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 100000);
          email = `noemail-${timestamp}-${random}@noreply.local`.toLowerCase();
        }

        // Apply default for missing name
        const finalName = name || `User-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Skip email format validation - allow any email or none at all

        // Check if registration already exists in database
        // Only check studentId duplicates (allow duplicate emails)
        const existingRecord = await MemberRegistration.findOne({
          studentId
        }).lean();

        if (existingRecord) {
          failedCount++;
          processed++;
          errors.push({
            row: rowNumber,
            error: "Student ID already exists in database",
          });
          
          // Update progress tracker
          updateProgress(importId, processed, successCount, failedCount, errors);
          continue;
        }

        // Create record object with ALL fields explicitly set
        const recordToInsert = {
          name: finalName,
          studentId,
          email,
          phone,
          department,
          batch: batch || "",
          currentYear: currentYear || "",
          cgpa: cgpa || 0,
          previousExperience: previousExperience || "",
          whyJoin: whyJoin || "",
          skills: skills && skills.length > 0 ? skills : [],
          portfolio: "",
          linkedin: "",
          github: "",
          paymentOptionId: "",
          paymentNumber: paymentNumber || "",
          paymentMethod: paymentMethod || "bkash",
          transactionId: transactionId || "",
          paymentStatus: "approved",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Insert directly to bypass validation
        await MemberRegistration.collection.insertOne(recordToInsert);

        successCount++;
        processed++;

        // Update progress tracker
        updateProgress(importId, processed, successCount, failedCount, errors);
      } catch (rowError: any) {
        failedCount++;
        processed++;
        errors.push({
          row: i + 2,
          error: rowError.message || "Unknown error during record creation",
        });

        // Update progress tracker
        updateProgress(importId, processed, successCount, failedCount, errors);
        
        // Continue processing next row instead of stopping
        continue;
      }
    }

    const successRate = ((successCount / totalRows) * 100).toFixed(2);

    // Mark import as completed in progress tracker
    completeImport(importId);
    
    return NextResponse.json({
      success: successCount > 0,
      importId,
      total: totalRows,
      processed,
      inserted: successCount,
      failed: failedCount,
      successRate: `${successRate}%`,
      progressPercentage: 100,
      errors,
      message: `Import completed: ${successCount} succeeded, ${failedCount} failed out of ${totalRows} records`,
    });
  } catch (error: any) {
    // Import error handled above
    failImport(importId, error.message);

    let errorMessage = error.message || "Import failed";
    if (error.name === "SyntaxError") {
      errorMessage = "Invalid JSON format in request body";
    } else if (error.name === "ValidationError") {
      errorMessage = `Validation error: ${error.message}`;
    }

    return NextResponse.json(
      {
        success: false,
        importId,
        insertedCount: 0,
        failedCount: 0,
        totalProcessed: 0,
        errors: [errorMessage],
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
