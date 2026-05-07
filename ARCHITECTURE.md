# 前端项目结构约定

本项目采用 **feature 优先 + 全局共享** 的混合架构。

核心原则：

- 业务页面相关代码优先放到 `features/`，让一个功能的代码尽量聚在一起。
- 多个业务都会复用的能力，再抽到全局目录。
- `views/` 只作为路由入口，尽量不写复杂业务逻辑。

## 目录职责

```txt
src/
  features/        业务功能，页面级代码放这里
  api/             真正多个业务都复用的接口
  components/      真正多个业务都复用的组件
  composables/     真正通用的 usePagination/useTableSort 等 Vue 状态逻辑
  const/           全局稳定常量、枚举
  types/           跨业务共用类型
  utils/           纯工具函数
  views/           路由入口
```

## features

`features/` 放业务功能模块。一个功能相关的页面组件、接口、类型、状态逻辑、业务函数，优先放在同一个 feature 下。

推荐结构：

```txt
src/features/seasonal-coefficient-dashboard/
  api.ts
  types.ts
  service.ts
  composables/useSeasonalCoefficientDashboard.ts
  components/SeasonalCoefficientDashboard.vue
  README.md
```

适合放入 feature 的内容：

- 只服务当前页面或当前业务功能的 API
- 只服务当前功能的类型
- 当前功能的页面组件和子组件
- 当前功能的筛选、分页、排序、请求流程
- 当前功能的数据转换、格式化、业务判断

## views

`views/` 只保留路由入口，负责引入并渲染 feature 页面。

推荐写法：

```vue
<template>
  <seasonal-coefficient-dashboard />
</template>

<script lang="ts" setup>
import SeasonalCoefficientDashboard from '/@/features/seasonal-coefficient-dashboard/components/SeasonalCoefficientDashboard.vue'

defineOptions({ name: 'SeasonalCoefficientDashboard' })
</script>
```

`views/` 里尽量不要写：

- 接口请求
- 复杂分页逻辑
- 复杂表格转换
- 平台/角色等业务分发
- 大量弹窗状态

这些应优先放到 feature 的 `composables/` 或 `service.ts`。

## api

`src/api/` 放真正多个业务都会复用的接口。

判断标准：

- 只给一个 feature 用：放 `features/xxx/api.ts`
- 多个 feature 都要用：抽到 `src/api/`

不要为了“可能复用”提前把所有接口都放全局。先放 feature，等第二个业务也要用时再抽出来。

## components

`src/components/` 放真正跨业务复用的组件。

适合放：

- 基础 UI 组件
- 通用业务组件
- 多个页面都会用的选择器、弹窗、表格单元格

只在某个 feature 内使用的组件，应放在：

```txt
src/features/xxx/components/
```

## composables

`src/composables/` 放真正通用的 Vue 状态逻辑。

适合放：

- `usePagination`
- `useTableSort`
- `useSelection`
- `useDialog`

只属于某个业务功能的 composable，应放在：

```txt
src/features/xxx/composables/
```

注意：

- `composables` 通常会用 `ref`、`reactive`、`computed`、`watch`、`onMounted`
- 它负责页面状态和交互流程

## service

`service.ts` 放无 Vue 状态的业务函数，通常在 feature 内。

适合放：

- 数据格式化
- 数据转换
- 业务判断
- 默认选项构造
- 平台 code 解析

不适合放：

- `ref`
- `reactive`
- `onMounted`
- loading 状态
- 分页状态

简单区分：

```txt
composables = 有 Vue 状态的逻辑
service = 没 Vue 状态的纯业务函数
```

## const

`src/const/` 放全局稳定常量和枚举。

适合放：

- 平台 code
- 角色 code
- 站点枚举
- 状态枚举

只属于某个 feature 的常量，也可以先放在 feature 内，等复用后再抽到全局。

## types

`src/types/` 或现有 `src/type/` 放跨业务共用类型。

判断标准：

- 只给一个 feature 用：放 `features/xxx/types.ts`
- 多个业务都会用：抽到全局类型目录

## utils

`src/utils/` 只放纯工具函数，不依赖业务，不依赖 Vue 状态。

适合放：

- 日期格式化
- 数字处理
- 字符串处理
- 文件处理

如果函数里出现平台、角色、SKU、利润分等业务概念，优先考虑放到对应 feature 的 `service.ts`。

## import 约定

同一个 feature 内部，优先用相对路径：

```ts
import { useSeasonalCoefficientDashboard } from '../composables/useSeasonalCoefficientDashboard'
import { seasonalCoefficientDashboardApi } from '../api'
```

跨 feature 或引用全局目录，使用 `/@/`：

```ts
import request from '/@/utils/request'
import { PlatformCode } from '/@/const/platform'
```

## 新页面建议流程

新增一个业务页面时，优先创建：

```txt
src/features/your-feature/
  api.ts
  types.ts
  service.ts
  composables/useYourFeature.ts
  components/YourFeaturePage.vue

src/views/your-route/index.vue
```

先让 feature 自包含；当某个 API、类型、组件、composable 被第二个业务复用时，再抽到全局目录。
