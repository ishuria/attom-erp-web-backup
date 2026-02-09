<template>
  <div class="vab-search-term-performance">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
          <template #reference>
            <el-button>
              <vab-icon icon="settings-line" />
            </el-button>
          </template>
          <vab-draggable
            v-model="columns"
            :animation="600"
            filter=".non-draggable"
            handle=".handle"
            :on-end="handleEnd"
            :on-move="handleMove"
          >
            <div
              v-for="item in columns"
              :key="item.label"
              :class="{ 'non-draggable': item.disableCheck }"
              style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
            >
              <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
              <span style="flex: 1">{{ item.label }}</span>
              <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                <vab-icon icon="eye-line" />
              </span>
              <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                <vab-icon v-show="!item.checked" icon="eye-off-line" />
                <vab-icon v-show="item.checked" icon="eye-line" />
              </span>
            </div>
          </vab-draggable>
        </el-popover>
        <el-form inline @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="loading"
      border
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="headerCellStyle"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-for="(item, index) in baseColumns"
        :key="item.prop || index"
        :class-name="handleClassName(item)"
        :fixed="item.isFixed"
        :header-class-name="handleHeaderClassName(item)"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :sortable="item.sortable ? 'custom' : false"
      >
        <template #default="{ row }">
          {{ row[item.prop] }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(group, gIdx) in groupedColumns"
        :key="group.label || gIdx"
        class-name="group-split-left group-split-left--improve"
        header-class-name="group-split-left group-split-left--improve"
        :label="group.label"
      >
        <el-table-column
          v-for="(item, cIdx) in group.children"
          :key="item.prop || cIdx"
          :class-name="handleClassName(item)"
          :header-class-name="handleHeaderClassName(item)"
          :label="item.label"
          :min-width="handleWidth(item)"
          :prop="item.prop"
          :sortable="item.sortable ? 'custom' : false"
          :width="item.width"
        >
          <template #default="{ row }">
            {{ row[item.prop] }}
          </template>
        </el-table-column>
      </el-table-column>

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties, reactive, ref, watch } from 'vue'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '~/src/api/devlocal/productPerformance'
import { IGetOperationColumnList } from '~/src/type/storeOperation/productPerformanceType'
import { getSearchTermPerformance } from '/@/api/devlocal/productAnalysis'
import type { IGetSearchTermPerformance } from '/@/type/storeOperation/productAnalysisType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabSearchTermPerformance',
})

interface IProps {
  asin: string
  siteId?: number
  selectDateRange?: [string, string]
}

const props = withDefaults(defineProps<IProps>(), {})

const loading = ref<boolean>(false)
const list = ref<IGetSearchTermPerformance[]>([])
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 50,
  orderByField: '',
  orderDirection: '',
})
const total = ref<number>(0)
const columns = ref<any>([])
// 1) 给每个 prop 指定所属分组（不在这里的就是“非分组基础列”）
const groupByProp: Record<string, '' | '展现' | '点击' | '加购物车' | '购买量'> = {
  // 展现
  totalQueryImpressionCount: '展现',
  asinImpressionCount: '展现',
  asinImpressionShare: '展现',

  // 点击
  totalClickCount: '点击',
  totalClickRate: '点击',
  asinClickCount: '点击',
  asinClickShare: '点击',
  totalMedianClickPrice: '点击',
  asinMedianClickPrice: '点击',
  totalSameDayShippingClickCount: '点击',
  totalOneDayShippingClickCount: '点击',
  totalTwoDayShippingClickCount: '点击',

  // 加购物车
  totalCartAddCount: '加购物车',
  totalCartAddRate: '加购物车',
  asinCartAddCount: '加购物车',
  asinCartAddShare: '加购物车',
  totalMedianCartAddPrice: '加购物车',
  asinMedianCartAddPrice: '加购物车',
  totalSameDayShippingCartAddCount: '加购物车',
  totalOneDayShippingCartAddCount: '加购物车',
  totalTwoDayShippingCartAddCount: '加购物车',

  // 购买量
  totalPurchaseCount: '购买量',
  totalPurchaseRate: '购买量',
  asinPurchaseCount: '购买量',
  asinPurchaseShare: '购买量',
  totalMedianPurchasePrice: '购买量',
  asinMedianPurchasePrice: '购买量',
  totalSameDayShippingPurchaseCount: '购买量',
  totalOneDayShippingPurchaseCount: '购买量',
  totalTwoDayShippingPurchaseCount: '购买量',
}

// 2) 当前勾选出来的可见列（保持 columns 当前排序）
const visibleColumns = computed(() => columns.value.filter((c: any) => !!c.checked))

// 3) 非分组基础列：搜索关键词/评分/搜索量等
const baseColumns = computed(() => visibleColumns.value.filter((c: any) => !c.group))

// 4) 分组列：按固定顺序输出父表头（展现/点击/加购物车/购买量）
const groupOrder: Array<'展现' | '点击' | '加购物车' | '购买量'> = ['展现', '点击', '加购物车', '购买量']

