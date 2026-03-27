# SKU 库存盘点前端 PRD（完善版）

## 1. 文档目标

本文档基于当前仓库实际结构，补充《SKU 库存盘点 PRD》的前端落地要求，明确页面归属、模块拆分、交互流程、字段口径、接口映射、异常处理和验收标准，作为前端开发、联调、测试和评审依据。

本文档优先约束本项目中的实现方式，而不是抽象描述页面能力。

## 2. 项目落点

### 2.1 页面代码位置

- 页面主文件：`src/views/inventory/inventoryCount/index.vue`
- 页面组件名：`InventoryCount`

### 2.2 当前实现现状

当前页面仅为最小占位实现：

- 模板仅展示 `inventoryCount`
- 尚未接入查询区、操作区、表格、分页
- 尚未接入库存盘点相关接口
- 尚未建立类型定义、权限常量和页面状态

因此本次 PRD 的目标不是“增量优化”，而是将该页面补齐为可交付版本。

### 2.3 所属业务域

该页面属于 `inventory` 业务域，应与下列现有目录保持一致的组织方式：

- 视图目录：`src/views/inventory/`
- 类型目录：`src/type/inventory/`
- 接口目录：`src/api/devlocal/`

同业务域下已经存在可参考实现：

- 列表页参考：`src/views/inventory/adjust/index.vue`
- 接口文件参考：`src/api/devlocal/inventoryAdjustment.ts`
- 类型文件参考：`src/type/inventory/adjust.ts`

本页面应优先复用上述目录划分、命名习惯和页面骨架，而不是新建一套偏离现有 `inventory` 域的实现方式。

### 2.4 建议新增文件

为保证仓库结构清晰，建议新增以下文件：

- `src/api/devlocal/inventoryCount.ts`
- `src/type/inventory/count.ts`
- `src/permissions/inventory.ts`，若本次不单独建文件，则在现有权限文件中补充库存盘点权限常量

建议同时遵循当前仓库已有导入方式：

- 接口层使用 `/@/utils/request` 和 `/@/api/devlocal/api` 中的 `BASE_API`
- 类型层通过 `/@/type/inventory/count` 引用
- 页面内不直接拼接完整接口前缀，统一在接口文件中封装

说明：

- 本页面数据为页面内状态，不要求新增 Pinia 模块。
- 若后端菜单权限已通过动态路由下发，则权限文件主要用于按钮级显隐控制。
- 当前仓库中尚不存在 `src/permissions/inventory.ts`，从模块清晰度考虑，优先新增该文件，而不是继续塞入无关权限文件。

### 2.5 复用组件约束

页面应优先复用项目现有基础组件和交互风格，不新增与仓库风格割裂的页面骨架：

- 查询区：`<vab-query-form>`、`<vab-query-form-left-panel>`、`<vab-query-form-right-panel>`
- 分页：`<vab-pagination>`
- 弹窗：`<vab-dialog>` 或 `el-dialog`
- 表格：`<el-table>`
- 空态：`<el-empty class="vab-data-empty" />`
- 消息提示：沿用 `request` 封装内统一错误提示，成功态使用项目已有 message 方式

具体样式和交互节奏建议直接对齐 `src/views/inventory/adjust/index.vue`：

- 外层容器使用 `comprehensive-table-container auto-height-container`
- 查询区和操作区保持单页列表页布局
- 分页、空态、表格 loading 方式保持一致

## 3. 需求背景

当前系统缺少 SKU 库存盘点页面，业务无法在系统内完成以下动作：

- 查看盘点阈值配置
- 一键生成待盘点数据
- 查看进行中的盘点列表
- 修改未装箱数量和盘点备注
- 取消当前盘点
- 完成当前盘点并归档

因此需要新增一套前端页面，用于承接库存盘点的完整操作闭环。

## 4. 建设目标

- 用户可以直观看到当前盘点余量设定
- 用户可以一键发起盘点生成
- 用户可以分页查看进行中的盘点数据
- 用户可以在列表中修改 `未装箱数量` 和 `盘点备注`
- 页面在关键操作前有明确确认和防重复提交能力
- 页面在接口失败时具备明确提示和稳定的降级表现

