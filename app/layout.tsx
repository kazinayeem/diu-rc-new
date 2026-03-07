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
  metadataBase: new URL("https://diu-rc-new.vercel.app"),
  title: {
    default: "DIU Robotics Club | Daffodil International University",
    template: "%s | DIU Robotics Club",
  },
  description:
    "Daffodil International University Robotics Club (DIU RC) — empowering students through robotics, automation, AI, workshops, seminars, and competitions at DIU, Dhaka, Bangladesh.",
  keywords: [
    "DIU Robotics Club",
    "Daffodil International University Robotics Club",
    "DIU RC",
    "robotics club Bangladesh",
    "university robotics club",
    "robotics DIU",
    "automation club DIU",
    "engineering club Daffodil",
    "robotics workshop Bangladesh",
    "STEM club Bangladesh",
  ],
  authors: [{ name: "DIU Robotics Club", url: "https://diu-rc-new.vercel.app" }],
  creator: "DIU Robotics Club",
  publisher: "Daffodil International University Robotics Club",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
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
    type: "website",
    locale: "en_US",
    url: "https://diu-rc-new.vercel.app",
    siteName: "DIU Robotics Club",
    title: "DIU Robotics Club | Daffodil International University",
    description:
      "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology at Daffodil International University.",
    images: [
      {
        url: "/diurc_logo.png",
        width: 512,
        height: 512,
        alt: "Daffodil International University Robotics Club Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@diuroboticsclub",
    creator: "@diuroboticsclub",
    title: "DIU Robotics Club | Daffodil International University",
    description:
      "Empowering the next generation of engineers and innovators through robotics, automation, and cutting-edge technology at DIU.",
    images: ["/diurc_logo.png"],
  },
  verification: {
    // google: "your-google-site-verification-token",
  },
  alternates: {
    canonical: "https://diu-rc-new.vercel.app",
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
        <link rel="canonical" href="https://diu-rc-new.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Daffodil International University Robotics Club",
              "alternateName": "DIU RC",
              "url": "https://diu-rc-new.vercel.app",
              "logo": "https://diu-rc-new.vercel.app/diurc_logo.png",
              "description": "DIU Robotics Club empowers students through robotics, automation, AI workshops, seminars and competitions at Daffodil International University, Dhaka, Bangladesh.",
              "foundingLocation": {
                "@type": "Place",
                "name": "Daffodil International University, Dhaka, Bangladesh"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@diuroboticclub.com",
                "contactType": "customer support"
              },
              "sameAs": [
                "https://www.facebook.com/diuroboticsclub",
                "https://instagram.com/diu_robotics_club",
                "https://bd.linkedin.com/company/diuroboticsclub"
              ]
            })
          }}
        />
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
