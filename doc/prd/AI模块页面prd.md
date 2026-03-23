# spec-frontend.md

## 1. 文档目标

本文档用于定义一套新的通用聊天插件前端方案。该方案基于当前工程技术栈实现，但不复用、不改造项目中已有的 GPT 页面或相关旧代码。

本次目标是新建一个 `ai` 模块，其中页面与页面组件放在 `src/views/ai`，其余接口、状态、类型、工具等分别放入工程已有的公共目录中，保持整个项目目录风格一致。

适用范围：

- `src/views/ai` 页面与组件目录规划
- 通用聊天组件划分
- 状态管理约定
- 接口层组织方式
- Markdown 与流式输出能力设计
- 挂载与接入方式

不包含内容：

- 后端实现细节
- 业务知识库配置
- 模型供应商配置
- 非聊天能力的业务页面实现

---

## 2. 建设原则

本次方案必须满足以下原则：

- 新建实现，不复用现有 `src/views/GPT` 下的页面和逻辑。
- 新增的页面与页面组件统一命名为 `ai`，并存放到 `src/views/ai`。
- 方案以通用聊天能力为目标，不与某个单独业务页面强耦合。
- 保持与现有技术栈一致：Vue 3、TypeScript、Pinia、Element Plus、Vite。
- 接口调用遵循现有项目规范，统一通过项目请求能力访问后端/BFF。
- 插件能力设计要支持后续扩展为多会话、流式响应、快捷指令、业务上下文注入。
- 编写代码时必须保持良好的注释习惯，只在必要位置补充简洁、有效的说明性注释。

---

## 3. 与现有工程的关系

当前工程中虽然存在旧版 GPT 页面，但本次文档明确要求：

- 不参考 `src/views/GPT/ChatGPT.vue` 的页面结构作为最终方案。
- 不在原有 GPT 页面基础上增量修改。
- 不复用原有页面中的请求实现、打字效果实现、消息结构定义。
- 不将新模块继续放在 `views/GPT` 下。

允许复用的仅限工程基础设施：

- Vue 3
- TypeScript
- Pinia
- Element Plus
- `/@/utils/request`
- 项目已有依赖，如 `marked`、`dompurify`、`typeit`

换言之，本次是“复用底层框架能力”，不是“复用旧业务代码”。

---

## 4. 技术约束

| 层级 | 方案 | 说明 |
|------|------|------|
| 框架 | Vue 3 + TypeScript | 与现有项目一致 |
| 状态管理 | Pinia | 状态独立管理 |
| UI 组件 | Element Plus | 弹窗、按钮、输入框等基础组件复用 |
| 请求层 | `/@/utils/request` + `fetch` | 普通请求走 request，流式按需走 fetch |
| Markdown 渲染 | `marked` + `dompurify` | 当前仓库已具备依赖 |
| 打字机效果 | `typeit` 或流式 chunk 渲染 | 二选一或组合使用 |
| 样式 | scoped scss 或独立 scss 文件 | 避免污染全局 |

约束要求：

- 不新增与项目现有技术栈明显冲突的新框架。
- 不直接在页面中拼接第三方域名调用接口。
- 不把聊天逻辑分散到多个业务页面中。
- 不把能力设计成只适用于某一个业务模块。
- 目录、组件、类型、接口、状态的命名保持统一，避免出现 `ai`、`chat`、`gpt` 混用且语义不清的情况。
- `views` 之外的代码文件应优先放入项目已有公共目录，不在 `src/views/ai` 下继续自建一套 `api`、`store`、`types`、`utils` 的平行体系。

---

## 5. 推荐目录结构

本次统一以 `src/views/ai/` 作为页面与组件根目录，非视图层文件按项目已有公共目录落位。

```text
src/
├── views/
│   └── ai/
│       ├── index.vue                         # AI 模块主入口或容器页
│       └── vabAutoComponents/
│           ├── AiChatLauncher.vue           # 悬浮触发按钮
│           ├── AiChatModal.vue              # 聊天弹窗容器
│           ├── ConversationSidebar.vue      # 会话侧边栏
│           ├── ChatPanel.vue                # 聊天主面板
│           ├── MessageList.vue              # 消息列表
│           ├── MessageItem.vue              # 单条消息
│           ├── MessageInput.vue             # 输入框区域
│           ├── TypingIndicator.vue          # 输入中动画
│           └── ModelSelector.vue            # 模型选择器，可选
├── api/
│   └── devlocal/
│       └── ai.ts                            # AI 模块接口层
├── store/
│   └── modules/
│       └── ai.ts                            # AI 模块状态
├── type/
│   └── ai/
│       └── chat.ts                          # AI 模块类型定义
└── utils/
    ├── aiMarkdown.ts                        # Markdown 渲染与清洗
    ├── aiStream.ts                          # 流式响应处理
    └── aiScroll.ts                          # 滚动工具
```