## 5. 需求范围

### 5.1 本次必须完成

- 新增 `SKU 库存盘点` 页面正式实现
- 余量设定查询与修改
- 新增盘点
- 取消盘点
- 完成盘点
- 进行中盘点列表查询
- 关键词搜索
- 分页切换
- 行内编辑 `未装箱数量` 和 `盘点备注`
- 空态、loading、失败提示

### 5.2 本次明确不做

- 历史盘点页面
- 导出功能
- 批量编辑
- 操作日志查看
- 多轮盘点切换
- 审批流
- 独立详情页拆分

## 6. 用户角色

- 仓储/运营：发起盘点、维护未装箱数量和备注
- 管理人员：查看盘点结果、执行完成盘点

## 7. 页面信息架构

页面采用单页结构，建议布局顺序如下：

1. 顶部标题区
2. 余量设定与主操作区
3. 查询区
4. 列表区
5. 分页区
6. 余量设定编辑弹窗

说明：

- 本页不拆分子路由，不新增详情页。
- 页面应与 `src/views/inventory/adjust/index.vue` 的列表页风格保持一致。
- 页面主逻辑默认写在 `src/views/inventory/inventoryCount/index.vue`，仅当行编辑或余量弹窗逻辑显著膨胀时，再考虑局部拆分子组件。

## 8. 页面模块设计

### 8.1 顶部标题区

包含：

- 页面标题：`SKU库存盘点`
- 可选副标题：说明当前仅展示进行中的盘点数据

### 8.2 余量设定模块

建议以“当前值展示 + 编辑按钮”的方式呈现，不建议直接在页面上裸露可编辑表单。

展示字段：

- `数量阈值`：`count`
- `比例阈值(%)`：`proportion`

交互要求：

- 点击 `编辑余量设定` 后，打开弹窗
- 弹窗确认后调用修改接口
- 修改成功后关闭弹窗并重新拉取余量设定
- `proportion` 前端展示的是百分比值，不是小数值

输入规则：

- `count`：整数，不能小于 `0`
- `proportion`：数字，不能小于 `0`，最多支持 `2` 位小数

前端校验提示建议：

- `count不能为空`
- `count不能小于0`
- `proportion不能为空`
- `proportion不能小于0`

### 8.3 操作按钮模块

页面提供 3 个主操作按钮：

- `新增盘点`
- `取消盘点`
- `完成盘点`

按钮交互规则：

- `新增盘点`
  - 点击后弹出二次确认
  - 确认文案：`确认根据当前规则生成库存盘点数据吗？`
  - 成功后刷新列表
- `取消盘点`
  - 点击后弹出二次确认
  - 确认文案：`确认取消当前盘点吗？取消后进行中数据将被清空。`
  - 成功后刷新列表并展示空状态
- `完成盘点`
  - 点击后弹出二次确认
  - 确认文案：`确认完成当前盘点吗？完成后数据将归档到历史表。`
  - 成功后刷新列表并展示空状态

按钮禁用规则：

- 当列表为空时：
  - `取消盘点` 禁用
  - `完成盘点` 禁用
- 当列表存在数据时：
  - `新增盘点` 可点击
  - 若后端返回“当前存在进行中的盘点”，前端直接透传错误提示

### 8.4 查询模块

查询字段：

- `关键字`：支持输入 `SKU / 产品名称 / 备注`

交互要求：

- 点击 `查询` 时，从第 `1` 页开始加载数据
- 点击 `重置` 时，清空关键字并刷新列表
- 回车可触发查询
- 清空关键词后允许再次查询

建议查询模型：

```ts
{
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
}
```

### 8.5 列表模块

列表字段建议如下：

