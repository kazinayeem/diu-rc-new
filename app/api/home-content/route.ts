import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HomeContent from "@/lib/models/HomeContent";

export async function GET() {
  try {
    await connectDB();

    const doc = await HomeContent.findOne({ isActive: true })
      .sort({ updatedAt: -1 })
      .lean();

    if (!doc) {
      return NextResponse.json({
        data: {
          heroSlides: [],
          achievements: [],
        },
      });
    }

    const heroSlides = (doc.heroSlides ?? [])
      .filter((item: any) => item?.isVisible !== false && item?.imageUrl)
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    const achievements = (doc.achievements ?? [])
      .filter(
        (item: any) =>
          item?.isVisible !== false && item?.name && item?.shortDescription && item?.imageUrl
      )
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return NextResponse.json({
      data: {
        heroSlides,
        achievements,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
