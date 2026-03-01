import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Sponsor from "@/lib/models/Sponsor";

// Public GET — only visible ones
export async function GET() {
  try {
    await connectDB();
    const sponsors = await Sponsor.find({ isVisible: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ data: sponsors });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// Admin POST — create sponsor
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { name, logoUrl, websiteUrl, tier, isVisible, order } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ error: "name and logoUrl are required" }, { status: 400 });
    }

    await connectDB();
    const sponsor = await Sponsor.create({ name, logoUrl, websiteUrl, tier, isVisible, order: order ?? 0 });
    return NextResponse.json({ data: sponsor }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
