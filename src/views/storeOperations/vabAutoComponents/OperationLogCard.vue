<template>
  <div class="operation-log-card">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-text>{{ title }}</el-text>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">{{ addButtonText }}</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline>
          <el-form-item label="筛选展示">
            <el-select v-model="selectedFilter" @change="handleFilterChange">
              <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="loading"
      border
      :data="filteredData"
      :header-cell-style="{ textAlign: 'center' }"
      max-height="700"
      stripe
      style="flex: 1"
    >
      <el-table-column align="center" label="日期" prop="date" width="115" />
      <el-table-column align="center" label="类型" prop="type" width="90" />
      <el-table-column label="内容" min-width="170" prop="content">
        <template #default="{ row }">
          <el-link type="primary" @click="handleContentClick(row)">{{ row.content }}</el-link>
          <!-- {{ row.content }} -->
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

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
import { getOperationLog } from '/@/api/devlocal/productAnalysis'
import type { IGetOperationLog } from '/@/type/storeOperation/productAnalysisType'

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
  type?: number
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

const props = withDefaults(defineProps<Props>(), {
  title: '操作日志/事件清单',
  addButtonText: '新增',
  asin: '',
  siteId: undefined,
  type: undefined,
  data: undefined,
  filterOptions: () => [
    { label: '全部', value: -1 },
    { label: '手动输入', value: 0 },
    { label: '系统抓取', value: 1 },
    { label: 'SP广告', value: 2 },
  ],
  changeDetailConfig: () => ({}),
})

const emit = defineEmits<{
  add: []
  contentClick: [row: LogItem]
}>()

const selectedFilter = ref<number | string>(-1)
const changeDetailVisible = ref<boolean>(false)
const changeDetailTitle = ref<string>('')
const changeDetailType = ref<string>('')
const changeDetailData = ref<ChangeDetailItem[]>([])
const beforeProp = ref<string>('')
const afterProp = ref<string>('')
const beforeFormatter = ref<((row: any) => string) | undefined>(undefined)
const afterFormatter = ref<((row: any) => string) | undefined>(undefined)

// 操作日志数据
const logData = ref<LogItem[]>([])
const loading = ref<boolean>(false)
// 分页相关
const pageNo = ref<number>(1)
const pageSize = ref<number>(50)
const total = ref<number>(0)
// 表格引用
const tableRef = ref()

// 类型映射：数字 -> 字符串
const typeMap: Record<number, string> = {
  0: '手动输入',
  1: '系统抓取',
  2: 'SP广告',
}

// 获取操作日志数据
const fetchOperationLog = async () => {
  // 如果提供了 data prop，则使用 data，不从接口获取
  if (props.data !== undefined) {
    logData.value = props.data
    total.value = props.data.length
    return
  }

  // 如果没有提供必要的参数，不请求
  if (!props.asin || props.siteId === undefined || props.type === undefined) {
    logData.value = []
    total.value = 0
    return
  }

  loading.value = true
  try {
    const { data } = await getOperationLog({
      asin: props.asin,
      siteId: props.siteId,
      type:
        selectedFilter.value !== -1
          ? typeof selectedFilter.value === 'number'
            ? selectedFilter.value
            : Number(selectedFilter.value)
          : props.type,
      pageNo: pageNo.value,
      pageSize: pageSize.value,
    })
    // 将接口返回的数据映射到组件需要的格式
    logData.value = data.list.map((item: IGetOperationLog) => ({
      date: item.date,
      type: typeMap[item.type] || '未知',
      content: item.content,
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

// 筛选后的数据（如果使用接口数据，筛选应该在接口层面处理，这里保留前端筛选逻辑用于 data prop）
const filteredData = computed(() => {
  const dataSource = props.data !== undefined ? props.data : logData.value
  // 如果使用接口数据，且筛选不是"全部"，需要重新请求接口
  if (props.data === undefined && selectedFilter.value !== -1) {
    // 筛选逻辑在接口层面处理，这里直接返回数据
    return dataSource
  }
  if (selectedFilter.value === -1) {
    return dataSource
  }
  // 根据类型筛选（仅用于 data prop 的情况）
  return dataSource.filter((item) => {
    // 如果 type 是字符串，需要映射到数值
    const typeMapReverse: Record<string, number> = {
      手动输入: 0,
      系统抓取: 1,
      SP广告: 2,
      广告: 2,
    }
    const itemTypeValue = typeMapReverse[item.type]
    return itemTypeValue !== undefined && itemTypeValue === selectedFilter.value
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
  () => [props.asin, props.siteId, props.type],
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
  emit('add')
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
  height: 100%;

  .vab-query-form {
    flex-shrink: 0;
  }

  :deep(.el-table) {
    flex: 1;
  }

  .vab-pagination {
    flex-shrink: 0;
    padding: 16px 0;
    margin-top: 8px;
  }
}
</style>
