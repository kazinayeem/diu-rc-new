import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Only manager role can change their own password
  if ((session.user as any).role !== "manager") {
    return NextResponse.json(
      { success: false, error: "Only managers can change their password through this page." },
      { status: 403 }
    );
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { success: false, error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  await connectDB();

  const admin = await Admin.findById((session.user as any).id).select("+password");
  if (!admin) {
    return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
  }

  const isValid = await admin.comparePassword(currentPassword);
  if (!isValid) {
    return NextResponse.json({ success: false, error: "Current password is incorrect." }, { status: 400 });
  }

  admin.password = newPassword;
  await admin.save(); // pre-save hook hashes the new password

  return NextResponse.json({ success: true, message: "Password updated successfully." });
}