| 列 | 字段 | 说明 |
|------|------|------|
| SKU图片 | `skuImg` | 无图时显示占位 |
| SKU | `sku` | 文本展示 |
| 产品名称 | `productName` | 文本展示，超长省略 |
| PO ID | `poId` | 文本展示，可为空 |
| 订货日期 | `orderDate` | 时间格式化展示 |
| 打包任务ID | `packageTaskId` | 文本展示，可为空 |
| 实际完成数 | `actualCount` | 数字 |
| 打包任务数 | `taskCount` | 数字 |
| 装箱数量 | `encasementCount` | 数字 |
| 待售后数量 | `afterCount` | 数字 |
| 缺数 | `lackCount` | 数字 |
| 总发货数 | `totalSendCount` | 数字 |
| 总接收数 | `totalReceiveCount` | 数字 |
| 未装箱数量 | `noEncasementCount` | 可编辑 |
| 盘点备注 | `remark` | 可编辑 |
| 创建时间 | `createTime` | 时间格式化展示 |

展示要求：

- 数字列右对齐
- 时间统一格式：`YYYY-MM-DD HH:mm:ss`
- 图片列固定尺寸，避免表格抖动
- 图片建议使用 `el-image`，无图时回退占位或 `-`
- 备注列默认单行省略，支持 tooltip 查看完整内容
- 空态使用项目统一空组件
- 表格建议设置 `border`、表头居中，并与 `inventory/adjust` 页保持同一视觉密度

### 8.6 列表内编辑模块

本次仅允许编辑：

- `未装箱数量`
- `盘点备注`

推荐实现方式：

- 行内编辑 + 单行保存

原因：

- 页面是进行中盘点场景，修改频率高
- 与“就地修正单行数据”的业务动作更匹配
- 能避免弹窗来回切换带来的操作成本

交互要求：

- 用户点击单元格或“编辑”进入编辑态
- 编辑后点击 `保存` 触发更新接口
- 保存成功后刷新当前页数据
- 保存失败时保留用户输入，并提示失败原因
- 同一时刻只允许一行处于保存中状态

前端校验：

- `未装箱数量` 必填
- `未装箱数量` 不能小于 `0`
- `盘点备注` 长度不能超过 `500`

提示文案建议：

- `未装箱数量不能为空`
- `未装箱数量不能小于0`
- `盘点备注长度不能超过500`

## 9. 页面状态设计

### 9.1 页面状态拆分

建议页面内至少维护以下状态：

- `queryForm`：查询条件
- `list`：表格数据
- `total`：分页总数
- `marginInfo`：当前余量设定展示值
- `marginForm`：余量设定弹窗表单
- `marginLoading`：余量设定加载中
- `marginSaving`：余量设定保存中
- `listLoading`：列表加载中
- `addLoading`：新增盘点提交中
- `cancelLoading`：取消盘点提交中
- `finishLoading`：完成盘点提交中
- `rowSavingId`：当前行编辑保存中的行 ID

说明：

- 这些状态属于页面内局部状态，不建议提升到 Pinia。
- 页面切换离开后允许状态销毁，不要求跨页面记忆。
- 命名建议沿用 `inventory/adjust` 页面已有风格，避免同仓库内出现两套风格差异过大的状态命名。

### 9.2 初始加载态

- 页面首次进入时并行请求：
  - 余量设定
  - 进行中盘点列表
- 表格区域显示 loading
- 余量设定区域显示 loading 或骨架屏

### 9.3 空状态

当列表为空时，展示空状态文案：

- `当前暂无进行中的库存盘点数据`

并保留：

- `新增盘点` 按钮可见

### 9.4 异常态

当接口失败时：

- 沿用项目 `request` 统一错误提示能力
- 列表查询失败时，表格区域允许显示空白态或失败态
- 失败后页面其他已成功模块仍应保持可用

### 9.5 提交中状态

以下操作必须增加 loading 或禁用态，防止重复点击：

- 修改余量设定
- 新增盘点
- 取消盘点
- 完成盘点
- 保存单行编辑

## 10. 类型设计建议

建议在 `src/type/inventory/count.ts` 中补充以下类型：

- `InventoryCountQuery`
- `InventoryCountItem`
- `InventoryCountListRes`
- `InventoryCountMargin`
- `InventoryCountMarginUpdateReq`
- `InventoryCountUpdateReq`
- `InventoryCountPageState`
- `InventoryCountRowEditForm`

