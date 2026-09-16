"use client";

import { useState, useEffect } from "react";

export default function DemoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup shortly after page loads for a smoother user experience
    const timer = setTimeout(() => setIsOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
        <h2 className="mb-2 font-display text-xl font-bold text-cj-navy">
          Demo Mode
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-cj-charcoal/80">
          This page is under construction and is currently a demo. Online ordering is not yet active.
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className="w-full rounded-xl bg-cj-navy py-3 text-sm font-semibold text-white transition hover:bg-cj-navy/90 active:scale-95"
        >
          Understood
        </button>
      </div>
    </div>
  );
}