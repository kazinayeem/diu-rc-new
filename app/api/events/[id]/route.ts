import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Count registrations for all event types
    let registrationCount = 0;
    const WorkshopRegistration = (
      await import("@/lib/models/WorkshopRegistration")
    ).default;
    registrationCount = await WorkshopRegistration.countDocuments({
      workshopId: params.id,
      status: { $in: ["pending", "confirmed"] },
    });

    const eventData = event.toObject();
    return NextResponse.json({
      success: true,
      data: {
        ...eventData,
        registrationCount,
        spotsRemaining: event.registrationLimit
          ? Math.max(0, event.registrationLimit - registrationCount)
          : null,
      },
    });
  } catch (error: any) {
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

    
    if (body.type !== "workshop" && body.mode === "online" && !body.eventLink) {
      return NextResponse.json(
        { success: false, error: "Online events must include an event link" },
        { status: 400 }
      );
    }

    
    if (body.title) {
      const { slugify } = await import("@/lib/utils");
      body.slug = slugify(body.title);
    }

    
    // Only delete workshop-specific fields for non-workshop types
    // Keep registration and payment settings for all event types
    if (body.type !== "workshop") {
      // Workshop-specific
    }

    
    if (body.type === "workshop") {
      delete body.eventLink;
      delete body.mode;
    }

    const event = await Event.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
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

    const event = await Event.findByIdAndDelete(params.id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
