import { Metadata } from "next";

interface EventDetails {
  _id: string;
  title: string;
  description: string;
  image?: string;
  eventDate: string;
  type: string;
}

async function getEventData(slug: string): Promise<EventDetails | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/events?slug=${encodeURIComponent(slug)}`,
      { cache: 'revalidate', next: { revalidate: 3600 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.success && data.data?.[0] ? data.data[0] : null;
  } catch (error) {
    console.error("Error fetching event for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventData(params.slug);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The event you are looking for does not exist.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const eventUrl = `${baseUrl}/events/${params.slug}`;
  const imageUrl = event.image
    ? event.image.startsWith("http")
      ? event.image
      : `${baseUrl}${event.image}`
    : `${baseUrl}/og-default.png`;

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    title: event.title,
    description: event.description || `Join us for ${event.title}`,
    keywords: [event.title, "event", "registration"],
    openGraph: {
      title: event.title,
      description: event.description || `Join us for ${event.title}`,
      url: eventUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description || `Join us for ${event.title}`,
      images: [imageUrl],
    },
  };
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
