import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PaymentOption from "@/lib/models/PaymentOption";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const options = await PaymentOption.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: options });
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
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const requiredFields = ["name", "number", "instruction"];

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const option = await PaymentOption.create({
      name: body.name,
      number: body.number,
      instruction: body.instruction,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: option }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
