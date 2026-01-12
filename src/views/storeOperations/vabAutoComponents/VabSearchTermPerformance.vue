<template>
  <div class="vab-search-term-performance">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
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
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column
        fixed="left"
        label="搜索关键词"
        min-width="110"
        prop="searchQuery"
        :width="flexColumnWidth(list, '搜索关键词', 'searchQuery')"
      />
      <el-table-column label="搜索关键词评分" min-width="110" prop="searchQueryScore" />
      <el-table-column label="关键词搜索量" min-width="130" prop="searchQueryVolume" sortable="custom" />
      <el-table-column label="关键词总曝光量" min-width="100" prop="totalQueryImpressionCount" sortable="custom" />
      <el-table-column label="商品曝光量" min-width="130" prop="asinImpressionCount" sortable="custom" />
      <el-table-column label="商品曝光占比（%）" min-width="130" prop="asinImpressionShare" sortable="custom" />
      <el-table-column label="关键词总点击量" min-width="100" prop="totalClickCount" sortable="custom" />
      <el-table-column label="总点击率（%）" min-width="110" prop="totalClickRate" />
      <el-table-column label="商品点击量" min-width="130" prop="asinClickCount" sortable="custom" />
      <el-table-column label="商品点击占比（%）" min-width="120" prop="asinClickShare" />
      <el-table-column label="关键词中位点击价（金额）" min-width="140" prop="totalMedianClickPrice" />
      <el-table-column label="商品中位点击价（金额）" min-width="140" prop="asinMedianClickPrice" />
      <el-table-column label="当日达点击量" min-width="120" prop="totalSameDayShippingClickCount" />
      <el-table-column label="次日达点击量" min-width="120" prop="totalOneDayShippingClickCount" />
      <el-table-column label="两日达点击量" min-width="120" prop="totalTwoDayShippingClickCount" />
      <el-table-column label="关键词总加购量" min-width="100" prop="totalCartAddCount" />
      <el-table-column label="总加购率（%）" min-width="100" prop="totalCartAddRate" />
      <el-table-column label="商品加购量" min-width="110" prop="asinCartAddCount" />
      <el-table-column label="商品加购占比（%）" min-width="120" prop="asinCartAddShare" />
      <el-table-column label="关键词中位加购价（金额）" min-width="140" prop="totalMedianCartAddPrice" />
      <el-table-column label="商品中位加购价（金额）" min-width="140" prop="asinMedianCartAddPrice" />
      <el-table-column label="当日达加购量" min-width="120" prop="totalSameDayShippingCartAddCount" />
      <el-table-column label="次日达加购量" min-width="120" prop="totalOneDayShippingCartAddCount" />
      <el-table-column label="两日达加购量" min-width="120" prop="totalTwoDayShippingCartAddCount" />
      <el-table-column label="关键词总购买量" min-width="100" prop="totalPurchaseCount" />
      <el-table-column label="总购买率（%）" min-width="110" prop="totalPurchaseRate" />
      <el-table-column label="商品购买量" min-width="110" prop="asinPurchaseCount" />
      <el-table-column label="商品购买占比（%）" min-width="120" prop="asinPurchaseShare" />
      <el-table-column label="关键词中位购买价（金额）" min-width="140" prop="totalMedianPurchasePrice" />
      <el-table-column label="商品中位购买价（金额）" min-width="140" prop="asinMedianPurchasePrice" />
      <el-table-column label="当日达购买量" min-width="120" prop="totalSameDayShippingPurchaseCount" />
      <el-table-column label="次日达购买量" min-width="120" prop="totalOneDayShippingPurchaseCount" />
      <el-table-column label="两日达购买量" min-width="120" prop="totalTwoDayShippingPurchaseCount" />
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

watch(
  () => [props.asin, props.siteId, props.selectDateRange],
  () => {
    queryForm.pageNo = 1
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
</style>
