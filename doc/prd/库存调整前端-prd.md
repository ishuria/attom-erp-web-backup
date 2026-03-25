# 库存调整前端 PRD

## 1. 文档目的

本文档用于明确“库存调整”模块在前端仓库中的实现范围、页面结构、交互规则、字段口径、接口约定与验收标准，保证产品、前端、后端、测试对同一版本需求的理解一致。

本文档以当前仓库实际结构为基础编写，优先约束前端落地方式，而不是抽象描述。

## 2. 项目落点

### 2.1 页面代码位置

- 页面主文件：`src/views/inventory/adjust/index.vue`
- 页面命名：`Adjust`

### 2.2 所属模块

该页面属于 `inventory` 业务域，当前页面已存在最小占位实现：

- `src/views/inventory/adjust/index.vue`

本次需求需在该页面基础上完成正式业务实现。

### 2.3 复用组件约束

页面需沿用仓库已有基础组件，不新增与现有风格割裂的页面骨架：

- 查询区：`<vab-query-form>`、`<vab-query-form-left-panel>`、`<vab-query-form-right-panel>`
- 分页：`<vab-pagination>`
- 弹窗：`<vab-dialog>`
- 表格：`<el-table>`
- 空态：`<el-empty class="vab-data-empty" />`

## 3. 当前实现现状

当前页面仅存在最小占位实现，尚未进入业务开发阶段：

- 页面模板仅包含一个占位标题
- 尚未搭建查询区、操作区、表格、分页
- 尚未接入真实列表接口
- 尚未接入新增、明细、余量设定
- 尚未建立表单、校验、状态管理和异常处理

本 PRD 目标是将该页面补齐为可交付版本。

## 4. 需求范围

### 4.1 本次必须完成

- 库存调整列表查询
- 日期范围筛选
- 关键词筛选
- 分页查询
- 新增库存调整
- 查看库存调整明细
- 余量设定查询
- 余量设定修改
- 页面级 loading、空态、错误提示

### 4.2 本次明确不做

- 编辑库存调整
- 删除库存调整
- 红冲后的撤销/反审核/冲回
- 导入
- 导出
- 批量操作
- 权限系统改造
- 独立路由页的详情页拆分

说明：
若后端已预留编辑/删除接口，本次前端仍不暴露入口，代码中已有注释区可保留但不能开放到用户界面。

## 5. 用户目标

财务或相关业务人员需要：

- 快速检索库存调整记录
- 查看某条调整记录的来源与明细
- 新增一条库存调整记录
- 查看和维护系统使用的余量设定值

## 6. 页面信息架构

页面采用单页结构，布局顺序如下：

1. 查询区
2. 操作区
3. 余量设定区
4. 列表区
5. 分页区
6. 新增弹窗
7. 明细弹窗

## 7. 页面交互结构

### 7.1 查询区

查询区位于页面顶部，沿用仓库通用列表页布局风格。

左侧：

- 日期范围

右侧：

- 关键词输入框
- 查询按钮
- 重置按钮

### 7.2 操作区

操作区位于查询区下方或与查询区同一行左侧，至少包含：

- `新增库存调整`

### 7.3 余量设定区

余量设定为页面内独立模块，不建议混入列表表头。

建议展示：

- 当前余量值
- 可编辑输入框
- 保存按钮

### 7.4 列表区

列表区展示库存调整记录，默认按时间倒序。

### 7.5 弹窗区

本次采用弹窗方案，不新增独立详情页。

- 新增弹窗：录入库存调整
- 明细弹窗：查看库存调整关联明细

## 8. 列表页需求

### 8.1 查询条件

| 字段 | 变量建议 | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 日期范围 | `dateRange` | `[string, string]` | 否 | 默认带当天或系统默认日期区间 |
| 关键词 | `keyWord` | `string` | 否 | 模糊匹配多个字段 |
| 页码 | `pageNo` | `number` | 是 | 默认 `1` |
| 分页大小 | `pageSize` | `number` | 是 | 默认 `20` |

### 8.2 关键词匹配范围

关键词匹配范围由后端支持，前端仅提供统一输入框，目标字段包含：

- SKU
- 产品名称/型号
- 品名
- PO
- Shipment ID
- 合同编号
- 备注
- 供应商名称

### 8.3 查询交互

- 页面初始化自动查询一次列表
- 修改日期范围后自动查询
- 关键词输入支持回车查询
- 关键词清空后允许重新查询
- 点击查询时重置页码为 `1`
- 点击重置时恢复默认查询条件并重新查询

### 8.4 列表字段

基于本次需求设计，列表字段统一如下：

