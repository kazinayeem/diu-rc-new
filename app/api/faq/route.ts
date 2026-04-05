import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FAQ from "@/lib/models/FAQ";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

// GET - Fetch FAQs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error: any) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create a new FAQ (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, answer, order } = body;

    // Validation
    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const faq = new FAQ({
      question,
      answer,
      order: order || 0,
      isActive: true,
      createdBy: token.sub,
    });

    await faq.save();

    return NextResponse.json(
      {
        success: true,
        data: faq,
        message: "FAQ created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

// PUT - Update a FAQ (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const faq = await FAQ.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faq,
      message: "FAQ updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a FAQ (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
