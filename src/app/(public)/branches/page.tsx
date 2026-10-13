import type { Metadata } from "next";
import BranchExplorer from "@/components/branches/BranchExplorer";

export const metadata: Metadata = { title: "Branches", description: "Find Chicken Joo in Pampanga. Check branch addresses, opening hours, and directions before your next chicken break." };

export default function Branches() {
  return <BranchExplorer />;
}
