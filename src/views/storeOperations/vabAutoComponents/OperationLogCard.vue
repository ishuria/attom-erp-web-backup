<template>
  <div class="operation-log-card">
    <vab-query-form>
      <vab-query-form-left-panel :span="6">
        <el-form inline>
          <el-form-item>
            <el-text>{{ title }}</el-text>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">{{ addButtonText }}</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="18">
        <el-form inline>
          <el-form-item label="">
            <el-select
              v-model="selectedFilter"
              collapse-tags
              collapse-tags-tooltip
              multiple
              style="min-width: 140px"
              @change="handleFilterChange"
            >
              <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dateRange"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="max-width: 240px"
              type="daterange"
              @change="handleFilterChange"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="handleFilterChange"
              @keyup.enter="handleFilterChange"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="loading" border :data="filteredData" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column align="center" label="日期" prop="date" width="115" />
      <el-table-column align="center" label="类型" prop="type" width="95" />
      <el-table-column label="内容" min-width="170">
        <template #default="{ row }">
          <!-- 手动输入 -->
          <div v-if="row.rawType === 0">
            <div v-html="row.content"></div>
          </div>
          <div v-else-if="row.rawType === 3 || row.rawType === 4 || row.rawType === 5">
            <div style="white-space: pre-line">{{ row.content }}</div>
          </div>
          <!-- 系统抓取(type=1)时的解析展示 -->
          <div v-else-if="row.rawType === 1 && row.content" class="parsed-content" v-html="parseSystemContent(row.content)"></div>
          <!-- 其他情况保持原有逻辑 -->
          <div v-else-if="row.content">
            <el-link v-if="row.isAggregate" class="content-link" type="primary" @click="handleAggregateClick(row)">
              <span class="content-text">{{ row.content }}</span>
            </el-link>
            <span v-else class="content-text">{{ row.content }}</span>
          </div>
          <div v-else>
            <!-- 特殊情况：广告推广状态+创建，只显示"产品推广状态" -->
            <div v-if="row.entityType === '广告推广状态' && row.changeType === '创建'">产品推广状态</div>
            <div v-else-if="row.entityType === '广告组' && row.changeType === '创建'">创建广告组</div>
            <!-- 其他情况的正常逻辑 -->
            <template v-else>
              <!-- entityType 是否词的不展示 -->
              <div v-if="row.entityType !== '关键词' && row.entityType !== '否词' && row.entityType !== '广告活动'">
                {{ row.entityType }}
              </div>
              <div v-if="row.keyWord">
                <el-tag v-if="row.keyWordType" :type="getKeyWordType(row.keyWordType)">
                  {{ row.keyWordType }}
                </el-tag>
                {{ row.keyWord }}
              </div>
              <!-- changeType 展示逻辑 -->
              <div v-if="row.keyWordType !== '取消否定投放' && row.afterValue !== '归档'" class="change-info">
                <!-- 创建类型：蓝色加粗显示"创建" -->
                <span v-if="row.changeType === '创建'" class="create-text">创建</span>
                <!-- 状态类型：只展示变更后的值 -->
                <span v-else-if="row.changeType === '状态'">
                  <span v-if="row.afterValue === '打开'" class="status-open">打开</span>
                  <span v-else-if="row.afterValue === '关闭'" class="status-close">关闭</span>
                  <span v-else>{{ row.afterValue }}</span>
                </span>
                <!-- 竞价类型：显示完整变化及箭头 -->
                <span v-else-if="row.changeType === '竞价'" style="font-weight: bold">
                  {{ row.changeType }}: {{ row.beforeValue }} -> {{ row.afterValue }}
                  <span
                    v-if="
                      row.beforeValue !== undefined && row.afterValue !== undefined && isValueIncreased(row.beforeValue, row.afterValue)
                    "
                    class="arrow-up"
                  >
                    ↑
                  </span>
                  <span v-else-if="row.beforeValue !== undefined && row.afterValue !== undefined" class="arrow-down">↓</span>
                </span>
                <!-- 预算 -->
                <span v-else-if="row.changeType === '预算'">
                  <span v-if="row.afterValue === 'false'" style="color: var(--el-color-danger)">预算用完</span>
                  <span v-else-if="row.afterValue === 'true'" style="color: var(--el-color-success)">预算恢复</span>
                </span>
                <!-- 其他类型：正常显示 -->
                <span v-else>{{ row.changeType }}: {{ row.beforeValue }} -> {{ row.afterValue }}</span>
              </div>
              <div v-if="row.campaignName" class="campaign-name">{{ row.campaignName }}</div>
            </template>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="pageNo"
      layout="total, prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
    />

    <vab-rich-remark-dialog v-model="remarkVisible" :remark="addRemark" title="新增操作日志" @update:remark="handleAddRemark" />

    <!-- 变化详情对话框 -->
    <vab-dialog v-model="changeDetailVisible" :title="changeDetailTitle">
      <el-table border :data="changeDetailData">
        <el-table-column label="变化类型">
          <template #default="{ row }">
            {{ changeDetailType }}
          </template>
        </el-table-column>
        <el-table-column label="变化前" :prop="beforeProp">
          <template v-if="beforeFormatter" #default="{ row }">{{ beforeFormatter(row) }}</template>
        </el-table-column>
        <el-table-column label="变化后" :prop="afterProp">
          <template v-if="afterFormatter" #default="{ row }">{{ afterFormatter(row) }}</template>
        </el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 操作日志聚合明细展示 -->
    <operation-log-aggregated-details
      v-model="operationLogAggregatedDetailsVisible"
      :detail-list="operationLogAggregatedDetailsList"
      :detail-loading="operationLogAggregatedDetailsLoading"
    />
  </div>
