import { NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getChapter } from "@/content/chapters";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await ensureSchema();
  const result = await pool.query(
    "SELECT chapter_slug, status, last_code, completed_at FROM progress WHERE user_id = $1",
    [user.id]
  );

  return NextResponse.json({ progress: result.rows });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const chapterSlug = typeof body?.chapterSlug === "string" ? body.chapterSlug : "";
  const status = body?.status === "completed" ? "completed" : "in_progress";
  const lastCode = typeof body?.lastCode === "string" ? body.lastCode : null;

  if (!chapterSlug || !getChapter(chapterSlug)) {
    return NextResponse.json({ error: "bab tidak dikenal" }, { status: 400 });
  }

  await ensureSchema();
  await pool.query(
    `INSERT INTO progress (user_id, chapter_slug, status, last_code, completed_at, updated_at)
     VALUES ($1, $2, $3, $4, CASE WHEN $3 = 'completed' THEN now() ELSE NULL END, now())
     ON CONFLICT (user_id, chapter_slug)
     DO UPDATE SET
       status = EXCLUDED.status,
       last_code = EXCLUDED.last_code,
       completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN now() ELSE progress.completed_at END,
       updated_at = now()`,
    [user.id, chapterSlug, status, lastCode]
  );

  return NextResponse.json({ ok: true });
}
