"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import { usePrefetchInit } from "@/lib/api/usePrefetchInit";

export default function HideNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  usePrefetchInit();
  const pathname = usePathname();

  // Hide navbar for ALL admin routes
  const hideNavbar = pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
