"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import type {
  PublicChapterQuiz,
  PublicQuizQuestion,
} from "@/content/quizzes";

interface QuizProgress {
  bestScore: number;
  lastScore: number;
  attempts: number;
  passed: boolean;
}

interface CheckResult {
  correct: boolean;
  explanation?: string;
  feedback?: string;
  passedTests?: number;
  totalTests?: number;
  stderr?: string | null;
}

interface SubmitResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  results: Array<{
    questionId: string;
    correct: boolean;
    explanation: string;
    passedTests?: number;
    totalTests?: number;
    stderr?: string;
  }>;
  progress: QuizProgress;
}

type AnswerMap = Record<string, string | boolean>;

export default function QuizRunner({
  quiz,
  initialProgress,
}: {
  quiz: PublicChapterQuiz;
  initialProgress: QuizProgress | null;
}) {
  const router = useRouter();
  const codingQuestion = quiz.questions.find(
    (question): question is Extract<PublicQuizQuestion, { type: "coding" }> =>
      question.type === "coding",
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [code, setCode] = useState(codingQuestion?.starterCode ?? "");
  const [feedback, setFeedback] = useState<Record<string, CheckResult>>({});
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const currentQuestion = quiz.questions[currentIndex];
  const currentFeedback = feedback[currentQuestion.id];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;
  const allChecked = quiz.questions.every((question) => feedback[question.id]);

  function selectAnswer(answer: string | boolean) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer }));
    setFeedback((previous) => {
      const next = { ...previous };
      delete next[currentQuestion.id];
      return next;
    });
    setError(null);
  }

  async function checkCurrentQuestion() {
    setChecking(true);
    setError(null);
    try {
      const body =
        currentQuestion.type === "coding"
          ? { questionId: currentQuestion.id, code }
          : { questionId: currentQuestion.id, answer: answers[currentQuestion.id] };
      const response = await fetch(`/api/quizzes/${quiz.chapterSlug}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Gagal memeriksa jawaban.");
      }
      setFeedback((previous) => ({ ...previous, [currentQuestion.id]: data }));
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : "Gagal memeriksa jawaban.");
    } finally {
      setChecking(false);
    }
  }

  async function submitQuiz() {
    setSubmitting(true);
    setError(null);
    const conceptAnswers: AnswerMap = {};
    for (const question of quiz.questions) {
      if (question.type !== "coding") {
        conceptAnswers[question.id] = answers[question.id];
      }
    }

    try {
      const response = await fetch(`/api/quizzes/${quiz.chapterSlug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: conceptAnswers, codingCode: code }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Gagal menyimpan hasil quiz.");
      }
      setSubmitResult(data);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan hasil quiz.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function moveNext() {
    if (isLastQuestion) {
      void submitQuiz();
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }

  function resetQuiz() {
    setCurrentIndex(0);
    setAnswers({});
    setCode(codingQuestion?.starterCode ?? "");
    setFeedback({});
    setError(null);
    setSubmitResult(null);
  }

  if (submitResult) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-clay">
          Hasil quiz
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
          {submitResult.score}%
        </h2>
        <p className="mt-2 text-muted">
          {submitResult.correctCount} dari {submitResult.totalQuestions} soal benar.
        </p>
        <div
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            submitResult.passed
              ? "bg-clay-soft text-ink"
              : "bg-surface-alt text-muted"
          }`}
        >
          {submitResult.passed
            ? "Lulus! Bab ini otomatis ditandai selesai."
            : "Belum lulus. Pelajari lagi bagian yang belum tepat lalu coba lagi."}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Skor terbaik" value={`${submitResult.progress.bestScore}%`} />
          <Stat label="Percobaan" value={String(submitResult.progress.attempts)} />
          <Stat label="Status" value={submitResult.progress.passed ? "Lulus" : "Latihan"} />
        </div>

        <div className="mt-8 space-y-3">
          {submitResult.results.map((result, index) => (
            <div
              key={result.questionId}
              className="rounded-xl border border-border bg-surface-alt px-4 py-3"
            >
              <p className="text-sm font-medium text-ink">
                <span className={result.correct ? "text-green-700" : "text-red-700"}>
                  {result.correct ? "✓" : "×"}
                </span>{" "}
                Soal {index + 1}
              </p>
              <p className="mt-1 text-sm text-muted">{result.explanation}</p>
              {result.totalTests !== undefined && (
                <p className="mt-1 text-xs text-muted">
                  {result.passedTests}/{result.totalTests} hidden test lulus.
                </p>
              )}
              {result.stderr && (
                <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-console px-3 py-2 font-mono text-xs text-red-300">
                  {result.stderr}
                </pre>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={resetQuiz}
          className="mt-8 rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-clay-hover"
        >
          Coba lagi
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <div className="flex items-center justify-between gap-4 text-sm text-muted">
          <span>Soal {currentIndex + 1} dari {quiz.questions.length}</span>
          <span>{Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}%</span>
        </div>
        {initialProgress && (
          <p className="mt-3 text-xs text-muted">
            Skor terbaik {initialProgress.bestScore}% · {initialProgress.attempts} percobaan
          </p>
        )}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-alt">
          <div
            className="h-full rounded-full bg-clay transition-all"
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-clay">
          <span>{questionTypeLabel(currentQuestion)}</span>
          {currentQuestion.type === "coding" && <span>· 20 poin</span>}
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
          {currentQuestion.prompt}
        </h2>

        {currentQuestion.type === "multiple_choice" && (
          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option) => {
              const selected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => selectAnswer(option.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    selected
                      ? "border-clay bg-clay-soft text-ink"
                      : "border-border bg-surface hover:border-clay/60 hover:bg-surface-alt"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-medium uppercase">
                    {option.id}
                  </span>
                  <span className="pt-0.5">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "true_false" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[true, false].map((answer) => {
              const selected = answers[currentQuestion.id] === answer;
              return (
                <button
                  type="button"
                  key={String(answer)}
                  onClick={() => selectAnswer(answer)}
                  className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition-colors ${
                    selected
                      ? "border-clay bg-clay-soft text-ink"
                      : "border-border bg-surface hover:border-clay/60 hover:bg-surface-alt"
                  }`}
                >
                  {answer ? "Benar" : "Salah"}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "coding" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="border-b border-border bg-console-alt px-4 py-3 text-sm text-white/80">
              {currentQuestion.instructions}
            </div>
            <CodeMirror
              value={code}
              height="300px"
              theme="dark"
              extensions={[go()]}
              onChange={(value) => {
                setCode(value);
                setFeedback((previous) => {
                  const next = { ...previous };
                  delete next[currentQuestion.id];
                  return next;
                });
              }}
              basicSetup={{ tabSize: 4 }}
            />
          </div>
        )}

        {currentFeedback && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm ${
              currentFeedback.correct
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <p className="font-medium">
              {currentFeedback.correct ? "Jawaban benar." : "Belum tepat."}
            </p>
            {currentFeedback.feedback && <p className="mt-1">{currentFeedback.feedback}</p>}
            {currentFeedback.explanation && (
              <p className="mt-1">{currentFeedback.explanation}</p>
            )}
            {currentFeedback.totalTests !== undefined && (
              <p className="mt-1">
                {currentFeedback.passedTests}/{currentFeedback.totalTests} hidden test lulus.
              </p>
            )}
            {currentFeedback.stderr && (
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-console px-3 py-2 font-mono text-xs text-red-300">
                {currentFeedback.stderr}
              </pre>
            )}
          </div>
        )}

        {error && <p className="mt-5 text-sm text-red-700">{error}</p>}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0 || checking || submitting}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-alt hover:text-ink disabled:opacity-40"
          >
            ← Sebelumnya
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void checkCurrentQuestion()}
              disabled={
                checking ||
                submitting ||
                (currentQuestion.type !== "coding" && answers[currentQuestion.id] === undefined) ||
                (currentQuestion.type === "coding" && !code.trim())
              }
              className="rounded-full border border-clay px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-clay"
            >
              {checking ? "Memeriksa..." : "Cek jawaban"}
            </button>
            <button
              type="button"
              onClick={moveNext}
              disabled={!currentFeedback || checking || submitting || (isLastQuestion && !allChecked)}
              className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clay-hover disabled:opacity-40"
            >
              {submitting ? "Menyimpan..." : isLastQuestion ? "Selesaikan quiz" : "Lanjut →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function questionTypeLabel(question: PublicQuizQuestion): string {
  if (question.type === "multiple_choice") return "Pilihan ganda";
  if (question.type === "true_false") return "Benar atau salah";
  return "Coding challenge";
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-alt px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-medium text-ink">{value}</p>
    </div>
  );
}
