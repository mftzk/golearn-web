import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chapters, getChapter, chapterNeighbors } from "@/content/chapters";
import { getCurrentUser } from "@/lib/auth";
import { getPool, ensureSchema } from "@/lib/db";
import CodeConsole from "@/components/CodeConsole";
import ChapterSidebar from "@/components/ChapterSidebar";

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const user = await getCurrentUser();
  let initialCode = chapter.starterCode;
  let initiallyCompleted = false;
  let completedSlugs = new Set<string>();

  if (user) {
    await ensureSchema();
    const [current, all] = await Promise.all([
      getPool().query(
        "SELECT status, last_code FROM progress WHERE user_id = $1 AND chapter_slug = $2",
        [user.id, chapter.slug]
      ),
      getPool().query(
        "SELECT chapter_slug FROM progress WHERE user_id = $1 AND status = 'completed'",
        [user.id]
      ),
    ]);
    const row = current.rows[0];
    if (row) {
      initiallyCompleted = row.status === "completed";
      if (row.last_code) initialCode = row.last_code;
    }
    completedSlugs = new Set(all.rows.map((r) => r.chapter_slug));
  }

  const { prev, next } = chapterNeighbors(slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link href="/chapters" className="text-sm text-muted hover:text-ink transition-colors">
        ← Semua bab
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Daftar isi
          </p>
          <ChapterSidebar currentSlug={chapter.slug} completedSlugs={completedSlugs} />
        </aside>

        <div>
          <details className="lg:hidden mb-6 rounded-xl border border-border bg-surface">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink">
              Daftar isi — Bab {chapter.order}/{chapters.length}
            </summary>
            <div className="border-t border-border px-2 py-2">
              <ChapterSidebar currentSlug={chapter.slug} completedSlugs={completedSlugs} />
            </div>
          </details>

          <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-clay mb-2">
            Bab {chapter.order} dari {chapters.length}
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink mb-6">
            {chapter.title}
          </h1>
          <article className="prose-lesson">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chapter.lessonMarkdown}
            </ReactMarkdown>
          </article>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            {prev ? (
              <Link
                href={`/chapters/${prev.slug}`}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/chapters/${next.slug}`}
                className="text-sm text-clay hover:text-clay-hover transition-colors"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CodeConsole
            chapterSlug={chapter.slug}
            initialCode={initialCode}
            expectedOutput={chapter.expectedOutput}
            isLoggedIn={!!user}
            initiallyCompleted={initiallyCompleted}
          />
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
