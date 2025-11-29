import connectDB from "@/lib/db";
import ResearchPaper from "@/lib/models/ResearchPaper";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
  await connectDB();
  const body = await req.json();

  const updated = await ResearchPaper.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req: Request, { params }: any) {
  await connectDB();

  await ResearchPaper.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
