# 顶部栏 AI 助手展示规则与配置项扩展说明

## 1. 目的

本文档用于说明当前“顶部栏 AI 助手”是如何控制显示的，并抽象出一套可复用的配置项接入方式，方便后续新增类似的顶部开关、浮窗开关、样式开关或行为开关。

适用场景：

- 新增顶部栏图标开关
- 新增主题配置抽屉中的布尔开关
- 新增需要支持“默认值 + 本地持久化 + 页面实时生效”的配置项

---

## 2. 当前 AI 助手的实际展示链路

当前顶部栏 AI 助手的唯一控制字段是：

```ts
theme.showDeepSeek
```

它的完整链路如下：

1. 默认值定义在 `src/config/theme.config.ts`
2. 统一导出在 `src/config/index.ts`
3. 注入到设置 store 的默认主题 `src/store/modules/settings.ts`
4. 运行时与本地缓存 `shop-vite-theme` 合并
5. 顶部栏组件 `library/components/VabRightTools/index.vue` 根据该字段决定是否渲染
6. 主题抽屉 `library/components/VabTheme/components/VabThemeDrawer.vue` 提供开关入口

可以把它理解成一句话：

`theme.showDeepSeek` 是顶部栏 AI 助手是否展示的单一事实来源。

---

## 3. 展示规则拆解

### 3.1 默认规则

`src/config/theme.config.ts` 中当前默认值为：

```ts
showDeepSeek: true
```

这表示：

- 首次进入系统时，AI 助手默认显示
- 但这个默认值只在“本地还没有缓存配置”时生效

---

### 3.2 运行时优先级

`src/store/modules/settings.ts` 中主题初始化逻辑是：

```ts
theme: { ...defaultTheme, ...getLocalStorage('shop-vite-theme') }
```

因此优先级是：

1. 本地缓存 `shop-vite-theme`
2. `defaultTheme`
3. `theme.config.ts` 中的初始配置

结论：

- 如果用户以前手动关掉过 AI 助手，并且点过保存，那么刷新后仍然不显示
- 修改 `theme.config.ts` 后，如果浏览器已有旧缓存，页面未必按新默认值展示
- 这也是 `theme.config.ts` 头部写“修改后需清理浏览器缓存”的原因

---

### 3.3 顶部栏实际渲染规则

顶部栏渲染位置在：

- 横向布局：`library/components/VabHeader/index.vue`
- 其他常见布局：`library/components/VabNav/index.vue`

这两个入口最终都会渲染：

```vue
<vab-right-tools />
```

而 `library/components/VabRightTools/index.vue` 中 AI 助手的展示判断为：

```vue
<vab-deep-seek v-show="theme.showDeepSeek" class="hidden-xs-only" />
```

这意味着当前真实规则是：

1. `theme.showDeepSeek === true` 时才显示
2. 在超小屏幕下还会被 `hidden-xs-only` 隐藏
3. 不依赖路由
4. 不依赖角色权限
5. 不依赖接口返回
6. 不区分横向布局和普通布局，两边都会走到 `vab-right-tools`

所以“顶部栏 AI 助手是否显示”的核心不是权限，而是主题配置项 + 响应式渲染。

---

### 3.4 点击后的兜底规则

具体点击逻辑在 `library/components/VabDeepSeek/index.vue`：

```ts
if (!theme.value.showDeepSeek) {
  $baseMessage('请先在主题设置中启用AI助手', 'warning', 'hey')
  return
}
```

这里做了二次校验。

虽然正常情况下按钮已经被 `v-show` 隐藏，不会点到，但这里仍然保留了兜底判断。这个写法是合理的，原因是：

- 组件后续可能被其他位置复用
- 防止外部直接调用打开逻辑
- 配置状态切换时更稳妥

---

### 3.5 是否“实时生效”和“持久化生效”

主题抽屉中的开关写法是：

```vue
<el-switch v-model="theme.showDeepSeek" />
```

这会带来两个层面的效果：

- 实时生效：会，因为 `theme` 是响应式对象，顶部栏立即跟着变
- 持久化生效：不一定，只有执行 `saveTheme()` 后才会写入本地缓存

当前主题抽屉底部有“保存”按钮：

```ts
const handleSaveTheme = () => {
  saveTheme()
  drawerVisible.value = false
}
```

所以当前 AI 助手开关的行为是：

- 切换开关后，页面立即变化
- 点击“保存”后，刷新仍保留
- 如果没保存直接刷新，可能回到旧缓存状态

---

## 4. 当前规则的简版结论

如果只看结果，可以记这一版：

1. 顶部栏 AI 助手由 `theme.showDeepSeek` 控制
2. 默认值来自 `src/config/theme.config.ts`
3. 实际运行时优先读取本地缓存 `shop-vite-theme`
4. 顶部栏展示点在 `library/components/VabRightTools/index.vue`
5. 主题抽屉负责修改该值
6. 点击“保存”后配置才持久化
7. 在超小屏下即使开关打开，也可能因为 `hidden-xs-only` 不显示

---

