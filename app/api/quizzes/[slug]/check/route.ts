import { NextResponse } from "next/server";
import {
  getQuiz,
  isValidQuiz,
} from "@/content/quizzes";
import { getCurrentUser } from "@/lib/auth";
import {
  gradeCodingAnswer,
  gradeConceptAnswer,
} from "@/lib/quiz";
import { RunnerClientError } from "@/lib/runner";

interface RouteContext {
  params: Promise<{ slug: string }>;
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
  const questionId = typeof body?.questionId === "string" ? body.questionId : "";
  const question = quiz.questions.find((item) => item.id === questionId);
  if (!question) {
    return NextResponse.json({ error: "soal tidak ditemukan" }, { status: 400 });
  }

  try {
    if (question.type === "coding") {
      const source = typeof body?.code === "string" ? body.code : "";
      if (!source) {
        return NextResponse.json({ error: "kode wajib diisi" }, { status: 400 });
      }

      const grade = await gradeCodingAnswer(question, source);
      return NextResponse.json({
        correct: grade.correct,
        passedTests: grade.passedTests,
        totalTests: grade.totalTests,
        feedback: grade.correct
          ? "Semua hidden test lulus."
          : "Kode belum lulus semua hidden test.",
        stderr: grade.stderr || null,
      });
    }

    const grade = gradeConceptAnswer(question, body?.answer);
    if (!grade.valid) {
      return NextResponse.json({ error: grade.explanation }, { status: 400 });
    }

    return NextResponse.json({
      correct: grade.correct,
      explanation: grade.explanation,
    });
  } catch (error) {
    if (error instanceof RunnerClientError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: "gagal memeriksa jawaban" }, { status: 500 });
  }
}
