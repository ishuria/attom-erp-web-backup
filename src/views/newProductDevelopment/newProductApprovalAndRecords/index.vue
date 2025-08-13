<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
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
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoveTable custom-table-hover"
      :data="dataList"
      :header-cell-style="{ 'text-align': 'center' }"
      :row-class-name="stripedRowClass"
      :span-method="objectSpanMethod"
      @row-click="handleRowClick"
    >
      <el-table-column label="提交日期" min-width="115" prop="createTime">
        <template #default="{ row }">
          <span>{{ formatDate(new Date(row.createTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImage" style="display: block; width: 75px; height: 75px" @click="setPreviewList(row.skuImage)">
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" :min-width="columnWidths.sku + 30" prop="sku">
        <template #default="{ row }">
          <span :style="{ display: 'inline-block', 'min-width': columnWidths.sku + 'px', 'text-align': 'left' }">
            {{ formattedProgressLog(row.sku) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="产品" :min-width="columnWidths.productName + 30" prop="productName">
        <template #default="{ row }">
          <span :style="{ display: 'inline-block', 'min-width': columnWidths.productName + 'px', 'text-align': 'left' }">
            {{ formattedProgressLog(row.productName) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="主站点" min-width="130" prop="siteName" />
      <el-table-column label="主站首单Po" min-width="100" prop="po" />
      <el-table-column label="首单实际成本" prop="poCost" width="125" />
      <el-table-column label="审批成本" min-width="100" prop="reviewCost" />
      <el-table-column label="相差" min-width="100" prop="difference" />
      <el-table-column label="产品定位" :min-width="columnWidths.productPosition + 30" prop="productPosition" />
      <el-table-column label="Vine数量" min-width="100" prop="vineCount" />
      <el-table-column label="平面设计" min-width="90" prop="graphicDesign">
        <template #default="{ row }">
          <el-checkbox v-model="row.graphicDesign" class="custom-checkbox" :disabled="true" :false-value="0" size="large" :true-value="1" />
        </template>
      </el-table-column>
      <el-table-column label="OEM" prop="oem" width="80">
        <template #default="{ row }">
          <el-checkbox v-model="row.oem" class="custom-checkbox" :disabled="true" :false-value="0" size="large" :true-value="1" />
        </template>
      </el-table-column>

      <el-table-column label="有效计数" min-width="100" prop="effectiveCount">
        <template #default="{ row }">
          <span :style="{ display: 'inline-block', 'min-width': columnWidths.effectiveCount + 'px', 'text-align': 'right' }">
            {{ row.effectiveCount }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="产品经理" min-width="100" prop="productManager">
        <template #default="{ row }">
          <span
            :style="{ display: 'inline-block', 'min-width': columnWidths.productManager + 'px', 'text-align': 'left' }"
            v-html="row.productManager"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="产品设计" min-width="100" prop="productDesign">
        <template #default="{ row }">
          <span :style="{ display: 'inline-block', 'min-width': columnWidths.productDesign + 'px', 'text-align': 'left' }">
            {{ row.productDesign }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="立项日期" min-width="115" prop="projectInitiationDate">
        <template #default="{ row }">
          <span>{{ formatDate(new Date(row.projectInitiationDate)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批日期" min-width="115" prop="reviewDate">
        <template #default="{ row }">
          <span>{{ row.reviewDate != null ? formatDate(new Date(row.reviewDate)) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" min-width="100" prop="timeConsuming">
        <template #default="{ row }">
          <span :style="{ display: 'inline-block', 'min-width': columnWidths.timeConsuming + 'px', 'text-align': 'right' }">
            {{ row.timeConsuming }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" min-width="130" prop="reviewStatus">
        <template #default="{ row }">
          <span
            :class="generateStatus(row.reviewStatus).color"
            :style="{ display: 'inline-block', 'min-width': columnWidths.reviewStatus + 'px', 'text-align': 'left' }"
          >
            {{ generateStatus(row.reviewStatus).text }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" min-width="100" prop="reviewPersonName">
        <template #default="{ row }">
          <span :style="{ display: 'inline-block', 'min-width': columnWidths.reviewPersonName + 'px', 'text-align': 'left' }">
            {{ row.reviewPersonName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="130">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="handleOrderProcess(row)">
              {{ row.reviewStatus === 0 || row.reviewStatus === 2 ? '编辑' : '查看' }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleOrderProcess(row)">
                  <el-link type="primary" underline="never">
                    {{ row.reviewStatus === 0 || row.reviewStatus === 2 ? '编辑' : '查看' }}
                  </el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    row.reviewStatus === 1 ||
                    row.reviewStatus === 2 ||
                    row.reviewStatus === 3 ||
                    row.reviewStatus === 4 ||
                    row.reviewStatus === 5
                  "
                  @click="handleOrderReview(row)"
                >
                  <el-link type="primary" underline="never">审批和PO发布</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleGetScoreById(row.reviewMainId)">
                  <el-link type="primary" underline="never">分数明细</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
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
    <!-- 新款评估 -->
    <vab-dialog v-model="newScoreVisible" :before-close="handlerScoreCloseDialog" class="moldDialog" title="分数明细" width="90%">
      <el-divider style="margin-top: 0; margin-bottom: 20px" />
      <div id="table-height-container">
        <el-table
          ref="evaluationTableRef"
          v-loading="listLoading"
          border
          :data="newEvaluationData"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="keyWordTrendCellClick"
        >
          <el-table-column
            v-for="(item, index) in indexColumns"
            :key="index"
            align="center"
            :label="item.label"
            :min-width="item.minWidth || 100"
            :prop="item.prop"
            width="auto"
          >
            <template #default="{ row }">
              <div v-if="item.label === '关键词趋势'" style="width: 80px; height: 63px">
                <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer></template>
    </vab-dialog>
    <!-- 关键词趋势图表 -->
    <vab-trend
      :key-word="inputKeyWord"
      :trend-data="trendEcahts"
      :trend-echarts-visible="keyWordTrendEchatsVisible"
      @update:clear-input-key-word="cleanKeyWordTrendData"
      @update:trend-echarts-list="updateTrendEchatsData"
      @update:visible-value="updateTrendVisibleValue"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { TableColumnCtx, TableInstance } from 'element-plus'
import type { CSSProperties } from 'vue'
import { indexColumns } from '../newProductProgress/indexColumns'
import { getReviewEvaluationId, getReviewList } from '/@/api/devlocal/orderingReview'
import { getByIdQueryEvaluation } from '/@/api/devlocal/progress'
import type { IKeyWordTrend } from '/@/type/evaluation/evaluationType'
import type { IGetByIdQueryEvaluation } from '/@/type/progress/progressType'
import type { IReviewQueryItem, IReviewQueryReq } from '/@/type/review/review'
import { formatDate } from '/@/utils/dateUtils'
import { _setStepNo } from '/@/utils/stepNoState'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'NewProductApprovalAndRecords',
})

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.reviewMainId
}

const columnWidths = computed(() => ({
  sku: flexColumnWidth(dataList.value, 'SKU', 'sku', 0),
  productName: flexColumnWidth(dataList.value, '产品', 'productName', 0),
  effectiveCount: flexColumnWidth(dataList.value, '有效计m', 'effectiveCount', 0),
  timeConsuming: flexColumnWidth(dataList.value, '耗m', 'timeConsuming', 0),
  productManager: flexColumnWidth(dataList.value, '产品经理', 'other', 0),
  productDesign: flexColumnWidth(dataList.value, '产品设计', 'other', 0),
  reviewStatus: flexColumnWidth(dataList.value, '审批状态', 'reviewStatus', 0),
  reviewPersonName: flexColumnWidth(dataList.value, '审批人', 'other', 0),
  productPosition: flexColumnWidth(dataList.value, '产品定位', 'productPosition', 0),
}))
interface SpanMethodProps {
  row: IReviewQueryItem
  column: TableColumnCtx<IReviewQueryItem>
  rowIndex: number
  columnIndex: number
}
const router = useRouter()
const route = useRoute()
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const queryForm = reactive<IReviewQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const dataList = ref<IReviewQueryItem[]>([])
// 控制分数明细是否显示
const newScoreVisible = ref<boolean>(false)
// 根据评估id找到的新款评估信息
const newEvaluationData = ref<IGetByIdQueryEvaluation[]>([])
// 输入的关键词
const inputKeyWord = ref<string>('')
// 图表
const trendEcahts = ref<IKeyWordTrend>({
  xAxis: [],
  yAxis: [],
})
const keyWordTrendEchatsVisible = ref<boolean>(false)
const formattedProgressLog = (str: string) => {
  return str.replaceAll(/([\u4e00-\u9fa5]) ([A-Za-z])/g, '$1<br>$2').replaceAll(/([A-Za-z]) ([\u4e00-\u9fa5])/g, '$1<br>$2')
}

// 分数明细
const handleGetScoreById = async (idNo: number) => {
  const { data: evaluationId } = await getReviewEvaluationId({ reviewId: idNo })

  newScoreVisible.value = true
  const { data } = await getByIdQueryEvaluation({ idNo: evaluationId })
  newEvaluationData.value = [data]
}
const handlerScoreCloseDialog = () => {
  newScoreVisible.value = false
}
const keyWordTrendCellClick = async (row: any, column: any) => {
  if (column.label === '关键词趋势') {
    inputKeyWord.value = row.amazonFrontendKeywords
    trendEcahts.value.xAxis = row.trendList.xAxis
    trendEcahts.value.yAxis = row.trendList.yAxis
    keyWordTrendEchatsVisible.value = true
  }
}
const updateTrendVisibleValue = (newValue: boolean) => {
  keyWordTrendEchatsVisible.value = newValue
}
// 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue: string) => {
  inputKeyWord.value = newValue
  trendEcahts.value.xAxis = []
  trendEcahts.value.yAxis = []
  keyWordTrendEchatsVisible.value = false
}
const updateTrendEchatsData = (newValue: IKeyWordTrend) => {
  trendEcahts.value = newValue
}

// 审批状态对应的文本和颜色
const generateStatus = (value: number) => {
  switch (value) {
    case 0: {
      return { text: '编辑中', color: 'status-editing' }
    }
    case 1: {
      return { text: '待审核', color: 'status-editing' }
    }
    case 2: {
      return { text: '主管审批未通过', color: 'status-failed' }
    }
    case 3: {
      return { text: 'SKU创建', color: 'status-editing' }
    }
    case 4: {
      return { text: '运营分货', color: 'status-editing' }
    }
    case 5: {
      return { text: '待发布PO', color: 'status-editing' }
    }
    case 6: {
      return { text: '已完成', color: 'status-finished' }
    }
    default: {
      return { text: '未知', color: 'status-editing' }
    }
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getReviewList(queryForm)
  dataList.value = data.list!
  total.value = data.total
  listLoading.value = false
  previous = null
  currentGroupIndex = 0
}

const handleOrderReview = (row: IReviewQueryItem) => {
  // console.log(row);
  router.push({
    path: '/newProductDevelopment/orderingReview',
    query: {
      reviewId: row.reviewMainId,
      reviewStatus: row.reviewStatus,
      reviewStepNo: row.reviewStepNo,
    },
  })
}

const handleOrderProcess = (row: IReviewQueryItem) => {
  // 只有编辑的按照row的stepNo设置步骤
  if (row.reviewStatus === 0 || row.reviewStatus === 2) {
    _setStepNo(row.reviewMainId!, row.stepNo!)
  }
  router.push({
    path: '/newProductDevelopment/orderingProcess',
    query: {
      reviewStatus: row.reviewStatus,
      reviewId: row.reviewMainId,
    },
  })
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
    },
  })
  fetchData()
}

// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 修改图片预览列表
const setPreviewList = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

// 列表col合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  const label = column.label
  // 设置需要合并的列
  if (['提交日期', '图片', '立项日期', '审批日期', '耗时', '审批状态', '审批人', '操作'].includes(label)) {
    // 获取当前row的id
    const reviewMainId = row.reviewMainId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < dataList.value.length!; i++) {
      // 如果id一样需要合并
      if (dataList.value[i].reviewMainId === reviewMainId) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || dataList.value[rowIndex - 1].reviewMainId !== reviewMainId) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}

let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row

  // 直接基于 reviewMainId 的值来确定条纹，确保稳定性
  const stripedClass = row.reviewMainId % 2 === 0 ? 'el-table__row--striped' : ''

  // 选中状态
  const selectedClass = row.reviewMainId === selectedRowIndex.value ? 'select-row' : ''

  // 组合类名
  return [stripedClass, selectedClass].filter(Boolean).join(' ')
}

const cellStyle = (): CSSProperties => {
  return {
    textAlign: 'center',
  }
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  fetchData()
})
</script>

<style lang="scss" scoped>
// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.status-editing {
  color: orange;
}

.status-failed {
  color: red;
}

.status-success {
  color: black;
}

.status-finished {
  color: green;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.5px;
}
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}
:deep(.row-striped) {
  // background-color: var(--el-fill-color-lighter);
  background-color: var(--el-fill-color-lighter);
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
