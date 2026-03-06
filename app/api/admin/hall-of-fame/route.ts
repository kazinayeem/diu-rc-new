import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HallOfFame from "@/lib/models/HallOfFame";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

// GET all entries (including hidden)
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const data = await HallOfFame.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST – create entry
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const { name, imageUrl, achievement, position, year, linkedinUrl, isVisible, order } = body;

    if (!name || !imageUrl || !achievement || !position || !year) {
      return NextResponse.json(
        { error: "name, imageUrl, achievement, position and year are required" },
        { status: 400 }
      );
    }

    const entry = await HallOfFame.create({
      name,
      imageUrl,
      achievement,
      position,
      year,
      linkedinUrl: linkedinUrl ?? "",
      isVisible: isVisible !== undefined ? isVisible : true,
      order: order ?? 0,
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
