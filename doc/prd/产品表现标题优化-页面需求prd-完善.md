# 产品表现标题优化-页面需求 PRD（完善版）

## 1. 需求概述

### 1.1 需求名称

产品表现标题优化入口改造

### 1.2 对应目标

将 `src/views/storeOperations/productPerformanceDashboard/index.vue` 页面中的 `标题优化` 入口，从“弹出 `AiChatDialog` 组件后由用户继续交互”的模式，调整为“前端基于当前业务上下文自动创建 AI 会话并直接发送首条标题优化消息”的模式。

### 1.3 原始需求摘要

- 点击 `标题优化` 时，不再弹出 `src/views/ai/vabAutoComponents/AiChatDialog.vue`
- 直接调用 `src/api/devlocal/ai.ts` 中的 `createAiConversation`
- 当 `createAiConversation` 成功后，再调用 `src/api/devlocal/ai.ts` 中的 `sendAiChatMessage`

## 2. 需求背景

当前产品表现页面中的 `标题优化` 能力，依赖通用 AI 弹窗承载会话创建和消息发送。这种实现虽然复用了 AI 组件能力，但在“针对当前商品一键发起标题优化”的业务场景下存在以下问题：

- 用户需要先进入弹窗，再继续发起会话，操作路径偏长。
- AI 会话入口是通用弹窗思路，不完全符合“基于当前行上下文直接执行标题优化”的业务诉求。
- 标题优化首条消息的触发时机依赖人工输入，不利于形成标准化的自动化流程。
- 页面需求文档中已经明确要求按业务上下文自动创建会话，但缺少对触发链路、异常处理和验收口径的完整定义。

因此，本次需要将页面入口改为自动串联“创建会话 + 发送首条消息”，并补齐页面级需求定义。

## 3. 建设目标

- 用户点击一次 `标题优化` 即可完成 AI 会话创建与首条消息发送。
- 会话创建必须携带当前业务上下文，确保 AI 能识别当前操作对象。
- 标题优化流程不再依赖 `AiChatDialog` 弹窗打开作为前置条件。
- 页面需要具备明确的成功、失败、重复点击、缺少关键字段等处理规则。
- 为开发、测试和验收提供可执行的明确标准。

## 4. 适用范围

### 4.1 本次包含

- `产品表现` 页面 `标题优化` 按钮点击行为改造。
- 调用 `createAiConversation` 创建会话。
- 在创建成功后调用 `sendAiChatMessage` 自动发送首条消息。
- 会话创建时透传业务参数 `operationSkuId`。
- 页面交互反馈、异常处理、按钮防重处理。

### 4.2 本次不包含

- `AiChatDialog` 组件通用能力重构。
- AI 会话列表页面整体重构。
- AI Prompt 内容策略大改。
- 流式消息能力改造。
- 其他页面 AI 入口同步改造。

## 5. 用户角色

- 运营人员：在产品表现页面点击 `标题优化`，发起当前商品的标题优化任务。
- 产品/测试人员：验证基于业务上下文自动创建会话并自动发送首条消息的流程是否正确。

## 6. 业务场景

用户在产品表现页面浏览某条商品数据时，点击该行操作列中的 `标题优化`。

系统应立即：

1. 读取当前行关键业务数据。
2. 以当前行 `id` 作为 `operationSkuId` 调用 `createAiConversation` 创建新会话。
3. 会话创建成功后，自动生成首条标题优化请求内容。
4. 调用 `sendAiChatMessage` 将该请求发送到新创建的会话中。
5. 根据接口结果给出页面反馈。

## 7. 页面与模块范围

### 7.1 触发页面

- `src/views/storeOperations/productPerformanceDashboard/index.vue`

### 7.2 接口模块

- `src/api/devlocal/ai.ts`

接口包括：

- `createAiConversation`
- `sendAiChatMessage`

### 7.3 相关但本次需移除依赖的组件

- `src/views/ai/vabAutoComponents/AiChatDialog.vue`

说明：

- 本次页面触发标题优化时，不再以弹出该组件作为前置交互。
- 若系统其他入口仍使用该组件，不在本次变更范围内。

## 8. 功能需求

### 8.1 入口行为调整

当前行为：

- 用户点击 `标题优化`
- 页面依赖 AI 弹窗承载后续会话流程

目标行为：

- 用户点击 `标题优化`
- 页面不弹出 `AiChatDialog`
- 页面直接执行标题优化请求链路

