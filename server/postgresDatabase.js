import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { seedArticles } from './data/seedArticles.js'
import { hashPassword } from './services/auth.js'

const migrationsDirectory = fileURLToPath(new URL('../database/postgres/migrations', import.meta.url))

export function postgresConfig(env = process.env) {
  const required = ['POSTGRES_HOST', 'POSTGRES_DATABASE', 'POSTGRES_USER', 'POSTGRES_PASSWORD']
  for (const name of required) if (!env[name]) throw new Error(`Missing environment variable: ${name}`)
  return {
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT) || 5432,
    database: env.POSTGRES_DATABASE,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    max: 5,
    ssl: env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: true } : false,
  }
}

export function openPostgresPool(env = process.env) {
  return new pg.Pool(postgresConfig(env))
}

export async function migratePostgres(pool, directory = migrationsDirectory) {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)
  const { rows } = await pool.query('SELECT version FROM schema_migrations')
  const applied = new Set(rows.map((row) => row.version))
  const migrations = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort()
  const completed = []
  for (const migration of migrations) {
    if (applied.has(migration)) continue
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(await readFile(new URL(`../database/postgres/migrations/${migration}`, import.meta.url), 'utf8'))
      await client.query('INSERT INTO schema_migrations(version) VALUES ($1)', [migration])
      await client.query('COMMIT')
      completed.push(migration)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally { client.release() }
  }
  return completed
}

export async function seedPostgres(pool) {
  for (const article of seedArticles) {
    await pool.query(`INSERT INTO articles
      (id, slug, title, summary, content_json, tags_json, status, author, published_at)
      VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9)
      ON CONFLICT (id) DO NOTHING`, [article.id, article.slug, article.title, article.summary, JSON.stringify(article.content), JSON.stringify(article.tags), article.status, article.author, article.publishedAt])
  }
  await pool.query("SELECT setval(pg_get_serial_sequence('articles','id'), GREATEST((SELECT COALESCE(MAX(id),1) FROM articles),1))")
  const { rows: [row] } = await pool.query('SELECT COUNT(*)::int AS count FROM articles')
  return row.count
}

export async function seedPostgresAdmin(userRepository, { username, password, displayName = '课程管理员' }) {
  if (!username || !password) return null
  const { salt, hash } = hashPassword(password)
  return userRepository.upsert({ username, displayName, role: 'admin', passwordSalt: salt, passwordHash: hash })
}
