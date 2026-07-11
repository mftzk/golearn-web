import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { RunnerClientError, runCode } from "@/lib/runner";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }
  if (!process.env.RUNNER_URL || !process.env.RUNNER_TOKEN) {
    return NextResponse.json({ error: "runner is not configured" }, { status: 500 });
  }

  try {
    return NextResponse.json(await runCode(code));
  } catch (err) {
    const message = err instanceof RunnerClientError ? err.message : "unknown error";
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
