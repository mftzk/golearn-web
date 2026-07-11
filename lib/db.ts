import { Pool } from "pg";

declare global {
  var __golearnPool: Pool | undefined;
  var __golearnSchemaReady: Promise<void> | undefined;
}

// The pool is created lazily on first query, NOT at module load. `next build`
// imports these route handlers to collect page data, and doing so must not
// require DATABASE_URL — that env var only needs to exist at request time.
export function getPool(): Pool {
  if (!global.__golearnPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL env var is required");
    }
    global.__golearnPool = new Pool({ connectionString });
  }
  return global.__golearnPool;
}

async function migrate() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            BIGSERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name          TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      id           BIGSERIAL PRIMARY KEY,
      user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      chapter_slug TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'in_progress',
      last_code    TEXT,
      completed_at TIMESTAMPTZ,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, chapter_slug)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_progress (
      id                BIGSERIAL PRIMARY KEY,
      user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      chapter_slug      TEXT NOT NULL,
      best_score        INTEGER NOT NULL DEFAULT 0,
      last_score        INTEGER NOT NULL DEFAULT 0,
      attempts          INTEGER NOT NULL DEFAULT 0,
      passed            BOOLEAN NOT NULL DEFAULT false,
      last_attempt_at   TIMESTAMPTZ,
      passed_at         TIMESTAMPTZ,
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, chapter_slug)
    );
  `);
}

export function ensureSchema(): Promise<void> {
  if (!global.__golearnSchemaReady) {
    global.__golearnSchemaReady = migrate();
  }
  return global.__golearnSchemaReady;
}
