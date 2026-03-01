import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Sponsor from "@/lib/models/Sponsor";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

// GET all sponsors including hidden ones
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const sponsors = await Sponsor.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ data: sponsors });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// Create a sponsor
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { name, logoUrl, websiteUrl, tier, isVisible, order } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ error: "name and logoUrl are required" }, { status: 400 });
    }

    await connectDB();
    const sponsor = await Sponsor.create({
      name,
      logoUrl,
      websiteUrl: websiteUrl ?? "",
      tier: tier ?? "community",
      isVisible: isVisible !== undefined ? isVisible : true,
      order: order ?? 0,
    });

    return NextResponse.json({ data: sponsor }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
