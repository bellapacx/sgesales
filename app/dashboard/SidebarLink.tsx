"use client";

import Link from "next/link";

export default function SidebarLink({
  href,
  label,
  mobile = false,
}: {
  href: string;
  label: string;
  mobile?: boolean;
}) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`
        block px-3 py-2 rounded-lg font-medium transition-all duration-150
        ${
          active
            ? "bg-[var(--color-mint-500)/15] text-[var(--color-mint-500)]"
            : "hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-dark)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }
        ${mobile ? "text-base" : ""}
      `}
    >
      {label}
    </Link>
  );
}
