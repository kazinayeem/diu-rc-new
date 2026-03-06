import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SMTPSettings from "@/lib/models/SMTPSettings";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json().catch(() => ({}));

    // Use credentials from request body if provided (live-test without saving)
    // Otherwise fall back to saved DB settings
    let testConfig: any = null;

    if (body?.auth?.user && body?.auth?.pass) {
      // Using form data directly
      testConfig = {
        host: body.host || "smtp.gmail.com",
        port: body.port || 587,
        secure: body.secure || false,
        auth: { user: body.auth.user, pass: body.auth.pass },
        from: body.from || {},
      };
    } else {
      // Fall back to saved DB settings
      const settings = await SMTPSettings.findOne({ isActive: true }).lean() as any;
      if (!settings || !settings.auth?.user || !settings.auth?.pass) {
        return NextResponse.json({
          success: false,
          message: "SMTP not configured. Fill in your credentials and click Test (or Save first).",
        }, { status: 400 });
      }
      testConfig = settings;
    }

    const settings = testConfig;

    const transporter = nodemailer.createTransport({
      host: settings.host || "smtp.gmail.com",
      port: settings.port || 587,
      secure: settings.secure || false,
      auth: {
        user: settings.auth.user,
        pass: settings.auth.pass,
      },
    });

    // Verify connection
    await transporter.verify();

    const recipient = body?.testEmail || settings.from?.email || settings.auth.user;

    // Send test email
    await transporter.sendMail({
      from: `"DIURC Portal" <${settings.from?.email || settings.auth.user}>`,
      to: recipient,
      subject: "✅ SMTP Test — Daffodil International University Robotics Club",
      html: `
        <div style="font-family:sans-serif;padding:32px;background:#f4f7fb;border-radius:12px;max-width:500px;margin:auto">
          <h2 style="color:#0a1f44">✅ SMTP is Working!</h2>
          <p style="color:#333">Your SMTP configuration for <strong>Daffodil International University Robotics Club</strong> is correctly set up.</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:20px 0"/>
          <p style="color:#666;font-size:13px">Host: <strong>${settings.host}</strong></p>
          <p style="color:#666;font-size:13px">Port: <strong>${settings.port}</strong></p>
          <p style="color:#666;font-size:13px">User: <strong>${settings.auth.user}</strong></p>
          <p style="color:#666;font-size:13px">From: <strong>${settings.from?.name} &lt;${settings.from?.email}&gt;</strong></p>
          <p style="margin-top:24px;color:#1c75bc;font-size:13px">Transactional emails (registration, approval, etc.) will now be delivered successfully.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${recipient}. Check your inbox!`,
    });
  } catch (error: any) {
    console.error("[SMTP Test] Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "SMTP connection failed",
      hint: error.code === "EAUTH"
        ? "Gmail rejected your credentials. You MUST use a 16-character App Password — not your regular Gmail password. Steps: (1) Enable 2-Step Verification at myaccount.google.com/security, (2) Go to myaccount.google.com/apppasswords, (3) Generate an App Password for Mail, (4) Paste the 16-char code (no spaces) as your password here."
        : error.code === "ECONNREFUSED"
        ? "Connection refused. Check your SMTP host and port settings."
        : error.message?.includes("wrong version number")
        ? "SSL version mismatch. This usually means 'secure' is set incorrectly. For port 587 use secure=OFF (TLS/STARTTLS). For port 465 use secure=ON (SSL). Select Gmail service to auto-fix this."
        : (error.code === "ESOCKET" || error.code === "ETIMEDOUT" || error.errno === -60)
        ? `Connection timed out on port ${error.port || "unknown"}. Valid SMTP ports are 587 (TLS/STARTTLS) or 465 (SSL). Make sure you are NOT using port 456 or any other non-standard port.`
        : "Check your SMTP settings and credentials.",
    }, { status: 500 });
  }
}
