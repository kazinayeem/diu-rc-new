import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ContactUs from "@/lib/models/ContactUs";
import { getToken } from "next-auth/jwt";

// GET - Fetch contact information
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the most recent contact info
    const contact = await ContactUs.findOne().sort({ updatedAt: -1 });

    if (!contact) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}

// POST - Create/Update contact information (admin only)
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
    const { email, phone, address, description, socialLinks } = body;

    // Validation
    if (!email || !phone || !address) {
      return NextResponse.json(
        { success: false, error: "Email, phone, and address are required" },
        { status: 400 }
      );
    }

    // Check if contact info already exists
    const existingContact = await ContactUs.findOne();

    let contact;
    if (existingContact) {
      // Update existing
      contact = await ContactUs.findByIdAndUpdate(
        existingContact._id,
        {
          email,
          phone,
          address,
          description,
          socialLinks,
          updatedBy: token.sub,
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      contact = new ContactUs({
        email,
        phone,
        address,
        description,
        socialLinks,
        updatedBy: token.sub,
      });
      await contact.save();
    }

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: "Contact info saved successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving contact info:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save contact info" },
      { status: 500 }
    );
  }
}
