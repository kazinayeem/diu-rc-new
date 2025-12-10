import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Member from '@/lib/models/Member';
import Event from '@/lib/models/Event';
import Seminar from '@/lib/models/Seminar';
import Post from '@/lib/models/Post';
import Notice from '@/lib/models/Notice';
import Gallery from '@/lib/models/Gallery';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [
      totalMembers,
      activeMembers,
      mainMembers,
      executiveMembers,
      deputyMembers,
      generalMembers,
      totalEvents,
      upcomingEvents,
      totalSeminars,
      upcomingSeminars,
      totalPosts,
      publishedPosts,
      totalNotices,
      activeNotices,
      totalGallery,
    ] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ isActive: true }),
      Member.countDocuments({ role: 'main' }),
      Member.countDocuments({ role: 'executive' }),
      Member.countDocuments({ role: 'deputy' }),
      Member.countDocuments({ role: 'general' }),
      Event.countDocuments(),
      Event.countDocuments({ status: 'upcoming' }),
      Seminar.countDocuments(),
      Seminar.countDocuments({ status: 'upcoming' }),
      Post.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Notice.countDocuments(),
      Notice.countDocuments({ isActive: true }),
      Gallery.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        members: {
          total: totalMembers,
          active: activeMembers,
          byRole: {
            main: mainMembers,
            executive: executiveMembers,
            deputy: deputyMembers,
            general: generalMembers,
          },
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
        },
        seminars: {
          total: totalSeminars,
          upcoming: upcomingSeminars,
        },
        posts: {
          total: totalPosts,
          published: publishedPosts,
        },
        notices: {
          total: totalNotices,
          active: activeNotices,
        },
        gallery: {
          total: totalGallery,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

