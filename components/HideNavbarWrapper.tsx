"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import NoticeTickerBar from "@/components/public/NoticeTickerBar";
import { usePrefetchInit } from "@/lib/api/usePrefetchInit";

export default function HideNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  usePrefetchInit();
  const pathname = usePathname();

  
  const hideNavbar = pathname.startsWith("/admin");
  const hideFooter = pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && (
        <div className="sticky top-0 z-50">
          <NoticeTickerBar />
          <Navbar />
        </div>
      )}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
