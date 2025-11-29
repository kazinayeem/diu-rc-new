import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;
    if (slug) query.slug = slug;
    if (type) query.type = type;

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: events,
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

// POST - Create new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    if (!body.slug) {
      body.slug = slugify(body.title);
    }

    const event = await Event.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Event with this slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

