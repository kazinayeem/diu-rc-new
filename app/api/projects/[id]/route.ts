import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
  await connectDB();
  const body = await req.json();
  const project = await Project.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json({ success: true, data: project });
}

export async function DELETE(req: Request, { params }: any) {
  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
