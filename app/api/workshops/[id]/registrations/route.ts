import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkshopRegistration from '@/lib/models/WorkshopRegistration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Get all registrations for a workshop (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    const query: any = { workshopId: params.id };
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const registrations = await WorkshopRegistration.find(query)
      .populate('paymentApprovedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const total = await WorkshopRegistration.countDocuments(query);
    const pendingPayments = await WorkshopRegistration.countDocuments({
      workshopId: params.id,
      paymentStatus: 'pending',
      isPaid: true,
    });

    return NextResponse.json({
      success: true,
      data: registrations,
      total,
      pendingPayments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

