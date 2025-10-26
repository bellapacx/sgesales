"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 🌙 Themed Card — Dark Carbon + Mint Accent
 */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Base layout
        "rounded-2xl border backdrop-blur-sm transition-all duration-200",
        // Light mode
        "border-[var(--color-border-light)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        // Dark mode
        "dark:border-[var(--color-border-dark)] dark:bg-[var(--color-surface-dark)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
        // Hover depth effect
        "hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-5 border-b transition-colors",
        "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]",
        "bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-deep)]",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold tracking-tight leading-none",
        "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]",
        "flex items-center gap-2",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-5 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]",
        className
      )}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-t",
        "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]",
        "flex items-center justify-end gap-3",
        className
      )}
      {...props}
    />
  );
}
