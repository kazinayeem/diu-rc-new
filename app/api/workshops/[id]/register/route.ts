import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import WorkshopRegistration from '@/lib/models/WorkshopRegistration';


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      studentId, 
      department, 
      batch, 
      message,
      paymentMethod,
      paymentNumber,
      transactionId
    } = body;

    
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    
    const workshop = await Event.findById(params.id);
    if (!workshop) {
      return NextResponse.json(
        { success: false, error: 'Workshop not found' },
        { status: 404 }
      );
    }

    
    if (!workshop.registrationOpen) {
      return NextResponse.json(
        { success: false, error: 'Registration is closed for this workshop' },
        { status: 400 }
      );
    }

    
    if (workshop.isPaid) {
      if (!paymentMethod || !paymentNumber || !transactionId) {
        return NextResponse.json(
          { success: false, error: 'Payment details are required for paid workshops' },
          { status: 400 }
        );
      }
      if (workshop.paymentMethod && workshop.paymentMethod !== 'both' && workshop.paymentMethod !== paymentMethod) {
        return NextResponse.json(
          { success: false, error: `This workshop only accepts ${workshop.paymentMethod.toUpperCase()} payments` },
          { status: 400 }
        );
      }
    }

    
    const currentRegistrations = await WorkshopRegistration.countDocuments({
      workshopId: params.id,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (workshop.registrationLimit && currentRegistrations >= workshop.registrationLimit) {
      
      await Event.findByIdAndUpdate(params.id, { registrationOpen: false });
      return NextResponse.json(
        { success: false, error: 'Registration limit reached. Registration is now closed.' },
        { status: 400 }
      );
    }

    
    const existingRegistration = await WorkshopRegistration.findOne({
      workshopId: params.id,
      email: email.toLowerCase(),
    });

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'You have already registered for this workshop' },
        { status: 400 }
      );
    }

    
    const registration = await WorkshopRegistration.create({
      workshopId: params.id,
      name,
      email: email.toLowerCase(),
      phone,
      studentId,
      department,
      batch,
      message,
      isPaid: workshop.isPaid || false,
      paymentStatus: workshop.isPaid ? 'pending' : 'paid',
      paymentMethod: workshop.isPaid ? paymentMethod : undefined,
      paymentNumber: workshop.isPaid ? paymentNumber : undefined,
      transactionId: workshop.isPaid ? transactionId : undefined,
      status: workshop.isPaid ? 'pending' : 'pending', 
    });

    
    await Event.findByIdAndUpdate(params.id, {
      $inc: { attendees: 1 },
    });

    
    const newCount = currentRegistrations + 1;
    if (workshop.registrationLimit && newCount >= workshop.registrationLimit) {
      await Event.findByIdAndUpdate(params.id, { registrationOpen: false });
    }

    return NextResponse.json(
      { success: true, data: registration, message: 'Registration successful!' },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already registered for this workshop' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const registrations = await WorkshopRegistration.find({
      workshopId: params.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const total = await WorkshopRegistration.countDocuments({
      workshopId: params.id,
    });

    return NextResponse.json({
      success: true,
      data: registrations,
      total,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

