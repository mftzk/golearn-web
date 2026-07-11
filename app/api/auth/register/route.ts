import { NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : null;

  if (!email || !email.includes("@") || password.length < 6) {
    return NextResponse.json(
      { error: "Email valid dan password minimal 6 karakter diperlukan." },
      { status: 400 }
    );
  }

  await ensureSchema();

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name",
    [email, passwordHash, name]
  );
  const user = result.rows[0];

  await setSessionCookie({ id: user.id, email: user.email, name: user.name });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
