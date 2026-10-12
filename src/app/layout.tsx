import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Chicken Joo | Student Demonstration", template: "%s | Chicken Joo" },
  description: "Browse Chicken Joo’s menu and Pampanga branches on a student demonstration website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body bg-cj-cream text-cj-charcoal">{children}</body>
    </html>
  );
}
