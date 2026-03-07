import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";
import SMTPSettings from "@/lib/models/SMTPSettings";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { subject, htmlBody, recipientType, batchSize = 100 } = await request.json();

  if (!subject?.trim() || !htmlBody?.trim()) {
    return NextResponse.json({ success: false, error: "Subject and body are required." }, { status: 400 });
  }

  await connectDB();

  // Load SMTP settings
  const settings = await SMTPSettings.findOne({ isActive: true }).lean() as any;
  if (!settings?.auth?.user || !settings?.auth?.pass) {
    return NextResponse.json({ success: false, error: "SMTP not configured. Go to Settings → SMTP." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: settings.host || "smtp.gmail.com",
    port: settings.port || 587,
    secure: settings.secure || false,
    auth: { user: settings.auth.user, pass: settings.auth.pass },
  });

  // Fetch recipients
  const query: any = {};
  if (recipientType === "approved") query.status = "approved";
  else if (recipientType === "pending") query.status = "pending";
  // "all" = no filter

  const registrations = await MemberRegistration.find(query).select("name email").lean() as any[];

  if (registrations.length === 0) {
    return NextResponse.json({ success: false, error: "No recipients found for the selected filter." }, { status: 400 });
  }

  const MAX_BATCH = Math.min(Number(batchSize) || 100, 500);
  const recipients = registrations.slice(0, MAX_BATCH);

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const reg of recipients) {
    try {
      await transporter.sendMail({
        from: settings.from || settings.auth.user,
        to: reg.email,
        subject,
        html: htmlBody,
      });
      sent++;
    } catch (err: any) {
      failed++;
      errors.push(`${reg.email}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Sent: ${sent}, Failed: ${failed} (out of ${recipients.length} recipients)`,
    sent,
    failed,
    total: registrations.length,
    batched: recipients.length,
    errors: errors.slice(0, 10), // return first 10 error details
  });
}
