export interface RunnerResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

const PROXY_TIMEOUT_MS = 8000;

export class RunnerClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RunnerClientError";
  }
}

export type RunnerFiles = Record<string, string>;

async function requestRun(body: {
  code?: string;
  files?: RunnerFiles;
  stdin?: string;
}): Promise<RunnerResult> {
  const runnerUrl = process.env.RUNNER_URL;
  const runnerToken = process.env.RUNNER_TOKEN;
  if (!runnerUrl || !runnerToken) {
    throw new RunnerClientError("runner is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Runner-Token": runnerToken,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new RunnerClientError(`runner responded with ${response.status}`);
    }

    return (await response.json()) as RunnerResult;
  } catch (error) {
    if (error instanceof RunnerClientError) throw error;
    const message = error instanceof Error ? error.message : "unknown error";
    throw new RunnerClientError(`failed to reach runner: ${message}`);
  } finally {
    clearTimeout(timeout);
  }
}

export function runCode(code: string, stdin?: string): Promise<RunnerResult> {
  return requestRun({ code, ...(stdin !== undefined ? { stdin } : {}) });
}

export function runWorkspace(
  files: RunnerFiles,
  stdin?: string,
): Promise<RunnerResult> {
  return requestRun({ files, ...(stdin !== undefined ? { stdin } : {}) });
}
