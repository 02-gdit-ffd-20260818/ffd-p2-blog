# 长风成卷｜P2 个人博客与内容管理平台

当前版本：`p2-v1.1` 管理端。

## 5 分钟启动

```powershell
npm ci
npm run check
npm test
npm run dev
```

生产构建：

```powershell
npm run build
```

## v1.0 已完成

- 文章列表、详情、标签筛选和关于页面。
- props、emit、命名 slot 和生命周期。
- loading、success、empty、error、not-found 状态。
- 10 项逻辑测试、3 项组件测试和 9 项结构检查。
- GitHub Actions 与 Netlify 配置。

## v1.1 新增

- Vue Router 动态路由与 Netlify SPA fallback。
- Pinia 文章 store、搜索、新建、编辑、删除和预览。
- 草稿隔离、字段级校验、删除确认和 localStorage 刷新恢复。
- 管理端 service 的正常、边界和失败测试。

## 状态模拟

- 空数据：`/?empty=1`
- 请求失败：`/?fail=1`
- 文章不存在：`/#/articles/missing`

教师指南见 `docs/lesson-07-teacher-guide.md`，学生入口见 `docs/lesson-07-student-guide.md`。
