import Link from "next/link";
import { chapters } from "@/content/chapters";
import { getCurrentUser } from "@/lib/auth";
import { pool, ensureSchema } from "@/lib/db";

export default async function ChaptersPage() {
  const user = await getCurrentUser();

  let completedSlugs = new Set<string>();
  if (user) {
    await ensureSchema();
    const result = await pool.query(
      "SELECT chapter_slug FROM progress WHERE user_id = $1 AND status = 'completed'",
      [user.id]
    );
    completedSlugs = new Set(result.rows.map((r) => r.chapter_slug));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">
        Daftar Bab
      </h1>
      <p className="text-muted mb-10">
        {completedSlugs.size} dari {chapters.length} bab selesai.
      </p>

      <ol className="space-y-3">
        {chapters.map((chapter) => {
          const done = completedSlugs.has(chapter.slug);
          return (
            <li key={chapter.slug}>
              <Link
                href={`/chapters/${chapter.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 hover:border-clay/60 hover:shadow-softer transition-all group"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    done
                      ? "bg-clay text-white"
                      : "bg-surface-alt text-muted"
                  }`}
                >
                  {done ? "✓" : chapter.order}
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-ink group-hover:text-clay transition-colors">
                    {chapter.title}
                  </span>
                  <span className="block text-sm text-muted">{chapter.summary}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
