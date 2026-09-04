# 第 10 次课教师指南：把内存数据换成 SQLite

## 本课可验收结果

学生下课前应交付 `p2-v2.1`：API 路径保持不变，文章写入数据库后重启仍存在；迁移可重复执行；可以完成一次备份、恢复和完整性验证。

## 课前 5 分钟自检

```powershell
npm ci
npm run db:migrate
npm run db:seed
npm run db:verify
npm run check
npm test
npm run build
```

默认数据库是 `var/p2-blog.sqlite`，已被 `.gitignore` 排除。不要把真实数据文件提交到 Git。

## 90 分钟教学路径

| 时间 | 教师演示 | 学生留下的证据 |
| --- | --- | --- |
| 0—10 分钟 | 对比 memory 与 SQLite repository；说明接口不变的价值 | 能指出 app 与数据库实现的边界 |
| 10—30 分钟 | 读 `001_initial.sql`，运行两次 `db:migrate` | 第二次提示“已是最新版本” |
| 30—50 分钟 | 启动 API，新建文章，停止并重启 | 重启后 GET 仍能读到新文章 |
| 50—65 分钟 | 演示状态筛选、关键词和分页 | 保存一条分页请求与响应 |
| 65—78 分钟 | 插入评论后删除文章，观察外键级联 | 评论数量从 1 变成 0 |
| 78—88 分钟 | 备份、恢复、完整性检查 | 备份文件路径和 `integrity=ok` |
| 88—90 分钟 | push 并查看 CI | commit、CI URL、Release 草稿 |

## 课堂演示命令

启动服务：

```powershell
npm run dev:api
```

分页请求：

```text
GET http://127.0.0.1:3000/api/articles?status=published&page=1&pageSize=1
```

备份与验证：

```powershell
npm run db:backup
npm run db:verify
```

恢复会覆盖 `DATABASE_PATH` 指向的数据库。先停止 API，再明确传入刚生成的备份文件：

```powershell
npm run db:restore -- ./var/backups/你的备份文件.sqlite
npm run db:verify
```

## 讲课抓手

- `schema_migrations` 记录哪些 SQL 已执行，因此迁移可重复运行。
- `PRAGMA foreign_keys = ON` 让文章删除时评论同步删除。
- WAL 与 `busy_timeout` 降低课堂并发请求出现“database is locked”的概率。
- JSON 数组在 SQLite 中以文本保存，repository 负责序列化与反序列化，API 不暴露存储细节。
- SQLite 适合单机教学和早期项目；第 11 次课再保持同一接口切换 MySQL。

## 验收清单

- [ ] 迁移连续执行两次不报错。
- [ ] 三张业务表与索引存在。
- [ ] 新建、更新、删除、搜索、分页均通过 API 完成。
- [ ] 服务重启后数据不丢失。
- [ ] 备份可恢复且 `db:verify` 通过。
- [ ] `npm run check`、`npm test`、`npm run build` 全绿。
- [ ] GitHub CI、tag `p2-v2.1` 与 Release 可访问。
