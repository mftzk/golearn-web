import { NextResponse } from "next/server";
import {
  getQuiz,
  isMiniProjectQuiz,
  isValidMiniProject,
} from "@/content/quizzes";
import { getCurrentUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";
import {
  hasExpectedWorkspaceFiles,
  MAX_WORKSPACE_SOURCE_BYTES,
  parseWorkspaceFiles,
  workspaceSourceBytes,
} from "@/lib/workspace";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz || !isMiniProjectQuiz(quiz)) {
    return NextResponse.json({ error: "mini project tidak ditemukan" }, { status: 404 });
  }
  if (!isValidMiniProject(quiz)) {
    return NextResponse.json({ error: "mini project belum dikonfigurasi dengan benar" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const files = parseWorkspaceFiles(body?.files);
  if (
    !files ||
    !hasExpectedWorkspaceFiles(files, quiz.files.map((file) => file.name))
  ) {
    return NextResponse.json({ error: "file workspace tidak valid" }, { status: 400 });
  }
  if (workspaceSourceBytes(files) > MAX_WORKSPACE_SOURCE_BYTES) {
    return NextResponse.json({ error: "source workspace terlalu besar" }, { status: 413 });
  }

  await ensureSchema();
  await getPool().query(
    `INSERT INTO quiz_workspace_drafts (user_id, quiz_slug, files, updated_at)
     VALUES ($1, $2, $3::jsonb, now())
     ON CONFLICT (user_id, quiz_slug)
     DO UPDATE SET files = EXCLUDED.files, updated_at = now()`,
    [user.id, slug, JSON.stringify(files)],
  );

  return NextResponse.json({ ok: true });
}
