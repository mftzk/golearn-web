import { NextResponse } from "next/server";
import {
  getQuiz,
  isMiniProjectQuiz,
  isValidMiniProject,
  isValidQuiz,
  QUIZ_PASSING_SCORE,
  type QuizAnswer,
} from "@/content/quizzes";
import { getCurrentUser } from "@/lib/auth";
import { getPool, ensureSchema } from "@/lib/db";
import {
  gradeConceptAnswer,
  gradeFullQuiz,
  gradeMiniProjectAnswer,
} from "@/lib/quiz";
import { RunnerClientError } from "@/lib/runner";
import {
  hasExpectedWorkspaceFiles,
  MAX_WORKSPACE_SOURCE_BYTES,
  parseWorkspaceFiles,
  workspaceSourceBytes,
} from "@/lib/workspace";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

interface SavedQuizProgress {
  best_score: number;
  last_score: number;
  attempts: number;
  passed: boolean;
}

async function saveQuizProgress(
  userId: number,
  slug: string,
  score: number,
  passed: boolean,
  completeChapter: boolean,
): Promise<SavedQuizProgress> {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const progressResult = await client.query(
      `INSERT INTO quiz_progress
         (user_id, chapter_slug, best_score, last_score, attempts, passed,
          last_attempt_at, passed_at, updated_at)
       VALUES ($1, $2, $3, $3, 1, $4, now(),
               CASE WHEN $4 THEN now() ELSE NULL END, now())
       ON CONFLICT (user_id, chapter_slug)
       DO UPDATE SET
         best_score = GREATEST(quiz_progress.best_score, EXCLUDED.last_score),
         last_score = EXCLUDED.last_score,
         attempts = quiz_progress.attempts + 1,
         passed = quiz_progress.passed OR EXCLUDED.passed,
         last_attempt_at = now(),
         passed_at = CASE
           WHEN quiz_progress.passed THEN quiz_progress.passed_at
           WHEN EXCLUDED.passed THEN now()
           ELSE quiz_progress.passed_at
         END,
         updated_at = now()
       RETURNING best_score, last_score, attempts, passed`,
      [userId, slug, score, passed],
    );

    if (completeChapter && passed) {
      await client.query(
        `INSERT INTO progress
           (user_id, chapter_slug, status, completed_at, updated_at)
         VALUES ($1, $2, 'completed', now(), now())
         ON CONFLICT (user_id, chapter_slug)
         DO UPDATE SET
           status = 'completed',
           completed_at = COALESCE(progress.completed_at, now()),
           updated_at = now()`,
        [userId, slug],
      );
    }

    await client.query("COMMIT");
    return progressResult.rows[0] as SavedQuizProgress;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) {
    return NextResponse.json({ error: "quiz tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  if (isMiniProjectQuiz(quiz)) {
    if (!isValidMiniProject(quiz)) {
      return NextResponse.json({ error: "mini project belum dikonfigurasi dengan benar" }, { status: 500 });
    }

    const files = parseWorkspaceFiles(body?.files);
    if (
      !files ||
      !hasExpectedWorkspaceFiles(files, quiz.files.map((file) => file.name))
    ) {
      return NextResponse.json({ error: "file workspace tidak valid" }, { status: 400 });
    }
    if (workspaceSourceBytes(files) > MAX_WORKSPACE_SOURCE_BYTES) {
      return NextResponse.json({ error: "source workspace terlalu besar" }, { status: 413 });
    }

    try {
      const grade = await gradeMiniProjectAnswer(quiz, files);
      const score = Math.round((grade.passedTests / grade.totalTests) * 100);
      const progress = await saveQuizProgress(user.id, slug, score, grade.correct, false);
      return NextResponse.json({
        score,
        passedTests: grade.passedTests,
        totalTests: grade.totalTests,
        passed: grade.correct,
        progress: {
          bestScore: progress.best_score,
          lastScore: progress.last_score,
          attempts: progress.attempts,
          passed: progress.passed,
        },
      });
    } catch (error) {
      if (error instanceof RunnerClientError) {
        return NextResponse.json({ error: error.message }, { status: 502 });
      }
      return NextResponse.json({ error: "gagal menyimpan hasil project" }, { status: 500 });
    }
  }

  if (!isValidQuiz(quiz)) {
    return NextResponse.json({ error: "quiz belum dikonfigurasi dengan benar" }, { status: 500 });
  }

  const rawAnswers = isRecord(body?.answers) ? body.answers : null;
  const codingSource = typeof body?.codingCode === "string" ? body.codingCode : "";
  if (!rawAnswers || !codingSource) {
    return NextResponse.json(
      { error: "semua jawaban dan kode coding wajib diisi" },
      { status: 400 },
    );
  }

  const answers: Record<string, QuizAnswer> = {};
  for (const question of quiz.questions) {
    if (question.type === "coding") continue;
    if (!(question.id in rawAnswers)) {
      return NextResponse.json({ error: "semua soal wajib dijawab" }, { status: 400 });
    }
    const answer = rawAnswers[question.id];
    const conceptGrade = gradeConceptAnswer(question, answer);
    if (!conceptGrade.valid) {
      return NextResponse.json({ error: conceptGrade.explanation }, { status: 400 });
    }
    answers[question.id] = answer as QuizAnswer;
  }

  try {
    const grade = await gradeFullQuiz(quiz, answers, codingSource);
    const passed = grade.score >= QUIZ_PASSING_SCORE;
    const progress = await saveQuizProgress(user.id, slug, grade.score, passed, true);

    return NextResponse.json({
      score: grade.score,
      correctCount: grade.correctCount,
      totalQuestions: quiz.questions.length,
      passed,
      results: grade.results,
      progress: {
        bestScore: progress.best_score,
        lastScore: progress.last_score,
        attempts: progress.attempts,
        passed: progress.passed,
      },
    });
  } catch (error) {
    if (error instanceof RunnerClientError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: "gagal menyimpan hasil quiz" }, { status: 500 });
  }
}