### 8.2 创建会话

点击 `标题优化` 后，前端首先调用：

```ts
createAiConversation(payload)
```

其中 `payload` 至少包含：

```json
{
  "operationSkuId": "当前点击行的 id"
}
```

要求如下：

- `operationSkuId` 必传，值取当前点击行 `id`
- 每次点击 `标题优化`，都应创建新会话
- 不复用旧会话
- 若当前行缺少 `id`，则不得继续执行消息发送

### 8.3 自动发送首条消息

当 `createAiConversation` 返回成功，并拿到有效 `conversationId` 后，前端继续调用：

```ts
sendAiChatMessage({
  conversationId,
  content,
})
```

要求如下：

- `conversationId` 必须取自本次新建会话返回结果
- `content` 必须为标题优化首条消息内容
- `sendAiChatMessage` 只在 `createAiConversation` 成功后触发
- 若创建会话失败，不得发送消息

### 8.4 首条消息内容生成规则

原始需求未定义 `content` 的具体拼接规则，本次完善版补充如下：

- 前端应基于当前点击行的业务上下文生成一条标准标题优化请求内容
- 若系统中已存在标题优化默认 Prompt 模板，则应复用既有模板，避免重复维护
- 若当前页面已有现成字段可作为上下文，应至少包含当前商品核心识别信息

建议最小上下文字段：

- `SKU` 或业务唯一标识
- `ASIN`
- 商品名称或当前标题
- 站点

建议消息语义：

- 明确这是一次“标题优化”请求
- 要求 AI 基于当前商品信息给出优化建议

待确认项：

- 首条消息是否只需要固定文案
- 是否需要把当前行更多业务字段一并拼入 Prompt
- 是否需要指定返回格式，例如“输出 3 个候选标题 + 优化原因”

如果产品未补充更细规则，前端实现默认应复用当前系统已存在的标题优化 Prompt 组织方式。

## 9. 交互规则

### 9.1 点击时机

触发时机：

- 用户点击产品表现列表行内 `标题优化`

### 9.2 加载态

为避免重复点击和重复创建会话，前端需提供 loading 或禁用态：

- 点击后当前按钮进入 loading / disabled
- 在 `createAiConversation` 与 `sendAiChatMessage` 整个链路结束前，不允许重复触发
- 链路结束后恢复按钮状态

### 9.3 成功反馈

建议规则：

- 会话创建成功但消息发送失败：提示“标题优化任务创建成功，但消息发送失败”
- 会话创建成功且消息发送成功：提示“标题优化已发起”

如果页面后续不直接展示会话内容，则必须给出明确成功提示，避免用户误以为点击无效。

### 9.4 失败反馈

失败场景需明确提示后端返回信息或通用兜底文案：

- 创建会话失败：提示“创建标题优化会话失败”
- 发送消息失败：提示“发送标题优化请求失败”
- 行数据缺少主键 `id`：提示“当前数据缺少业务标识，无法发起标题优化”

## 10. 接口需求

### 10.1 创建会话接口

接口方法：

```ts
createAiConversation(data)
```

请求参数：

```json
{
  "operationSkuId": 123
}
```

参数说明：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| operationSkuId | number/string | 是 | 当前点击行主键 `id` |

响应要求：

- 返回值中必须能拿到本次新建会话的唯一标识
- 前端需从响应中提取 `conversationId` 或等价字段供后续调用使用

### 10.2 发送消息接口

接口方法：

