"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { setCartUser } from "@/lib/orders/cart";
type User = { id: string; name: string; email: string };
const Context = createContext<{ user: User | null; loading: boolean; error: string; refresh: () => Promise<void> }>({ user: null, loading: true, error: "", refresh: async () => {} });
export function useUser() { return useContext(Context); }
export default function UserProvider({ children }: { children: React.ReactNode }) {
  const version = useRef(0);
  const [user, setUser] = useState<User | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const refresh = useCallback(async () => {
    const current = ++version.current;
    try {
      const response = await fetch("/api/v1/user/session", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (current !== version.current) return;
      setCartUser(result.data?.id ?? null); setUser(result.data); setError("");
    } catch { if (current === version.current) { setUser(null); setCartUser(null); setError("Account status is temporarily unavailable."); } }
    finally { if (current === version.current) setLoading(false); }
  }, []);
  useEffect(() => {
    const invalidate = () => { version.current++; };
    const initial = window.setTimeout(() => { void refresh(); }, 0);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("cj-account-changed", onFocus);
    return () => { invalidate(); window.clearTimeout(initial); window.removeEventListener("focus", onFocus); window.removeEventListener("cj-account-changed", onFocus); };
  }, [refresh]);
  return <Context.Provider value={{ user, loading, error, refresh }}>{children}</Context.Provider>;
}
