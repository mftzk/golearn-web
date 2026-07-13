import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CODING_GUIDE_SECTION_ID, getChapter } from "@/content/chapters";
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
  const chapter = getChapter(quiz.chapterSlug);
  if (!chapter) notFound();

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
    <div
      className={`mx-auto px-6 py-12 ${
        isMiniProjectQuiz(quiz) ? "max-w-[1800px]" : "max-w-3xl"
      }`}
    >
      <Link href="/quizzes" className="text-sm text-muted transition-colors hover:text-ink">
        ← Semua quiz
      </Link>
      <div className="mt-8">
        <p className="text-sm font-medium uppercase tracking-wide text-clay">
          {isMiniProjectQuiz(quiz)
            ? `Mini project Bab ${chapter.order}`
            : `Quiz Bab ${chapter.order}`}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          {isMiniProjectQuiz(quiz) ? quiz.title : chapter.title}
        </h1>
        <p className="mt-3 text-muted">{quiz.description}</p>
        {!isMiniProjectQuiz(quiz) && (
          <div className="mt-5 rounded-xl border border-clay/30 bg-clay-soft px-4 py-3">
            <p className="text-sm text-ink">
              Belum yakin mulai dari mana? Baca panduan coding challenge di materi bab ini.
            </p>
            <Link
              href={`/chapters/${chapter.slug}#${CODING_GUIDE_SECTION_ID}`}
              className="mt-2 inline-flex text-sm font-medium text-clay transition-colors hover:text-clay-hover"
            >
              Buka panduan coding challenge →
            </Link>
          </div>
        )}
        <p className="mt-2 text-sm text-muted">
          {isMiniProjectQuiz(quiz)
            ? "Workspace multi-file · lulus jika semua hidden test terpenuhi"
            : "5 soal · skor minimal lulus 80%"}
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
