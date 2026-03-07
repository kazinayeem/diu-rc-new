import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/certificates/:id - Get a single certificate
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const certificate = await Certificate.findById(params.id).populate(
      "createdBy",
      "name email"
    );

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate);
  } catch (error: any) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/certificates/:id - Update a certificate
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if certificate exists
    const certificate = await Certificate.findById(params.id);
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // If certificate ID is being changed, check if new ID already exists
    if (certificateId && certificateId.toUpperCase() !== certificate.certificateId) {
      const existing = await Certificate.findOne({
        certificateId: certificateId.toUpperCase(),
        _id: { $ne: params.id },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Certificate ID already exists" },
          { status: 400 }
        );
      }
    }

    const updated = await Certificate.findByIdAndUpdate(
      params.id,
      {
        ...(certificateId && { certificateId: certificateId.toUpperCase() }),
        ...(recipientName && { recipientName }),
        ...(recipientEmail && { recipientEmail }),
        ...(event && { event }),
        ...(eventType && { eventType }),
        ...(category !== undefined && { category }),
        ...(issueDate && { issueDate: new Date(issueDate) }),
        ...(description !== undefined && { description }),
        ...(skills !== undefined && { skills }),
        ...(duration !== undefined && { duration }),
        ...(instructor !== undefined && { instructor }),
        ...(certificateImageUrl !== undefined && { certificateImageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update certificate" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/certificates/:id - Delete a certificate
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const certificate = await Certificate.findByIdAndDelete(params.id);

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
