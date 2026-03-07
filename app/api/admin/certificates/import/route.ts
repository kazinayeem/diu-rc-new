import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import * as XLSX from "xlsx";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CertificateImport from "@/lib/models/CertificateImport";

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

    await dbConnect();

    const lastDoc = await CertificateImport.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
    let nextId = (lastDoc?.id || 0) + 1;

    const documents = rows.map((row) => ({
      id: nextId++,
      certificate_id: String(row["ID"] ?? ""),
      name_filled: String(row["Name Filled Up"] ?? ""),
      name: String(row["Name"] ?? ""),
      email: String(row["Email"] ?? ""),
      workshop: String(row["Workshop"] ?? ""),
      issue_date: String(row["Date"] ?? ""),
    }));

    if (documents.length > 0) {
      await CertificateImport.insertMany(documents, { ordered: true });
    }

    return NextResponse.json({
      message: "File uploaded",
      totalRowsDetected: rows.length,
      imported: documents.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Import failed";
    console.error("Certificate Excel import error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
