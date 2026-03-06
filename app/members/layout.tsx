import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daffodil International University Robotics Club | Members",
  description: "Meet the innovators and members of Daffodil International University Robotics Club.",
  openGraph: {
    title: "Daffodil International University Robotics Club | Members",
    description: "Meet the innovators and members of Daffodil International University Robotics Club.",
    images: ["/diurc_logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Daffodil International University Robotics Club | Members",
    description: "Meet the innovators and members of Daffodil International University Robotics Club.",
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
