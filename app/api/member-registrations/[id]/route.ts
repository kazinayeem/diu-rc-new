import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MemberRegistration from "@/lib/models/MemberRegistration";
import {
  sendRegistrationApprovedEmail,
  sendRegistrationRejectedEmail,
  sendPaymentVerifiedEmail,
  sendPaymentRejectedEmail,
  sendAdminStatusChangeNotification,
} from "@/lib/email";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const registration = await MemberRegistration.findById(params.id).lean();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
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
    const updateData: any = {
      ...body,
      reviewedAt: new Date(),
    };

    const registration = await MemberRegistration.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    // Await all emails before returning so serverless function doesn't terminate early
    const reg = registration as any;
    const emailQueue: Promise<any>[] = [];

    if (body.paymentStatus === "approved") {
      emailQueue.push(
        sendPaymentVerifiedEmail({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          department: reg.department,
          batch: reg.batch,
          paymentMethod: reg.paymentMethod,
          transactionId: reg.transactionId,
        }),
        sendAdminStatusChangeNotification({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          status: "approved",
        })
      );
    }

    if (body.paymentStatus === "rejected") {
      emailQueue.push(
        sendPaymentRejectedEmail({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          department: reg.department,
          batch: reg.batch,
          paymentMethod: reg.paymentMethod,
          transactionId: reg.transactionId,
        }),
        sendAdminStatusChangeNotification({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          status: "rejected",
        })
      );
    }

    if (body.status === "approved") {
      emailQueue.push(
        sendRegistrationApprovedEmail({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          department: reg.department,
          batch: reg.batch,
        }),
        sendAdminStatusChangeNotification({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          status: "approved",
        })
      );
    } else if (body.status === "rejected") {
      emailQueue.push(
        sendRegistrationRejectedEmail({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
        }),
        sendAdminStatusChangeNotification({
          name: reg.name,
          email: reg.email,
          studentId: reg.studentId,
          status: "rejected",
        })
      );
    }

    if (emailQueue.length > 0) {
      const results = await Promise.allSettled(emailQueue);
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[Email] Queue item ${i} failed:`, r.reason);
        }
      });
    }

    return NextResponse.json({ success: true, data: registration });
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

    const registration = await MemberRegistration.findByIdAndDelete(params.id);

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
