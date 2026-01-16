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
          <div v-if="row.content">
            <el-link class="content-link" type="primary" @click="handleContentClick(row)">
              <span class="content-text">{{ row.content }}</span>
            </el-link>
          </div>
          <div v-else>
            <div v-if="row.entityType !== '关键词'">{{ row.entityType }}</div>
            <div v-if="row.keyWord">
              <el-tag v-if="row.keyWordType" :type="getKeyWordType(row.keyWordType)">
                {{ row.keyWordType }}
              </el-tag>
              {{ row.keyWord }}
            </div>
            <div
              v-if="!(row.entityType === '否词' && row.changeType === '创建')"
              class="change-info"
              :style="{ fontWeight: row.changeType === '竞价' ? 'bold' : 'normal' }"
            >
              <span>{{ row.changeType }}: {{ row.beforeValue }} -> {{ row.afterValue }}</span>
              <el-icon
                v-if="
                  row.changeType === '竞价' &&
                  row.beforeValue !== undefined &&
                  row.afterValue !== undefined &&
                  isValueIncreased(row.beforeValue, row.afterValue)
                "
                class="arrow-up"
              >
                <vab-icon icon="arrow-up-line" />
              </el-icon>
              <el-icon
                v-else-if="row.changeType === '竞价' && row.beforeValue !== undefined && row.afterValue !== undefined"
                class="arrow-down"
              >
                <vab-icon icon="arrow-down-line" />
              </el-icon>
            </div>
            <div v-if="row.campaignName" class="campaign-name">{{ row.campaignName }}</div>
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

    <vab-remark-dialog v-model="remarkVisible" :remark="addRemark" title="新增操作日志" @update:remark="handleAddRemark" />

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
  </div>
</template>

<script lang="ts" setup>
import { addOperationLog, getOperationLog } from '/@/api/devlocal/productAnalysis'
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
  ],
  changeDetailConfig: () => ({}),
})

const emit = defineEmits<{
  contentClick: [row: LogItem]
}>()

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
      type: typeMap[item.type] || '未知',
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

// 处理内容点击
const handleContentClick = (row: LogItem) => {
  emit('contentClick', row)

  // 如果有配置的变化详情，显示对话框
  if (props.changeDetailConfig && props.changeDetailConfig[row.content]) {
    const config = props.changeDetailConfig[row.content]
    changeDetailTitle.value = config.title
    changeDetailType.value = config.type
    changeDetailData.value = config.data || []
    beforeProp.value = config.beforeProp || ''
    afterProp.value = config.afterProp || ''
    beforeFormatter.value = config.beforeFormatter
    afterFormatter.value = config.afterFormatter
    changeDetailVisible.value = true
  }
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
      color: #f56c6c;
      font-size: 18px;
      flex-shrink: 0;
      margin-top: -3px;
    }

    .arrow-down {
      color: #67c23a;
      font-size: 18px;
      flex-shrink: 0;
      margin-top: -2px;
    }
  }

  .campaign-name {
    color: #909399;
  }
}
</style>
