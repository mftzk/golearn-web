import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __golearnPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __golearnSchemaReady: Promise<void> | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL env var is required");
  }
  return new Pool({ connectionString });
}

export const pool = global.__golearnPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  global.__golearnPool = pool;
}

async function migrate() {
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
}

export function ensureSchema(): Promise<void> {
  if (!global.__golearnSchemaReady) {
    global.__golearnSchemaReady = migrate();
  }
  return global.__golearnSchemaReady;
}
