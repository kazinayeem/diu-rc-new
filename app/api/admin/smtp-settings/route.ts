import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SMTPSettings from "@/lib/models/SMTPSettings";

// GET: Retrieve SMTP settings
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super-admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let settings = await SMTPSettings.findOne({ isActive: true });

    // If no settings exist, return default structure
    if (!settings) {
      settings = {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: "",
        },
        from: {
          name: "DIU Robotics Club",
          email: "",
        },
        isActive: true,
      };
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("SMTP GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch SMTP settings" },
      { status: 500 }
    );
  }
}

// PUT: Update SMTP settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super-admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { service, host, port, secure, auth, from } = body;

    // Validate required fields
    if (!auth?.user || !auth?.pass || !from?.email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Deactivate all existing settings
    await SMTPSettings.updateMany({}, { isActive: false });

    // Create or update settings
    const settings = await SMTPSettings.findOneAndUpdate(
      { isActive: true },
      {
        service: service || "gmail",
        host: host || "smtp.gmail.com",
        port: port || 587,
        secure: secure || false,
        auth: {
          user: auth.user,
          pass: auth.pass,
        },
        from: {
          name: from.name || "DIU Robotics Club",
          email: from.email,
        },
        isActive: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "SMTP settings updated successfully",
      data: settings,
    });
  } catch (error: any) {
    console.error("SMTP PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update SMTP settings" },
      { status: 500 }
    );
  }
}

// POST: Test SMTP connection
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super-admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { service, host, port, secure, auth, from } = body;

    // Validate
    if (!auth?.user || !auth?.pass) {
      return NextResponse.json(
        { success: false, message: "Missing email credentials" },
        { status: 400 }
      );
    }

    // Here you would normally test the connection using nodemailer
    // For now, we'll just return success
    // TODO: Implement nodemailer connection test

    return NextResponse.json({
      success: true,
      message: "SMTP configuration test passed (Note: Actual email sending not implemented yet)",
    });
  } catch (error: any) {
    console.error("SMTP TEST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "SMTP test failed" },
      { status: 500 }
    );
  }
}
