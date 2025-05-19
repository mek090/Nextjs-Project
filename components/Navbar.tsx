"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import NotificationDropdown from "./notifications/NotificationDropdown";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Travel Guide
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <NotificationDropdown />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
} 