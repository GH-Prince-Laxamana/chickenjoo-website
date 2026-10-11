"use client";

import { useEffect, useState } from "react";
import type { PublicList } from "@/lib/public/types";

export function usePublicList<T>(url: string) {
  const [attempt, setAttempt] = useState(0);
  const key = `${url}:${attempt}`;
  const [result, setResult] = useState<{ key: string; data: PublicList<T> | null; error: boolean }>({
    key: "", data: null, error: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Public data unavailable.");
        const data: PublicList<T> = await response.json();
        if (!controller.signal.aborted) setResult({ key, data, error: false });
      } catch {
        if (!controller.signal.aborted) setResult((previous) => ({ key, data: previous.data, error: true }));
      }
    }
    void load();
    return () => controller.abort();
  }, [url, key]);

  return {
    data: result.data,
    loading: result.key !== key,
    error: result.key === key && result.error,
    retry: () => setAttempt((value) => value + 1),
  };
}
