import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    if (!isAdmin) {
      const stats = await MemberRegistration.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      return NextResponse.json({
        success: true,
        data: { stats },
      });
    }

    const query: any = {};
    if (status) query.status = status;

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    const registrations = await MemberRegistration.find(query)
      .sort({ createdAt: -1 })
      .select(
        "name studentId email phone department batch currentYear cgpa previousExperience whyJoin skills portfolio linkedin github status paymentMethod paymentNumber transactionId paymentStatus createdAt"
      )
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MemberRegistration.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: registrations,
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
    await connectDB();

    const body = await request.json();

    // Required fields including payment
    const requiredFields = [
      "name",
      "studentId",
      "email",
      "phone",
      "department",
      "batch",
      "currentYear",
      "whyJoin",
      "paymentNumber",
      "paymentMethod",
      "transactionId",
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Default statuses
    body.status = "pending";
    body.paymentStatus = "pending";

    const registration = await MemberRegistration.create(body);

    return NextResponse.json(
      {
        success: true,
        data: registration,
        message:
          "Registration submitted successfully! Your payment is pending verification.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          error: `A registration with this ${field} already exists`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
