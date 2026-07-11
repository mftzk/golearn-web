"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

export default function Header({ user }: { user: SessionUser | null }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          Go<span className="text-clay">Learn</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/chapters" className="text-muted hover:text-ink transition-colors">
            Bab
          </Link>
          <Link href="/quizzes" className="text-muted hover:text-ink transition-colors">
            Quiz
          </Link>
          {user ? (
            <>
              <span className="text-muted hidden sm:inline">
                Halo, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-border px-4 py-1.5 text-ink hover:bg-surface-alt transition-colors"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-ink transition-colors">
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-clay px-4 py-1.5 text-white hover:bg-clay-hover transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
