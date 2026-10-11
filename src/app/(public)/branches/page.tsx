import type { Metadata } from "next";
import FoundationPage from "@/components/FoundationPage";

export const metadata: Metadata = { title: "Branches" };

export default function Branches() {
  return <FoundationPage title="Branches" description="Find your nearest Chicken Joo. Branch addresses, hours, contact details, and directions will be added after verification." />;
}
