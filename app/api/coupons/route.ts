import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import Event from "@/lib/models/Event";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

// GET - Fetch coupons for an event or specific coupon
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const couponCode = searchParams.get("code");
    const couponId = searchParams.get("id");

    // If checking coupon validity (public endpoint)
    if (couponCode && eventId) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        eventId,
        isActive: true,
      }).select("-createdBy");

      if (!coupon) {
        return NextResponse.json(
          { success: false, error: "Coupon not found or inactive" },
          { status: 404 }
        );
      }

      // Check if coupon is expired
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return NextResponse.json(
          { success: false, error: "Coupon has expired" },
          { status: 400 }
        );
      }

      // Check if coupon usage limit exceeded
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json(
          { success: false, error: "Coupon usage limit exceeded" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: coupon,
      });
    }

    // Get specific coupon or coupons for event (admin)
    if (eventId) {
      const coupons = await Coupon.find({ eventId })
        .populate("eventId", "title registrationFee")
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: coupons,
      });
    }

    if (couponId) {
      const coupon = await Coupon.findById(couponId)
        .populate("eventId", "title registrationFee")
        .populate("createdBy", "name email");

      if (!coupon) {
        return NextResponse.json(
          { success: false, error: "Coupon not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: coupon,
      });
    }

    // Get all coupons
    const coupons = await Coupon.find()
      .populate("eventId", "title registrationFee")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST - Create a new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check admin authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, eventId, description, discountType, discountValue, maxUses, minimumPrice, maximumDiscount, expiryDate } = body;

    // Validation
    if (!code || !eventId || !description || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if coupon code already exists for this event
    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
      eventId,
    });

    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: "Coupon code already exists for this event" },
        { status: 400 }
      );
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      eventId,
      description,
      discountType,
      discountValue,
      maxUses: maxUses || null,
      minimumPrice: minimumPrice || 0,
      maximumDiscount: maximumDiscount || null,
      expiryDate: expiryDate || null,
      isActive: true,
      createdBy: token.sub,
    });

    await coupon.save();

    return NextResponse.json(
      {
        success: true,
        data: coupon,
        message: "Coupon created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}

// PUT - Update a coupon
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Check admin authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const couponId = searchParams.get("id");

    if (!couponId || !mongoose.Types.ObjectId.isValid(couponId)) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const coupon = await Coupon.findByIdAndUpdate(couponId, body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon,
      message: "Coupon updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a coupon
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Check admin authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const couponId = searchParams.get("id");

    if (!couponId || !mongoose.Types.ObjectId.isValid(couponId)) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon ID" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
