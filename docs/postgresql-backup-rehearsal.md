# PostgreSQL 备用兼容与恢复演练

演练时间：2026-09-06（Asia/Shanghai）  
服务器：Ubuntu `47.120.73.69`  
数据库：PostgreSQL 16（仅监听服务器默认受控端口）  
应用版本：P2 v2.2 PostgreSQL compatibility

## 演练范围

本次只创建隔离数据库和最小权限账号，不切换 P2 当前生产数据库，不影响 SQLite/MySQL 主链。

1. 创建隔离源库并运行 `db:postgres:migrate`。
2. 运行 `db:postgres:seed` 和 `db:postgres:verify`。
3. 使用自定义格式 `pg_dump` 生成备份。
4. 创建空恢复库，运行 `pg_restore --clean --if-exists`。
5. 再次执行结构验证，并比对源库和恢复库文章行数。

## 实际结果

```text
已应用 PostgreSQL 迁移：001_initial.sql
PostgreSQL 验证通过：业务表=articles,comments,users，迁移数=1，文章数=3
PostgreSQL 备份完成：/srv/ffd-p2-postgres-rehearsal-20260906/backups/p2-postgres.dump
PostgreSQL 恢复完成，请继续运行 db:postgres:verify。
PostgreSQL 验证通过：业务表=articles,comments,users，迁移数=1，文章数=3
POSTGRES_REHEARSAL_OK primary=3 restored=3
```

备份文件与 SHA256 校验文件权限均为 `600`。账号密码只保存在服务器 root 可读环境文件，不进入仓库、日志或截图。

## 回滚判断

PostgreSQL 是备用路径，不自动替换生产 MySQL/SQLite。只有迁移、seed、仓储 CRUD、备份恢复和健康检查全部通过，才可在维护窗口修改 `DB_DRIVER=postgres`；任一失败即恢复原驱动并重启 `ffd-p2-api`。
