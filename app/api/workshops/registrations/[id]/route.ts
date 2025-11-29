import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkshopRegistration from '@/lib/models/WorkshopRegistration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT - Update registration payment status (admin only)
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
    const { paymentStatus, status } = body;

    const updateData: any = {};
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        updateData.paymentApprovedBy = (session.user as any).id;
        updateData.paymentApprovedAt = new Date();
        // Auto-confirm registration when payment is approved
        updateData.status = 'confirmed';
      }
    }
    
    if (status) {
      updateData.status = status;
    }

    const registration = await WorkshopRegistration.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('paymentApprovedBy', 'name email')
      .populate('workshopId', 'title');

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete registration (admin only)
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

    const registration = await WorkshopRegistration.findByIdAndDelete(params.id);

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Registration deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

