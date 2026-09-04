# 第 11 次课教师指南：权限、MySQL 与生产部署

## 本课可验收结果

学生应交付 `p2-v2.2`：公开阅读不登录；管理端登录后才能写入；作者不能删除；管理员可以删除；生产 API 使用 MySQL 最小权限账号，经 systemd 与 Nginx 提供服务，并留下备份和回滚证据。

## 课前自检

```powershell
npm ci
npm run check
npm test
npm run build
```

复制 `.env.example` 为本地 `.env`，自行填写至少 32 字符的 `SESSION_SECRET` 和至少 12 字符的管理员密码。真实值只进入服务器环境文件或 Secret，不进入 Git、截图和课堂投屏。

## 90 分钟教学路径

| 时间 | 教师演示 | 验收证据 |
| --- | --- | --- |
| 0—15 分钟 | 区分认证、授权和前端隐藏；画访客/作者/管理员矩阵 | 权限矩阵 |
| 15—30 分钟 | scrypt + salt、统一登录错误、签名令牌 | 正确/错误登录测试 |
| 30—45 分钟 | 对 POST/PUT/DELETE 加服务器端角色校验 | 401、403、成功路径 |
| 45—60 分钟 | 同一 repository 接口从 SQLite 切 MySQL | 三表迁移与最小权限账号 |
| 60—72 分钟 | systemd、Nginx、环境变量和健康检查 | 服务状态与公开 URL |
| 72—82 分钟 | 真实备份、删除测试数据、恢复验证 | SQL 备份与恢复记录 |
| 82—90 分钟 | CI、Release、生产 smoke、回滚 | CI/URL/tag/回滚证据 |

## 权限矩阵

| 操作 | 访客 | 作者 | 管理员 |
| --- | --- | --- | --- |
| 阅读文章 | 允许 | 允许 | 允许 |
| 新建/修改 | 401 | 允许 | 允许 |
| 删除 | 401 | 403 | 允许 |

不能以“前端没有显示按钮”作为授权证据，必须直接请求 API 验证 401/403。

## MySQL 命令

```bash
npm run db:mysql:migrate
npm run db:mysql:seed
npm run db:mysql:verify
npm run db:mysql:backup -- /srv/ffd-p2/backups/p2-v2.2.sql
```

恢复会覆盖或合并当前数据库，必须先停止 API 并再次备份：

```bash
sudo systemctl stop ffd-p2-api
npm run db:mysql:backup -- /srv/ffd-p2/backups/before-restore.sql
npm run db:mysql:restore -- /srv/ffd-p2/backups/p2-v2.2.sql
npm run db:mysql:verify
sudo systemctl start ffd-p2-api
```

## 生产检查

```bash
sudo systemctl is-active ffd-p2-api
sudo nginx -t
curl -i http://127.0.0.1:3010/health
```

生产数据库账号只授予本项目数据库的 `SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES`，不使用 MySQL root 运行应用。3010 只允许 localhost，经 Nginx 暴露。日志不得包含密码、Bearer token、Cookie 或正文。

## 回滚顺序

1. 记录失败 commit 与时间，先备份当前数据库。
2. 将应用目录切回上一 Release tag，执行 `npm ci --omit=dev`。
3. 只在迁移不兼容时恢复对应备份，不能凭感觉覆盖数据。
4. 重启 systemd，执行 health、登录、阅读和权限 smoke test。
5. 保留失败原因、回滚 tag、备份路径和复验结果。

## 验收清单

- [ ] 登录正确、错误、过期和篡改令牌测试通过。
- [ ] 未登录写入为 401，作者删除为 403，管理员删除成功。
- [ ] SQLite 本地模式和 MySQL 生产模式使用同一 API 契约。
- [ ] MySQL 三表、外键、utf8mb4、最小权限账号和真实备份均验证。
- [ ] Nginx、systemd、health、日志、端口隔离和回滚演练完成。
- [ ] CI、生产 URL、tag `p2-v2.2` 与 Release 可访问。
