"use client";
import { useSyncExternalStore } from "react";
import type { OrderLine } from "./domain";
export type CartLine = OrderLine & { name: string; priceCentavos: number };
const empty: CartLine[] = [];
let owner: string | null = null;
const storageKey = () => `cj-cart-v2:${owner}`;
let cachedRaw: string | null | undefined, cached = empty;
const listeners = new Set<() => void>();
function snapshot() {
  if (!owner) return empty;
  let raw: string | null = null;
  try { raw = localStorage.getItem(storageKey()); } catch { return cached; }
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
  if (!owner) throw new Error("Sign in before changing your cart.");
  if (items.length > 20 || items.reduce((sum, item) => sum + item.quantity, 0) > 50) throw new Error("Your cart can hold up to 20 different selections and 50 items in total.");
  try { localStorage.setItem(storageKey(), JSON.stringify(items)); cachedRaw = undefined; }
  catch { throw new Error("Enable browser storage to save your cart."); }
  listeners.forEach((listener) => listener());
}
export function setCartUser(id: string | null) {
  if (owner === id) return;
  owner = id; cachedRaw = undefined; cached = empty;
  listeners.forEach(listener => listener());
}
export async function addToCart(item: CartLine) {
  const response = await fetch("/api/v1/user/session", { cache: "no-store" });
  if (!response.ok) throw new Error("Account status is unavailable. Please try again.");
  const { data: user } = await response.json();
  if (!user) {
    setCartUser(null);
    sessionStorage.setItem("cj-pending-cart", JSON.stringify({ item, expiresAt: Date.now() + 30 * 60_000 }));
    return false;
  }
  setCartUser(user.id);
  const items = snapshot(), existing = items.find((line) => lineKey(line) === lineKey(item));
  if (existing && existing.quantity + item.quantity > 10) throw new Error("Each cart item allows at most 10 of the same flavor selection.");
  save(existing ? items.map((line) => line === existing ? { ...item, quantity: existing.quantity + item.quantity } : line) : [...items, item]);
  return true;
}
export async function resumePendingCart() {
  const raw = sessionStorage.getItem("cj-pending-cart");
  if (!raw) return;
  const pending = JSON.parse(raw);
  if (!pending || !Number.isFinite(pending.expiresAt) || pending.expiresAt < Date.now() || !pending.item || typeof pending.item.menuItemId !== "string" || !/^[a-f0-9]{24}$/.test(pending.item.menuItemId) || typeof pending.item.name !== "string" || !Number.isSafeInteger(pending.item.priceCentavos) || !Number.isInteger(pending.item.quantity) || pending.item.quantity < 1 || pending.item.quantity > 10 || !Array.isArray(pending.item.flavors) || pending.item.flavors.some((flavor: unknown) => typeof flavor !== "string")) {
    sessionStorage.removeItem("cj-pending-cart"); return;
  }
  if (await addToCart(pending.item)) sessionStorage.removeItem("cj-pending-cart");
}
export function setQuantity(key: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 10) throw new Error("Choose a quantity from 1 to 10.");
  save(snapshot().flatMap((line) => lineKey(line) === key ? quantity ? [{ ...line, quantity }] : [] : [line]));
}
export function clearCart() { save([]); }