</template>

<script lang="ts" setup>
import { addOperationLog, getOperationLog, getOperationLogAggregatedDetails } from '/@/api/devlocal/productAnalysis'
import type { IGetOperationLog } from '/@/type/storeOperation/productAnalysisType'
import { formatDateToString } from '/@/utils/dateUtils'

defineOptions({
  name: 'OperationLogCard',
})

interface FilterOption {
  label: string
  value: number | string
}

interface LogItem {
  date: string
  type: string
  content: string
  [key: string]: any
}

interface ChangeDetailItem {
  [key: string]: any
}

interface Props {
  title?: string
  addButtonText?: string
  // 接口参数
  asin?: string
  siteId?: number
  // 如果提供了 data，则使用 data，否则从接口获取
  data?: LogItem[]
  filterOptions?: FilterOption[]
  // 变化详情配置
  changeDetailConfig?: {
    [content: string]: {
      title: string
      type: string
      data: ChangeDetailItem[]
      beforeProp?: string
      afterProp?: string
      beforeFormatter?: (row: any) => string
      afterFormatter?: (row: any) => string
    }
  }
}
const getKeyWordType = (type: string) => {
  switch (type) {
    case '精准匹配':
      return 'primary'
    case '宽泛匹配':
      return 'success'
    case '短语匹配':
      return 'warning'
    default:
      return 'info' // 或者 'default'
  }
}

// 解析系统抓取的 content
const parseSystemContent = (content: string) => {
  if (!content) return ''

  // 格式: [实际价涨价]£10.99->£11.99\n产品SKU 或 [原价降价]137.96->127.08\nSKU
  // 支持多种换行符：\n, \r\n, \r
  const lines = content.split(/\r?\n/)
  if (lines.length === 0) return content

  const firstLine = lines[0]
  // 匹配 [标签]价格1->价格2 格式
  // 使用非贪婪匹配，支持任意货币符号（包括多字符如 C$, MX$, R$ 等）
  const match = firstLine.match(/(\[.*?\])?\s*(.+?)\s*(->|－>|→)\s*(.+?)\s*(?:$|\n)/)

  if (match) {
    const label = match[1] || '' // [实际价涨价]
    const beforePrice = match[2]?.trim() // £10.99, 137.96, MX$840.49, ₺1179.70
    const afterPrice = match[4]?.trim() // £11.99, 127.08, MX$823.17, ₺1176.89

    // 验证价格格式（必须包含数字）
    const pricePattern = /\d/
    if (!pricePattern.test(beforePrice) || !pricePattern.test(afterPrice)) {
      return content // 不是有效的价格格式
    }

    // 判断涨跌
    const priceChange = isPriceIncreased(beforePrice, afterPrice)
    if (priceChange === null) {
      return content // 无法判断，返回原内容
    }

    const isIncrease = priceChange
    const icon = isIncrease ? '<span class="price-arrow price-up">↑</span>' : '<span class="price-arrow price-down">↓</span>'

    let result = `${label || ''}${beforePrice}-> ${afterPrice}${icon}`

    // 添加产品SKU（第二行），前面加一个空格
    if (lines[1]) {
      result += `<br/><span class="product-sku">${lines[1]}</span>`
    }

    return result
  }

  return content
}