## 5. 举一反三：后续新增配置项时怎么做

后续如果要新增类似配置项，建议按下面 6 步走。

### 第 1 步：在类型里声明字段

文件：

- `types/theme.d.ts`

示例：

```ts
declare interface ThemeType {
  showFooEntry?: boolean
}
```

作用：

- 保证 `theme.xxx` 访问有类型提示
- 避免配置项只在运行时存在、缺少类型约束

---

### 第 2 步：在主题默认配置中定义初始值

文件：

- `src/config/theme.config.ts`

示例：

```ts
showFooEntry: false,
```

作用：

- 定义首次进入系统时的默认行为
- 让 `defaultTheme` 能拿到这个值

注意：

- 这里的值不代表最终值
- 只代表“本地缓存不存在时”的初始默认值

---

### 第 3 步：在统一配置出口导出字段

文件：

- `src/config/index.ts`

示例：

```ts
export const {
  // ...
  showFooEntry,
} = config
```

作用：

- 让 store 或其他模块可以统一从 `/@/config` 取值

---

### 第 4 步：挂到 settings store 的默认主题里

文件：

- `src/store/modules/settings.ts`

需要做两件事：

1. 从 `/@/config` 引入该字段
2. 写进 `defaultTheme`

示例：

```ts
import { showFooEntry } from '/@/config'

const defaultTheme: ThemeType = {
  // ...
  showFooEntry,
}
```

作用：

- 让该配置进入全局响应式主题对象
- 让本地缓存合并逻辑自动覆盖它

---

### 第 5 步：给用户一个修改入口

最常见位置是主题抽屉：

- `library/components/VabTheme/components/VabThemeDrawer.vue`

示例：

```vue
<el-form-item :label="translate('Foo入口')">
  <el-switch v-model="theme.showFooEntry" />
</el-form-item>
```

如果需求是“修改后立即持久化”，可以补上显式保存逻辑；如果沿用当前主题抽屉模式，则保持“即时生效，手动保存”。

---

### 第 6 步：在实际消费组件里使用该字段

比如新增顶部栏入口：

- `library/components/VabRightTools/index.vue`

示例：

```vue
<vab-foo-entry v-show="theme.showFooEntry" class="hidden-xs-only" />
```

如果是控制浮窗、侧边栏、卡片区块，也是一样：

```vue
<foo-panel v-if="theme.showFooPanel" />
```

经验建议：

- 纯展示开关用 `v-show` 或 `v-if` 即可
- 如果组件初始化成本高，优先 `v-if`
- 如果只是频繁切换显隐，优先 `v-show`

---

## 6. 推荐的新增配置项模板

如果后面继续加“顶部栏开关类”配置，建议统一采用下面模板。

### 6.1 命名建议

布尔开关统一使用：

- `showXxx`

例如：

- `showAiEntry`
- `showWorkbenchEntry`
- `showMessageCenter`
- `showQuickCreate`

非布尔配置统一使用有语义的名词：

- `fooMode`
- `fooPosition`
- `fooWidth`
- `fooPermissionCode`

---

### 6.2 推荐接入清单

新增一个主题类配置时，优先检查这些文件：

- `types/theme.d.ts`
- `src/config/theme.config.ts`
- `src/config/index.ts`
- `src/store/modules/settings.ts`
- `library/components/VabTheme/components/VabThemeDrawer.vue`
- 实际消费该配置的组件

如果配置会影响 CSS 变量或全局主题，还要继续看：

- `src/store/modules/settings.ts` 中的 `setCssVar()`
- `src/store/modules/settings.ts` 中的 `updateTheme()`

---

## 7. 什么时候不适合塞进 theme 配置

不是所有配置都应该照搬 `showDeepSeek` 这套。

以下场景不建议放进 `theme`：

- 和用户权限强相关的开关
- 需要后端下发并强控的开关
- 明显属于业务配置而不是界面配置的字段
- 需要按账号、按组织、按租户统一控制的字段

这类场景更适合：

- 放在独立业务 store
- 登录后从接口拉取
- 与权限码、角色、组织配置合并判断

换句话说：

- `theme` 更适合“界面偏好”
- `permission/business config` 更适合“业务准入”

---

## 8. 给后续开发的落地建议

如果只是新增一个“顶部栏展示/隐藏”的配置项，优先复用 `showDeepSeek` 这条链路，不要另起一套状态管理。

建议直接按下面原则执行：

1. 展示开关统一放 `theme`
2. 默认值统一放 `theme.config.ts`
3. 用户可改项统一进主题抽屉
4. 页面展示统一读取 `theme.xxx`
5. 如需防误触，可在点击逻辑里加一次兜底校验
6. 如需永久生效，记得补 `saveTheme()` 的触发时机说明

---

## 9. 一句话模板

后续再新增类似配置项时，可以直接套这句：

“先在 `ThemeType`、`theme.config.ts`、`config/index.ts`、`settings.ts` 中把配置项打通，再在主题抽屉提供修改入口，最后在实际组件里读取 `theme.xxx` 控制展示。”
