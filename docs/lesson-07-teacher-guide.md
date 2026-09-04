# 第 07 次课教师指南｜P2 v1.0 阅读端

## 课前 5 分钟检查

```powershell
npm ci
npm run check
npm test
npm run build
```

四条演示地址：

- 正常：`/`
- 空数据：`/?empty=1`
- 请求失败：`/?fail=1`
- 文章不存在：`/#/articles/missing`

## 135 分钟讲授与现场代码

### 第 1 学时：先定组件契约

1. 10 分钟：从“文章列表 → 详情 → 标签 → 关于”解释用户路径。
2. 10 分钟：对照 `ArticleCard.vue` 讲 prop 只读和 emit 上报意图。
3. 10 分钟：删除父组件的 `@open`，观察按钮仍被点击但页面不响应。
4. 10 分钟：对照 `AppShell.vue` 解释为什么导航内容适合命名插槽。
5. 5 分钟：学生画组件树并标出数据向下、事件向上。

### 第 2 学时：做出完整阅读路径

1. 从 `articles.json` 读取三篇文章。
2. 用 `normalizeArticle` 隔离不可信数据。
3. 用 `ArticleList` 组合卡片；点击按钮后修改 hash。
4. 用 `ArticleDetail` 处理存在与不存在两种结果。
5. 用标签按钮进入筛选结果，解释为什么筛选不修改源数组。

### 第 3 学时：先故障，再发布

1. 打开 `?empty=1`，确认不是空白页。
2. 打开 `?fail=1`，点击“重新加载”，说明可恢复失败态。
3. 打开不存在文章地址，确认有返回入口。
4. 执行结构检查、10 项逻辑测试、3 项组件测试和生产构建。
5. 推送 GitHub，检查绿色 CI，再由 Netlify 发布。

## 常见错误演示

- 在 `ArticleCard` 内直接改 `article.title`：说明子组件不拥有该数据。
- `v-if` 顺序错误导致 loading 与 empty 同时出现：把状态改为互斥分支。
- 把本机绝对路径写进 JSON：部署后资源失效。
- 只测试三篇文章：提醒学生补空数组、503 和错误 slug。

## 本课验收

- `npm ci && npm run check && npm test && npm run build` 全部通过。
- 正常、空、失败、未找到四种状态可演示。
- GitHub Actions 为绿色。
- Netlify URL 可匿名访问。
- 建立 `p2-v1.0` Release，并作为第 8 次课 starter。
