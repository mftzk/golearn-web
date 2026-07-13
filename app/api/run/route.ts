import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { RunnerClientError, runCode, runWorkspace } from "@/lib/runner";
import { parseWorkspaceFiles } from "@/lib/workspace";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  const files = parseWorkspaceFiles(body?.files);
  const stdin = typeof body?.stdin === "string" ? body.stdin : undefined;
  if (code && files) {
    return NextResponse.json({ error: "kirim code atau files, bukan keduanya" }, { status: 400 });
  }
  if (!code && (!files || Object.keys(files).length === 0)) {
    return NextResponse.json({ error: "code or files is required" }, { status: 400 });
  }
  if (!process.env.RUNNER_URL || !process.env.RUNNER_TOKEN) {
    return NextResponse.json({ error: "runner is not configured" }, { status: 500 });
  }

  try {
    return NextResponse.json(
      files ? await runWorkspace(files, stdin) : await runCode(code, stdin),
    );
  } catch (err) {
    const message = err instanceof RunnerClientError ? err.message : "unknown error";
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
