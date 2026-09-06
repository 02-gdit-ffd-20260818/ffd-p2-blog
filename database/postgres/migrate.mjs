import { migratePostgres, openPostgresPool } from '../../server/postgresDatabase.js'
const pool = openPostgresPool()
try {
  const applied = await migratePostgres(pool)
  console.log(applied.length ? `已应用 PostgreSQL 迁移：${applied.join(', ')}` : 'PostgreSQL 已是最新版本。')
} finally { await pool.end() }
