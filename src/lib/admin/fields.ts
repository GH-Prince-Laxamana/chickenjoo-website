export type Resource = "menu-items" | "branches" | "blog-posts" | "inquiries";
export type Field = { key: string; label: string; kind: "text" | "textarea" | "boolean" | "number" | "price" | "lines" | "paragraphs" | "select" | "date"; required?: boolean; max?: number; options?: string[]; help?: string };
export const resources: Record<Resource, string> = { "menu-items": "Menu", branches: "Branches", "blog-posts": "Posts", inquiries: "Inquiries" };
export function isResource(value: string): value is Resource { return Object.hasOwn(resources, value); }
export const fields: Record<Resource, Field[]> = {
  "menu-items": [
    { key: "name", label: "Name", kind: "text", required: true, max: 120 },
    { key: "description", label: "Description", kind: "textarea", required: true, max: 1200 },
    { key: "category", label: "Category", kind: "text", required: true, max: 80 },
    { key: "priceCentavos", label: "Price (PHP)", kind: "price", required: true },
    { key: "image", label: "Image path", kind: "text", max: 300, help: "Optional supplied asset: /images/filename.webp (jpg, png, avif also supported)." },
    { key: "flavorOptions", label: "Flavor options", kind: "lines", help: "One flavor per line; leave blank for sides." },
    { key: "requiredFlavorCount", label: "Required flavors", kind: "select", options: ["0", "1", "2"] },
    { key: "isAvailable", label: "Available for the demonstration", kind: "boolean" },
    { key: "isFeatured", label: "Featured", kind: "boolean" },
    { key: "isArchived", label: "Archived (hidden publicly)", kind: "boolean" },
  ],
  branches: [
    { key: "name", label: "Branch name", kind: "text", required: true, max: 120 },
    { key: "address", label: "Address", kind: "textarea", required: true, max: 500 },
    { key: "city", label: "City", kind: "text", required: true, max: 80 },
    { key: "province", label: "Province", kind: "text", max: 80 },
    { key: "businessHours", label: "Readable hours", kind: "textarea", max: 500 },
    { key: "openingTime", label: "Opening time (HH:mm)", kind: "text", max: 5 },
    { key: "closingTime", label: "Closing time (HH:mm)", kind: "text", max: 5 },
    { key: "closesNextDay", label: "Closes on the following day", kind: "boolean" },
    { key: "phone", label: "Branch phone", kind: "text", max: 60 },
    { key: "email", label: "Branch email", kind: "text", max: 254 },
    { key: "mapsUrl", label: "Google Maps URL", kind: "text", max: 1000 },
    { key: "facebookUrl", label: "Branch Facebook URL", kind: "text", max: 1000 },
    { key: "isActive", label: "Active", kind: "boolean" },
    { key: "isArchived", label: "Archived (hidden publicly)", kind: "boolean" },
  ],
  "blog-posts": [
    { key: "title", label: "Title", kind: "text", required: true, max: 160 },
    { key: "slug", label: "Slug", kind: "text", required: true, max: 160, help: "Lowercase words separated by hyphens. Must be unique." },
    { key: "excerpt", label: "Excerpt", kind: "textarea", required: true, max: 500 },
    { key: "body", label: "Body", kind: "paragraphs", required: true, max: 40000, help: "Plain text only. Separate paragraphs with a blank line; up to 5,000 characters per paragraph." },
    { key: "type", label: "Type", kind: "select", options: ["article", "promotion"], help: "Use promotion only for supplied campaign content. This does not create a voucher." },
    { key: "status", label: "Status", kind: "select", options: ["draft", "published"] },
    { key: "publishedDate", label: "Publication date", kind: "date", help: "Required when published. Future dates stay hidden until that calendar day (UTC)." },
    { key: "coverImage", label: "Cover image path", kind: "text", max: 300 },
    { key: "sourceUrl", label: "Original Facebook post URL", kind: "text", max: 1000 },
    { key: "ctaLabel", label: "CTA label", kind: "text", max: 80 },
    { key: "ctaHref", label: "CTA destination", kind: "select", options: ["", "/menu", "/branches"] },
  ],
  inquiries: [{ key: "status", label: "Status", kind: "select", options: ["new", "resolved"] }],
};
export function defaults(resource: Resource): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of fields[resource]) result[field.key] = field.kind === "boolean" ? false : field.kind === "lines" || field.kind === "paragraphs" ? [] : field.kind === "price" ? 0 : field.options?.[0] ?? "";
  if (resource === "menu-items") { result.isAvailable = true; result.requiredFlavorCount = 0; }
  if (resource === "branches") result.isActive = true;
  return result;
}
