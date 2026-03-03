import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    const registrations = await MemberRegistration.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Format data for export
    const exportData = registrations.map((reg: any) => ({
      "Full Name": reg.name,
      "Student ID": reg.studentId,
      "DIU Email": reg.email,
      "Mobile Phone": reg.phone,
      Department: reg.department,
      Batch: reg.batch,
      "Current Year": reg.currentYear,
      CGPA: reg.cgpa || "N/A",
      "Previous Experience": reg.previousExperience || "N/A",
      "Why Join": reg.whyJoin || "N/A",
      Skills: reg.skills?.join(", ") || "N/A",
      "Payment Method": reg.paymentMethod,
      "Payment Number": reg.paymentNumber,
      "Transaction ID": reg.transactionId,
      "Payment Status": reg.paymentStatus,
      Status: reg.status,
      "Registration Date": new Date(reg.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json({
      success: true,
      data: exportData,
      total: exportData.length,
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Export failed" },
      { status: 500 }
    );
  }
}
