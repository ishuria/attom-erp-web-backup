# 沃尔玛产品分配 PRD

## 1. 文档信息

| 项目 | 内容 |
|------|------|
| 模块名称 | 沃尔玛产品分配 |
| 所属系统 | 店铺运营 > 沃尔玛 |
| 参考页面 | 亚马逊产品分配（`/storeOperations/amazon/productDistribution`） |

## 2. 需求概述

沃尔玛产品分配页面用于管理沃尔玛平台的产品运营分配，支持按关键词、站点、运营人员、运营分类、认领状态进行筛选查询，并支持在线修改运营负责人和运营分类。

### 2.1 与亚马逊产品分配的差异

以下亚马逊产品分配功能**不需要**在沃尔玛版本中实现：

| 排除功能 | 说明 |
|----------|------|
| 展示/隐藏停产 | 无需停产筛选功能 |
| 老品认领 | 无需老品认领 checkbox |
| 自动分配站点认领设定 | 无需自动认领弹窗及新增/删除操作 |
| 申请老品认领 | 无需申请老品认领按钮 |
| 批量老品认领 | 无需批量老品认领弹窗 |
| 产品经理列 | 无需展示产品经理 |
| 预计上架日期列 | 无需展示 |
| 最近入库列 | 无需展示 |
| 入库总数列 | 无需展示 |
| 头部产品#列 | 无需展示 |
| 同赛道ASIN列 | 无需展示 |
| 多选（selection） | 无需勾选列 |

### 2.2 页面位置

- 路由路径：`/storeOperations/walmart/productDistribution`
- 文件位置：`src/views/storeOperations/walmart/productDistributionWalmart/index.vue`

## 3. 页面设计

### 3.1 页面布局

页面分为三个区域：搜索筛选区、数据表格区、分页区。