目录要求：

- 视图层代码统一放在 `src/views/ai/` 下。
- 组件优先放在 `src/views/ai/vabAutoComponents/`，与当前仓库组件组织习惯保持一致。
- 接口文件放在 `src/api/devlocal/ai.ts` 或同级 AI 专用文件中，遵循现有 `devlocal` 目录风格。
- 状态文件放在 `src/store/modules/ai.ts`，遵循现有 store module 组织方式。
- 类型文件放在 `src/type/ai/chat.ts`，遵循现有 `src/type/<业务域>` 目录风格。
- 工具函数放在 `src/utils/` 下，以 `ai` 前缀命名，避免与现有公共工具重名。
- 若最终需要全局挂载能力，可增加 `src/views/ai/install.ts` 这类导出层文件，但不应为了模块私有逻辑在 `views/ai` 下再复制一套公共目录结构。

---

## 6. 模块定位

该方案定位为“通用聊天模块”，实现形态以聊天插件为主，但目录归属在 `src/views/ai`。

也就是说：

- 从目录组织看，它是 `views` 下的一个独立模块。
- 从能力形态看，它具备插件化和复用化设计。
- 从使用方式看，既可以挂到某个 AI 页面，也应支持后续扩展为全局入口。

典型形态如下：

- 页面右下角悬浮按钮
- 点击后打开聊天弹窗
- 弹窗内支持消息展示、输入、发送、会话切换
- 后续可根据产品需求演化为固定页面、工具页、工作台挂件或全局助手

支持的能力范围：

- 多会话管理
- 单会话消息渲染
- Markdown 内容展示
- 流式响应
- 模型切换
- 错误提示
- 加载中状态

暂不强制纳入本期的能力：

- 文件上传问答
- 图片识别
- 语音输入
- 插件拖拽位置记忆
- 指令模板市场

---

## 7. 挂载与接入方式

本期建议保留两种接入设计，但优先实现一种，避免过度铺开。

### 7.1 页面容器模式

以 `src/views/ai/index.vue` 作为主入口页面：

- 页面负责承载聊天模块
- 路由可单独指向该页面
- 适合作为“AI 工具页”或“工作台 AI 页”

### 7.2 插件挂载模式

如需支持插件挂载模式，可在 `src/views/ai/install.ts` 中提供安装能力，用于：

- 注册根组件
- 注册悬浮入口
- 注入配置项

### 7.3 当前建议

文档层面先按“模块可插件化”设计：

- 页面目录放在 `src/views/ai`
- 非视图层代码回归项目已有公共目录
- 导出层可按需要预留 `install.ts`
- 具体是走独立页面还是全局挂载，编码时根据最终 PR 范围确定

这样可以避免文档先天把实现锁死在“只能做页面”或“只能做插件”其中一种方式上。

---

## 8. UI 结构设计

### 8.1 整体结构

```text
AI 模块入口
└── <AiChatLauncher /> 或 <AiChatContainer />
    └── <AiChatModal />
        ├── <ConversationSidebar />
        └── <ChatPanel />
            ├── <ModelSelector />
            ├── <MessageList />
            │   └── <MessageItem />
            ├── <TypingIndicator />
            └── <MessageInput />
```

### 8.2 建议尺寸

| 属性 | 值 |
|------|-----|
| 弹窗宽度 | 760px |
| 弹窗高度 | 560px |
| 侧边栏宽度 | 220px |
| 聊天主区域宽度 | 540px |
| 弹窗位置 | 右下角，距底部 24px，距右侧 24px |
| 悬浮按钮 | 48px 或 56px 圆形按钮 |

### 8.3 视觉原则

- 样式与现有 ERP 主题兼容
- 不引入过强的独立视觉体系
- 避免污染全局样式
- 消息区域保证长文本、代码块、列表、表格的可读性

---

## 9. 交互流程

### 9.1 打开流程

1. 用户点击右下角悬浮按钮或进入 AI 页面
2. 聊天容器展开
3. 加载会话列表
4. 若无会话，则自动创建默认会话
5. 加载当前会话历史消息

### 9.2 发送流程

1. 用户输入问题
2. 前端进行空值校验
3. 先追加用户消息
4. 插入 AI 占位消息
5. 进入发送中状态
6. 调用聊天接口
7. 若为流式响应，逐块更新 AI 占位消息
8. 响应完成后结束发送状态

