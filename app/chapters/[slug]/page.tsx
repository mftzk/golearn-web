import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  chapters,
  getChapter,
  getChapterSections,
  chapterNeighbors,
} from "@/content/chapters";
import { getCurrentUser } from "@/lib/auth";
import { getPool, ensureSchema } from "@/lib/db";
import CodeConsole from "@/components/CodeConsole";
import ChapterSidebar from "@/components/ChapterSidebar";
import LessonLayout from "@/components/LessonLayout";

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
  const sections = getChapterSections(chapter);

  return (
    <div className="mx-auto w-full max-w-[1920px] px-6 py-12">
      <Link href="/chapters" className="text-sm text-muted hover:text-ink transition-colors">
        ← Semua bab
      </Link>

      <LessonLayout
        sidebar={
          <ChapterSidebar
            currentSlug={chapter.slug}
            completedSlugs={completedSlugs}
            sections={sections}
          />
        }
      >
          <details className="lg:hidden mb-6 rounded-xl border border-border bg-surface">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink">
              Daftar isi — Bab {chapter.order}/{chapters.length}
            </summary>
            <div className="border-t border-border px-2 py-2">
              <ChapterSidebar
                currentSlug={chapter.slug}
                completedSlugs={completedSlugs}
                sections={sections}
              />
            </div>
          </details>

          <div className="grid min-w-0 gap-10 xl:grid-cols-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-clay mb-2">
            Bab {chapter.order} dari {chapters.length}
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink mb-6">
            {chapter.title}
          </h1>
          <article className="prose-lesson">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h3({ node, children }) {
                  const section = sections.find(
                    (candidate) => candidate.sourceOffset === node?.position?.start.offset,
                  );

                  return (
                    <h3 id={section?.id} className="scroll-mt-24">
                      {children}
                    </h3>
                  );
                },
              }}
            >
              {chapter.lessonMarkdown}
            </ReactMarkdown>
          </article>

          <div className="mt-8 rounded-2xl border border-clay/30 bg-clay-soft p-5">
            <p className="text-sm font-medium text-ink">Sudah siap menguji pemahaman?</p>
            <p className="mt-1 text-sm text-muted">
              Kerjakan lima soal fokus bab ini, termasuk satu coding challenge.
            </p>
            <Link
              href={`/quizzes/${chapter.slug}`}
              className="mt-4 inline-flex rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clay-hover"
            >
              Mulai quiz bab ini →
            </Link>
          </div>

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

        <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <CodeConsole
            chapterSlug={chapter.slug}
            initialCode={initialCode}
            expectedOutput={chapter.expectedOutput}
            isLoggedIn={!!user}
            initiallyCompleted={initiallyCompleted}
          />
        </div>
          </div>
      </LessonLayout>
    </div>
  );
}
