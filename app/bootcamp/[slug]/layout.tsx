import { Metadata } from "next";

interface BootcampDetails {
  _id: string;
  title: string;
  description: string;
  image?: string;
  eventDate: string;
  type: string;
}

async function getBootcampData(slug: string): Promise<BootcampDetails | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/bootcamps?slug=${encodeURIComponent(slug)}`,
      { cache: 'revalidate', next: { revalidate: 3600 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.success && data.data?.[0] ? data.data[0] : null;
  } catch (error) {
    console.error("Error fetching bootcamp for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const bootcamp = await getBootcampData(params.slug);

  if (!bootcamp) {
    return {
      title: "Bootcamp Not Found",
      description: "The bootcamp you are looking for does not exist.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const bootcampUrl = `${baseUrl}/bootcamp/${params.slug}`;
  const imageUrl = bootcamp.image
    ? bootcamp.image.startsWith("http")
      ? bootcamp.image
      : `${baseUrl}${bootcamp.image}`
    : `${baseUrl}/og-default.png`;

  const formattedDate = new Date(bootcamp.eventDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return {
    title: bootcamp.title,
    description: bootcamp.description || `Join us for ${bootcamp.title}`,
    keywords: [bootcamp.title, "bootcamp", "training", "registration"],
    openGraph: {
      title: bootcamp.title,
      description: bootcamp.description || `Join us for ${bootcamp.title}`,
      url: bootcampUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: bootcamp.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: bootcamp.title,
      description: bootcamp.description || `Join us for ${bootcamp.title}`,
      images: [imageUrl],
    },
  };
}

export default function BootcampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
