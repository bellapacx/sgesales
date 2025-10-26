"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", value, ...props }, ref) => {
    // Prevent default 0 for number fields
    const inputProps: any = {};
    if (type === "number") {
      inputProps.inputMode = "numeric";
      inputProps.pattern = "[0-9]*";
      inputProps.onWheel = (e: React.WheelEvent<HTMLInputElement>) =>
        e.currentTarget.blur(); // Prevent scroll increment
      inputProps.value = value === 0 || value === "0" ? "" : value ?? ""; // Remove default 0
    }

    return (
      <input
        ref={ref}
        type={type}
        {...inputProps}
        {...props}
        className={cn(
          // Base layout
          "flex h-10 w-full rounded-xl px-3 py-2 text-sm transition-all duration-200",
          "placeholder:text-[var(--color-text-muted)] focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",

          // Borders & backgrounds
          "border border-[var(--color-border-light)] bg-[var(--color-surface)] text-[var(--color-text-primary)]",
          "dark:border-[var(--color-border-dark)] dark:bg-[var(--color-surface-dark)] dark:text-[var(--color-text-primary)]",

          // Focus ring with mint glow ✨
          "focus-visible:ring-2 focus-visible:ring-[var(--color-mint-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
          "dark:focus-visible:ring-offset-[var(--color-surface-dark)]",

          // Hover refinement
          "hover:border-[var(--color-mint-500)/50]",

          // Remove number input arrows
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",

          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
