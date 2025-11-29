import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Seminar from '@/lib/models/Seminar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch single seminar
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const seminar = await Seminar.findById(params.id).populate('createdBy', 'name email');

    if (!seminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: seminar });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update seminar (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const seminar = await Seminar.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!seminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: seminar });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete seminar (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const seminar = await Seminar.findByIdAndDelete(params.id);

    if (!seminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Seminar deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

