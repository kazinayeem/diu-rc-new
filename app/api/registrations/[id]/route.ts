import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WorkshopRegistration from "@/lib/models/WorkshopRegistration";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const registration = await WorkshopRegistration.findById(params.id).lean();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error: any) {
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    const registration = await WorkshopRegistration.findByIdAndUpdate(
      params.id,
      {
        status: body.status,
        paymentStatus: body.paymentStatus,
        notes: body.notes,
      },
      { new: true }
    ).lean();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
      message: "Registration updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const result = await WorkshopRegistration.findByIdAndDelete(params.id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
