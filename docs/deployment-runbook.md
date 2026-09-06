# P2 部署运行手册

## Netlify（第 7—8 次课主平台）

- 固定生产地址：<https://ffd-p2-blog.netlify.app/>
- Site ID：`c728261f-c688-4d17-b68d-93d6621cabb0`
- Build command：`npm run build`
- Publish directory：`dist`
- Node：24
- SPA fallback：由 `netlify.toml` 配置

首次部署后记录站点名、生产 URL、Git commit 和部署 ID。后续保持同一 URL。

仓库 Settings → Secrets and variables → Actions 中配置 `NETLIFY_AUTH_TOKEN` 和 `NETLIFY_SITE_ID`，不要把值写进代码或截图。`deploy-netlify.yml` 监听 `verify-p2` 的完成事件：只有 `main` 分支检查成功才构建并发布生产站点。公开健康检查为 <https://ffd-p2-blog.netlify.app/health>。

已验证部署：

| 课次 | 版本 | Deploy ID | 固定 URL |
| --- | --- | --- | --- |
| 07 | `p2-v1.0` | `6a9a3ffc65561e2353fdd1e6` | <https://ffd-p2-blog.netlify.app/> |
| 08 | `p2-v1.1` | `6a9a4025c2fafd06b7da9cde` | <https://ffd-p2-blog.netlify.app/> |

## Ubuntu API（第 10 次课）

- 公网健康检查：<http://47.120.73.69/ffd-p2-api/health>
- 公网 API 前缀：`http://47.120.73.69/ffd-p2-api/api`
- Netlify 同源代理：浏览器请求 `/api/*`，由 Netlify 服务端代理到 Ubuntu，避免浏览器 Mixed Content。
- systemd 服务：`ffd-p2-api.service`；运行用户：`ffd-p2`；内部端口：3010。
- SQLite：`/srv/ffd-p2/data/p2-blog.sqlite`；备份目录：`/srv/ffd-p2/backups`。

3010 已由 systemd 网络策略限制为 localhost；公网必须经过 Nginx。当前 Netlify 到 Ubuntu 的代理链路仍是 HTTP，只作为没有自有域名时的教学过渡方案。获得域名后必须配置 HTTPS，再更新本文件与 Netlify 代理目标。

## GitHub Actions

每次 push/PR 必须依次执行锁定依赖安装、结构检查、自动测试和生产构建。检查失败不部署；检查成功后再由独立的 `deploy-netlify` 工作流发布，避免“构建失败的代码仍上线”。

## 第 9 次课以后

前端仍可由 Netlify 托管；API、SQLite/MySQL、Nginx 和健康检查迁移到 Ubuntu。生产环境变量只在平台或服务器配置，不写入仓库。

SQLite 生产文件应放在持久目录并由服务用户独占，例如通过 `DATABASE_PATH=/srv/ffd-p2/data/p2-blog.sqlite` 指定。发布前运行 `db:backup`，发布后运行 `db:migrate` 与 `db:verify`。不要把 SQLite 文件放进 Git 工作区或 Netlify 静态站点。

## PostgreSQL 备用路径

将 `DB_DRIVER` 设为 `postgres`，并仅在服务器环境文件中配置 `POSTGRES_HOST`、`POSTGRES_PORT`、`POSTGRES_DATABASE`、`POSTGRES_USER`、`POSTGRES_PASSWORD` 和 `POSTGRES_SSL`。依次运行：

```bash
npm run db:postgres:migrate
npm run db:postgres:seed
npm run db:postgres:verify
npm run db:postgres:backup -- /srv/ffd-p2/backups/p2-postgres.dump
npm run db:postgres:restore -- /srv/ffd-p2/backups/p2-postgres.dump
```

不要同时切换生产驱动和删除原数据库。先在隔离数据库验证、备份原生产库，再修改 systemd 环境并执行健康检查；失败时恢复原 `DB_DRIVER` 后重启服务。
