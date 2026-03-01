import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  if ((session.user as any).role !== "super-admin") return null;
  return session;
}

// PUT /api/admin/admins/[id] — update role, permissions, status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { name, role, permissions, isActive } = body;

    await connectDB();

    const admin = await Admin.findById(params.id);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    if (admin.role === "super-admin" && role === "manager") {
      const superAdminCount = await Admin.countDocuments({ role: "super-admin", isActive: true });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot demote the only super-admin" }, { status: 400 });
      }
    }

    if (name !== undefined) admin.name = name;
    if (role !== undefined) admin.role = role;
    if (permissions !== undefined) admin.permissions = role === "manager" ? permissions : [];
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();
    const safe = await Admin.findById(admin._id).select("-password");
    return NextResponse.json({ data: safe });
  } catch (err: any) {
    console.error("[PUT /api/admin/admins/[id]]", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/admins/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();

    const admin = await Admin.findById(params.id);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    if (admin.role === "super-admin") {
      const superAdminCount = await Admin.countDocuments({ role: "super-admin" });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the only super-admin" }, { status: 400 });
      }
    }

    await admin.deleteOne();
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("[DELETE /api/admin/admins/[id]]", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
