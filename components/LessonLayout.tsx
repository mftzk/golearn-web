"use client";

import { useSyncExternalStore } from "react";

const TOC_STORAGE_KEY = "golearn:toc-open";
const TOC_CHANGE_EVENT = "golearn:toc-change";

function subscribeToToc(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(TOC_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(TOC_CHANGE_EVENT, onStoreChange);
  };
}

function getTocOpenSnapshot() {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(TOC_STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

function getServerTocOpenSnapshot() {
  return true;
}

export default function LessonLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const open = useSyncExternalStore(
    subscribeToToc,
    getTocOpenSnapshot,
    getServerTocOpenSnapshot,
  );

  function toggle() {
    const next = !open;
    window.localStorage.setItem(TOC_STORAGE_KEY, next ? "1" : "0");
    window.dispatchEvent(new Event(TOC_CHANGE_EVENT));
  }

  return (
    <div
      className={`mt-4 grid gap-8 ${
        open ? "lg:grid-cols-[15rem_1fr]" : "lg:grid-cols-1"
      }`}
    >
      {open && (
        <aside
          id="chapter-table-of-contents"
          className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
        >
          <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Daftar isi
            </p>
            <button
              type="button"
              onClick={toggle}
              title="Sembunyikan daftar isi"
              aria-label="Sembunyikan daftar isi"
              aria-expanded={open}
              aria-controls="chapter-table-of-contents"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-alt hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
                <path strokeLinecap="round" d="M19 6v12" />
              </svg>
            </button>
          </div>
          {sidebar}
        </aside>
      )}

      <div>
        {!open && (
          <button
            type="button"
            onClick={toggle}
            title="Tampilkan daftar isi"
            aria-label="Tampilkan daftar isi"
            aria-expanded={open}
            aria-controls="chapter-table-of-contents"
            className="fixed left-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-r-xl border border-l-0 border-border bg-surface px-2.5 py-3 text-muted shadow-softer transition-colors hover:border-clay/50 hover:bg-surface-alt hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-clay/50 lg:inline-flex"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" d="M5 6h14M5 12h14M5 18h14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 8 4 4-4 4" />
            </svg>
            <span
              className="text-[11px] font-medium tracking-wide [writing-mode:vertical-rl]"
              style={{ transform: "rotate(180deg)" }}
            >
              Daftar isi
            </span>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
