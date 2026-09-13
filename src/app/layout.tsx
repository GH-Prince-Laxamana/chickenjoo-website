import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout";
import { Footer } from "../components/layout";

// Heading font — warm, rounded, modern; fits the restaurant brand well
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

// Body font — clean, highly legible at all sizes
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ChickenJoo",
    default: "ChickenJoo — Korean Fried Chicken",
  },
  description:
    "ChickenJoo serves premium Korean fried chicken. Find our menu, branch locations, and latest news.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
