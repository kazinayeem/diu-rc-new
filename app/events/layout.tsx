import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIU Robotics Club | Events",
  description: "Explore the latest robotics events, meetups, and competitions.",
  openGraph: {
    title: "DIU Robotics Club | Events",
    description: "Explore the latest robotics events, meetups, and competitions.",
    images: ["/diurc_logo.png"],
  },
  twitter: {
    card: "summary",
    title: "DIU Robotics Club | Events",
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
