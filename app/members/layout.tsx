import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIU Robotics Club | Members",
  description: "Meet the innovators and members of DIU Robotics Club.",
  openGraph: {
    title: "DIU Robotics Club | Members",
    description: "Meet the innovators and members of DIU Robotics Club.",
    images: ["/diurc_logo.png"],
  },
  twitter: {
    card: "summary",
    title: "DIU Robotics Club | Members",
    description: "Meet the innovators and members of DIU Robotics Club.",
    images: ["/diurc_logo.png"],
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
