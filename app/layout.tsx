import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import StoreProvider from "./StoreProvider";
import HideNavbarWrapper from "@/components/HideNavbarWrapper";
import ScrollUI from "@/components/public/ScrollUI";
import CookieConsent from "@/components/public/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://diurc.vercel.app"),
  title: "Daffodil International University Robotics Club - Innovation Through Robotics",
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
    title: "Daffodil International University Robotics Club",
    description:
      "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology.",
    images: [
      {
        url: "/diurc_logo.png",
        width: 512,
        height: 512,
        alt: "Daffodil International University Robotics Club Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Daffodil International University Robotics Club",
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
      <body className="bg-white dark:bg-[#0B1F3A] text-black dark:text-white">
        <ThemeProvider>
          <SessionProvider>
            <StoreProvider>
              <ScrollUI />
              <HideNavbarWrapper>
                {children}
              </HideNavbarWrapper>
              <CookieConsent />
            </StoreProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
