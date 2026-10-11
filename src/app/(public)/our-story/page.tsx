import type { Metadata } from "next";
import FoundationPage from "@/components/FoundationPage";

export const metadata: Metadata = { title: "Our Story" };

export default function OurStory() {
  return <FoundationPage title="Our Story" description="Discover Chicken Joo's story and what makes its food special. Verified brand information and supplied visuals will be added here." />;
}
