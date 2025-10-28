"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void; // ✅ added for closing sidebar
}

export default function SidebarLink({
  href,
  label,
  icon,
  mobile = false,
  onClick, // ✅ added
}: SidebarLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick} // ✅ this triggers sidebar close when clicked
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-4 py-2 font-medium transition-all duration-200",
        // ✅ Solid backgrounds (no transparency)
        "bg-slate-100 dark:bg-slate-900",
        active
          ? mobile
            ? // ✅ Mobile active: solid emerald
              "bg-emerald-600 text-white shadow-md"
            : // ✅ Desktop active: subtle highlight
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
          : // Default inactive
            "text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800",
        mobile && "text-base"
      )}
    >
      {/* Icon */}
      {icon && (
        <motion.span
          initial={false}
          animate={{ scale: active ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "flex-shrink-0 text-foreground/80 group-hover:text-foreground",
            active && "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {icon}
        </motion.span>
      )}

      {/* Label */}
      <span
        className={cn(
          "truncate transition-colors duration-200",
          active && "font-semibold"
        )}
      >
        {label}
      </span>

      {/* Accent bar for desktop active */}
      {!mobile && active && (
        <motion.div
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-0 h-full w-1 rounded-r-md bg-emerald-500"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </Link>
  );
}
