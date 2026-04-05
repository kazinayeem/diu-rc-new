import { Metadata } from "next";

interface SeminarDetails {
  _id: string;
  title: string;
  description: string;
  image?: string;
  eventDate: string;
  type: string;
}

async function getSeminarData(slug: string): Promise<SeminarDetails | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/seminars?slug=${encodeURIComponent(slug)}`,
      { cache: 'revalidate', next: { revalidate: 3600 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.success && data.data?.[0] ? data.data[0] : null;
  } catch (error) {
    console.error("Error fetching seminar for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const seminar = await getSeminarData(params.slug);

  if (!seminar) {
    return {
      title: "Seminar Not Found",
      description: "The seminar you are looking for does not exist.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const seminarUrl = `${baseUrl}/seminars/${params.slug}`;
  const imageUrl = seminar.image
    ? seminar.image.startsWith("http")
      ? seminar.image
      : `${baseUrl}${seminar.image}`
    : `${baseUrl}/og-default.png`;

  const formattedDate = new Date(seminar.eventDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return {
    title: seminar.title,
    description: seminar.description || `Join us for ${seminar.title}`,
    keywords: [seminar.title, "seminar", "webinar", "registration"],
    openGraph: {
      title: seminar.title,
      description: seminar.description || `Join us for ${seminar.title}`,
      url: seminarUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seminar.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seminar.title,
      description: seminar.description || `Join us for ${seminar.title}`,
      images: [imageUrl],
    },
  };
}

export default function SeminarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
