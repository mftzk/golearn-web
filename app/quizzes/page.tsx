import Link from "next/link";
import { chapters } from "@/content/chapters";
import { getQuiz } from "@/content/quizzes";
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
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Quiz per Bab</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Lima soal singkat untuk setiap bab: konsep, benar atau salah, dan satu coding challenge dengan hidden test.
      </p>
      <p className="mt-5 text-sm text-muted">
        {user
          ? `${passedCount} dari ${chapters.length} quiz lulus.`
          : "Masuk untuk mulai mengerjakan dan menyimpan skor."}
      </p>

      <ol className="mt-8 space-y-3">
        {chapters.map((chapter) => {
          const quiz = getQuiz(chapter.slug);
          const row = progress.get(chapter.slug);
          if (!quiz) return null;

          return (
            <li key={chapter.slug}>
              <Link
                href={`/quizzes/${chapter.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-clay/60 hover:shadow-softer group"
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
            </li>
          );
        })}
      </ol>
    </div>
  );
}
