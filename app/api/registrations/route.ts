import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WorkshopRegistration from "@/lib/models/WorkshopRegistration";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    const query: any = { workshopId: eventId };
    if (status && status !== "all") query.status = status;
    if (paymentStatus && paymentStatus !== "all") query.paymentStatus = paymentStatus;

    // Get total count
    const total = await WorkshopRegistration.countDocuments(query);

    // Get paginated registrations
    const registrations = await WorkshopRegistration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      workshopId,
      name,
      email,
      phone,
      studentId,
      department,
      batch,
      message,
      isPaid,
      paymentMethod,
      paymentNumber,
      transactionId,
      paymentStatus,
      status,
    } = body;

    // Validation
    if (!workshopId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Check if registration already exists
    const existingRegistration = await WorkshopRegistration.findOne({
      workshopId,
      email: email.toLowerCase(),
    });

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: "You have already registered for this event" },
        { status: 409 }
      );
    }

    // Create new registration
    const registration = new WorkshopRegistration({
      workshopId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      studentId: studentId ? studentId.trim() : undefined,
      department: department ? department.trim() : undefined,
      batch: batch ? batch.trim() : undefined,
      message: message ? message.trim() : undefined,
      isPaid: isPaid || false,
      paymentMethod: isPaid && paymentMethod ? paymentMethod : undefined,
      paymentNumber: isPaid && paymentNumber ? paymentNumber.trim() : undefined,
      transactionId: isPaid && transactionId ? transactionId.trim() : undefined,
      paymentStatus: paymentStatus || "pending",
      status: status || "pending",
      registeredAt: new Date(),
    });

    await registration.save();

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating registration:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "You have already registered for this event" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
