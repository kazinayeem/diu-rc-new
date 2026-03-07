import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim().toUpperCase();

  if (!id) {
    return NextResponse.json({ valid: false, message: "Certificate ID is required." }, { status: 400 });
  }

  try {
    await dbConnect();

    const cert = await Certificate.findOne({ 
      certificateId: id,
      isActive: true 
    });

    if (!cert) {
      return NextResponse.json({
        valid: false,
        message: "No certificate found with this ID.",
      });
    }

    return NextResponse.json({
      valid: true,
      id: cert.certificateId,
      recipientName: cert.recipientName,
      event: cert.event,
      eventType: cert.eventType,
      category: cert.category,
      issueDate: cert.issueDate,
      description: cert.description,
      skills: cert.skills,
      duration: cert.duration,
      instructor: cert.instructor,
      certificateImageUrl: cert.certificateImageUrl,
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return NextResponse.json(
      { valid: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