### 9.3 会话流程

1. 用户可创建新会话
2. 用户可切换会话
3. 用户可删除会话
4. 删除当前会话后自动切换到下一个可用会话
5. 若全部删除，则自动创建一个新的空会话

### 9.4 异常流程

- 接口失败时保留用户消息
- AI 占位消息改为错误提示内容
- 发送状态立即恢复
- 给出统一消息提示

---

## 10. 组件职责划分

### 10.1 `AiChatLauncher.vue`

职责：

- 提供右下角悬浮入口
- 控制聊天容器开关
- 可显示未读提示或状态点位，当前可预留

### 10.2 `AiChatModal.vue`

职责：

- 负责整体布局
- 负责遮罩、关闭、尺寸控制
- 承载侧边栏与聊天面板

### 10.3 `ConversationSidebar.vue`

职责：

- 展示会话列表
- 会话切换
- 新建会话
- 删除会话
- 当前会话高亮

### 10.4 `ChatPanel.vue`

职责：

- 组织消息区、输入区、模型选择区
- 控制滚动到底部
- 处理空态与加载态

### 10.5 `MessageList.vue`

职责：

- 渲染当前会话消息集合
- 根据角色分发消息组件样式
- 提供滚动容器引用

### 10.6 `MessageItem.vue`

职责：

- 渲染单条消息
- 区分 `user`、`assistant`、`system`
- 处理 Markdown 内容
- 处理错误态与加载态

### 10.7 `MessageInput.vue`

职责：

- 提供输入框
- 处理 Enter 发送、Shift + Enter 换行
- 发送中禁用按钮

### 10.8 `TypingIndicator.vue`

职责：

- 在 AI 响应进行中展示状态动画
- 仅作视觉辅助，不承担实际流式逻辑

### 10.9 `ModelSelector.vue`

职责：

- 提供模型切换
- 切换后写入模块状态
- 为后端接口传递当前模型参数

---

## 11. 状态管理设计

模块内部状态建议单独维护在：

`src/store/modules/ai.ts`

推荐状态字段：

- `isOpen`: 弹窗是否打开
- `isStreaming`: 是否正在流式响应
- `loading`: 是否处于发送中
- `conversations`: 会话列表
- `activeConversationId`: 当前激活会话
- `messages`: 消息缓存，按会话维度存储
- `currentModel`: 当前模型
- `initialized`: 模块是否已完成初始化

推荐 getters：

- `activeConversation`
- `activeMessages`
- `canSend`

推荐 actions：

- `toggleModal`
- `openModal`
- `closeModal`
- `loadConversations`
- `createConversation`
- `switchConversation`
- `removeConversation`
- `loadMessages`
- `sendMessage`
- `resetState`

要求：

- 模块状态与业务页面状态隔离
- 不直接污染现有项目的业务 store
- 模块内部可以缓存已加载消息，避免频繁重复请求

---

## 12. 类型设计

类型统一放在：

`src/type/ai/chat.ts`

推荐类型：

```ts
export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id?: number | string
  role: ChatRole
  content: string
  createdAt?: string
  status?: 'loading' | 'success' | 'error'
}

export interface ChatConversation {
  id: number | string
  title: string
  createdAt?: string
}

export interface ChatModuleConfig {
  enabled?: boolean
  defaultModel?: string
  showLauncher?: boolean
  title?: string
  welcomeMessage?: string
  enableConversation?: boolean
  placement?: 'bottom-right'
}
```

---

## 13. 接口层设计

接口层统一放在：

`src/api/devlocal/ai.ts`

### 13.1 设计原则

- 普通接口使用 `/@/utils/request`
- 流式接口可单独使用 `fetch`
- 不在组件内部直接写请求细节
- 接口路径统一通过项目后端/BFF 暴露

### 13.2 推荐接口

```ts
export function getConversationList()
export function createConversation()
export function deleteConversation(id: number | string)
export function getMessageList(conversationId: number | string)
export function updateConversationTitle(data: { id: number | string; title: string })
export function sendChatMessage(data: {
  conversationId: number | string
  content: string
  model?: string
})
export function streamChatMessage(
  data: {
    conversationId: number | string
    content: string
    model?: string
  },
  callbacks: {
    onChunk: (chunk: string) => void
    onDone: (payload?: any) => void
    onError: (message: string) => void
  }
)
```

### 13.3 后端约束

前端期望后端提供以下能力：

- 会话列表查询
- 创建会话
- 删除会话
- 历史消息查询
- 普通消息发送
- 流式消息发送

