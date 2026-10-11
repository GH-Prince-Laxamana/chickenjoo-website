import { orderBody, orderFailure, orderJson } from "@/lib/orders/http";
import { quoteOrder } from "@/lib/orders/service";
import { onlyKeys } from "@/lib/orders/domain";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try { const body = await orderBody(request); onlyKeys(body, ["branchId", "items"]); return orderJson({ data: await quoteOrder(body) }); }
  catch (error) { return orderFailure(error); }
}
