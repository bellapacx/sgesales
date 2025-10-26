import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

import { Suspense } from "react";

// Font
const inter = Inter({ subsets: ["latin"] });

/**
 * Global metadata for SEO & social sharing
 */
export const metadata: Metadata = {
  title: "SoftDrink Sales System",
  description: "Sales & Inventory Management Dashboard",
  openGraph: {
    title: "SoftDrink Sales System",
    description:
      "Monitor, record, and manage your soft drink sales and inventory easily.",
    url: "https://softdrink.example.com", // Update when you have domain
    siteName: "SoftDrink Sales System",
    images: [
      {
        url: "/og-image.png", // optional social preview
        width: 1200,
        height: 630,
        alt: "SoftDrink Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftDrink Sales System",
    description: "Track and manage soft drink sales efficiently.",
    creator: "@softdrink_admin", // optional handle
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 antialiased"
        )}
      >
        <div className="flex flex-col min-h-screen">
          {/* Suspense for lazy-loading children */}
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center text-gray-500">
                Loading dashboard...
              </div>
            }
          >
            <main className="flex-1">{children}</main>
          </Suspense>

          {/* Footer */}
          <footer className="w-full border-t bg-white dark:bg-gray-800 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} SoftDrink Sales System
          </footer>
        </div>
      </body>
    </html>
  );
}
