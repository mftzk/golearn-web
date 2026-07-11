import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { chapters, getChapter } from "@/content/chapters";
import { getQuiz, toPublicQuiz } from "@/content/quizzes";
import QuizRunner from "@/components/QuizRunner";
import { getCurrentUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

interface QuizProgressRow {
  best_score: number;
  last_score: number;
  attempts: number;
  passed: boolean;
}

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  const quiz = getQuiz(slug);
  if (!chapter || !quiz) notFound();

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/quizzes/${slug}`)}`);
  }

  await ensureSchema();
  const result = await getPool().query(
    `SELECT best_score, last_score, attempts, passed
     FROM quiz_progress WHERE user_id = $1 AND chapter_slug = $2`,
    [user.id, slug],
  );
  const row = result.rows[0] as QuizProgressRow | undefined;
  const initialProgress = row
    ? {
        bestScore: row.best_score,
        lastScore: row.last_score,
        attempts: row.attempts,
        passed: row.passed,
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/quizzes" className="text-sm text-muted transition-colors hover:text-ink">
        ← Semua quiz
      </Link>
      <div className="mt-8">
        <p className="text-sm font-medium uppercase tracking-wide text-clay">
          Quiz Bab {chapter.order}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{chapter.title}</h1>
        <p className="mt-3 text-muted">{quiz.description}</p>
        <p className="mt-2 text-sm text-muted">5 soal · skor minimal lulus 80%</p>
        {initialProgress && (
          <p className="mt-4 text-sm text-muted">
            Skor terbaik: <span className="font-medium text-ink">{initialProgress.bestScore}%</span>
            {initialProgress.passed ? " · Lulus" : " · Belum lulus"}
          </p>
        )}
      </div>

      <div className="mt-8">
        <QuizRunner quiz={toPublicQuiz(quiz)} initialProgress={initialProgress} />
      </div>
    </div>
  );
}
