"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        // Base style
        "block text-sm font-medium leading-none select-none transition-colors",
        // Theme-aware colors
        "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]",
        // Subtle accent when interacting
        "peer-focus:text-[var(--color-mint-500)] peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = "Label";