若后端本期尚未提供完整多会话能力，则模块可先保留单会话实现，但目录和状态设计仍按可扩展结构保留。

---

## 14. Markdown 与内容安全

推荐在 `src/utils/aiMarkdown.ts` 中统一处理：

- Markdown 解析
- HTML 清洗
- 安全内容输出

设计要求：

- 使用 `marked` 解析 Markdown
- 使用 `dompurify` 清洗 HTML
- 默认禁止不安全标签与脚本注入
- 链接、代码块、列表、表格需可正常展示

说明：

- 本期若代码高亮不是必须，可先保留普通代码块展示
- 若后续需要高亮，再在公共工具层扩展，不影响上层组件结构

---

## 15. 流式响应设计

若后端提供 SSE 或可读流能力，推荐在 `src/utils/aiStream.ts` 中单独封装。

职责：

- 发起流式请求
- 解析 chunk
- 将 chunk 回调给 store 或组件
- 统一处理 `done`、`error`

要求：

- 组件层不直接操作原始 `ReadableStream`
- store 只关心消息如何更新，不关心底层流读取细节
- 同一会话在流式返回期间禁止重复发送

---

## 16. 滚动与渲染行为

滚动逻辑建议放在：

`src/utils/aiScroll.ts`

要求：

- 新消息插入时自动滚动到底部
- 流式消息更新时按需滚动到底部
- 不采用 `setInterval` 持续轮询滚动
- 避免由于频繁渲染造成滚动抖动

---

## 17. 配置能力

模块建议支持初始化配置，配置项可包括：

- 是否启用模块
- 默认模型
- 是否显示悬浮入口
- 默认弹窗标题
- 默认欢迎语
- 是否启用多会话

推荐配置示意：

```ts
export interface ChatModuleConfig {
  enabled?: boolean
  defaultModel?: string
  showLauncher?: boolean
  title?: string
  welcomeMessage?: string
  enableConversation?: boolean
}
```

配置原则：

- 提供合理默认值
- 不要求每个业务页面重复配置
- 后续支持按业务场景透传上下文参数

---

## 18. 样式要求

样式建议优先写在各组件局部样式中；若需要公共样式文件，可放在 `src/views/ai/` 下的样式文件中，由页面入口统一引入。

要求如下：

- 样式隔离，避免污染现有 ERP 页面
- 尽量复用 Element Plus 主题变量
- 保持消息气泡、滚动区、输入区的层次清晰
- 兼容常见桌面分辨率
- 小屏场景下弹窗允许降级为全宽或近全宽展示

---

## 19. 注释规范

本模块代码需保持良好的注释习惯，但禁止无意义注释。

要求如下：

- 对复杂状态流转、流式处理、消息同步逻辑补充简洁注释
- 对接口兜底策略、异常处理、滚动控制等关键逻辑补充说明
- 对显而易见的赋值、循环、模板渲染不写无价值注释
- 注释以“说明为什么这样做”为主，而不是重复代码表面行为

---

## 20. 分阶段实施建议

### Phase 1

- 新建 `src/views/ai/` 页面与组件骨架
- 搭建聊天容器、输入区、消息区
- 实现单会话消息收发

### Phase 2

- 增加多会话列表
- 接入会话创建、切换、删除
- 完成消息缓存

### Phase 3

- 接入流式返回
- 完成 Markdown 渲染
- 完善错误提示、滚动和加载状态

### Phase 4

- 增加配置能力
- 增强复用性
- 预留业务上下文扩展点

---

## 21. 验收标准

满足以下条件即可视为该文档规格完整：

- 明确采用新建 `src/views/ai/` 页面模块方案
- 明确不复用项目中已有 GPT 业务代码
- 目录结构、组件边界、状态边界、接口边界清晰
- 视图层与非视图层目录职责清晰，符合现有工程组织习惯
- 既可作为 AI 页面模块承载，也可预留插件化扩展能力
- 已覆盖多会话、流式、Markdown、安全渲染等核心扩展点
- 明确了代码注释规范
- 文档内容与当前工程目录和技术栈兼容，不再出现路径混用，也不再把所有文件都堆到 `views/ai` 下

---

## 22. 结论

本次前端方案应以“新建 `src/views/ai` 通用聊天页面模块”为唯一方向推进。实现上页面与组件放在 `src/views/ai`，接口放在 `src/api/devlocal`，状态放在 `src/store/modules`，类型放在 `src/type/ai`，工具放在 `src/utils`，整体保持与现有工程一致的目录风格，不再基于旧 GPT 页面做延续性改造，同时为后续插件化挂载保留扩展空间。