建议字段示例：

```ts
export interface InventoryCountQuery {
  keyWord: string
  pageNo: number
  pageSize: number
}

export interface InventoryCountItem {
  id: number | string
  sku?: string
  skuImg?: string
  productName?: string
  poId?: number | string
  orderDate?: string
  packageTaskId?: number | string
  actualCount?: number
  taskCount?: number
  noEncasementCount?: number
  encasementCount?: number
  afterCount?: number
  lackCount?: number
  totalSendCount?: number
  totalReceiveCount?: number
  remark?: string
  createTime?: string
}

export interface InventoryCountListRes {
  total: number
  list: InventoryCountItem[]
}

export interface InventoryCountMargin {
  count?: number
  proportion?: number
}

export interface InventoryCountMarginUpdateReq {
  count: number
  proportion: number
}

export interface InventoryCountUpdateReq {
  id: number | string
  noEncasementCount: number
  remark?: string
}
```

补充约束：

- 类型命名应与 `src/type/inventory/adjust.ts` 保持一致的 `InventoryXxx` 风格
- 查询入参与页面表单可拆为两个接口，避免把 UI 专属字段直接透传给接口层
- 若后端列表返回除 `list/total` 外还有其他统计字段，应单独补充响应类型，不要使用 `any`

## 11. 接口设计与前端映射

统一前提：

- 所有接口基于项目现有统一响应结构解析
- `src/utils/request.ts` 已处理通用错误提示和异常抛出
- 若返回结构为 `code/message/data`，页面层按仓库现有习惯通过 `const { data } = await xxx()` 读取业务数据

### 11.1 建议接口文件

建议在 `src/api/devlocal/inventoryCount.ts` 中提供以下方法：

- `getInventoryCountMargin`
- `updateInventoryCountMargin`
- `addInventoryCount`
- `getInventoryCountList`
- `cancelInventoryCount`
- `finishInventoryCount`
- `updateInventoryCountRow`

接口风格需保持与 `src/api/devlocal/inventoryAdjustment.ts` 一致。

推荐文件结构如下：

```ts
import request from '/@/utils/request'
import { BASE_API } from '/@/api/devlocal/api'
import type { ... } from '/@/type/inventory/count'
```

约束：

- 统一使用函数导出，不新增 class 风格 API 封装
- URL 统一通过 ``${BASE_API}/...`` 拼接
- 查询、更新、列表等请求方法命名使用 `get`、`update`、`add`、`cancel`、`finish`

### 11.2 查询余量设定

- URL：`/api/v1/stock/inventory/margin`
- Method：`GET`

返回示例：

```json
{
  "count": 34,
  "proportion": 1
}
```

前端处理：

- `proportion = 1` 时，页面显示 `1%`
- 编辑弹窗回填值直接使用返回值，不再额外换算

### 11.3 修改余量设定

- URL：`/api/v1/stock/inventory/margin/update`
- Method：`POST`

请求示例：

```json
{
  "count": 34,
  "proportion": 1
}
```

前端处理：

- 前端直接传百分比值
- 修改成功后刷新余量设定展示

### 11.4 新增盘点

- URL：`/api/v1/stock/inventory/add`
- Method：`POST`

返回：

- `Boolean`

前端处理：

- 成功后提示：`新增盘点成功`
- 刷新列表
- 若返回失败提示 `当前存在进行中的盘点，请先完成或取消后再重新生成`，直接透传给用户

### 11.5 查询进行中盘点列表

- URL：`/api/v1/stock/inventory/list`
- Method：`POST`

请求示例：

```json
{
  "keyWord": "",
  "pageNo": 1,
  "pageSize": 20
}
```

返回示例：

```json
{
  "total": 1,
  "list": [
    {
      "id": 1,
      "sku": "SKU-001",
      "skuImg": "",
      "productName": "产品名称示例",
      "poId": 1001,
      "orderDate": "2026-03-26 00:00:00",
      "packageTaskId": 2001,
      "actualCount": 100,
      "taskCount": 120,
      "noEncasementCount": 20,
      "encasementCount": 80,
      "afterCount": 5,
      "lackCount": 15,
      "totalSendCount": 95,
      "totalReceiveCount": 90,
      "remark": "盘点备注示例",
      "createTime": "2026-03-26 10:00:00"
    }
  ]
}
```

