import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

// Only super-admin can call these routes
async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  if ((session.user as any).role !== "super-admin") return null;
  return session;
}

// GET /api/admin/admins
export async function GET() {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const admins = await Admin.find({}).select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ data: admins });
  } catch (err: any) {
    console.error("[GET /api/admin/admins]", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// POST /api/admin/admins — create a new admin/manager
export async function POST(req: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { name, email, password, role, permissions } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "name, email, password, role are required" }, { status: 400 });
    }

    if (!["super-admin", "manager"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectDB();

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      permissions: role === "manager" ? (permissions ?? []) : [],
      isActive: true,
    });

    const safe = await Admin.findById(admin._id).select("-password");
    return NextResponse.json({ data: safe }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/admin/admins]", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
