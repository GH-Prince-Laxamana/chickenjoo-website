import type { Metadata } from "next";
import FoundationPage from "@/components/FoundationPage";

export const metadata: Metadata = { title: "Blog / Updates" };

export default function Blog() {
  return <FoundationPage title="Blog / Updates" description="Campaign stories and restaurant updates will appear here. Promotion dates, terms, and social links will be confirmed before publication." />;
}
