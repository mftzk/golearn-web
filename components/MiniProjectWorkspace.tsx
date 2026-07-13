"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import type { PublicMiniProject } from "@/content/quizzes";

interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

interface CheckResult {
  correct: boolean;
  feedback?: string;
  passedTests: number;
  totalTests: number;
  stderr?: string | null;
}

interface ProjectProgress {
  bestScore: number;
  lastScore: number;
  attempts: number;
  passed: boolean;
}

interface SubmitResult {
  score: number;
  passedTests: number;
  totalTests: number;
  passed: boolean;
  stderr?: string;
  progress: ProjectProgress;
}

type SaveStatus = "saved" | "saving" | "error";

export default function MiniProjectWorkspace({
  project,
  initialFiles,
  initialProgress,
}: {
  project: PublicMiniProject;
  initialFiles: Record<string, string> | null;
  initialProgress: ProjectProgress | null;
}) {
  const router = useRouter();
  const [files, setFiles] = useState(() => createFileMap(project, initialFiles));
  const [activeFile, setActiveFile] = useState(project.files[0]?.name ?? "");
  const [revealedClues, setRevealedClues] = useState<Record<string, number>>({});
  const [stdin, setStdin] = useState(project.sampleInput);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRequestRef = useRef(0);

  const activeContent = files[activeFile] ?? "";
  const activeClues =
    project.files.find((file) => file.name === activeFile)?.clues ?? [];
  const revealedClueCount = revealedClues[activeFile] ?? 0;
  const canSubmit = Object.values(files).every((content) => content.trim().length > 0);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("saving");
    const requestId = ++saveRequestRef.current;
    saveTimerRef.current = setTimeout(async () => {
      try {
        await persistWorkspaceDraft(project.slug, files);
        if (requestId === saveRequestRef.current) setSaveStatus("saved");
      } catch {
        if (requestId === saveRequestRef.current) setSaveStatus("error");
      }
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [files, project.slug]);

  function updateFile(content: string) {
    setFiles((previous) => ({ ...previous, [activeFile]: content }));
    setRunResult(null);
    setCheckResult(null);
    setSubmitResult(null);
  }

  async function handleRun() {
    setRunning(true);
    setError(null);
    setRunResult(null);
    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, stdin }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Gagal menjalankan project.");
      setRunResult(data as RunResult);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Gagal menjalankan project.");
    } finally {
      setRunning(false);
    }
  }

  async function handleCheck() {
    setChecking(true);
    setError(null);
    setCheckResult(null);
    try {
      const response = await fetch(`/api/quizzes/${project.slug}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Gagal memeriksa project.");
      setCheckResult(data as CheckResult);
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : "Gagal memeriksa project.");
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      try {
        await persistWorkspaceDraft(project.slug, files);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
      const response = await fetch(`/api/quizzes/${project.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Gagal menyimpan hasil project.");
      setSubmitResult(data as SubmitResult);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan hasil project.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetWorkspace() {
    setFiles(createFileMap(project, null));
    setActiveFile(project.files[0]?.name ?? "");
    setRunResult(null);
    setCheckResult(null);
    setSubmitResult(null);
    setError(null);
  }

  function revealNextClue() {
    setRevealedClues((previous) => {
      const currentCount = previous[activeFile] ?? 0;
      if (currentCount >= activeClues.length) return previous;
      return { ...previous, [activeFile]: currentCount + 1 };
    });
  }

  function revealAllClues() {
    setRevealedClues((previous) => ({
      ...previous,
      [activeFile]: activeClues.length,
    }));
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-clay">
              Workspace mini project
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
              {project.title}
            </h2>
          </div>
          <div className="text-right text-xs text-muted">
            <p>
              {saveStatus === "saving" && "Menyimpan draft..."}
              {saveStatus === "saved" && "Draft tersimpan"}
              {saveStatus === "error" && "Draft belum tersimpan"}
            </p>
            {initialProgress && (
              <p className="mt-1">
                Terbaik {initialProgress.bestScore}% · {initialProgress.attempts} percobaan
              </p>
            )}
          </div>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted">
          {project.instructions}
        </p>
      </div>

      <div className="grid lg:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[180px_minmax(0,1fr)_280px]">
        <aside className="border-b border-border bg-surface-alt p-3 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted">
            File project
          </p>
          <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
            {project.files.map((file) => (
              <button
                type="button"
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm transition-colors lg:block lg:w-full ${
                  activeFile === file.name
                    ? "bg-clay-soft font-medium text-ink"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={resetWorkspace}
            className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            Reset workspace
          </button>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between bg-console-alt px-4 py-2.5">
            <span className="font-mono text-xs text-white/70">{activeFile}</span>
            <span className="text-xs text-white/40">semua file dijalankan bersama</span>
          </div>
          <CodeMirror
            value={activeContent}
            height="380px"
            theme="dark"
            extensions={[go()]}
            onChange={updateFile}
            basicSetup={{ tabSize: 4 }}
          />

          <div className="border-t border-border p-4 sm:p-5">
            <label htmlFor="mini-project-stdin" className="text-sm font-medium text-ink">
              Input stdin saat Run
            </label>
            <textarea
              id="mini-project-stdin"
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              rows={5}
              spellCheck={false}
              className="mt-2 w-full resize-y rounded-xl border border-border bg-console px-3 py-3 font-mono text-sm leading-6 text-white outline-none transition-colors focus:border-clay"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleRun()}
                  disabled={running || checking || submitting}
                  className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clay-hover disabled:opacity-50"
                >
                  {running ? "Menjalankan..." : "▶ Run"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleCheck()}
                  disabled={!canSubmit || running || checking || submitting}
                  className="rounded-full border border-clay px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay hover:text-white disabled:opacity-40"
                >
                  {checking ? "Memeriksa..." : "Cek hidden test"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!canSubmit || running || checking || submitting}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-40"
              >
                {submitting ? "Menyimpan..." : "Kirim project"}
              </button>
            </div>

            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

            <div className="mt-5 overflow-hidden rounded-xl bg-console px-4 py-3 font-mono text-sm">
              <p className="mb-2 font-sans text-xs uppercase tracking-wide text-white/40">Output</p>
              {!runResult && !error && (
                <p className="text-white/35">Output akan muncul setelah kamu menekan Run.</p>
              )}
              {runResult && (
                <>
                  {runResult.stdout && (
                    <pre className="whitespace-pre-wrap text-white/90">{runResult.stdout}</pre>
                  )}
                  {runResult.stderr && (
                    <pre className="mt-2 whitespace-pre-wrap text-red-400">{runResult.stderr}</pre>
                  )}
                  {!runResult.stdout && !runResult.stderr && (
                    <p className="text-white/35">(tidak ada output)</p>
                  )}
                  <p className="mt-2 text-xs text-white/30">
                    {runResult.durationMs}ms · exit code {runResult.exitCode}
                  </p>
                </>
              )}
            </div>

            {checkResult && (
              <div
                className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                  checkResult.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">
                  {checkResult.correct ? "Semua hidden test lulus." : "Belum semua hidden test lulus."}
                </p>
                <p className="mt-1">
                  {checkResult.passedTests}/{checkResult.totalTests} test lulus.
                </p>
                {checkResult.feedback && <p className="mt-1">{checkResult.feedback}</p>}
                {checkResult.stderr && (
                  <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-console px-3 py-2 font-mono text-xs text-red-300">
                    {checkResult.stderr}
                  </pre>
                )}
              </div>
            )}

            {submitResult && (
              <div className="mt-4 rounded-xl border border-border bg-surface-alt px-4 py-4">
                <p className="text-sm font-medium text-ink">
                  {submitResult.passed ? "Project lulus!" : "Project belum lulus."}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Skor {submitResult.score}% · {submitResult.passedTests}/{submitResult.totalTests} hidden test lulus.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <Stat label="Skor terbaik" value={`${submitResult.progress.bestScore}%`} />
                  <Stat label="Percobaan" value={String(submitResult.progress.attempts)} />
                  <Stat label="Status" value={submitResult.progress.passed ? "Lulus" : "Latihan"} />
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="border-t border-border bg-surface-alt p-4 sm:p-5 lg:col-span-2 xl:col-span-1 xl:sticky xl:top-6 xl:self-start xl:border-l xl:border-t-0">
          <CluePanel
            activeFile={activeFile}
            activeClues={activeClues}
            revealedClueCount={revealedClueCount}
            onRevealNext={revealNextClue}
            onRevealAll={revealAllClues}
          />
        </aside>
      </div>
    </section>
  );
}

function CluePanel({
  activeFile,
  activeClues,
  revealedClueCount,
  onRevealNext,
  onRevealAll,
}: {
  activeFile: string;
  activeClues: string[];
  revealedClueCount: number;
  onRevealNext: () => void;
  onRevealAll: () => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 xl:block">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-clay">
            Clue eksplisit
          </p>
          <p className="mt-1 font-mono text-sm text-ink">{activeFile}</p>
          <p className="mt-1 text-sm text-muted">
            {revealedClueCount}/{activeClues.length} clue dibuka
          </p>
        </div>
        <div className="flex flex-wrap gap-2 xl:mt-4">
          <button
            type="button"
            onClick={onRevealNext}
            disabled={revealedClueCount >= activeClues.length}
            className="rounded-full border border-clay px-3 py-1.5 text-xs font-medium text-clay transition-colors hover:bg-clay hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {revealedClueCount === 0
              ? "Tampilkan clue pertama"
              : revealedClueCount >= activeClues.length
                ? "Semua clue terbuka"
                : "Clue berikutnya"}
          </button>
          {revealedClueCount > 0 && revealedClueCount < activeClues.length && (
            <button
              type="button"
              onClick={onRevealAll}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              Tampilkan semua
            </button>
          )}
        </div>
      </div>

      {revealedClueCount === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-3 py-3 text-sm leading-6 text-muted">
          Buka clue untuk mendapat langkah eksplisit tentang file ini.
        </p>
      ) : (
        <ol
          aria-live="polite"
          className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-ink"
        >
          {activeClues.slice(0, revealedClueCount).map((clue, index) => (
            <li key={`${activeFile}-clue-${index}`}>{clue}</li>
          ))}
        </ol>
      )}
    </>
  );
}

function createFileMap(
  project: PublicMiniProject,
  savedFiles: Record<string, string> | null,
): Record<string, string> {
  return Object.fromEntries(
    project.files.map((file) => [
      file.name,
      typeof savedFiles?.[file.name] === "string"
        ? savedFiles[file.name]
        : file.content,
    ]),
  );
}

async function persistWorkspaceDraft(
  slug: string,
  files: Record<string, string>,
): Promise<void> {
  const response = await fetch(`/api/quizzes/${slug}/workspace`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  if (!response.ok) throw new Error("draft tidak tersimpan");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
