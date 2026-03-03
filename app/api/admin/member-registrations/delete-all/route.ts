import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberRegistration from "@/lib/models/MemberRegistration";
import { initializeImport, updateProgress, completeImport, failImport } from "@/lib/importProgress";

export async function POST(req: NextRequest) {
  let session;
  const deleteId = `delete_${Date.now()}`;

  try {
    session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    console.log(`\n🗑️  Starting bulk delete of all registrations\n`);

    // Get total count first
    const totalRecords = await MemberRegistration.countDocuments();
    console.log(`📊 Total records to delete: ${totalRecords}`);

    // Initialize progress tracker
    initializeImport(deleteId, totalRecords);

    if (totalRecords === 0) {
      completeImport(deleteId);
      return NextResponse.json({
        success: true,
        deleteId,
        total: 0,
        deleted: 0,
        progressPercentage: 100,
        message: "No records to delete",
      });
    }

    // Delete in batches to show progress
    const batchSize = 50;
    let deleted = 0;

    for (let skip = 0; skip < totalRecords; skip += batchSize) {
      // Delete batch
      const result = await MemberRegistration.deleteMany({});
      
      if (result.deletedCount) {
        deleted += result.deletedCount;
      }

      // Update progress incrementally
      const progressPercentage = Math.round((deleted / totalRecords) * 100);
      updateProgress(deleteId, deleted, deleted, 0, []);

      console.log(
        `[${progressPercentage}%] Deleted: ${deleted}/${totalRecords}`
      );

      // Small delay to allow frontend to fetch progress
      await new Promise((resolve) => setTimeout(resolve, 100));

      // If we've deleted all, break
      if (deleted >= totalRecords) {
        break;
      }
    }

    completeImport(deleteId);

    console.log(`\n✅ Delete completed!`);
    console.log(`   Total: ${totalRecords}`);
    console.log(`   Deleted: ${deleted}\n`);

    return NextResponse.json({
      success: true,
      deleteId,
      total: totalRecords,
      deleted,
      progressPercentage: 100,
      message: `Successfully deleted ${deleted} records`,
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    failImport(deleteId, error.message);

    return NextResponse.json(
      {
        success: false,
        deleteId,
        message: "Delete operation failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
