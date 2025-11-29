import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import HideNavbarWrapper from "@/components/HideNavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DIU Robotic Club - Innovation Through Robotics",
  description:
    "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#071024] bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] text-white">
        <SessionProvider>
          <HideNavbarWrapper>{children}</HideNavbarWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
