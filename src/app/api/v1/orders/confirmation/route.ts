import { orderBody, orderFailure, orderJson } from "@/lib/orders/http";
import { findReceipt } from "@/lib/orders/service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try { return orderJson({ data: await findReceipt(await orderBody(request)) }); }
  catch (error) { return orderFailure(error); }
}
