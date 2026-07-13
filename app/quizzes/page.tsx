import Link from "next/link";
import { chapters } from "@/content/chapters";
import {
  allQuizzes,
  getMiniProjectForChapter,
  getQuiz,
} from "@/content/quizzes";
import { getCurrentUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

interface QuizProgressRow {
  chapter_slug: string;
  best_score: number;
  attempts: number;
  passed: boolean;
}

export default async function QuizzesPage() {
  const user = await getCurrentUser();
  const progress = new Map<string, QuizProgressRow>();

  if (user) {
    await ensureSchema();
    const result = await getPool().query(
      `SELECT chapter_slug, best_score, attempts, passed
       FROM quiz_progress WHERE user_id = $1`,
      [user.id],
    );
    for (const row of result.rows as QuizProgressRow[]) {
      progress.set(row.chapter_slug, row);
    }
  }

  const passedCount = [...progress.values()].filter((row) => row.passed).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-clay">Belajar sambil menguji diri</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Quiz & Mini Project</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Uji pemahaman setiap bab lewat soal konsep dan coding challenge, lalu praktikkan materinya dalam mini project per bab.
      </p>
      <p className="mt-5 text-sm text-muted">
        {user
          ? `${passedCount} dari ${allQuizzes.length} latihan lulus.`
          : "Masuk untuk mulai mengerjakan dan menyimpan skor."}
      </p>

      <ol className="mt-8 space-y-3">
        {chapters.map((chapter) => {
          const quiz = getQuiz(chapter.slug);
          const row = progress.get(chapter.slug);
          const miniProject = getMiniProjectForChapter(chapter.slug);
          const miniProgress = miniProject
            ? progress.get(miniProject.slug)
            : undefined;
          if (!quiz) return null;

          return (
            <li
              key={chapter.slug}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Link
                href={`/quizzes/${chapter.slug}`}
                className="flex items-center gap-4 p-5 transition-all hover:bg-surface-alt group"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    row?.passed ? "bg-clay text-white" : "bg-surface-alt text-muted"
                  }`}
                >
                  {row?.passed ? "✓" : chapter.order}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink transition-colors group-hover:text-clay">
                    {chapter.title}
                  </span>
                  <span className="block text-sm text-muted">{chapter.summary}</span>
                </span>
                <span className="shrink-0 text-right text-xs text-muted">
                  {row ? `${row.best_score}% terbaik` : "Belum dicoba"}
                  {row && <span className="block">{row.attempts} percobaan</span>}
                </span>
              </Link>
              {miniProject && (
                <Link
                  href={`/quizzes/${miniProject.slug}`}
                  className="flex items-center justify-between gap-4 border-t border-border bg-clay-soft/45 px-5 py-3 transition-colors hover:bg-clay-soft"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-clay">
                      Mini project
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-ink">
                      {miniProject.title}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-muted">
                    {miniProgress
                      ? `${miniProgress.best_score}% terbaik`
                      : "Mulai →"}
                    {miniProgress && (
                      <span className="block">{miniProgress.attempts} percobaan</span>
                    )}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
