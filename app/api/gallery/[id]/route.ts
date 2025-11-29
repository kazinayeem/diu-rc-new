import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const gallery = await Gallery.findById(params.id).populate('uploadedBy', 'name email');

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gallery });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update gallery image (admin only)
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
    const gallery = await Gallery.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate('uploadedBy', 'name email');

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gallery });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery image (admin only)
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

    const gallery = await Gallery.findByIdAndDelete(params.id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

