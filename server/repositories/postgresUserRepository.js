export function createPostgresUserRepository(pool) {
  return {
    async findByUsername(username) {
      const { rows } = await pool.query('SELECT id, username, display_name AS "displayName", role, password_salt AS "passwordSalt", password_hash AS "passwordHash" FROM users WHERE username = $1', [username])
      return rows[0] ?? null
    },
    async upsert({ username, displayName, role, passwordSalt, passwordHash }) {
      await pool.query(`INSERT INTO users(username, display_name, role, password_salt, password_hash)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (username) DO UPDATE SET display_name=EXCLUDED.display_name, role=EXCLUDED.role, password_salt=EXCLUDED.password_salt, password_hash=EXCLUDED.password_hash`, [username, displayName, role, passwordSalt, passwordHash])
      return this.findByUsername(username)
    },
  }
}
