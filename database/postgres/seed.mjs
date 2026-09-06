import { openPostgresPool, seedPostgres, seedPostgresAdmin } from '../../server/postgresDatabase.js'
import { createPostgresUserRepository } from '../../server/repositories/postgresUserRepository.js'
const pool = openPostgresPool()
try {
  console.log(`PostgreSQL 种子数据就绪，文章总数：${await seedPostgres(pool)}`)
  await seedPostgresAdmin(createPostgresUserRepository(pool), { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD })
} finally { await pool.end() }
