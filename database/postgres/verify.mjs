import { openPostgresPool } from '../../server/postgresDatabase.js'
const pool = openPostgresPool()
try {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name = ANY($1) ORDER BY table_name", [['users','articles','comments']])
  const migration = await pool.query('SELECT COUNT(*)::int AS count FROM schema_migrations')
  const articles = await pool.query('SELECT COUNT(*)::int AS count FROM articles')
  if (tables.rows.length !== 3 || migration.rows[0].count < 1 || articles.rows[0].count < 1) throw new Error('PostgreSQL 数据库验证失败')
  console.log(`PostgreSQL 验证通过：业务表=${tables.rows.map((row) => row.table_name).join(',')}，迁移数=${migration.rows[0].count}，文章数=${articles.rows[0].count}`)
} finally { await pool.end() }
