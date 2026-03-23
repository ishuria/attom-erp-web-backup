## PR 标题

feat: 运营奖金明细增加平均小类排名并支持运营小类排名配置维护

## PR 类型

- 功能新增
- 页面展示增强
- 接口封装补充
- 类型定义补充

## 变更背景

运营奖金模块原先缺少“小类排名”相关能力，导致奖金明细页无法展示平均小类排名，运营类型页也无法配置按档位计算的额外提成比例。本次 PR 将该能力补齐到展示层、配置层、接口层与类型层。

## 本次交付内容

### 1. 运营奖金明细页

文件：`src/views/commission/commissionOperationDetails/index.vue`

已实施内容：

- 新增 `平均小类排名` 列
- 绑定字段 `averageSubcategoryRanking`
- 空值统一展示 `-`
- 保持原有查询、分页、排序、详情逻辑不变

### 2. 提成设定-运营类型页

文件：`src/views/commission/commissionCoefficientSetting/index.vue`

已实施内容：

- 新增 `小类排名配置` 卡片区域
- 新增配置表格，列为 `档位`、`额外提成比例`
- 支持查询列表、编辑比例、保存修改、新增档位
- 保存失败时回滚页面值，成功后提示并刷新必要数据

### 3. 接口封装

文件：`src/api/devlocal/commission.ts`

新增接口封装：

- `GET /operation/commission/subcategoryRanking/list`
- `POST /operation/commission/subcategoryRanking/update`
- `POST /operation/commission/subcategoryRanking/add`

### 4. 类型补充

文件：`src/type/commission/commissionType.ts`

已补充内容：

- 运营小类排名配置相关类型
- 运营奖金明细 `averageSubcategoryRanking` 字段定义（如原类型中缺失）

## 关键实现说明

### 数据转换

- 接口 `proportion` 为小数值
- 前端展示与输入统一使用百分比
- 转换规则：`0.01 -> 1`，`1 -> 0.01`

### 页面交互

- 小类排名配置列表按 `gear` 升序展示
- `档位` 只读
- `额外提成比例` 可编辑
- 编辑后通过失焦或确认动作触发保存
- 新增档位后自动刷新列表
- 已存在档位不允许重复新增

### 一致性要求

- 卡片外观与现有“考核指标配置”保持一致
- 消息提示复用现有页面风格
- 不引入与本次需求无关的结构调整或大范围重构

## 接口说明

### 查询

```http
GET /api/v1/operation/commission/subcategoryRanking/list
```

### 修改

```http
POST /api/v1/operation/commission/subcategoryRanking/update
Content-Type: application/json
```

```json
{
  "id": 1,
  "proportion": 0.02
}
```

### 新增

```http
POST /api/v1/operation/commission/subcategoryRanking/add
Content-Type: application/json
```

```json
{
  "gear": 4,
  "proportion": 0.015
}
```

## 验证项

- 奖金明细页可展示 `平均小类排名`
- `averageSubcategoryRanking` 为空时展示 `-`
- “运营类型”页可正常拉取并展示小类排名配置
- 修改比例后可正常保存
- 保存失败时页面值可回滚
- 新增档位后可自动刷新并展示
- 重复档位新增被拦截或提示

## 影响评估

正向影响：

- 运营奖金明细信息更完整
- 运营提成配置维护路径更闭环
- 前后端关于小类排名的字段与接口契约更清晰

潜在风险：

- 比例精度处理不一致可能造成回显误差
- 后端未排序时可能出现前端显示顺序不稳定
- 后端未做重复限制时，前端校验需兜底

## 不包含内容

- 删除小类排名配置
- 配置批量维护
- 运营提成其他规则调整

## 关联文档

- `doc/pr/运营奖金明细新增需求1.md`
