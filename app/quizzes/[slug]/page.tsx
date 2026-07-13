import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getChapter } from "@/content/chapters";
import {
  allQuizzes,
  getQuiz,
  isMiniProjectQuiz,
  toPublicMiniProject,
  toPublicQuiz,
} from "@/content/quizzes";
import QuizRunner from "@/components/QuizRunner";
import MiniProjectWorkspace from "@/components/MiniProjectWorkspace";
import { getCurrentUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

interface QuizProgressRow {
  best_score: number;
  last_score: number;
  attempts: number;
  passed: boolean;
}

interface WorkspaceDraftRow {
  files: Record<string, string>;
}

export function generateStaticParams() {
  return allQuizzes.map((quiz) => ({
    slug: isMiniProjectQuiz(quiz) ? quiz.slug : quiz.chapterSlug,
  }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) notFound();
  const chapter = isMiniProjectQuiz(quiz) ? null : getChapter(quiz.chapterSlug);
  if (!isMiniProjectQuiz(quiz) && !chapter) notFound();

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/quizzes/${slug}`)}`);
  }

  await ensureSchema();
  const [result, draftResult] = await Promise.all([
    getPool().query(
      `SELECT best_score, last_score, attempts, passed
       FROM quiz_progress WHERE user_id = $1 AND chapter_slug = $2`,
      [user.id, slug],
    ),
    isMiniProjectQuiz(quiz)
      ? getPool().query(
          `SELECT files FROM quiz_workspace_drafts
           WHERE user_id = $1 AND quiz_slug = $2`,
          [user.id, slug],
        )
      : Promise.resolve({ rows: [] }),
  ]);
  const row = result.rows[0] as QuizProgressRow | undefined;
  const draft = draftResult.rows[0] as WorkspaceDraftRow | undefined;
  const initialProgress = row
    ? {
        bestScore: row.best_score,
        lastScore: row.last_score,
        attempts: row.attempts,
        passed: row.passed,
      }
    : null;

  return (
    <div className={`mx-auto px-6 py-12 ${chapter ? "max-w-3xl" : "max-w-6xl"}`}>
      <Link href="/quizzes" className="text-sm text-muted transition-colors hover:text-ink">
        ← Semua quiz
      </Link>
      <div className="mt-8">
        <p className="text-sm font-medium uppercase tracking-wide text-clay">
          {chapter ? `Quiz Bab ${chapter.order}` : "Mini project akhir course"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          {chapter?.title ?? quiz.title}
        </h1>
        <p className="mt-3 text-muted">{quiz.description}</p>
        <p className="mt-2 text-sm text-muted">
          {chapter
            ? "5 soal · skor minimal lulus 80%"
            : "Workspace multi-file · lulus jika semua hidden test terpenuhi"}
        </p>
        {initialProgress && (
          <p className="mt-4 text-sm text-muted">
            Skor terbaik: <span className="font-medium text-ink">{initialProgress.bestScore}%</span>
            {initialProgress.passed ? " · Lulus" : " · Belum lulus"}
          </p>
        )}
      </div>

      <div className="mt-8">
        {isMiniProjectQuiz(quiz) ? (
          <MiniProjectWorkspace
            project={toPublicMiniProject(quiz)}
            initialFiles={draft?.files ?? null}
            initialProgress={initialProgress}
          />
        ) : (
          <QuizRunner quiz={toPublicQuiz(quiz)} initialProgress={initialProgress} />
        )}
      </div>
    </div>
  );
}