// 价格比较（支持多种货币符号和千分位逗号）
const isPriceIncreased = (before: string, after: string): boolean | null => {
  const extractNumber = (price: string) => {
    // 移除所有货币符号和千分位逗号，提取数字
    return parseFloat(price.replace(/C\$|MX\$|R\$|JP¥|ر\.س|د\.إ/g, '').replace(/[£$€¥₹₽₩₺złkr,]/g, ''))
  }

  const beforeNum = extractNumber(before)
  const afterNum = extractNumber(after)

  if (isNaN(beforeNum) || isNaN(afterNum)) return null

  return afterNum > beforeNum
}

const keyWord = ref<string>('')
// 判断值是否增加（用于箭头方向）
const isValueIncreased = (beforeValue: any, afterValue: any): boolean => {
  const before = parseFloat(String(beforeValue).replace(/[^\d.-]/g, ''))
  const after = parseFloat(String(afterValue).replace(/[^\d.-]/g, ''))
  if (isNaN(before) || isNaN(after)) return false
  return after > before
}
const props = withDefaults(defineProps<Props>(), {
  title: '日志',
  addButtonText: '新增',
  asin: '',
  siteId: undefined,
  type: undefined,
  data: undefined,
  filterOptions: () => [
    { label: '手动输入', value: 0 },
    { label: '系统抓取', value: 1 },
    { label: '广告', value: 2 },
    { label: '补货设定', value: 3 },
    { label: '季节系数', value: 4 },
    { label: '自动化价格', value: 5 },
  ],
  changeDetailConfig: () => ({}),
})

const selectedFilter = ref<number[]>([0, 1])
const dateRange = ref<[Date, Date] | null>(null)
const changeDetailVisible = ref<boolean>(false)
const changeDetailTitle = ref<string>('')
const changeDetailType = ref<string>('')
const changeDetailData = ref<ChangeDetailItem[]>([])
const beforeProp = ref<string>('')
const afterProp = ref<string>('')
const beforeFormatter = ref<((row: any) => string) | undefined>(undefined)
const afterFormatter = ref<((row: any) => string) | undefined>(undefined)
const remarkVisible = ref<boolean>(false)
const addRemark = ref<string>('')
// 操作日志数据
const logData = ref<LogItem[]>([])
const loading = ref<boolean>(false)
// 分页相关
const pageNo = ref<number>(1)
const pageSize = ref<number>(50)
const total = ref<number>(0)

// 类型映射：数字 -> 字符串
const typeMap: Record<number, string> = {
  0: '手动输入',
  1: '系统抓取',
  2: '广告',
  3: '补货设定',
  4: '季节系数',
  5: '自动化价格',
}

