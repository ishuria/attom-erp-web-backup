# 页面久置后新标签打不开修复说明

## 一、问题现象

页面打开一段时间不操作后，再点击需要打开新标签页的菜单或入口，偶尔不会弹出新标签页。此时页面本身没有明显报错，按 F5 刷新后通常又能恢复。

## 二、原因说明

浏览器对新标签页有弹窗拦截规则：只有在用户点击事件当下直接执行的 `window.open`，才会被稳定认为是用户主动操作。

原来的部分导航代码是：

```ts
点击菜单
  等 Vue 下一轮更新 nextTick
    再执行 window.open
```

因为 `window.open` 被放到了 `nextTick` 这种异步回调里，浏览器有时会认为它不是本次点击直接触发，而是脚本自动弹窗，从而拦截新标签页。页面放置较久后，浏览器或页面状态更容易触发这种不稳定表现。

## 三、修复方案

把“打开新标签页”提前到点击事件内立即执行，后续再做路由跳转、菜单状态更新等逻辑。

修复后的逻辑是：

```ts
点击菜单
  立即执行 window.open
  再执行 router.push('/redirect') 等后续处理
```

同时新增了统一方法：

```ts
openRouteInNewTab(path)
```

该方法负责：

- 外部链接：直接打开原链接
- 内部路由：按当前 hash 路由模式生成 `#/xxx` 地址后打开
- 使用 `_blank` 打开新标签页，并带上 `noopener`

## 四、改动范围

本次只修改前端全局导航相关代码，不涉及业务页面和后端接口。

涉及文件：

- `src/utils/routes.ts`
  - 新增 `getNewTabPath`
  - 新增 `openRouteInNewTab`
- `library/components/VabMenu/components/VabMenuItem.vue`
  - 左侧菜单新标签页同步打开
- `library/components/VabFallBar/index.vue`
  - 瀑布菜单新标签页同步打开
- `library/components/VabColumnBar/index.vue`
  - 分栏一级菜单新标签页同步打开
  - 点击时直接使用当前点击的 tab，避免读取旧菜单状态
- `library/components/VabNav/index.vue`
  - 顶部综合菜单新标签页同步打开
  - 点击时直接使用当前点击的 tab，避免读取旧菜单状态

## 五、影响评估

预期影响：

- 页面久置后，再点击配置了 `target: '_blank'` 的菜单，新标签页应能稳定打开
- 外部链接仍按外部链接打开
- 内部路由仍按系统当前 hash 路由模式打开
- 原有打开后跳转 `/redirect` 的框架行为保留

不影响：

- 后端接口
- 登录逻辑
- 页面业务表格、表单、弹窗
- 普通菜单的当前页跳转

