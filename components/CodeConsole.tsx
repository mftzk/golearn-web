"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import { useRouter } from "next/navigation";

interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export default function CodeConsole({
  chapterSlug,
  initialCode,
  expectedOutput,
  isLoggedIn,
  initiallyCompleted,
}: {
  chapterSlug: string;
  initialCode: string;
  expectedOutput?: string;
  isLoggedIn: boolean;
  initiallyCompleted: boolean;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [runError, setRunError] = useState<string | null>(null);

  const passed =
    result?.ok &&
    expectedOutput !== undefined &&
    result.stdout.trim() === expectedOutput.trim();

  async function handleRun() {
    setRunning(true);
    setRunError(null);
    setResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRunError(data.error || "Gagal menjalankan kode.");
        return;
      }
      setResult(data);
      if (isLoggedIn) {
        await saveProgress("in_progress");
      }
    } finally {
      setRunning(false);
    }
  }

  async function saveProgress(status: "in_progress" | "completed") {
    await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterSlug, status, lastCode: code }),
    });
  }

  async function handleMarkComplete() {
    setSaving(true);
    try {
      await saveProgress("completed");
      setCompleted(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-soft">
      <div className="flex items-center justify-between bg-console-alt px-4 py-2.5">
        <span className="text-xs font-mono text-white/60">main.go</span>
        <button
          onClick={handleRun}
          disabled={running}
          className="rounded-full bg-clay px-4 py-1.5 text-sm font-medium text-white hover:bg-clay-hover transition-colors disabled:opacity-60"
        >
          {running ? "Menjalankan..." : "▶ Run"}
        </button>
      </div>

      <CodeMirror
        value={code}
        height="280px"
        theme="dark"
        extensions={[go()]}
        onChange={(value) => setCode(value)}
        basicSetup={{ tabSize: 4 }}
      />

      <div className="bg-console px-4 py-3 font-mono text-sm min-h-[88px]">
        {runError && <p className="text-red-400">{runError}</p>}
        {!runError && !result && (
          <p className="text-white/35">Output akan muncul di sini setelah kamu Run.</p>
        )}
        {result && (
          <>
            {result.stdout && (
              <pre className="whitespace-pre-wrap text-white/90">{result.stdout}</pre>
            )}
            {result.stderr && (
              <pre className="whitespace-pre-wrap text-red-400">{result.stderr}</pre>
            )}
            {!result.stdout && !result.stderr && (
              <p className="text-white/35">(tidak ada output)</p>
            )}
            <p className="mt-2 text-xs text-white/30">
              {result.durationMs}ms · exit code {result.exitCode}
            </p>
          </>
        )}
      </div>

      {expectedOutput !== undefined && (
        <div className="flex items-center justify-between border-t border-border bg-surface-alt px-4 py-3">
          <span className="text-sm text-muted">
            {passed
              ? "✓ Output sesuai — bab ini selesai."
              : completed
                ? "✓ Sudah ditandai selesai."
                : "Jalankan kode sampai outputnya sesuai, lalu tandai selesai."}
          </span>
          {isLoggedIn ? (
            <button
              onClick={handleMarkComplete}
              disabled={saving || completed}
              className="shrink-0 rounded-full border border-clay px-4 py-1.5 text-sm font-medium text-clay hover:bg-clay hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-clay"
            >
              {completed ? "Selesai" : saving ? "Menyimpan..." : "Tandai selesai"}
            </button>
          ) : (
            <a href="/login" className="shrink-0 text-sm text-clay hover:text-clay-hover">
              Masuk untuk menyimpan progress
            </a>
          )}
        </div>
      )}
    </div>
  );
}
