import type {
  ChapterQuiz,
  CodingQuestion,
  QuizAnswer,
  QuizQuestion,
} from "@/content/quizzes";
import { runCode } from "@/lib/runner";

export interface ConceptGrade {
  valid: boolean;
  correct: boolean;
  explanation: string;
}

export interface CodingGrade {
  correct: boolean;
  passedTests: number;
  totalTests: number;
  stderr: string;
}

export interface QuizQuestionGrade {
  questionId: string;
  correct: boolean;
  explanation: string;
  passedTests?: number;
  totalTests?: number;
  stderr?: string;
}

export interface FullQuizGrade {
  correctCount: number;
  score: number;
  results: QuizQuestionGrade[];
}

export function gradeConceptAnswer(
  question: Exclude<QuizQuestion, CodingQuestion>,
  answer: unknown,
): ConceptGrade {
  if (question.type === "multiple_choice") {
    if (
      typeof answer !== "string" ||
      !question.options.some((option) => option.id === answer)
    ) {
      return {
        valid: false,
        correct: false,
        explanation: "Pilih salah satu jawaban yang tersedia.",
      };
    }
    return {
      valid: true,
      correct: answer === question.correctOptionId,
      explanation: question.explanation,
    };
  }

  if (typeof answer !== "boolean") {
    return {
      valid: false,
      correct: false,
      explanation: "Jawaban benar/salah belum valid.",
    };
  }

  return {
    valid: true,
    correct: answer === question.correctAnswer,
    explanation: question.explanation,
  };
}

export async function gradeCodingAnswer(
  question: CodingQuestion,
  source: string,
): Promise<CodingGrade> {
  let passedTests = 0;
  let stderr = "";

  for (const test of question.tests) {
    const result = await runCode(source, test.stdin);
    if (!result.ok) {
      stderr = result.stderr.slice(0, 4000);
      break;
    }
    if (result.stdout.trim() === test.expectedOutput.trim()) {
      passedTests += 1;
    }
  }

  return {
    correct: passedTests === question.tests.length,
    passedTests,
    totalTests: question.tests.length,
    stderr,
  };
}

export async function gradeFullQuiz(
  quiz: ChapterQuiz,
  answers: Record<string, QuizAnswer>,
  codingSource: string,
): Promise<FullQuizGrade> {
  const results: QuizQuestionGrade[] = [];

  for (const question of quiz.questions) {
    if (question.type === "coding") {
      const codingGrade = await gradeCodingAnswer(question, codingSource);
      results.push({
        questionId: question.id,
        correct: codingGrade.correct,
        explanation: question.explanation,
        passedTests: codingGrade.passedTests,
        totalTests: codingGrade.totalTests,
        stderr: codingGrade.stderr || undefined,
      });
      continue;
    }

    const conceptGrade = gradeConceptAnswer(question, answers[question.id]);
    results.push({
      questionId: question.id,
      correct: conceptGrade.valid && conceptGrade.correct,
      explanation: conceptGrade.explanation,
    });
  }

  const correctCount = results.filter((result) => result.correct).length;
  return {
    correctCount,
    score: Math.round((correctCount / quiz.questions.length) * 100),
    results,
  };
}
