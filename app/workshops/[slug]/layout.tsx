import { Metadata } from "next";

interface WorkshopDetails {
  _id: string;
  title: string;
  description: string;
  image?: string;
  eventDate: string;
  type: string;
}

async function getWorkshopData(slug: string): Promise<WorkshopDetails | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/workshops?slug=${encodeURIComponent(slug)}`,
      { cache: 'revalidate', next: { revalidate: 3600 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.success && data.data?.[0] ? data.data[0] : null;
  } catch (error) {
    console.error("Error fetching workshop for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const workshop = await getWorkshopData(params.slug);

  if (!workshop) {
    return {
      title: "Workshop Not Found",
      description: "The workshop you are looking for does not exist.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const workshopUrl = `${baseUrl}/workshops/${params.slug}`;
  const imageUrl = workshop.image
    ? workshop.image.startsWith("http")
      ? workshop.image
      : `${baseUrl}${workshop.image}`
    : `${baseUrl}/og-default.png`;

  const formattedDate = new Date(workshop.eventDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return {
    title: workshop.title,
    description: workshop.description || `Join us for ${workshop.title}`,
    keywords: [workshop.title, "workshop", "training", "registration"],
    openGraph: {
      title: workshop.title,
      description: workshop.description || `Join us for ${workshop.title}`,
      url: workshopUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: workshop.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: workshop.title,
      description: workshop.description || `Join us for ${workshop.title}`,
      images: [imageUrl],
    },
  };
}

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
