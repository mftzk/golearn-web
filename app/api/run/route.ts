import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const PROXY_TIMEOUT_MS = 8000;

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

  const runnerUrl = process.env.RUNNER_URL;
  const runnerToken = process.env.RUNNER_TOKEN;
  if (!runnerUrl || !runnerToken) {
    return NextResponse.json(
      { error: "runner is not configured" },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const res = await fetch(`${runnerUrl.replace(/\/$/, "")}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Runner-Token": runnerToken,
      },
      body: JSON.stringify({ code }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `runner responded with ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: `failed to reach runner: ${message}` },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
