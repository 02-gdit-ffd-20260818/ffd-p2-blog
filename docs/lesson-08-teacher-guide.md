# 第 08 次课教师指南｜P2 v1.1 管理端

## 本课增量

- Vue Router：阅读端、管理列表、新建、编辑和预览路由。
- Pinia：统一文章状态与 CRUD action。
- 表单：标题/摘要字段级校验，草稿与发布状态。
- computed 搜索、localStorage 刷新恢复、删除二次确认。

## 135 分钟主线

1. 第 1 学时：画路由表；演示动态 `:id`、RouterLink 与 SPA fallback。
2. 第 2 学时：完成 Pinia store、表单新建/编辑、搜索与预览。
3. 第 3 学时：刷新编辑页、取消误删、空搜索和损坏存储测试；CI 后部署同一 Netlify URL。

## 演示顺序

```powershell
npm ci
npm run check
npm test
npm run dev
```

1. `/admin/articles` 搜索“Vue”。
2. 新建草稿，刷新页面后仍存在。
3. 预览草稿，回到首页确认草稿未公开。
4. 编辑为“已发布”，首页出现文章。
5. 点击删除后先取消，再确认删除。
6. 在开发者工具中把 `p2-articles` 改成损坏 JSON，刷新后回退种子数据。

## 验收

- 新建、读取、更新、删除均由 Pinia action 完成。
- 标题空值、摘要超长、空搜索、误删取消、刷新恢复均有证据。
- `netlify.toml` 保证直接刷新动态路由不返回 404。
- 建立 `p2-v1.1` Release，继续复用第 7 次课 Netlify URL。
