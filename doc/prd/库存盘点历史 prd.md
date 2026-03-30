# 库存盘点历史 PRD

页面地址：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/inventory/inventoryHistory/index.vue`

在目录 `/Users/luoxiangkai/Project/Worker/attom-web/src/views/inventory` 下新建文件夹 `inventoryHistory`，并创建页面文件 `index.vue`。

参考页面：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/inventory/inventoryCount/index.vue`

## 1. 需求背景

当前库存盘点页面主要展示“进行中盘点”数据，缺少已归档历史盘点记录的统一查询入口，导致：

- 无法快速回溯某个 SKU 在历史盘点中的数量快照
- 无法对比盘点归档时的任务数量、未装箱数量、售后数量等历史口径
- 运营和仓储在排查差异时，需要额外通过数据库或其他页面拼凑信息

因此需要新增“库存盘点历史”页面，用于展示历史归档数据，并保留与现有盘点列表一致的浏览习惯。

## 2. 页面目标

新增一个“库存盘点历史”列表页面，用于分页查看历史盘点记录，并支持：

- 按关键词搜索
- 按日期范围筛选
- 查看与进行中盘点一致的主表字段
- 展示历史任务明细 `packageTaskList`

## 3. 页面内容

页面包含 3 个区域：

- 顶部检索区：位于右上角，包含关键词检索和日期范围选择
- 中间数据区：表格内容与 `inventoryCount/index.vue` 的表格展示口径尽量保持一致
- 底部分页区：使用项目现有分页组件，支持页码切换和每页条数切换

## 4. 页面交互说明

### 4.1 检索区

检索区建议包含：

- 关键词输入框
- 日期范围选择器
- 查询按钮
- 重置按钮（如项目现有页面存在统一习惯，建议补充）

关键词建议支持以下字段模糊匹配：

- `sku`
- `productName`
- `po`
- `remark`

日期范围用于筛选历史记录的归档时间或创建时间，对应接口参数 `startDate` 和 `endDate`。

### 4.2 查询规则

- 页面首次进入时，默认查询第一页数据
- 输入关键词后，回车或点击查询按钮触发检索
- 调整日期范围后，可点击查询按钮触发查询
- 每次重新检索时，页码重置为第 1 页
- 切换分页或每页条数时，保留当前关键词和日期条件

### 4.3 表格展示规则

- 主表字段展示口径尽量与 `inventoryCount/index.vue` 保持一致
- 若某条历史记录包含 `packageTaskList`，可沿用当前页面的嵌套展示方式、展开行或多行拼接方式
- 空值统一显示为 `-`
- 图片字段 `skuImg` 为空时不展示图片

## 5. 接口文档

### 5.1 查询库存盘点历史列表

- URL：`/stock/inventory/history/list`
- Method：`POST`
- 鉴权：沿用库存模块现有接口鉴权方式

### 5.2 请求参数

请求示例：

```json
{
  "keyWord": "",
  "pageNo": 1,
  "pageSize": 20,
  "startDate": "",
  "endDate": ""
}
```

字段说明：

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| keyWord | string | 否 | 关键词，支持 SKU、产品名称、PO、备注等模糊查询 |
| pageNo | number | 否 | 当前页，默认 1 |
| pageSize | number | 否 | 每页大小，默认 20 |
| startDate | string | 否 | 开始日期，格式建议 `yyyy-MM-dd` |
| endDate | string | 否 | 结束日期，格式建议 `yyyy-MM-dd` |

校验规则：

- `pageNo < 1` 时按 1 处理
- `pageSize <= 0` 时按默认值 20 处理
- `startDate`、`endDate` 可同时为空
- 若仅传一个日期，后端需明确处理策略，建议要求前端传完整区间

### 5.3 响应结构

建议返回分页结构：

```json
{
  "total": 1,
  "list": [
    {
      "id": 1,
      "sku": "SKU-001",
      "skuImg": "",
      "productName": "产品名称示例",
      "actualCount": 100,
      "taskCount": 120,
      "noEncasementCount": 20,
      "encasementCount": 80,
      "afterCount": 5,
      "lackCount": 15,
      "totalSendCount": 95,
      "totalReceiveCount": 90,
      "remark": "盘点备注示例",
      "createTime": "2026-03-26 10:00:00",
      "packageTaskList": [
        {
          "id": 11,
          "packageTaskId": 2001,
          "orderDate": "2026-03-26 00:00:00",
          "actualCount": 100,
          "taskCount": 120,
          "afterCount": 5,
          "createTime": "2026-03-26 10:00:00",
          "po": "PO240326001"
        }
      ]
    }
  ]
}
```

### 5.4 字段口径

历史列表返回字段建议与进行中盘点列表保持一致：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 历史主表主键 |
| sku | string | SKU |
| skuImg | string | SKU 图片 |
| productName | string | 产品名称 |
| actualCount | number | 实际完成数 |
| taskCount | number | 打包任务数 |
| noEncasementCount | number | 未装箱数量 |
| encasementCount | number | 装箱数量 |
| afterCount | number | 待售后数量 |
| lackCount | number | 缺数 |
| totalSendCount | number | 总发货数 |
| totalReceiveCount | number | 总接收数 |
| remark | string | 盘点备注 |
| createTime | string | 盘点生成时间或归档快照时间 |
| packageTaskList | array | 历史任务明细列表 |

子表字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 历史子表主键 |
| packageTaskId | number | 打包任务 ID |
| orderDate | string | 订货日期 |
| actualCount | number | 实际完成数 |
| taskCount | number | 任务数量 |
| afterCount | number | 待售后数量 |
| createTime | string | 创建时间 |
| po | string | PO 号，可通过 `packageTaskId` 或已有 PO 关联逻辑补充 |

## 6. 前端实现建议

- 路由命名建议与页面目录保持一致，例如 `inventoryHistory`
- 查询区域和分页组件复用库存模块现有写法
- 表格列、图片展示、嵌套行样式尽量参考 `inventoryCount/index.vue`
- 若历史表格存在多条 `packageTaskList`，建议使用与现有页面一致的展开或多行展示方案，避免交互风格不统一

## 7. 验收标准

1. 可以正常进入“库存盘点历史”页面并加载列表数据
2. 页面包含检索区、表格区和分页区
3. 输入关键词后可正确筛选历史数据
4. 选择日期范围后可按时间区间筛选历史数据
5. 切换页码和每页条数时，数据和总数正确联动
6. 表格字段与进行中盘点页面口径基本一致
7. 历史任务明细 `packageTaskList` 可正常展示
8. 空数据场景下显示统一空状态
