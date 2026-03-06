import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim().toUpperCase();

  if (!id) {
    return NextResponse.json({ valid: false, message: "Certificate ID is required." }, { status: 400 });
  }

  try {
    await dbConnect();

    // TODO: Replace with your actual Certificate model lookup when the model exists.
    // Example:
    // const cert = await Certificate.findOne({ certificateId: id });
    // if (!cert) return NextResponse.json({ valid: false });
    // return NextResponse.json({ valid: true, id: cert.certificateId, recipientName: cert.recipientName, ... });

    // Placeholder: no certificates in DB yet
    return NextResponse.json({
      valid: false,
      message: "No certificate found with this ID.",
    });
  } catch {
    return NextResponse.json(
      { valid: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
