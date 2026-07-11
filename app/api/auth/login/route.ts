import { NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password diperlukan." }, { status: 400 });
  }

  await ensureSchema();

  const result = await pool.query(
    "SELECT id, email, name, password_hash FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];
  if (!user) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  await setSessionCookie({ id: user.id, email: user.email, name: user.name });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
