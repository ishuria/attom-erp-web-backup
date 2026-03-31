# 退税产品匹配发票 dialog 关闭逻辑优化 PRD

## 1. 需求背景

当前退税发票匹配相关页面包含 2 个主弹窗：

- 退税产品发票匹配弹窗：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vabAutoComponents/VabInvoiceMatching.vue`
- 退税产品聚合发票匹配弹窗：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vabAutoComponents/VabAggregationInvoiceMath.vue`

根据现有代码，这两个弹窗在关闭时仅执行前端本地关闭：

- 清空部分本地状态
- 通过 `emit('updateInvoiceMatchingVisible', false)` 通知父组件关闭弹窗

当前未调用后端“取消/释放当前匹配会话”的接口，可能导致后端仍保留本次匹配过程中的占用态、临时态或会话态数据。

本次需求是在不改变现有“确认”提交流程的前提下，补充“关闭弹窗”时的后端取消逻辑。

## 2. 需求目标

- 用户点击关闭退税发票匹配主弹窗时，前端先调用对应取消接口
- 仅当取消接口返回成功时，才真正关闭弹窗
- 如果取消接口返回失败或请求异常，则保留弹窗，不执行关闭
- 保持当前“确认”按钮既有逻辑不变

## 3. 适用范围

### 3.1 页面范围

1. `VabInvoiceMatching.vue`
2. `VabAggregationInvoiceMath.vue`

### 3.2 本次仅影响的关闭入口

以下动作均视为“关闭主弹窗”，需统一走取消接口逻辑：

1. 点击弹窗 footer 中的 `取消` 按钮
2. 点击弹窗右上角关闭按钮
3. 触发 `vab-dialog` 的 `@close` 关闭事件

说明：

- 当前组件模板中，主弹窗已通过 `@close="closeInvoiceMatching"` 统一绑定关闭方法
- 因此本次需求建议继续复用 `closeInvoiceMatching`，但其内部逻辑需调整为“先请求取消接口，再决定是否关闭”

### 3.3 不在本次范围内的内容

- 不调整弹窗中的匹配、清空、删除、导入、编辑等现有业务逻辑
- 不调整“确认”按钮现有提交流程
- 不调整子弹窗行为，包括：
  - 上传发票弹窗
  - 发票路径导入弹窗
  - 匹配弹窗
  - PDF 预览弹窗

## 4. 现状说明

### 4.1 `VabInvoiceMatching.vue`

当前主弹窗关闭函数为：

- `closeInvoiceMatching`

当前行为：

1. 清空 `detailIds`
2. 直接 `emit('updateInvoiceMatchingVisible', false)`

当前未调用后端接口：

- `/taxRefund/invoice/cancel`

### 4.2 `VabAggregationInvoiceMath.vue`

当前主弹窗关闭函数为：

- `closeInvoiceMatching`

当前行为：

1. 清空 `detailIds`
2. 直接 `emit('updateInvoiceMatchingVisible', false)`

当前未调用后端接口：

- `/taxRefund/main/invoice/cancel`

## 5. 需求说明

### 5.1 退税产品发票匹配弹窗关闭

涉及页面：

- `/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vabAutoComponents/VabInvoiceMatching.vue`

当用户关闭“发票匹配”主弹窗时，前端需要先调用取消接口：

- URL：`/api/v1/taxRefund/invoice/cancel`
- Method：`GET`
- Response：`true` 表示成功，`false` 表示失败

前端处理规则：

1. 用户触发关闭动作后，先发起取消接口请求
2. 当接口返回 `true` 时：
   - 清空 `detailIds`
   - 执行 `emit('updateInvoiceMatchingVisible', false)`
   - 完成弹窗关闭
3. 当接口返回 `false` 时：
   - 不关闭弹窗
   - 给出失败提示，提示文案建议为：`关闭失败，请稍后重试`
4. 当接口请求异常时：
   - 不关闭弹窗
   - 给出失败提示，提示文案建议为：`关闭失败，请稍后重试`

### 5.2 退税产品聚合发票匹配弹窗关闭

涉及页面：

- `/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vabAutoComponents/VabAggregationInvoiceMath.vue`

当用户关闭“退税产品聚合发票匹配”主弹窗时，前端需要先调用取消接口：

- URL：`/api/v1/taxRefund/main/invoice/cancel`
- Method：`GET`
- Response：`true` 表示成功，`false` 表示失败

前端处理规则：

1. 用户触发关闭动作后，先发起取消接口请求
2. 当接口返回 `true` 时：
   - 清空 `detailIds`
   - 执行 `emit('updateInvoiceMatchingVisible', false)`
   - 完成弹窗关闭
3. 当接口返回 `false` 时：
   - 不关闭弹窗
   - 给出失败提示，提示文案建议为：`关闭失败，请稍后重试`
4. 当接口请求异常时：
   - 不关闭弹窗
   - 给出失败提示，提示文案建议为：`关闭失败，请稍后重试`

## 6. 接口对接说明

### 6.1 新增前端 API 封装

建议在：

- `/Users/luoxiangkai/Project/Worker/attom-web/src/api/devlocal/customsDeclarationAndTaxRefund.ts`

新增 2 个接口方法：

1. 退税产品发票匹配取消
2. 退税产品聚合发票匹配取消

建议命名：

- `cancelTaxRefundInvoice`
- `cancelTaxRefundMainInvoice`

建议实现方式：

