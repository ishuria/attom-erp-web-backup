# 退税批次新增需求 prd

页面：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vatRefundBatch/index.vue`

在操作列增加 `汇总明细` 按钮，点击按钮 弹窗新增弹窗 dialog，新增 dialog 内容如下

## 1.新增 dialog 

新增 dialog 弹窗显示内容与页面中的 table 一直，页面地址：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vabAutoComponents/VabAggregationInvoiceMath.vue`


## 2. 接口对接

在点击`汇总明细` 按钮，根据点击行的 合同号，初始化 新增弹窗 dialog 表格


### 2.1 新增接口

- URL：`/taxRefund/batch/summary/detail/list`
- Method：`POST`
- Body 参数包含：`contractNumber`
- 是否分页：是
- 是否支持关键词：是
- 鉴权：沿用退税模块现有接口鉴权方式

### 2.2 接口用途

用于退税批次页面中，查看当前批次对应合同号下的“退税聚合产品汇总明细”。


## 3. 请求与响应定义

### 3.1 请求参数

接口建议采用：

- 统一使用 Body 传参
- Body 中包含 `contractNumber`、分页与关键词参数

Body 参数：

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| contractNumber | string | 是 | 合同号 |
| keyWord | string | 否 | 关键词，支持合同号范围内筛选 |
| pageNo | number | 否 | 当前页，默认 1 |
| pageSize | number | 否 | 每页大小，默认 20 |

校验规则：

- `contractNumber` 不能为空
- `pageNo` 小于 1 时按 1 处理
- `pageSize` 小于等于 0 时按默认值 20 处理
- `keyWord` 允许为空，为空时表示查询该合同号下全部数据

### 3.2 响应结构

建议沿用现有分页响应风格，返回 `total + list`。

```json
{
  "total": 2,
  "list": [
    {
      "id": 1,
      "shipmentDate": "2025-03-01",
      "contractNumber": "HT20250301001",
      "po": "PO250301001",
      "poId": 1001,
      "customsDeclarationName": "电机组件",
      "customsDeclarationCount": 100,
      "customsDeclarationUnit": "PCS",
      "count": 100,
      "taxInclusiveCost": 5000.00,
      "taxRefundsCost": 4424.78,
      "matchInvoiceCount": 100,
      "matchInvoicePrice": 5000.00,
      "suppliser": "某供应商",
      "suppliserTaxNumber": "913xxxxxxxxxxxxx",
      "sku": "SKU-001",
      "taxNumber": "913xxxxxxxxxxxxx",
      "matchDate": "2025-03-20T10:30:00",
      "invoiceDetailList": [
        {
          "id": 11,
          "no": 1,
          "invoiceNumber": "12345678",
          "invoiceMatchCount": 50,
          "invoicePath": "/invoice/2025/03/xxx.pdf"
        }
      ]
    }
  ]
}
```

### 3.3 字段说明

| 字段名 | 类型 | 说明 
| --- | --- | --- | 
| id | number | 退税主表主键  |
| shipmentDate | string | 发货日期 |
| contractNumber | string | 合同号 |
| po | string | PO 号 |
| poId | number | PO ID |
| customsDeclarationName | string | 报关品名 |
| customsDeclarationCount | number | 报关数量 |
| customsDeclarationUnit | string | 报关单位 |
| count | number | 零件数量|
| taxInclusiveCost | number | 含税成本 |
| taxRefundsCost | number | 未税价 |
| matchInvoiceCount | number | 匹配发票数量 |
| matchInvoicePrice | number | 匹配发票金额 | 
| suppliser | string | 供应商名称 | 
| suppliserTaxNumber | string | 供应商税号 |
| sku | string | SKU | 
| taxNumber | string | 税号 |
| matchDate | string/date | 发票匹配日期 | 
| invoiceDetailList | array | 发票明细列表 | 

### 3.4 `invoiceDetailList` 字段说明

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 发票明细主键 |
| no | number | 发票序号 |
| invoiceNumber | string | 发票号码 |
| invoiceMatchCount | number | 当前发票匹配数量 |
| invoicePath | string | 发票文件路径 |

## 4. 补充优化需求

### 4.1 聚合发票匹配弹窗检索条件重置

涉及页面：`/Users/luoxiangkai/Project/Worker/attom-web/src/views/customsDeclaration/vabAutoComponents/VabAggregationInvoiceMath.vue`

#### 问题背景

当前“匹配”弹窗中存在检索框，用户在检索框输入关键词后点击“确定”完成当前发票匹配，弹窗关闭时未清空检索项。

由于检索关键词仍保留在 `matchQueryForm.keyWord` 中，后续继续匹配下一张发票时，会继续携带上一次的检索条件调用匹配接口，导致后端返回的数据被错误过滤。在部分场景下，后端无法检索到对应数据，出现报错。

#### 需求说明

- “匹配”弹窗关闭时，需要清空当前检索框中的关键词
- 当前发票匹配成功并关闭弹窗时，需要同步清空检索关键词
- 再次打开新的“匹配”弹窗时，检索框默认应为空，不得沿用上一张发票的检索条件
- 检索页码需要恢复到第一页，避免沿用上一次分页状态

#### 预期结果

- 用户在任意一次匹配中输入关键词进行筛选后，该关键词只对当前弹窗有效
- 当前匹配完成或弹窗关闭后，再次进入匹配弹窗时，检索框展示为空
- 后续发票匹配时，请求参数中不应继续携带上一轮残留的 `keyWord`
- 后端能够基于当前发票上下文返回正确的匹配数据，避免因旧筛选条件导致查无数据

#### 验收标准

1. 打开“匹配”弹窗，在检索框输入任意关键词，例如 `PO123`
2. 点击“确定”完成当前发票匹配
3. 再次点击另一条发票的“匹配”按钮，进入新的“匹配”弹窗
4. 验证检索框内容已被清空，且分页回到第一页
5. 不输入任何关键词时，新的匹配请求不应携带上一轮残留的 `keyWord`
6. 后端可正常返回当前发票的匹配数据，不再因残留检索条件报错
