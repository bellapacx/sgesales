"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 🎨 Button Variants
 * Now includes new "subtle" and "glow" variants and respects dark-theme tokens.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-xl font-medium transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-mint-600)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-mint-600)] text-[var(--color-text-primary)] hover:bg-[var(--color-mint-700)] shadow-sm",
        subtle:
          "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] border border-[var(--color-border-light)]",
        outline:
          "border border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]",
        ghost:
          "bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]",
        link: "text-[var(--color-mint-500)] underline-offset-4 hover:underline",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        glow: [
          "bg-[var(--color-mint-600)] text-[var(--color-text-primary)]",
          "hover:shadow-[0_0_12px_var(--color-mint-600)] hover:bg-[var(--color-mint-700)]",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-lg",
        icon: "h-10 w-10",
      },
      radius: {
        default: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * 🧩 Themed Button Component
 * Integrates with Dark Carbon color tokens and supports Slot rendering.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, radius }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
