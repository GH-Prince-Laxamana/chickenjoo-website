import type { Metadata } from "next";
import FoundationPage from "@/components/FoundationPage";

export const metadata: Metadata = { title: "Menu" };

export default function Menu() {
  return <FoundationPage title="Menu" description="The menu is being prepared. Verified dishes, prices, categories, and availability will appear here, with search and filtering." />;
}
