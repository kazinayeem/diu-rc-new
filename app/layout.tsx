import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import StoreProvider from "./StoreProvider";
import HideNavbarWrapper from "@/components/HideNavbarWrapper";
import Footer from "@/components/public/Footer";

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
    <html lang="en" className={inter.className}>
      <body className="bg-white dark:bg-[#071024] text-black dark:text-white">
        <ThemeProvider>
          <SessionProvider>
            <StoreProvider>
              <HideNavbarWrapper>
                {children}
                <Footer />
              </HideNavbarWrapper>
            </StoreProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
