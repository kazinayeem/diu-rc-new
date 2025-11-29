
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const search = searchParams.get("search");

  const query: any = {};
  if (search) query.title = { $regex: search, $options: "i" };

  const total = await Project.countDocuments(query);
  const data = await Project.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    success: true,
    data,
    pagination: { total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const project = await Project.create(body);
  return NextResponse.json({ success: true, data: project });
}
