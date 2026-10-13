import type { PublicBranch } from "../../lib/public/types";

// Approximate positions on a schematic, not coordinates for navigation.
export function branchPosition(branch: Pick<PublicBranch, "name" | "city">): [number, number] | null {
  const name = branch.name.toLowerCase();
  const city = branch.city.toLowerCase();
  if (city === "angeles city" && name === "chicken joo auf") return [38, 48];
  if (city === "angeles city" && name === "chicken joo hau") return [29, 57];
  if (city === "magalang" && name === "chicken joo magalang") return [73, 30];
  if (city === "san fernando" && name === "chicken joo san fernando downtown") return [57, 78];
  return null;
}
