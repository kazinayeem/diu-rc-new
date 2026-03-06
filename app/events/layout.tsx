import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daffodil International University Robotics Club | Events",
  description: "Explore the latest robotics events, meetups, and competitions.",
  openGraph: {
    title: "Daffodil International University Robotics Club | Events",
    description: "Explore the latest robotics events, meetups, and competitions.",
    images: ["/diurc_logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Daffodil International University Robotics Club | Events",
    description: "Explore the latest robotics events, meetups, and competitions.",
    images: ["/diurc_logo.png"],
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