```
┌─────────────────────────────────────────────────────────────┐
│ [站点▼]  [认领状态▼]  [运营▼]  [运营分类▼]    [关键词搜索] [🔍] │
├─────────────────────────────────────────────────────────────┤
│ 图片 │ SKU │ Item Number │ UPC │ 站点 │ 认领状态 │ 运营 │ 运营分类 │
│ ...  │ ... │    ...      │ ... │ ...  │   ...   │ ...  │   ...   │
├─────────────────────────────────────────────────────────────┤
│ 分页：共 X 条  < 1 2 3 ... >                                │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 搜索筛选区

| 筛选项 | 组件类型 | 说明 |
|--------|----------|------|
| 站点 | `el-select`（单选，可清空） | 选项从站点列表接口获取，默认"全部站点" |
| 认领状态 | `el-select`（单选） | 选项：全部（-1）、未认领（0）、已认领（1） |
| 运营 | `el-select`（单选，可清空） | 选项从运营人员列表接口获取 |
| 运营分类 | `el-select`（单选，可清空） | 选项从运营分类列表接口获取 |
| 关键词 | `el-input`（可清空） | 模糊搜索 SKU / Item Number / UPC，支持回车搜索和输入搜索 |
| 搜索按钮 | `el-button`（带 Search 图标） | 触发查询 |

筛选变更后自动触发查询，页码重置为 1。

### 3.3 数据表格

#### 表格列定义

| 列名 | 字段 | 宽度 | 说明 |
|------|------|------|------|
| 图片 | `skuImgUrl` | 75px | 展示 SKU 图片，点击可预览大图（使用 `el-image-viewer`）；图片加载失败显示占位图标 |
| SKU | `sku` | 自适应 | 展示 SKU 编码 |
| Item Number | `itemNumber` | 自适应 | 展示 Item Number，点击可跳转至 `itemNumberAddress` 链接 |
| UPC | `upc` | 自适应 | 展示 UPC 条码 |
| 站点 | `site` | 130px | 展示站点名称 |
| 认领状态 | `distributionStatus` | 100px | 0=未认领，1=已认领 |
| 运营 | `operationUserId` | 150px | 下拉选择框（`el-select`），可修改运营负责人 |
| 运营分类 | `operationTypeId` | 150px | 下拉选择框（`el-select`），可修改运营分类；分类选项跟随当前运营人员 |

#### 表格交互

1. **图片预览**：点击图片列的缩略图，弹出 `el-image-viewer` 查看大图，点击遮罩层关闭
2. **Item Number 跳转**：点击 Item Number 文本，在新标签页打开 `itemNumberAddress` 链接
3. **修改运营负责人**：
   - 点击运营列下拉框选择新运营人员
   - 调用 `/walmart/allocate/update/user` 接口
   - 成功后：清空当前行的运营分类（需重新选择），刷新该行对应的分类选项
   - 失败后：恢复原运营人员值
4. **修改运营分类**：
   - 点击运营分类列下拉框选择新分类
   - 分类选项根据当前行运营人员动态获取
   - 调用 `/walmart/allocate/update/type` 接口
5. **认领状态展示**：
   - 已认领（1）：显示绿色勾选图标 `checkbox-circle-fill`
   - 未认领（0）：不显示

#### 表格样式

- 表格带边框（`border`）、斑马纹（`stripe`）
- 表头居中对齐
- 图片列去除内边距（`clear-padding`）
- 图片列、SKU 列左对齐，其余列居中对齐

### 3.4 分页区

使用 `vab-pagination` 组件，支持切换页码和每页条数。

- 默认每页 20 条
- 切换页码时保持筛选条件不变
- 切换每页条数时页码重置为 1

## 4. 接口对接

### 4.1 分页查询

- **URL**：`/walmart/allocate/list`
- **Method**：`POST`
- **Content-Type**：`application/json`

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| pageNo | int | 否 | 1 | 页码 |
| pageSize | int | 否 | 10 | 每页条数 |
| keyWord | String | 否 | - | 关键词，模糊匹配 sku / item_number / upc |
| site | Integer | 否 | - | 站点筛选 |
| operationUserId | Integer | 否 | - | 运营负责人 ID 筛选 |
| operationTypeId | Integer | 否 | - | 运营分类 ID 筛选 |
| distributionStatus | Integer | 否 | - | 分配状态筛选：0=未认领，1=已认领 |

#### 请求示例

```json
{
    "pageNo": 1,
    "pageSize": 10,
    "keyWord": "SKU-ABC",
    "site": 1,
    "operationUserId": 2001,
    "distributionStatus": 1
}
```

#### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| total | Long | 总记录数 |
| list | Array | 数据列表 |
| list[].id | Long | 主键 ID |
| list[].sku | String | SKU 编码 |
| list[].skuImgUrl | String | SKU 图片地址 |
| list[].itemNumber | String | item number |
| list[].itemNumberAddress | String | 访问链接 |
| list[].upc | String | UPC 条码 |
| list[].site | Integer | 站点 |
| list[].operationUserId | Integer | 运营负责人 ID |
| list[].operationUserName | String | 运营负责人姓名 |
| list[].operationTypeId | Integer | 运营分类 ID |
| list[].operationTypeName | String | 运营分类名称 |
| list[].distributionStatus | Integer | 分配状态：0=未认领，1=已认领 |
| list[].status | String | item_number 状态 |
| list[].createTime | String | 创建时间（yyyy-MM-dd HH:mm:ss） |
| list[].operationRemark | String | 运营备注 |

#### 响应示例

```json
{
    "code": "0000",
    "info": "success",
    "data": {
        "total": 100,
        "list": [
            {
                "id": 10001,
                "sku": "SKU-ABC-123",
                "skuImgUrl": "https://example.com/images/sku-abc-123.jpg",
                "itemNumber": "ITEM-987654",
                "itemNumberAddress": "https://example.com/item/ITEM-987654",
                "upc": "123456789012",
                "site": 1,
                "operationUserId": 2001,
                "operationUserName": "张三",
                "operationTypeId": 10,
                "operationTypeName": "电器",
                "distributionStatus": 1,
                "status": "ACTIVE",
                "createTime": "2026-04-03 13:00:00",
                "operationRemark": "已完成商品认领并上架"
            }
        ]
    }
}
```

---

### 4.2 修改运营负责人

- **URL**：`/walmart/allocate/update/user`
- **Method**：`POST`
- **Content-Type**：`application/json`

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 产品分配记录 ID |
| operationUserId | Integer | 是 | 新的运营负责人用户 ID |

#### 请求示例

```json
{
    "id": 10001,
    "operationUserId": 2002
}
```

#### 响应示例

```json
{
    "code": "0000",
    "info": "success",
    "data": true
}
```

---

### 4.3 修改运营分类

- **URL**：`/walmart/allocate/update/type`
- **Method**：`POST`
- **Content-Type**：`application/json`

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 产品分配记录 ID |
| operationTypeId | Integer | 是 | 新的运营分类 ID |

#### 请求示例

```json
{
    "id": 10001,
    "operationTypeId": 15
}
```

#### 响应示例

```json
{
    "code": "0000",
    "info": "success",
    "data": true
}
```

---

### 4.4 下拉数据源接口（复用现有接口）

以下接口用于填充筛选区和表格中的下拉选项，建议复用已有的沃尔玛相关接口：

| 数据 | 接口 | 来源 |
|------|------|------|
| 站点列表 | `getWalmartSiteList()` → `GET /walmart/site/list` | `src/api/devlocal/productPerformance.ts` |
| 运营人员列表 | `getAmazonOptionUserList()` → `GET /amazon/operation/user/list` | `src/api/devlocal/productPerformance.ts` |
| 运营分类列表 | `getDistributionUserType()` → `GET /distribution/option/user/all/list` | `src/api/devlocal/productDistribution.ts` |

> **备注**：运营分类列表为全量数据（按 userId 分组），前端通过 Map 映射，根据当前行运营人员 ID 筛选对应分类选项。如果后端后续提供沃尔玛专属接口，再做替换。

## 5. 技术实现要点

### 5.1 组件依赖

- `vab-query-form` / `vab-query-form-left-panel` / `vab-query-form-right-panel`：搜索区域布局
- `el-table` / `el-table-column`：数据表格
- `vab-pagination`：分页组件
- `el-image` / `el-image-viewer`：图片展示和预览
- `el-select` / `el-option`：下拉选择

### 5.2 关键逻辑

1. **页面初始化**：并行加载站点列表、运营人员列表、运营分类列表、表格数据
2. **运营分类联动**：表格中运营分类下拉选项根据当前行的运营人员动态过滤
3. **修改运营人员后**：调用修改接口成功后，清空当前行的运营分类值，并刷新该行对应的分类选项
4. **修改运营人员失败**：catch 中恢复原值
5. **筛选联动**：任意筛选条件变更时，页码重置为 1 并重新查询

### 5.3 文件规划

| 文件 | 说明 |
|------|------|
| `src/views/storeOperations/walmart/productDistributionWalmart/index.vue` | 页面组件 |
| `src/api/devlocal/productPerformance.ts` | 新增沃尔玛产品分配相关 API 调用函数 |