| 展示名称 | 字段建议 | 说明 |
|------|------|------|
| 调整日期 | `adjustDate` | 库存调整实际业务日期 |
| 供应商名称 | `supplierName` | 与财务云舟模块其他页面口径保持一致 |
| PO | `po` | 采购单号 |
| 产品名称/型号 | `sku` 或 `productModel` | 需与后端最终字段确认 |
| 品名 | `componentName` 或 `productName` | 需与后端最终字段确认 |
| 调整数量 | `adjustQuantity` | 数值型，支持负数展示 |
| 调整未税价格 | `adjustPreTaxPrice` | 单价或未税价，需与后端字段口径确认 |
| 含税总价￥ | `taxInclusiveTotalPrice` | 金额型 |
| Shipment ID | `shipmentId` | 可为空 |
| 合同编号 | `contractNumber` | 可为空 |
| 备注 | `remark` | 支持长文本省略与 tooltip |
| 创建人 | `createUserName` | 若后端提供则展示 |
| 创建时间 | `createTime` | 若后端提供则展示 |
| 红冲状态 | `redFlushStatus` | 本次仅展示，不提供操作 |
| 操作 | - | 查看明细 |

说明：

- 当前 `index.vue` 尚无表格实现；前端需按本表设计完整落地
- 若后端暂未返回 `创建人`、`创建时间`、`红冲状态`，前端可先不展示，但需要在接口评审中确认最终口径

### 8.5 列表展示规则

