# 第 09 次课教师指南｜P2 v2.0 REST 联调

## 课前检查

终端一运行 `npm ci` 和 `npm run dev:api`，终端二运行 `npm run dev`。完整验收执行 `npm run check`、`npm test`、`npm run build`。

## 135 分钟主线

1. 第 1 学时：用 `docs/api-contract.md` 讲请求方法、资源路径、JSON、2xx/4xx/5xx；现场完成 health、GET、POST。
2. 第 2 学时：完成 PUT/DELETE、服务器端校验、统一错误和前端 `articleApi`；从 Pinia localStorage action 切换到异步 API action。
3. 第 3 学时：执行 `.http` 请求和接口自动测试；关掉 API 观察前端 error/retry；启动后恢复并发布。

## 故障演示

- 删除 `express.json()`：请求体无法解析。
- 把标题校验只留在前端：直接 POST 空标题绕过。
- 把 API 地址硬编码成本机：Netlify 上线后请求访问者自己的 127.0.0.1。
- 关闭 API：前端必须显示失败并保留重试入口。

## 本课边界

v2.0 使用内存 repository，重启后恢复种子数据是预期行为；第 10 次课才以相同 repository 接口换成 SQLite。不要在本课提前混入 SQL，以免学生无法区分 HTTP 层和数据层。

## 验收

- API 正常、边界、失败测试全部通过。
- 非法输入返回 400，错误 id 返回 404，损坏 JSON 不得返回 500。
- 前端只通过 `articleApi` 读写。
- 本地 `/health` 和生产 API `/health` 均通过。
- 建立 `p2-v2.0` Release，记录 Netlify 前端 URL 与 Ubuntu API URL。
