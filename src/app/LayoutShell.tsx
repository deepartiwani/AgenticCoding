"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/home/Navbar";
import Footer from "@/app/home/Footer";

const AUTH_ROUTES = ["/login", "/signup"];

export default function LayoutShell({
  children,
  customerEmail,
}: {
  children: React.ReactNode;
  customerEmail?: string;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      {!isAuthPage && <Navbar customerEmail={customerEmail} />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
