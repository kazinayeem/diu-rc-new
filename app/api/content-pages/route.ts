import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ContentPage from "@/lib/models/ContentPage";
import { getToken } from "next-auth/jwt";

// GET - Fetch content pages
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Fetch specific page
      const page = await ContentPage.findOne({ slug });

      if (!page) {
        return NextResponse.json(
          { success: false, error: "Page not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: page,
      });
    }

    // Fetch all pages
    const pages = await ContentPage.find().sort({ slug: 1 });

    return NextResponse.json({
      success: true,
      data: pages,
    });
  } catch (error: any) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST - Create a content page (admin only)
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
    const { slug, title, content } = body;

    // Validation
    if (!slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if page already exists
    const existingPage = await ContentPage.findOne({ slug });
    if (existingPage) {
      return NextResponse.json(
        { success: false, error: "Page already exists" },
        { status: 400 }
      );
    }

    const page = new ContentPage({
      slug: slug.toLowerCase(),
      title,
      content,
      updatedBy: token.sub,
    });

    await page.save();

    return NextResponse.json(
      {
        success: true,
        data: page,
        message: "Page created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create page" },
      { status: 500 }
    );
  }
}

// PUT - Update a content page (admin only) - Creates if doesn't exist
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
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Page slug is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // Ensure slug and updatedBy are included
    const updateData = {
      title: body.title,
      content: body.content,
      slug: slug.toLowerCase(),
      updatedBy: token.sub,
    };

    // Use upsert - creates if doesn't exist, updates if exists
    const page = await ContentPage.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      updateData,
      {
        new: true,
        upsert: true, // Create if doesn't exist
      }
    );

    return NextResponse.json({
      success: true,
      data: page,
      message: "Page saved successfully",
    });
  } catch (error: any) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update page" },
      { status: 500 }
    );
  }
}
