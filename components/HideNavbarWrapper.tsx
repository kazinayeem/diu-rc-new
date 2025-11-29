"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";

export default function HideNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
