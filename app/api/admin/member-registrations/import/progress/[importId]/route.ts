import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProgress } from "@/lib/importProgress";

export async function GET(
  req: NextRequest,
  { params }: { params: { importId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const progress = getProgress(params.importId);

    if (!progress) {
      return NextResponse.json(
        { success: false, message: "Import not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      importId: progress.importId,
      totalRows: progress.totalRows,
      processed: progress.processed,
      inserted: progress.inserted,
      failed: progress.failed,
      progressPercentage: progress.progressPercentage,
      status: progress.status,
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
      successRate: progress.totalRows > 0 
        ? ((progress.inserted / progress.totalRows) * 100).toFixed(2) 
        : "0",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
