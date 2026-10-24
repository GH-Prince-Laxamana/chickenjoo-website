"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useRef } from "react";

const storageKey = "chickenjoo-demo-disclaimer-understood";

export default function SiteDisclaimer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current;
    let understood = false;
    try {
      understood = localStorage.getItem(storageKey) === "true";
    } catch {
      // Storage restrictions must not prevent visitors from reading the notice.
    }
    if (!understood) element?.showModal();
    return () => element?.close();
  }, []);

  function acknowledge() {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // The notice can still close when browser storage is unavailable.
    }
    dialog.current?.close();
  }

  return (
    <>
      <button
        type="button"
        aria-label="View website disclaimer"
        aria-haspopup="dialog"
        title="Website disclaimer"
        onClick={() => dialog.current?.showModal()}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-11 w-11 items-center justify-center rounded-full border border-cj-navy/15 bg-white text-cj-charcoal shadow-sm transition-colors hover:border-cj-red hover:text-cj-red"
      >
        <Info size={20} aria-hidden="true" />
      </button>
      <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId} className="menu-dialog">
        <div className="p-6 sm:p-8">
          <h2 id={titleId} className="text-2xl font-bold tracking-tight text-cj-navy sm:text-3xl">A quick disclaimer</h2>
          <p id={descriptionId} className="mt-4 text-base leading-relaxed text-cj-charcoal">
            This website is for demonstration purposes only and is not affiliated with Chicken Joo. Orders, inquiries, and other submissions made here are for demonstration only and are not official requests.
          </p>
          <button type="button" autoFocus onClick={acknowledge} className="cj-button cj-button-order mt-7 w-full">I Understand</button>
        </div>
      </dialog>
    </>
  );
}
