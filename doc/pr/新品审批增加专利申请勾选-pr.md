## PR 标题

feat: 新品审批流程增加专利申请勾选展示

## PR 类型

- 功能新增
- 页面展示增强
- 字段映射补充

## 变更背景

新品审批流程当前已展示“应季产品”勾选状态，但缺少“专利申请”标识，导致审批、复核和下单流转阶段无法直接判断该新品是否涉及专利申请。本次 PR 在新品审批相关页面补充 `专利申请` 勾选列，保持与现有 `应季产品` 一致的展示方式。

## 本次交付内容

### 1. 新品审批流程页面增加“专利申请”列

涉及页面：

- `src/views/newProductDevelopment/orderingProcessStep/orderCheckStep4.vue`
- `src/views/newProductDevelopment/orderingProcessStep/orderCheckStep5.vue`
- `src/views/newProductDevelopment/orderingProcessStep/orderStep5.vue`
- `src/views/newProductDevelopment/orderingProcessStep/orderStep6.vue`
- `src/views/newProductDevelopment/orderingReviewStep/orderReviewStep1.vue`
- `src/views/newProductDevelopment/orderingReviewStep/orderReviewStep2.vue`

已实施内容：

- 在 `seasonal` 对应的“应季产品”列后新增 `专利申请` 列
- 新列展示样式与 `应季产品` 保持一致，使用 checkbox 展示勾选状态
- 字段绑定后端返回值 `patentFlag`
- 不调整原有业务流程、提交流程和审批逻辑

## 字段说明

- 表头名称：`专利申请`
- 字段名：`patentFlag`
- 展示方式：checkbox
- 展示规则：
  - `patentFlag = 1` 时勾选
  - `patentFlag = 0` 时不勾选
  - 无值时按未勾选处理，避免影响页面结构

## 关键实现说明

### 页面展示规则

- `专利申请` 列位置紧跟 `应季产品` 列
- 仅补充展示能力，不新增编辑能力
- 该列在审批流、审核流、复核流的对应页面保持一致展示

### 一致性要求

- checkbox 样式与现有 `seasonal: '应季产品'` 列保持一致
- 不引入额外交互，不新增点击事件或表单校验
- 不修改已有接口参数和现有字段逻辑

## 接口与数据说明

本次 PR 不新增接口，仅消费后端已有返回字段：

- 字段：`patentFlag`
- 含义：是否专利申请
- 取值：`1` 勾选，`0` 不勾选

如果部分页面当前类型定义中未声明 `patentFlag`，需同步补充类型声明，确保模板字段访问与类型约束一致。

## 验证项

- 上述 6 个页面均可展示 `专利申请` 列
- `专利申请` 列位置在 `应季产品` 列之后
- `patentFlag = 1` 时页面展示为勾选状态
- `patentFlag = 0` 时页面展示为未勾选状态
- 不影响原有页面渲染、表格结构和审批流转功能

## 影响评估

正向影响：

- 新品审批链路中的专利申请信息更完整
- 审批人员可直接在列表中识别专利申请状态
- 多个审批节点的展示口径保持一致

潜在风险：

- 若个别页面接口未返回 `patentFlag`，则会出现统一未勾选展示
- 若部分页面字段命名或类型定义未同步，可能导致展示不一致
- 若列顺序依赖静态索引，新增列后需确认不会影响其他列逻辑

## 不包含内容

- 新增或修改后端接口
- 专利申请字段的编辑能力
- 专利申请相关审批规则变更
- 专利申请筛选、导出或统计功能

## 关联说明

- 本次为展示增强类改动，目标是补齐新品审批流程中的专利申请可视化状态