- 日期统一按 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss` 展示，具体取决于后端精度
- 数量和金额为空时展示 `-`
- 金额字段统一保留 2 位小数
- 数量字段若后端返回整数则按整数展示，若存在小数则最多展示 2 位小数
- 备注过长时使用 `show-overflow-tooltip` 或等效方案
- 表格空态使用项目统一空态组件

### 8.6 分页规则

- 分页组件使用 `vab-pagination`
- 翻页保持查询条件不变
- 切换 `pageSize` 时页码重置为 `1`

## 9. 新增库存调整

### 9.1 入口

入口按钮：`新增库存调整`

点击后打开 `vab-dialog` 弹窗。

### 9.2 弹窗字段

| 字段 | 变量建议 | 必填 | 控件 | 说明 |
|------|----------|------|------|------|
| SKU | `sku` | 是 | 输入框 | 支持手输、粘贴 |
| 产品信息 | `productDesc` | 否 | 输入框/文本 | 根据 SKU 自动带出，只读 |
| PO | `poId` | 否 | 下拉选择 | 根据 SKU 查询 PO 列表 |
| 货件编号 | `shipmentId` | 否 | 输入框 | 手工输入 |
| 箱号 | `boxNumber` | 否 | 输入框 | 手工输入 |
| 调整数量 | `adjustQuantity` | 是 | 数字输入框 | 允许正负，不能为 0 |
| 调整未税价格 | `adjustPreTaxPrice` | 是 | 数字输入框 | 金额型 |
| 含税总价￥ | `taxInclusiveTotalPrice` | 否 | 只读/自动计算 | 若后端要求前端计算则需明确税率规则 |
| 红冲状态 | `redFlushStatus` | 是 | 单选/下拉 | 仅录入状态值 |
| 来源 | `source` | 否 | 输入框 | 手工输入 |
| 备注 | `remark` | 否 | 文本域 | 最长长度需后端确认 |

### 9.3 SKU 联动

当用户输入 SKU 并完成触发动作后，前端需要：

1. 查询 SKU 基础信息
2. 查询可选 PO 列表

触发时机建议：

- `blur` 触发
- 或 SKU 旁提供“查询”按钮

不建议在每次输入字符时自动请求，避免高频请求。

### 9.4 SKU 联动返回处理

#### 9.4.1 查询成功

- 回填 `productDesc`
- 刷新 `PO` 下拉选项

#### 9.4.2 SKU 不存在

- 提示 `未查询到对应 SKU 信息`
- 清空 `productDesc`
- 清空 `poId`
- 清空 PO 下拉选项

#### 9.4.3 接口异常

- 保留当前 SKU 输入
- 提示后端错误信息或通用错误文案

### 9.5 数值校验

- `adjustQuantity` 必填
- `adjustQuantity` 不能为 `0`
- `adjustQuantity` 允许负数，用于调减
- `adjustQuantity` 最多保留 2 位小数
- `adjustPreTaxPrice` 必填
- `adjustPreTaxPrice` 最多保留 2 位小数
- 若 `taxInclusiveTotalPrice` 为前端输入，则同样最多保留 2 位小数

### 9.6 提交校验

提交前至少校验：

- SKU 不能为空
- 调整数量不能为空
- 调整数量不能为 0
- 调整未税价格不能为空
- 红冲状态不能为空

### 9.7 提交流程

1. 点击 `确认新增`
2. 前端执行表单校验
3. 校验通过后按钮进入 loading
4. 调用新增接口
5. 新增成功后关闭弹窗
6. 提示 `新增成功`
7. 刷新列表并回到第一页

### 9.8 失败处理

- 按钮结束 loading
- 保留用户已填写内容
- 提示后端返回错误信息，兜底文案为 `新增失败，请稍后重试`

## 10. 明细弹窗

### 10.1 入口

列表操作列提供：

- `查看明细`

### 10.2 弹窗内容

展示当前库存调整记录关联的明细数据。

结合原始草稿，本次明细定义为“打包/质检/关联明细”，字段建议如下：

| 展示名称 | 字段建议 | 说明 |
|------|------|------|
| 好的数量 | `goodCount` | 数量 |
| 坏的数量 | `badCount` | 数量 |
| 缺的数量 | `lackCount` | 数量 |
| 多的数量 | `manyCount` | 数量 |
| 留样数 | `keepSampleCount` | 数量 |
| 类型 | `type` | 文本 |
| 备注 | `remark` | 文本 |

说明：

- 如果后端实际返回的不是质检历史，而是库存调整明细，本表字段需以后端接口为准
- 该点必须在联调前确认，不能由前端自行假设

### 10.3 明细交互

- 打开弹窗后请求明细
- 弹窗内使用独立 loading
- 明细为空时展示 `暂无质检历史数据`
- 明细接口失败时展示错误提示，可保留空表格

## 11. 余量设定

### 11.1 功能定位

余量设定是库存调整页面内的附属配置能力，不单独拆页。

### 11.2 展示内容

建议模块字段：

| 字段 | 变量建议 | 说明 |
|------|----------|------|
| 当前余量值 | `currentMargin` | 初始化读取 |
| 新余量值 | `margin` | 可编辑 |
| 保存按钮 | - | 提交修改 |

### 11.3 初始化行为

页面加载完成后自动调用余量查询接口：

- 成功则回显当前余量值
- 失败则提示错误，但不阻断列表查询

### 11.4 余量校验

- 必填
- 必须为数字
- 当前版本按整数处理
- 若后端允许小数，需同步修订本 PRD 和表单规则

### 11.5 保存流程

1. 点击 `保存余量设定`
2. 执行表单校验
3. 按钮进入 loading
4. 调用修改接口
5. 修改成功后提示 `余量设定修改成功`
6. 重新拉取一次当前余量值

### 11.6 失败处理

- 保留输入值
- 提示后端错误信息
- 兜底文案：`余量设定修改失败，请稍后重试`

## 12. 页面状态设计

### 12.1 列表状态

- `listLoading`
- `list`
- `total`

### 12.2 新增弹窗状态

- `addVisible`
- `addLoading`
- `addForm`
- `poOptions`
- `skuInfoLoading`

### 12.3 明细弹窗状态

- `detailVisible`
- `detailLoading`
- `detailList`

### 12.4 余量设定状态

- `marginLoading`
- `marginSaving`
- `marginForm`

## 13. 前端数据结构建议

### 13.1 列表查询参数

```ts
interface InventoryAdjustQuery {
  keyWord: string
  pageNo: number
  pageSize: number
  dateRange: [string, string] | []
}
```

### 13.2 列表项

```ts
interface InventoryAdjustItem {
  id: number | string
  adjustDate?: string
  supplierName?: string
  po?: string
  poId?: number | string
  sku?: string
  productDesc?: string
  componentName?: string
  adjustQuantity?: number
  adjustPreTaxPrice?: number
  taxInclusiveTotalPrice?: number
  shipmentId?: string
  contractNumber?: string
  redFlushStatus?: number | string
  source?: string
  remark?: string
  createUserName?: string
  createTime?: string
}
```

### 13.3 新增表单

```ts
interface InventoryAdjustAddForm {
  sku: string
  productDesc: string
  poId?: number | string
  shipmentId: string
  boxNumber: string
  adjustQuantity?: number | string
  adjustPreTaxPrice?: number | string
  taxInclusiveTotalPrice?: number | string
  redFlushStatus?: number | string
  source: string
  remark: string
}
```

### 13.4 余量设定

```ts
interface InventoryAdjustMarginForm {
  margin?: number | string
}
```

## 14. 接口约定

说明：

- 以下接口路径延续原始草稿
- 当前仓库内尚未存在对应 `api/devlocal` 封装文件，本次前端开发需新增独立接口文件，建议位置：
  `src/api/devlocal/inventoryAdjustment.ts`
- 若后端最终接口不同，必须先更新本 PRD，再调整实现

### 14.1 查询 SKU 基础信息

- URL：`/api/v1/product/sku/info/{sku}`
- Method：`POST`

返回示例：

```json
{
  "productDesc": "",
  "skuImg": ""
}
```

前端使用：

- `productDesc` 用于新增弹窗回显
- `skuImg` 当前版本不强制展示

### 14.2 根据 SKU 查询 PO 列表

- URL：`/api/v1/purchase/poList/{sku}`
- Method：`POST`

返回示例：

```json
[
  {
    "poId": 0,
    "po": ""
  }
]
```

### 14.3 新增库存调整

- URL：`/api/v1/stock/adjust/add`
- Method：`POST`

请求示例：

```json
{
  "sku": "",
  "poId": 0,
  "shipmentId": "",
  "boxNumber": "",
  "adjustQuantity": 1.4,
  "adjustPreTaxPrice": 44.3,
  "redFlushStatus": 0,
  "source": "",
  "remark": ""
}
```

成功处理：

- 关闭新增弹窗
- 提示 `新增成功`
- 刷新列表

### 14.4 查询库存调整列表

- URL：`/api/v1/stock/adjust/list`
- Method：`POST`

请求示例：

```json
{
  "keyWord": "",
  "pageNo": 1,
  "pageSize": 20,
  "startDate": "2026-03-01",
  "endDate": "2026-03-31"
}
```

返回建议：

```json
{
  "total": 0,
  "rows": []
}
```

### 14.5 查询库存调整明细

- URL：`/api/v1/stock/adjust/detail`
- Method：`POST`

请求示例：

```json
{
  "id": 0,
  "pageNo": 1,
  "pageSize": 20
}
```

### 14.6 查询余量设定

- URL：`/api/v1/stock/margin`
- Method：`GET`

返回示例：

```json
{
  "margin": 0
}
```

### 14.7 修改余量设定

- URL：`/api/v1/stock/margin/update`
- Method：`POST`

请求示例：

```json
{
  "margin": 0
}
```

## 15. 前端实现约束

### 15.1 文件组织

建议新增以下文件：

- `src/api/devlocal/inventoryAdjustment.ts`
- `src/type/inventory/adjust.ts`

如弹窗逻辑复杂，可拆分：

- `src/views/inventory/adjust/vabAutoComponents/InventoryAdjustAddDialog.vue`
- `src/views/inventory/adjust/vabAutoComponents/InventoryAdjustDetailDialog.vue`

### 15.2 编码约束

- 维持项目现有 2 空格缩进、单引号、无分号风格
- 查询区、表格、分页风格与仓库现有标准列表页统一
- 不做无关大范围格式化

### 15.3 交互一致性

- 列表页 loading 使用按钮 loading 和表格 loading 组合
- 所有失败提示优先展示后端 `msg/message`
- 所有分页查询都保持统一行为

## 16. 异常与边界场景

### 16.1 列表查询

- 日期范围为空时允许查询
- 关键词为空时允许查询
- 接口失败时保留上一次查询条件

### 16.2 新增弹窗

- SKU 输入后查询失败，不应清空用户原始输入
- PO 列表为空时允许不选 PO
- 连续点击提交时必须防重

### 16.3 明细弹窗

- 无明细时展示空态，不报错
- 明细打开时关闭上一条明细缓存或按需刷新

### 16.4 余量设定

- 查询失败不影响列表功能
- 保存失败保留用户输入

## 17. 文案规范

建议统一文案如下：

### 17.1 新增成功

```text
新增成功
```

### 17.2 SKU 不存在

```text
未查询到对应 SKU 信息
```

### 17.3 新增失败

```text
新增失败，请稍后重试
```

### 17.4 明细为空

```text
暂无质检历史数据
```

### 17.5 余量修改成功

```text
余量设定修改成功
```

### 17.6 余量修改失败

```text
余量设定修改失败，请稍后重试
```

## 18. 验收标准

### 18.1 列表

- 可按日期范围查询库存调整列表
- 可按关键词查询库存调整列表
- 翻页、切换分页大小行为正确
- 空态、loading、失败提示完整

### 18.2 新增

- 可打开新增弹窗
- 可根据 SKU 拉取产品信息和 PO 列表
- 表单校验完整
- 提交成功后弹窗关闭并刷新列表

### 18.3 明细

- 可打开明细弹窗
- 可展示当前记录对应明细
- 无数据时展示空态

### 18.4 余量设定

- 页面初始化可查询当前余量值
- 可修改余量设定并保存成功
- 失败提示与输入保留行为正确

### 18.5 前端代码

- 页面代码落在 `src/views/inventory/adjust/index.vue`
- 接口、类型定义拆分合理
- 与仓库通用列表页交互风格一致

## 19. 待确认项

以下内容当前仓库和草稿 PRD 尚未完全闭合，开发前必须确认：

1. 列表接口的真实字段名称是否与本 PRD 一致。
2. 明细弹窗到底展示“质检历史”还是“库存调整明细”。
3. 含税总价￥是否由前端计算，若计算则税率来源是什么。
4. 红冲状态字段是录入字段还是仅后端回填展示字段。
5. 余量设定接口是否确实属于库存调整模块，而不是复用其他财务模块配置。
