"use client";
import { useSyncExternalStore } from "react";
import type { OrderLine } from "./domain";
export type CartLine = OrderLine & { name: string; priceCentavos: number };
const key = "cj-demo-cart-v1", empty: CartLine[] = [];
let cachedRaw: string | null | undefined, cached = empty;
const listeners = new Set<() => void>();
function snapshot() {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { return cached; }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length > 20 || parsed.some((item) => !item || typeof item.menuItemId !== "string" || !/^[a-f0-9]{24}$/.test(item.menuItemId) || typeof item.name !== "string" || item.name.length > 120 || !Number.isSafeInteger(item.priceCentavos) || item.priceCentavos < 0 || item.priceCentavos > 100_000_000 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10 || !Array.isArray(item.flavors) || item.flavors.length > 2 || item.flavors.some((flavor: unknown) => typeof flavor !== "string" || flavor.length > 80)) || parsed.reduce((sum, item) => sum + item.quantity, 0) > 50) throw new Error();
    cached = parsed;
  } catch { cached = empty; }
  return cached;
}
function subscribe(listener: () => void) {
  listeners.add(listener); window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
export function useCart() { return useSyncExternalStore(subscribe, snapshot, () => empty); }
export function lineKey(item: OrderLine) { return JSON.stringify([item.menuItemId, [...item.flavors].sort()]); }
function save(items: CartLine[]) {
  if (items.length > 20 || items.reduce((sum, item) => sum + item.quantity, 0) > 50) throw new Error("The demo allows 20 cart lines and 50 items.");
  try { localStorage.setItem(key, JSON.stringify(items)); cachedRaw = undefined; }
  catch { throw new Error("Enable browser storage to use the demo cart."); }
  listeners.forEach((listener) => listener());
}
export function addToCart(item: CartLine) {
  const items = snapshot(), existing = items.find((line) => lineKey(line) === lineKey(item));
  if (existing && existing.quantity + item.quantity > 10) throw new Error("Each cart item allows at most 10 of the same flavor selection.");
  save(existing ? items.map((line) => line === existing ? { ...item, quantity: existing.quantity + item.quantity } : line) : [...items, item]);
}
export function setQuantity(key: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 10) throw new Error("Choose a quantity from 1 to 10.");
  save(snapshot().flatMap((line) => lineKey(line) === key ? quantity ? [{ ...line, quantity }] : [] : [line]));
}
export function clearCart() { save([]); }
