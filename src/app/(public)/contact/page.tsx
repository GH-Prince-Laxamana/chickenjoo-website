import type { Metadata } from "next";
import FoundationPage from "@/components/FoundationPage";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return <FoundationPage title="Contact" description="Verified contact information and a contact form will be added here. This preview does not currently accept inquiries." />;
}