```ts
sendAiChatMessage({
  conversationId,
  content,
})
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| conversationId | number/string | 是 | 本次 `createAiConversation` 返回的会话 ID |
| content | string | 是 | 标题优化首条消息内容 |
| model | string | 否 | 若系统已有默认模型策略，则沿用现有逻辑 |

调用时序：

1. `createAiConversation`
2. 获取有效会话 ID
3. `sendAiChatMessage`

不允许跳过会话创建直接发送。

## 11. 页面流程

### 11.1 主流程

1. 用户在产品表现页面点击某行 `标题优化`
2. 前端校验当前行是否存在 `id`
3. 按当前行 `id` 调用 `createAiConversation({ operationSkuId: row.id })`
4. 接口成功后，解析新会话 ID
5. 基于当前行业务数据组装标题优化消息内容 `content`
6. 调用 `sendAiChatMessage({ conversationId, content })`
7. 根据结果给出成功或失败反馈

### 11.2 异常流程

#### 场景 A：当前行无 `id`

- 不调用任何 AI 接口
- 页面直接提示错误信息

#### 场景 B：创建会话失败

- 不调用 `sendAiChatMessage`
- 结束流程并提示失败

#### 场景 C：会话创建成功，但消息发送失败

- 本次会话视为已创建
- 页面提示“消息发送失败”
- 不自动重试，除非产品明确要求

#### 场景 D：用户连续点击

- 正在请求时禁止重复提交
- 若需要支持多行并行发起，应以“单行按钮级 loading”为准

## 12. 数据与状态要求

页面至少需要维护以下状态：

- 当前触发中的行标识
- 标题优化请求 loading 状态
- 当前行上下文数据

建议：

- loading 粒度按“当前点击行”控制，避免整页锁死
- 若后续需要展示处理结果，可保留最近一次触发结果用于页面反馈

## 13. 与现有实现的差异说明

当前关联代码中已经存在以下能力：

- 支持通过 `operationSkuId` 创建 AI 会话
- 存在 `AiChatDialog` 及会话创建配置能力

但本次页面需求强调的是：

- `标题优化` 点击后不再依赖弹窗作为主交互承载
- 页面侧应直接串联 `createAiConversation + sendAiChatMessage`
- 页面需求文档必须按“自动执行流程”定义，而不是“用户进入弹窗后自行发问”

因此，本次 PRD 是对页面行为的一次进一步收敛和明确。

## 14. 验收标准

- 点击产品表现页面某行 `标题优化` 后，不弹出 `AiChatDialog`
- 前端会调用一次 `createAiConversation`
- `createAiConversation` 请求中带有 `operationSkuId`
- `operationSkuId` 的值等于当前点击行 `id`
- `createAiConversation` 成功后，前端会继续调用一次 `sendAiChatMessage`
- `sendAiChatMessage` 中的 `conversationId` 取自本次新建会话结果
- `sendAiChatMessage` 的 `content` 为自动生成的标题优化首条消息
- 当 `createAiConversation` 失败时，不会继续调用 `sendAiChatMessage`
- 同一行连续点击时，不会因为重复提交导致短时间内创建多个重复会话
- 不影响其他仍依赖 `AiChatDialog` 的 AI 页面功能

## 15. 人工验证步骤

1. 打开 `产品表现` 页面
2. 在任意一条数据上点击 `标题优化`
3. 观察页面，确认未弹出 `AiChatDialog`
4. 打开浏览器网络面板，确认首先请求 `createAiConversation`
5. 确认该请求中包含 `operationSkuId`
6. 确认 `operationSkuId` 的值等于当前点击行 `id`
7. 确认 `createAiConversation` 成功后，继续请求 `sendAiChatMessage`
8. 确认 `sendAiChatMessage` 的 `conversationId` 与新建会话返回值一致
9. 确认 `sendAiChatMessage` 的 `content` 为自动拼装后的标题优化请求
10. 模拟创建会话失败，确认不会继续发送消息
11. 模拟消息发送失败，确认页面提示正确
12. 连续快速点击同一行，确认没有重复创建多条会话

## 16. 风险与注意事项

- 如果 `createAiConversation` 的响应结构不稳定，可能导致前端无法正确提取会话 ID。
- 如果首条消息 `content` 规则未统一，容易出现标题优化效果不一致。
- 如果页面去掉弹窗后又没有补充明确成功反馈，用户会感知不到请求是否已发起。
- 如果 loading 粒度控制不当，可能出现重复提交或整页误锁定。

## 17. 待产品确认项

- 自动发送首条消息后，页面是否需要展示 AI 返回结果。
- 若不展示结果，用户后续从哪里查看本次标题优化会话与回复内容。
- 首条消息 `content` 的最终模板内容。
- 是否需要在成功后提供“查看会话”或“跳转 AI 页”入口。
- 同一商品是否允许重复点击并创建多个会话，还是需要做时间窗口内去重。

## 18. 结论

本次需求的本质不是简单替换一个弹窗组件，而是将产品表现页 `标题优化` 的交互模式改为“基于当前业务上下文自动执行 AI 流程”。完善后的页面 PRD 已明确：

- 入口行为
- 调用顺序
- 参数要求
- 错误处理
- 验收标准
- 待确认项

开发与测试可基于本文件直接落地实现和验收。
