import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notice from '@/lib/models/Notice';

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const notice = await Notice.findOne({
      isMarquee: true,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: now } },
      ],
    })
      .select('title content type')
      .lean();

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
