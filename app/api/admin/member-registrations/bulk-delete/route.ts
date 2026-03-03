import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid IDs array" },
        { status: 400 }
      );
    }

    // Delete multiple registrations
    const result = await MemberRegistration.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} registration(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Bulk delete error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Bulk delete failed" },
      { status: 500 }
    );
  }
}
