import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/certificates - List all certificates
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const eventType = searchParams.get("eventType") || "";

  try {
    await dbConnect();

    const query: any = {};
    
    if (search) {
      query.$or = [
        { certificateId: { $regex: search, $options: "i" } },
        { recipientName: { $regex: search, $options: "i" } },
        { recipientEmail: { $regex: search, $options: "i" } },
        { event: { $regex: search, $options: "i" } },
      ];
    }

    if (eventType) {
      query.eventType = eventType;
    }

    const total = await Certificate.countDocuments(query);
    const certificates = await Certificate.find(query)
      .sort({ issueDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy", "name email");

    return NextResponse.json({
      certificates,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST /api/admin/certificates - Create a new certificate
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await req.json();
    const {
      certificateId,
      recipientName,
      recipientEmail,
      event,
      eventType,
      category,
      issueDate,
      description,
      skills,
      duration,
      instructor,
      certificateImageUrl,
      isActive,
    } = body;

    // Validate required fields
    if (!certificateId || !recipientName || !recipientEmail || !event || !issueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if certificate ID already exists
    const existing = await Certificate.findOne({ 
      certificateId: certificateId.toUpperCase() 
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "Certificate ID already exists" },
        { status: 400 }
      );
    }

    const certificate = await Certificate.create({
      certificateId: certificateId.toUpperCase(),
      recipientName,
      recipientEmail,
      event,
      eventType: eventType || "workshop",
      category,
      issueDate: new Date(issueDate),
      description,
      skills: skills || [],
      duration,
      instructor,
      certificateImageUrl,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error: any) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create certificate" },
      { status: 500 }
    );
  }
}
