import { NextResponse } from "next/server";
import {
  getQuiz,
  isValidQuiz,
  QUIZ_PASSING_SCORE,
  type QuizAnswer,
} from "@/content/quizzes";
import { getCurrentUser } from "@/lib/auth";
import { getPool, ensureSchema } from "@/lib/db";
import {
  gradeConceptAnswer,
  gradeFullQuiz,
} from "@/lib/quiz";
import { RunnerClientError } from "@/lib/runner";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
  if (!isValidQuiz(quiz)) {
    return NextResponse.json({ error: "quiz belum dikonfigurasi dengan benar" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
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

    await ensureSchema();
    const client = await getPool().connect();
    let progress: {
      best_score: number;
      last_score: number;
      attempts: number;
      passed: boolean;
      last_attempt_at: string;
      passed_at: string | null;
    };
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
         RETURNING best_score, last_score, attempts, passed,
                   last_attempt_at, passed_at`,
        [user.id, slug, grade.score, passed],
      );
      progress = progressResult.rows[0];

      if (passed) {
        await client.query(
          `INSERT INTO progress
             (user_id, chapter_slug, status, completed_at, updated_at)
           VALUES ($1, $2, 'completed', now(), now())
           ON CONFLICT (user_id, chapter_slug)
           DO UPDATE SET
             status = 'completed',
             completed_at = COALESCE(progress.completed_at, now()),
             updated_at = now()`,
          [user.id, slug],
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

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
