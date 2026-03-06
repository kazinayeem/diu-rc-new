import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";

// Vercel: allow up to 60 seconds for this route
export const maxDuration = 60;

// Helper function for safe string trimming - handles any data type
const safeTrim = (v: any): string => String(v ?? "").trim();

export async function POST(req: NextRequest) {
  const importId = `import_${Date.now()}`;

  try {
    const session = await getServerSession(authOptions);
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

    const totalRows = data.length;
    const errors: any[] = [];
    const now = new Date();

    // ── Step 1: Parse all rows in memory ────────────────────────────────────
    const parsed: Array<{ rowNumber: number; record: any }> = [];
    const seenInBatch = new Set<string>(); // catch duplicates within the uploaded file itself

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;

      let studentId = safeTrim(row.studentId || row["Student ID"]);
      let email = safeTrim(row.email || row["DIU Email"]).toLowerCase();
      let department = safeTrim(row.department || row.Department);
      const name = safeTrim(row.name || row["Full Name"]);

      // Defaults for missing critical fields
      if (!studentId) {
        studentId = `0000-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      }
      if (!department) department = "None";
      if (!email) {
        email = `noemail-${Date.now()}-${Math.floor(Math.random() * 100000)}@noreply.local`;
      }

      const finalName = name || `User-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      // Deduplicate within the uploaded batch
      if (seenInBatch.has(studentId)) {
        errors.push({ row: rowNumber, error: "Duplicate Student ID within uploaded file" });
        continue;
      }
      seenInBatch.add(studentId);

      const skills = safeTrim(row.skills || row.Skills)
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s);

      parsed.push({
        rowNumber,
        record: {
          name: finalName,
          studentId,
          email,
          phone: safeTrim(row.phone || row["Mobile Phone"]),
          department,
          batch: safeTrim(row.batch || row.Batch) || "",
          currentYear: safeTrim(row.currentYear || row["Current Year"]) || "",
          cgpa: Number(row.cgpa || row.CGPA) || 0,
          previousExperience: safeTrim(row.previousExperience || row["Previous Experience"]) || "",
          whyJoin: safeTrim(row.whyJoin || row["Why Join"]) || "",
          skills: skills.length > 0 ? skills : [],
          portfolio: "",
          linkedin: "",
          github: "",
          paymentOptionId: "",
          paymentNumber: safeTrim(row.paymentNumber || row["Payment Number"]) || "",
          paymentMethod: safeTrim(row.paymentMethod || row["Payment Method"]) || "bkash",
          transactionId: safeTrim(row.transactionId || row["Transaction ID"]) || "",
          paymentStatus: "approved",
          status: "approved",
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    // ── Step 2: ONE query to find all already-existing studentIds ────────────
    const allStudentIds = parsed.map((p) => p.record.studentId);
    const existingDocs = await MemberRegistration.find(
      { studentId: { $in: allStudentIds } },
      { studentId: 1, _id: 0 }
    ).lean() as Array<{ studentId: string }>;

    const existingSet = new Set(existingDocs.map((d) => d.studentId));

    const toInsert: any[] = [];

    for (const { rowNumber, record } of parsed) {
      if (existingSet.has(record.studentId)) {
        errors.push({ row: rowNumber, error: "Student ID already exists in database" });
      } else {
        toInsert.push(record);
      }
    }

    // ── Step 3: Bulk insert in one shot ─────────────────────────────────────
    let successCount = 0;
    let failedCount = errors.length;

    if (toInsert.length > 0) {
      // ordered: false → continue on duplicate key errors, don't abort the batch
      const result = await MemberRegistration.collection.insertMany(toInsert, { ordered: false });
      successCount = result.insertedCount;
      // Any records that failed at DB level (e.g. race-condition duplicate)
      failedCount += toInsert.length - successCount;
    }

    const processed = successCount + failedCount;
    const successRate = totalRows > 0 ? ((successCount / totalRows) * 100).toFixed(2) : "0.00";

    return NextResponse.json({
      success: successCount > 0,
      importId,
      total: totalRows,
      processed,
      inserted: successCount,
      failed: failedCount,
      successRate: `${successRate}%`,
      progressPercentage: 100,
      status: "completed",
      errors,
      message: `Import completed: ${successCount} succeeded, ${failedCount} failed out of ${totalRows} records`,
    });
  } catch (error: any) {
    let errorMessage = error.message || "Import failed";
    if (error.name === "SyntaxError") errorMessage = "Invalid JSON format in request body";
    else if (error.name === "ValidationError") errorMessage = `Validation error: ${error.message}`;

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
