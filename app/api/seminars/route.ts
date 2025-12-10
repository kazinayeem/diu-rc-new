import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Seminar from '@/lib/models/Seminar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { slugify } from '@/lib/utils';


export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;

    const seminars = await Seminar.find(query)
      .populate('createdBy', 'name email')
      .sort({ seminarDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Seminar.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: seminars,
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    if (!body.slug) {
      body.slug = slugify(body.title);
    }

    const seminar = await Seminar.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(
      { success: true, data: seminar },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Seminar with this slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

