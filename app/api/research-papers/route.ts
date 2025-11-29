import connectDB from "@/lib/db";
import ResearchPaper from "@/lib/models/ResearchPaper";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const {
    search,
    page = 1,
    limit = 10,
  } = Object.fromEntries(new URL(req.url).searchParams);

  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const total = await ResearchPaper.countDocuments(query);
  const data = await ResearchPaper.find(query)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    },
  });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const created = await ResearchPaper.create(body);

  return NextResponse.json({ success: true, data: created });
}
