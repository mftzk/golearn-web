"use client";

import { useEffect, useState } from "react";

export default function LessonLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("golearn:toc-open");
    if (saved !== null) setOpen(saved === "1");
  }, []);

  function toggle() {
    setOpen((v) => {
      const next = !v;
      localStorage.setItem("golearn:toc-open", next ? "1" : "0");
      return next;
    });
  }

  return (
    <div
      className={`mt-4 grid gap-8 ${
        open ? "lg:grid-cols-[15rem_1fr]" : "lg:grid-cols-1"
      }`}
    >
      {open && (
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Daftar isi
            </p>
            <button
              onClick={toggle}
              className="text-xs text-muted hover:text-ink transition-colors"
              aria-label="Sembunyikan daftar isi"
            >
              Sembunyikan ✕
            </button>
          </div>
          {sidebar}
        </aside>
      )}

      <div>
        {!open && (
          <button
            onClick={toggle}
            className="mb-6 hidden lg:inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted hover:text-ink hover:border-clay/50 transition-colors"
          >
            ☰ Tampilkan daftar isi
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
