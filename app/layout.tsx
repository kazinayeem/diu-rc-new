import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import StoreProvider from "./StoreProvider";
import HideNavbarWrapper from "@/components/HideNavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://diurc.vercel.app"),
  title: "DIU Robotic Club - Innovation Through Robotics",
  description:
    "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DIU RC",
  },
  icons: {
    icon: "/diurc_logo.png",
    shortcut: "/diurc_logo.png",
    apple: "/diurc_logo.png",
  },
  openGraph: {
    title: "DIU Robotic Club",
    description:
      "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology.",
    images: [
      {
        url: "/diurc_logo.png",
        width: 512,
        height: 512,
        alt: "DIU Robotics Club Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "DIU Robotic Club",
    description:
      "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology.",
    images: ["/diurc_logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="theme-color" content="#06b6d4" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DIU RC" />
        <link rel="manifest" href="/manifest.json" />
        <script src="/sw-register.js" suppressHydrationWarning></script>
      </head>
      <body className="bg-white dark:bg-[#071024] text-black dark:text-white">
        <ThemeProvider>
          <SessionProvider>
            <StoreProvider>
              <HideNavbarWrapper>
                {children}
              </HideNavbarWrapper>
            </StoreProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
