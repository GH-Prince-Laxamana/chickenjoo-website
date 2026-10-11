import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Chicken Joo | Student Demonstration", template: "%s | Chicken Joo" },
  description: "A student demonstration website for Chicken Joo. Explore the brand and preview upcoming menu, branch, and campaign content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="font-body bg-cj-cream text-cj-charcoal">{children}</body>
    </html>
  );
}
