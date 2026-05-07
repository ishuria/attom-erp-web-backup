# 季节系数看板 Feature 分层说明

这个目录按业务模块组织季节系数看板相关代码，`views` 只保留路由入口。

## components

放这个业务模块的 Vue 展示组件。

这里的组件可以有少量 UI 交互，但尽量不直接写接口请求、分页拼参、平台分发等业务流程。

例如：

- `components/SeasonalCoefficientDashboard.vue`：季节系数看板页面主体，负责布局、表格、图表和筛选控件展示。

## composables

放带 Vue 响应式状态的页面逻辑，也就是会用到 `ref`、`reactive`、`computed`、`watch`、`onMounted` 的逻辑。

适合放：

- 查询表单状态
- loading 状态
- 分页状态
- 排序状态
- 下拉选项状态
- 页面初始化流程
- 调 API 后更新页面数据

例如：

- `composables/useSeasonalCoefficientDashboard.ts`：管理这个看板的筛选、分页、排序、请求和图表数据。

## service

放无状态的业务函数。它可以存业务逻辑，但不应该存 Vue 页面状态。

适合放：

- 平台 code 解析
- 数据格式化
- 数据转换
- 默认选项构造
- 纯业务判断

不适合放：

- `ref`
- `reactive`
- `onMounted`
- 组件弹窗状态
- 表格分页状态

例如：

- `service.ts`：`formatPercent`、`getDiffStyle`、`getPlatformCodeById`、运营“全部”选项构造。

## api

放这个 feature 使用到的接口入口。

如果接口只服务当前 feature，就直接在这里用 `request` 写请求；如果多个 feature 都要用，再抽到全局 `api/devlocal/*`。

例如：

- `api.ts`：季节系数看板需要的平台、站点、品类、运营人员、看板数据接口。

## types

放这个 feature 暴露和使用的类型。

现在先复用全局 `type/storeOperation/seasonalCoefficientType.ts`，以后如果这个模块变复杂，可以把只属于这个看板的类型逐步迁进来。

## 简单判断

- 要写页面结构：放 `components`
- 要写 Vue 状态和生命周期：放 `composables`
- 要写纯业务函数：放 `service`
- 要调接口：放 `api`
- 要定义类型：放 `types`
