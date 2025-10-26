"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        // Default style for all toasts
        className:
          "rounded-xl bg-white shadow-md border border-gray-100 px-4 py-2 text-sm font-medium text-gray-800",
        duration: 4000,

        // Success Toast
        success: {
          iconTheme: {
            primary: "oklch(0.72 0.11 178)", // your --color-mint-500
            secondary: "white",
          },
        },

        // Error Toast
        error: {
          style: {
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          },
        },
      }}
    />
  );
}
