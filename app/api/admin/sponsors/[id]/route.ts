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

// Admin GET all (including hidden)
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

// Admin PUT — update
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    await connectDB();

    const sponsor = await Sponsor.findByIdAndUpdate(params.id, body, { new: true });
    if (!sponsor) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: sponsor });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// Admin DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const sponsor = await Sponsor.findByIdAndDelete(params.id);
    if (!sponsor) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
