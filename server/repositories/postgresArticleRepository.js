function toArticle(row) {
  if (!row) return null
  return { id: Number(row.id), slug: row.slug, title: row.title, summary: row.summary, content: row.content_json, tags: row.tags_json, status: row.status, author: row.author, publishedAt: String(row.published_at).slice(0, 10) }
}

export function createPostgresArticleRepository(pool) {
  const columns = 'id, slug, title, summary, content_json, tags_json, status, author, published_at'
  return {
    async list({ status, query = '', page = 1, pageSize = 20 } = {}) {
      const where = []
      const values = []
      if (status) { values.push(status); where.push(`status = $${values.length}`) }
      if (query) { values.push(`%${query}%`); where.push(`LOWER(title || ' ' || summary || ' ' || tags_json::text) LIKE LOWER($${values.length})`) }
      const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''
      const count = await pool.query(`SELECT COUNT(*)::int AS total FROM articles ${clause}`, values)
      values.push(Number(pageSize), Number((page - 1) * pageSize))
      const rows = await pool.query(`SELECT ${columns} FROM articles ${clause} ORDER BY published_at DESC, id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values)
      return { items: rows.rows.map(toArticle), total: count.rows[0].total }
    },
    async find(id) {
      const { rows } = await pool.query(`SELECT ${columns} FROM articles WHERE id = $1`, [Number(id)])
      return toArticle(rows[0])
    },
    async create(input) {
      const { rows } = await pool.query(`INSERT INTO articles (slug,title,summary,content_json,tags_json,status,author,published_at)
        VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8) RETURNING ${columns}`,
      [input.slug, input.title, input.summary, JSON.stringify(input.content), JSON.stringify(input.tags), input.status, input.author, input.publishedAt])
      return toArticle(rows[0])
    },
    async update(id, input) {
      const { rows } = await pool.query(`UPDATE articles SET slug=$1,title=$2,summary=$3,content_json=$4::jsonb,tags_json=$5::jsonb,status=$6,author=$7,published_at=$8,updated_at=CURRENT_TIMESTAMP WHERE id=$9 RETURNING ${columns}`,
      [input.slug, input.title, input.summary, JSON.stringify(input.content), JSON.stringify(input.tags), input.status, input.author, input.publishedAt, Number(id)])
      return toArticle(rows[0])
    },
    async remove(id) {
      return (await pool.query('DELETE FROM articles WHERE id = $1', [Number(id)])).rowCount > 0
    },
  }
}
