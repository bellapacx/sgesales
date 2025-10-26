"use client";

import React from "react";
import { Menu } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import SidebarLink from "./SidebarLink";

export default function TopNavbar({
  user,
  role,
}: {
  user: { name: string; role: string };
  role: string;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header
      className="sticky top-0 z-20 h-14 border-b border-[var(--color-border-light)] 
      dark:border-[var(--color-border-dark)] bg-[var(--color-surface-contrast)]/90 
      dark:bg-[var(--color-surface-deep)]/90 backdrop-blur-md flex items-center justify-between px-4"
    >
      {/* Left: Menu (mobile only) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-md hover:bg-[var(--color-surface-hover)] transition"
        >
          <Menu size={22} className="text-[var(--color-text-primary)]" />
        </button>

        <span className="hidden sm:inline font-semibold text-[var(--color-text-primary)] text-sm">
          {user.name} ({role})
        </span>
      </div>

      {/* Right: Logout */}
      <div className="flex items-center">
        <LogoutButton />
      </div>

      {/* 📱 Slide-over mobile nav */}
      {menuOpen && (
        <nav
          className="absolute top-14 left-0 w-full bg-[var(--color-surface)] 
          dark:bg-[var(--color-surface-dark)] border-t border-[var(--color-border-light)] 
          dark:border-[var(--color-border-dark)] shadow-lg animate-slideDown"
        >
          <div className="flex flex-col space-y-1 p-3 text-sm">
            {role === "ADMIN" ? (
              <>
                <SidebarLink href="/dashboard" label="Overview" mobile />
                <SidebarLink
                  href="/dashboard/reports"
                  label="Sales Report"
                  mobile
                />
                <SidebarLink
                  href="/dashboard/inventory"
                  label="Inventory"
                  mobile
                />
                <SidebarLink
                  href="/dashboard/users"
                  label="Manage Users"
                  mobile
                />
              </>
            ) : (
              <SidebarLink href="/dashboard/sales" label="Sales Form" mobile />
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
