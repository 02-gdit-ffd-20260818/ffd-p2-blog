import { execFile } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'
import { postgresConfig } from '../../server/postgresDatabase.js'
const execute = promisify(execFile)
const config = postgresConfig()
const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const destination = resolve(process.argv[2] || `./var/backups/postgres-p2-${timestamp}.dump`)
await mkdir(dirname(destination), { recursive: true })
await execute('pg_dump', ['--format=custom', '--no-owner', '--no-acl', '-h', config.host, '-p', String(config.port), '-U', config.user, '-d', config.database, '-f', destination], { env: { ...process.env, PGPASSWORD: config.password } })
console.log(`PostgreSQL 备份完成：${destination}`)
