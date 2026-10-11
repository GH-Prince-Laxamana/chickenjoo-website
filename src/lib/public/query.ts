export class PublicQueryError extends Error {}

export type PublicListQuery = {
  q: string;
  filter: string;
  page: number;
  limit: number;
};

export function parsePublicListQuery(params: URLSearchParams, filterName: "category" | "city"): PublicListQuery {
  const allowed = new Set(["q", filterName, "page", "limit"]);
  for (const key of params.keys()) {
    if (!allowed.has(key)) throw new PublicQueryError(`Unsupported query parameter: ${key.slice(0, 40)}.`);
    if (params.getAll(key).length !== 1) throw new PublicQueryError(`Provide ${key} only once.`);
  }

  const q = (params.get("q") ?? "").trim();
  const filter = (params.get(filterName) ?? "").trim();
  if (q.length > 80) throw new PublicQueryError("Search must be 80 characters or fewer.");
  if (filter.length > 80) throw new PublicQueryError("Filter must be 80 characters or fewer.");

  function integer(name: string, fallback: number, maximum: number) {
    const value = params.get(name);
    if (value === null) return fallback;
    if (!/^[1-9]\d*$/.test(value)) throw new PublicQueryError(`${name} must be a positive integer.`);
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed > maximum) {
      throw new PublicQueryError(`${name} must be no greater than ${maximum}.`);
    }
    return parsed;
  }

  return { q, filter, page: integer("page", 1, 1000), limit: integer("limit", 12, 48) };
}

// User search text is literal text, never an executable regular expression.
export function escapeSearchText(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function listMeta(query: PublicListQuery, total: number) {
  return {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
}
