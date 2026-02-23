"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import MiniCart from "./MiniCart";



export default function Navbar({ customerEmail }: { customerEmail?: string }) {

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  return (
    <nav className="sticky top-0 z-50 border-b border-violet-100 bg-white/80 backdrop-blur-md dark:border-violet-900/30 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        {/* Logo */}
        <h1 className="shrink-0 text-xl font-bold tracking-tight">
          <Link href="/home" className="text-gradient">🛍️ MyStore</Link>
        </h1>
        {/* Search bar with dropdown */}
        <SearchBar searchRef={searchRef} />
        {/* Right section: Mini Cart + Profile */}
        <div className="flex items-center gap-3">
          <MiniCart />
          {customerEmail ? (
            <ProfileDropdown
              customerEmail={customerEmail}
              profileRef={profileRef}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
            />
          ) : (
            <Link
              href="/login"
              className="btn-vibrant px-4 py-2 rounded-full text-white font-semibold text-sm transition hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
