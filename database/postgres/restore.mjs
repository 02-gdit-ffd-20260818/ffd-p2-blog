import { execFile } from 'node:child_process'
import { access } from 'node:fs/promises'
import { promisify } from 'node:util'
import { postgresConfig } from '../../server/postgresDatabase.js'
const execute = promisify(execFile)
const source = process.argv[2]
if (!source) throw new Error('用法：npm run db:postgres:restore -- <备份 dump 路径>')
await access(source)
const config = postgresConfig()
await execute('pg_restore', ['--clean', '--if-exists', '--no-owner', '--no-acl', '-h', config.host, '-p', String(config.port), '-U', config.user, '-d', config.database, source], { env: { ...process.env, PGPASSWORD: config.password } })
console.log('PostgreSQL 恢复完成，请继续运行 db:postgres:verify。')
