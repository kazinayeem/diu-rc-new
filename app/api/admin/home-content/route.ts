import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import HomeContent from "@/lib/models/HomeContent";

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "super-admin") return null;
  return session;
}

function sanitizeSlides(slides: any[] = []) {
  return slides
    .map((slide, index) => ({
      imageUrl: String(slide?.imageUrl ?? "").trim(),
      order: Number.isFinite(Number(slide?.order)) ? Number(slide.order) : index,
      isVisible: slide?.isVisible !== false,
    }))
    .filter((slide) => slide.imageUrl.length > 0);
}

function sanitizeAchievements(items: any[] = []) {
  return items
    .map((item, index) => ({
      name: String(item?.name ?? "").trim(),
      shortDescription: String(item?.shortDescription ?? "").trim(),
      imageUrl: String(item?.imageUrl ?? "").trim(),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
      isVisible: item?.isVisible !== false,
    }))
    .filter((item) => item.name && item.shortDescription && item.imageUrl);
}

export async function GET() {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const doc = await HomeContent.findOne({ isActive: true }).sort({ updatedAt: -1 });

    if (!doc) {
      return NextResponse.json({
        data: {
          heroSlides: [],
          achievements: [],
        },
      });
    }

    return NextResponse.json({
      data: {
        heroSlides: doc.heroSlides ?? [],
        achievements: doc.achievements ?? [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const heroSlides = sanitizeSlides(body?.heroSlides ?? []);
    const achievements = sanitizeAchievements(body?.achievements ?? []);

    await connectDB();
    const doc = await HomeContent.findOneAndUpdate(
      { isActive: true },
      {
        $set: {
          heroSlides,
          achievements,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      data: {
        heroSlides: doc.heroSlides ?? [],
        achievements: doc.achievements ?? [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