- 统一使用项目现有 `request`
- `method` 使用 `get`
- 返回值类型沿用现有布尔响应风格 `Promise<IBooleanRes>`

### 6.2 请求参数

根据当前需求描述，取消接口未要求前端传参，因此本次前端按“无参调用”设计。

若后端联调时要求补充会话标识、批次标识、详情标识等参数，需要以后端最终接口文档为准，但当前 PRD 不将其作为前置条件。

### 6.3 响应约定

接口返回布尔值：

| 返回值 | 含义 | 前端动作 |
| --- | --- | --- |
| `true` | 取消成功 | 关闭弹窗 |
| `false` | 取消失败 | 保留弹窗并提示失败 |

## 7. 前端交互要求

### 7.1 防重复触发

用户连续点击取消按钮或短时间多次触发关闭事件时，需要避免重复发送取消请求。

建议：

- 主弹窗关闭过程中增加独立 loading / closing 状态
- 请求未返回前，禁用取消按钮或拦截重复关闭动作

### 7.2 关闭时机

必须以后端取消接口成功作为真正关闭条件。

不允许出现以下行为：

- 先关闭弹窗，再异步请求取消接口
- 取消接口失败但前端已关闭弹窗

### 7.3 提示信息

建议提示口径统一：

- 关闭成功：无需额外提示，可直接关闭
- 关闭失败：`关闭失败，请稍后重试`

### 7.4 与确认提交流程的关系

当前两个组件的“确认”按钮仍保留现有逻辑：

- `VabInvoiceMatching.vue` 通过 `submitConfirmTaxRefundInvoiceMatch({ type: 0 })` 完成确认
- `VabAggregationInvoiceMath.vue` 先调用 `submitConfirmTaxRefundInvoiceMatchBefore()`，成功后再调用 `submitConfirmTaxRefundInvoiceMatch({ type: 1 })`

本次需求不修改上述确认流程。

## 8. 状态处理要求

### 8.1 成功关闭时

关闭成功后，需保留当前组件既有本地清理逻辑：

- 清空 `detailIds`
- 关闭主弹窗可见状态

### 8.2 关闭失败时

关闭失败时：

- 不清空主流程关键状态
- 不关闭主弹窗
- 保持用户当前界面上下文，便于重试或继续操作

### 8.3 子弹窗状态

本次需求不额外要求联动处理子弹窗状态；若主弹窗关闭本身已受组件销毁/隐藏影响，则沿用现有组件表现。

## 9. 边界场景

### 9.1 接口返回 `false`

- 主弹窗保持打开
- 用户可再次点击取消
- 页面不应出现空白或假关闭状态

### 9.2 网络异常/超时

- 主弹窗保持打开
- 显示失败提示

### 9.3 用户在已提交确认后关闭

“确认成功后关闭”继续沿用当前逻辑，不额外调用本次取消接口。

原因：

- “确认关闭”与“取消关闭”语义不同
- 本次需求仅针对用户主动取消/关闭主弹窗的场景

### 9.4 匹配子弹窗已打开时

如果主弹窗存在可被用户直接关闭的入口，则仍应优先完成主弹窗关闭取消逻辑。实际交互上是否允许父弹窗在子弹窗打开时直接关闭，沿用当前组件及 `vab-dialog` 既有行为。

## 10. 验收标准

### 10.1 退税产品发票匹配弹窗

1. 打开发票匹配主弹窗
2. 点击 `取消` 或右上角关闭按钮
3. 前端调用 `GET /api/v1/taxRefund/invoice/cancel`
4. 当接口返回 `true` 时，主弹窗成功关闭
5. 当接口返回 `false` 时，主弹窗不关闭，并提示 `关闭失败，请稍后重试`
6. 当接口请求异常时，主弹窗不关闭，并提示 `关闭失败，请稍后重试`

### 10.2 退税产品聚合发票匹配弹窗

1. 打开聚合发票匹配主弹窗
2. 点击 `取消` 或右上角关闭按钮
3. 前端调用 `GET /api/v1/taxRefund/main/invoice/cancel`
4. 当接口返回 `true` 时，主弹窗成功关闭
5. 当接口返回 `false` 时，主弹窗不关闭，并提示 `关闭失败，请稍后重试`
6. 当接口请求异常时，主弹窗不关闭，并提示 `关闭失败，请稍后重试`

### 10.3 防重校验

1. 用户连续多次点击关闭
2. 前端不应重复发起多次取消请求
3. 不应出现弹窗状态错乱、重复提示或关闭后再次打开的问题

## 11. 开发实现建议

### 11.1 组件侧建议

两个组件都建议将 `closeInvoiceMatching` 改造为异步关闭方法。

建议结构：

1. 判断当前是否正在关闭中
2. 调用对应 cancel API
3. 成功后再执行本地状态清理与 `emit`
4. 失败时提示并终止关闭

### 11.2 API 层建议

在 `customsDeclarationAndTaxRefund.ts` 新增以下接口：

- `cancelTaxRefundInvoice`
- `cancelTaxRefundMainInvoice`

避免将请求直接写在页面组件内，保持与仓库现有 API 分层一致。

## 12. 对测试和联调的补充说明

联调时需重点确认以下事项：

1. 两个取消接口是否确实为 `GET`
2. 两个取消接口是否确实无参
3. 返回结构是否为项目当前常用的布尔响应结构
4. 当返回 `false` 时，后端是否带有可展示的错误信息

若实际接口协议与本 PRD 不一致，应同步更新本文档与前端实现口径。
