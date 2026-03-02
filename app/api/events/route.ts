import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";


export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (featured === "true") query.featured = true;
    if (slug) query.slug = slug;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(query);

    // Calculate registration counts and spots remaining for all events
    const enrichedEvents = await Promise.all(
      events.map(async (event: any) => {
        let registrationCount = 0;
        // Count registrations for all event types
        const WorkshopRegistration = (
          await import("@/lib/models/WorkshopRegistration")
        ).default;
        registrationCount = await WorkshopRegistration.countDocuments({
          workshopId: event._id,
          status: { $in: ["pending", "confirmed"] },
        });

        return {
          ...event,
          registrationCount,
          spotsRemaining: event.registrationLimit
            ? Math.max(0, event.registrationLimit - registrationCount)
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedEvents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    
    if (!body.slug) {
      body.slug = slugify(body.title);
    }

    
    if (body.type !== "workshop" && body.mode === "online" && !body.eventLink) {
      return NextResponse.json(
        { success: false, error: "Online events must include an event link" },
        { status: 400 }
      );
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

    const event = await Event.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Event with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