const groupedColumns = computed(() => {
  const map = new Map<string, any[]>()

  // 按 visibleColumns 的顺序塞入（所以“组内顺序”就是你拖拽后的顺序）
  visibleColumns.value
    .filter((c: any) => c.group)
    .forEach((c: any) => {
      if (!map.has(c.group)) map.set(c.group, [])
      map.get(c.group)!.push(c)
    })

  return groupOrder
    .filter((g) => map.has(g))
    .map((g) => ({
      label: g,
      children: map.get(g)!,
    }))
})
// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  if (queryForm.orderByField === prop) {
    if (!order) {
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  fetchData()
}
const fetchData = async () => {
  // 只有当 asin 和 siteId 存在时才请求
  if (!props.asin || props.siteId === undefined) {
    list.value = []
    total.value = 0
    return
  }
  // 检查日期范围是否存在
  if (!props.selectDateRange || !props.selectDateRange[0] || !props.selectDateRange[1]) {
    list.value = []
    total.value = 0
    return
  }
  loading.value = true
  try {
    const { data } = await getSearchTermPerformance({
      asin: props.asin,
      siteId: props.siteId,
      keyWord: queryForm.keyWord,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      orderByField: queryForm.orderByField,
      orderDirection: queryForm.orderDirection,
      startDate: props.selectDateRange[0],
      endDate: props.selectDateRange[1],
    })
    list.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '搜索关键词') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}

const headerGroupMap: Record<string, { bg: string; color: string; props: string[] }> = {
  展现: {
    bg: 'var(--el-color-primary-light-9)',
    color: 'var(--el-color-primary)',
    props: ['totalQueryImpressionCount', 'asinImpressionCount', 'asinImpressionShare'],
  },
  点击: {
    bg: 'var(--el-color-warning-light-9)',
    color: 'var(--el-color-warning)',
    props: [
      'totalClickCount',
      'totalClickRate',
      'asinClickCount',
      'asinClickShare',
      'totalMedianClickPrice',
      'asinMedianClickPrice',
      'totalSameDayShippingClickCount',
      'totalOneDayShippingClickCount',
      'totalTwoDayShippingClickCount',
    ],
  },
  加购物车: {
    bg: 'var(--el-color-success-light-9)',
    color: 'var(--el-color-success)',
    props: [
      'totalCartAddCount',
      'totalCartAddRate',
      'asinCartAddCount',
      'asinCartAddShare',
      'totalMedianCartAddPrice',
      'asinMedianCartAddPrice',
      'totalSameDayShippingCartAddCount',
      'totalOneDayShippingCartAddCount',
      'totalTwoDayShippingCartAddCount',
    ],
  },
  购买量: {
    bg: 'var(--el-color-danger-light-9)',
    color: 'var(--el-color-danger)',
    props: [
      'totalPurchaseCount',
      'totalPurchaseRate',
      'asinPurchaseCount',
      'asinPurchaseShare',
      'totalMedianPurchasePrice',
      'asinMedianPurchasePrice',
      'totalSameDayShippingPurchaseCount',
      'totalOneDayShippingPurchaseCount',
      'totalTwoDayShippingPurchaseCount',
    ],
  },
}
const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const prop = data.column?.property
  const label = data.column?.label

  // 遍历分组配置
  for (const groupLabel in headerGroupMap) {
    const group = headerGroupMap[groupLabel]

    // 命中父表头（展现 / 点击 / 加购物车 / 购买量）
    if (label === groupLabel) {
      return {
        textAlign: 'center',
        backgroundColor: group.bg,
        color: group.color,
        fontWeight: 600,
      }
    }

    // 命中子列
    if (prop && group.props.includes(prop)) {
      return {
        textAlign: 'center',
        backgroundColor: group.bg,
        color: group.color,
        fontWeight: 600,
      }
    }
  }

  // 默认样式
  return {
    textAlign: 'center',
  }
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const splitProps = ['totalQueryImpressionCount', 'totalClickCount', 'totalCartAddCount', 'totalPurchaseCount']

const handleClassName = (item: any) => (splitProps.includes(item.prop) ? 'group-split-left group-split-left--improve' : '')
const handleHeaderClassName = (item: any) => (splitProps.includes(item.prop) ? 'group-split-left group-split-left--improve' : '')
// 计算并缓存列宽
const handleWidth = (item: any) => {
  let width: string | number
  switch (item.label) {
    case '搜索关键词': {
      width = flexColumnWidth(list.value, '搜索关键词', 'searchQuery')
      break
    }
    default: {
      width = item.minWidth
      break
    }
  }
  return width
}

const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 18 })
  columns.value = data
  columns.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width

    // 新增：写入所属分组
    ;(item as any).group = groupByProp[(item as any).prop] || ''

    if (
      [
        'searchQueryVolume',
        'totalQueryImpressionCount',
        'asinImpressionCount',
        'asinImpressionShare',
        'totalClickCount',
        'asinClickCount',
      ].includes((item as any).prop)
    ) {
      ;(item as any).sortable = true
    }

    if (['searchQuery'].includes((item as any).prop)) {
      ;(item as any).isFixed = 'left'
    }
  })
}
watch(
  () => [props.asin, props.siteId, props.selectDateRange],
  () => {
    queryForm.pageNo = 1
    fetchColumn()
    fetchData()
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.vab-search-term-performance {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .el-table {
    flex: 1;
  }
}
/* 每组左侧分割线：表头 + body */
:deep(.group-split-left) {
  border-left: 3px solid var(--el-border-color) !important;
}
:deep(.group-split-left--line) {
  border-left-color: var(--el-border-color) !important;
}
.handle {
  cursor: grab;
}
.disabled-handle {
  cursor: not-allowed;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}
</style>