前端处理：

- `total` 绑定分页总数
- `list` 绑定表格数据
- `keyWord` 查询时从第 `1` 页重新加载

### 11.6 取消盘点

- URL：`/api/v1/stock/inventory/cancle`
- Method：`POST`

前端处理：

- 注意接口路径为 `cancle`，不是 `cancel`
- 成功后提示：`取消盘点成功`
- 刷新列表

### 11.7 完成盘点

- URL：`/api/v1/stock/inventory/finish`
- Method：`POST`

前端处理：

- 成功后提示：`盘点完成成功`
- 刷新列表

### 11.8 修改盘点备注和未装箱数

- URL：`/api/v1/stock/inventory/update`
- Method：`POST`

请求示例：

```json
{
  "id": 1,
  "noEncasementCount": 1,
  "remark": ""
}
```

前端处理：

- 保存成功后提示：`保存成功`
- 建议刷新当前页数据，以同步后端重新计算后的 `lackCount`

## 12. 页面交互流程

### 12.1 首次进入页面

1. 查询余量设定
2. 查询进行中盘点列表
3. 根据列表是否为空，控制按钮可用状态和空状态展示

### 12.2 新增盘点流程

1. 用户点击 `新增盘点`
2. 弹出确认框
3. 确认后调用新增盘点接口
4. 成功后刷新列表
5. 若失败，提示错误原因

### 12.3 修改余量设定流程

1. 用户点击 `编辑余量设定`
2. 弹出编辑弹层
3. 填写并校验
4. 提交保存
5. 成功后关闭弹层并刷新展示值

### 12.4 修改盘点行数据流程

1. 用户编辑 `未装箱数量` 或 `盘点备注`
2. 点击 `保存`
3. 调用更新接口
4. 成功后刷新当前列表

### 12.5 取消盘点流程

1. 用户点击 `取消盘点`
2. 弹出确认框
3. 确认后调用接口
4. 成功后刷新列表为无数据状态

### 12.6 完成盘点流程

1. 用户点击 `完成盘点`
2. 弹出确认框
3. 确认后调用接口
4. 成功后刷新列表为无数据状态

## 13. 权限与显隐建议

若页面需要做按钮级权限控制，建议按仓库现有模式补充库存盘点权限常量，例如：

- `inventory:count:list`
- `inventory:count:add`
- `inventory:count:cancel`
- `inventory:count:finish`
- `inventory:count:update`
- `inventory:count:margin:update`

推荐实现方式：

- 新增 `src/permissions/inventory.ts`
- 参考 `src/permissions/listing.ts`、`src/permissions/sku.ts` 的 class 静态常量写法
- 若页面存在“操作列权限”聚合判断，可额外提供 `operationColPermission()` 方法

按钮控制建议：

- 页面进入权限不足时，不进入页面或由后端菜单控制
- `编辑余量设定`、`新增盘点`、`取消盘点`、`完成盘点`、`行编辑保存` 可分别做权限显隐

如果当前系统尚未给出库存盘点权限点，本次可先不阻塞页面开发，但要在联调前确认最终权限编码。

## 14. 实现约束

### 14.1 编码约束

- 使用 Vue 3 `script setup` + TypeScript
- 保持仓库现有 2 空格缩进、单引号、无分号风格
- 不进行大范围格式化

### 14.2 页面实现约束

- 不新增 Pinia 页面缓存
- 不拆分为过多子组件，优先在 `index.vue` 内完成页面逻辑
- 当表格列定义和编辑逻辑变复杂时，可再局部拆分子组件，但必须保持职责清晰
- 页面内优先采用组合式 API 的 `ref/reactive/computed` 组织状态，不额外引入新的页面状态管理方案
- 日期、数字、图片展示方式尽量复用仓库已有工具函数或现有页面格式化写法，避免同类页面口径不一致

