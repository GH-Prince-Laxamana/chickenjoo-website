import { orderBody, orderFailure, orderJson } from "@/lib/orders/http";
import { submitOrder } from "@/lib/orders/service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try { return orderJson({ data: await submitOrder(await orderBody(request)) }, 201); }
  catch (error) { return orderFailure(error); }
}
