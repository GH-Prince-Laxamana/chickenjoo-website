import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Chicken Joo | Korean-style boneless chicken", template: "%s | Chicken Joo" },
  description: "Korean-style boneless chicken for your lunch break or the whole barkada. Explore Chicken Joo meals, sharing boxes, and branches in Pampanga.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body bg-cj-cream text-cj-charcoal">{children}</body>
    </html>
  );
}