### 14.3 路由与菜单约束

- 若页面已由后端动态菜单挂载，本次前端不强制新增本地静态路由
- 若本地路由需补充，路径和命名必须与 `InventoryCount` 页面保持一致

### 14.4 建议实施拆分

为降低联调风险，建议按以下顺序实施：

1. 建立 `type`、`api`、`permissions` 基础文件
2. 在 `src/views/inventory/inventoryCount/index.vue` 完成静态页面骨架和查询模型
3. 接入余量设定查询、列表查询
4. 接入新增、取消、完成盘点
5. 接入行内编辑与单行保存
6. 补齐空态、异常态、按钮禁用态和人工验证

说明：

- 先接只读能力，再接写操作，能减少联调期间定位成本
- 行编辑建议最后接入，因为它最依赖最终字段口径和列表刷新行为

## 15. 文案建议

页面文案建议如下：

- 页面标题：`SKU库存盘点`
- 余量设定标题：`余量设定`
- 新增盘点按钮：`新增盘点`
- 取消盘点按钮：`取消盘点`
- 完成盘点按钮：`完成盘点`
- 查询按钮：`查询`
- 重置按钮：`重置`
- 编辑余量按钮：`编辑余量设定`
- 保存按钮：`保存`
- 空状态文案：`当前暂无进行中的库存盘点数据`

提示文案建议：

- `新增盘点成功`
- `取消盘点成功`
- `盘点完成成功`
- `保存成功`
- `余量设定修改成功`

确认框文案建议：

- `确认根据当前规则生成库存盘点数据吗？`
- `确认取消当前盘点吗？取消后进行中数据将被清空。`
- `确认完成当前盘点吗？完成后数据将归档到历史表。`

## 16. 前端验收标准

### 16.1 页面展示

- 页面能正常展示余量设定和盘点列表
- 表格字段与接口返回字段一一对应
- 图片、时间、数字展示格式正确

### 16.2 余量设定

- 能正确查询并展示 `count` 和 `proportion`
- 能正确修改并刷新展示结果
- 百分比展示和提交口径正确

### 16.3 盘点操作

- 点击 `新增盘点` 后可成功生成列表数据
- 点击 `取消盘点` 后列表被清空
- 点击 `完成盘点` 后列表被清空
- 操作期间有 loading，避免重复提交

### 16.4 列表查询

- 支持关键字查询
- 支持分页切换
- 重置可恢复默认查询条件

### 16.5 行编辑

- 可修改未装箱数量和备注
- 保存后 `lackCount` 能按后端返回正确刷新
- 非法输入可被前端拦截

### 16.6 异常处理

- 接口失败时有清晰错误提示
- 重复生成盘点时能展示后端错误信息
- 页面不会因单个接口失败而整体崩溃

## 17. 联调与测试建议

提交联调前至少完成：

- `npm run vue-tsc`
- `npm run lint:oxlint`

提交测试前建议补充人工验证步骤：

1. 首次进入页面，余量设定和列表是否均正常加载
2. 列表为空时，按钮禁用状态是否正确
3. 新增盘点后，列表是否刷新
4. 修改未装箱数量后，缺数是否同步刷新
5. 修改备注超长时，是否被前端拦截
6. 取消盘点和完成盘点后，空状态是否正确展示
7. 任一接口报错时，页面其他区域是否仍可继续使用

## 18. 风险与注意事项

- 接口路径中存在 `cancle` 这个既定拼写，前端必须严格按该路径调用。
- `proportion` 的展示值是百分比，不是 Redis 存储的小数值，前端不要自行除以 `100`。
- 行编辑保存后，`lackCount` 可能由后端重新计算，前端不要在本地自行推导后覆盖后端结果。
- 当前页面尚未存在相关接口文件和类型文件，开发时应先补齐目录落点，避免把库存盘点接口散落到无关模块。
- 当前 `src/views/inventory/inventoryCount/index.vue` 仍是纯占位页面，开发时需要对照 `src/views/inventory/adjust/index.vue` 补齐完整列表页骨架，避免做成独立风格的新页面。
