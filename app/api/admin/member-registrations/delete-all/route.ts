import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";

// Vercel: allow up to 60 seconds for this route
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Optional filters passed from the frontend
    const body = await req.json().catch(() => ({}));
    const { status, search } = body as { status?: string; search?: string };

    const query: any = {};
    if (status) query.status = status;
    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
      ];
    }

    // Single deleteMany – fast, no loop needed
    const result = await MemberRegistration.deleteMany(query);

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} record(s)`,
    });
  } catch (error: any) {
    console.error("Delete-all error:", error);
    return NextResponse.json(
      { success: false, message: "Delete operation failed", error: error.message },
      { status: 500 }
    );
  }
}
