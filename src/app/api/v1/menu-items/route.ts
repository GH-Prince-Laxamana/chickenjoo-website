import { getPublicMenu } from "@/lib/public/catalog";
import { parsePublicListQuery } from "@/lib/public/query";
import { publicJson, publicReadError } from "@/lib/public/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = parsePublicListQuery(new URL(request.url).searchParams, "category");
    return publicJson(await getPublicMenu(query));
  } catch (error) {
    return publicReadError(error);
  }
}
