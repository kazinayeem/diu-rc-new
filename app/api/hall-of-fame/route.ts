import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HallOfFame from "@/lib/models/HallOfFame";

// Public GET – only visible entries, sorted by order
export async function GET() {
  try {
    await connectDB();
    const data = await HallOfFame.find({ isVisible: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