// 获取操作日志数据
const fetchOperationLog = async () => {
  // 如果提供了 data prop，则使用 data，不从接口获取
  if (props.data !== undefined) {
    logData.value = props.data
    total.value = props.data.length
    return
  }

  // 判断参数是否齐全
  if (!props.asin || props.siteId === undefined || !selectedFilter.value.length) {
    logData.value = []
    total.value = 0
    return
  }

  loading.value = true
  try {
    const requestParams: any = {
      asin: props.asin,
      siteId: props.siteId,
      type: selectedFilter.value,
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      keyWord: keyWord.value,
    }

    // 如果有日期范围，添加到请求参数
    if (dateRange.value && dateRange.value.length === 2) {
      requestParams.startDate = formatDateToString(dateRange.value[0])
      requestParams.endDate = formatDateToString(dateRange.value[1])
    }

    const { data } = await getOperationLog(requestParams)
    logData.value = data.list.map((item: IGetOperationLog) => ({
      ...item, // 保留后端所有字段
      date: item.date,
      rawType: item.type,
      type: typeMap[item.type] || '未知', // 显示用的类型文字
    }))
    total.value = data.total
  } catch (error) {
    console.error('获取操作日志数据失败:', error)
    logData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// const filteredData = computed(() => {
//   const dataSource = props.data !== undefined ? props.data : logData.value
//   if (props.data === undefined && selectedFilter.value.length > 0) {
//     return dataSource
//   }
//   if (selectedFilter.value.length === 0) {
//     return dataSource
//   }
//   return dataSource.filter((item) => {
//     const typeMapReverse: Record<string, number> = {
//       手动输入: 0,
//       系统抓取: 1,
//       广告: 2,
//     }
//     const itemTypeValue = typeMapReverse[item.type]
//     return itemTypeValue !== undefined && selectedFilter.value.includes(itemTypeValue)
//   })
// })
const filteredData = computed(() => {
  const dataSource = props.data !== undefined ? props.data : logData.value

  // 接口模式：后端已经过滤过，直接返回
  if (props.data === undefined) {
    return dataSource
  }

  // 本地数据模式：没有选择筛选条件，直接返回
  if (!selectedFilter.value.length) {
    return dataSource
  }

  const typeMapReverse: Record<string, number> = {
    手动输入: 0,
    系统抓取: 1,
    广告: 2,
  }

  return dataSource.filter((item) => {
    const itemTypeValue = typeMapReverse[item.type]
    return itemTypeValue !== undefined && selectedFilter.value.includes(itemTypeValue)
  })
})
// 处理筛选变化
const handleFilterChange = () => {
  if (props.data === undefined) {
    pageNo.value = 1
    fetchOperationLog()
  }
}

// 处理分页变化
const handleCurrentChange = (page: number) => {
  pageNo.value = page
  fetchOperationLog()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  pageNo.value = 1 // 切换每页条数时重置到第一页
  fetchOperationLog()
}

// 监听 props 变化，重新获取数据（重置到第一页）
watch(
  () => [props.asin, props.siteId],
  () => {
    if (props.data === undefined) {
      pageNo.value = 1
      fetchOperationLog()
    }
  },
  { immediate: true }
)

// 处理新增
const handleAdd = () => {
  remarkVisible.value = true
}

// 处理新增备注
const handleAddRemark = async (remark: string) => {
  if (!remark || !remark.trim()) {
    $baseMessage('请输入操作日志内容', 'warning')
    return
  }

  if (!props.asin || props.siteId === undefined) {
    $baseMessage('缺少必要参数：asin 或 siteId', 'error')
    return
  }

  loading.value = true
  try {
    await addOperationLog({
      asin: props.asin,
      siteId: props.siteId,
      content: remark.trim(),
    })
    $baseMessage('新增操作日志成功', 'success')
    addRemark.value = ''
    remarkVisible.value = false
    // 刷新列表数据
    await fetchOperationLog()
  } catch (error) {
    console.error('新增操作日志失败:', error)
    $baseMessage('新增操作日志失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

const operationLogAggregatedDetailsList = ref<IGetOperationLog[]>([])
const operationLogAggregatedDetailsLoading = ref<boolean>(false)
const operationLogAggregatedDetailsVisible = ref<boolean>(false)
const handleAggregateClick = async (row: any) => {
  if (!row.isAggregate) return
  operationLogAggregatedDetailsLoading.value = true
  operationLogAggregatedDetailsVisible.value = true
  const { data } = await getOperationLogAggregatedDetails({
    asin: props.asin,
    siteId: props.siteId ?? 0,
    date: row.date,
    aggregateType: row.aggregateType,
  })

  operationLogAggregatedDetailsList.value = data
  operationLogAggregatedDetailsLoading.value = false
}
</script>

<style lang="scss" scoped>
.operation-log-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  height: 100%;

  :deep(.el-table) {
    flex: 1;
  }

  .content-link {
    display: block;
    width: 100%;

    .content-text {
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  .change-info {
    display: flex;
    align-items: center;
    gap: 6px;

    .arrow-up {
      color: var(--el-color-danger);
      font-size: 18px;
      flex-shrink: 0;
      margin-top: -3px;
    }

    .arrow-down {
      color: var(--el-color-success);
      font-size: 18px;
      flex-shrink: 0;
      margin-top: -2px;
    }

    .create-text {
      color: var(--el-color-primary);
      font-weight: bold;
    }

    .status-open {
      color: var(--el-color-success);
      font-weight: bold;
    }

    .status-close {
      color: var(--el-color-danger);
      font-weight: bold;
    }
  }

  .campaign-name {
    color: #909399;
  }

  .parsed-content {
    :deep(.price-arrow) {
      display: inline-block;
      margin: 0 4px;
      font-size: 16px;
      font-weight: bold;

      &.price-up {
        color: var(--el-color-danger);
      }

      &.price-down {
        color: var(--el-color-success);
      }
    }

    :deep(.product-sku) {
      color: #909399;
    }
  }
}
</style>
