<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="站点">
            <el-select
              v-model="site"
              class="multiple-select"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="全部站点"
              style="width: 250px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" @change="queryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button :icon="Filter" :type="hasFilter ? 'warning' : 'primary'" @click="filterVisible = true">筛选</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
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
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              class="search-input"
              clearable
              placeholder="请输入搜索关键词"
              @input="debouncedQueryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :default-sort="{ prop: 'originalNowSupplement', order: 'descending' }"
      :header-cell-class-name="headerStyle"
      :header-cell-style="{ textAlign: 'center' }"
      height="calc(100vh - 260px)"
      :row-class-name="tableRowClassName"
      :row-key="(row) => row.id"
      @cell-click="cellClick"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-for="(item, index) in checkList"
        :key="index"
        :class-name="item.label === '最近入库' ? 'recent-inbound-col' : ''"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :sortable="item.sortable ? 'custom' : false"
        :width="item.width"
      >
        <template #header>
          <span v-if="item.label === '库存可售'">
            库存
            <br />
            可售
          </span>
          <span v-if="item.label === '可售含在途'">
            可售
            <br />
            含在途
          </span>
          <span v-if="item.label === '月广告%'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                月广告%
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">月广告销售占比</div>
              </template>
            </el-tooltip>
          </span>
          <span v-if="item.label === '原始今补'">
            原始
            <br />
            今补
          </span>
          <span v-if="item.label === '剩余库存'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                剩余库存
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">总库存(接收中)/可售库存</div>
              </template>
            </el-tooltip>
          </span>
          <span v-if="item.label === '月净利率'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                月净利
                <el-icon><question-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">过去30天的结算净利润率</div>
              </template>
            </el-tooltip>
          </span>
          <span v-if="item.label === '春节最晚订货日'">
            春节最晚
            <br />
            订货日
          </span>
        </template>
        <template #default="{ row }">
          <!-- 简单文本字段 -->
          <template v-if="isSimpleTextField(item.label)">
            {{ getSimpleTextContent(row, item) }}
          </template>

          <!-- 图片字段 -->
          <img
            v-else-if="item.label === '图片'"
            loading="lazy"
            :src="row.skuImgUrl"
            style="object-fit: cover; width: 75px; height: 75px; cursor: pointer"
            @click="imagePreviewShow(row.skuImgUrl)"
          />

          <!-- SKU 字段 -->
          <el-tooltip v-else-if="item.label === 'SKU'" content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._skuFull }}</div>
            </template>
            <span v-html="row._sku"></span>
          </el-tooltip>

          <!-- 图表字段 -->
          <div v-else-if="item.label === '销量趋势(点击看明细)'" style="width: 100%; height: 59px">
            <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
          </div>
          <div v-else-if="item.label === '季节趋势'" style="width: 100%; height: 50px">
            <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="row._actualList || []" />
          </div>

          <!-- 选择器字段 -->
          <el-select
            v-else-if="item.label === '运营分类'"
            v-model="row.operationTypeId"
            style="min-width: 100%"
            @change="handleUpdateAsinOpeType(row)"
          >
            <el-option v-for="select in row.operationTypeList" :key="select.id" :label="select.label" :value="select.id" />
          </el-select>

          <!-- 按钮字段 -->
          <el-button v-else-if="item.label === '操作'" type="primary" @click="handleShowReleaseOrder(row)">发布订货</el-button>

          <!-- 多行文本字段 -->
          <div v-else-if="item.label === '剩余库存'">
            {{ row.fbaCount }}
            <span style="color: var(--el-color-warning)">
              {{ row.acceptingCount === 0 || row.acceptingCount === null ? '' : `(${row.acceptingCount})` }}
            </span>
            / {{ row.availableInventory }}
          </div>
          <div v-else-if="item.label === '订货#'">
            {{ row.orderCount }}
            <br />
            <span style="font-weight: bold">{{ row.orderTotalNumber }}</span>
          </div>

          <!-- HTML 内容字段 -->
          <span v-else-if="item.label === '库龄'" v-html="row.storageAge"></span>

          <!-- 断货字段 -->
          <el-text v-else-if="item.label === '断货'" :type="getOutOfStockType(row.outOfStock)">{{ row.outOfStock }}天</el-text>

          <!-- 最近入库 -->
          <div v-else-if="item.label === '最近入库'">
            {{ row.recentlyInboundStorage }}
          </div>

          <!-- 订货备注 -->
          <div v-else-if="item.label === '订货备注'">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.orderRemark }}</div>
              </template>
              <div class="multi-line-ellipsis">{{ row.orderRemark }}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 筛选 -->
    <vab-dialog v-model="filterVisible" title="筛选" width="25%">
      <el-form ref="filterFormRef" label-position="right" label-width="auto" :model="filterForm" style="width: 100%; margin-right: 10px">
        <el-form-item label="交期">
          <div class="flex">
            <el-input-number v-model="filterForm.minAvgTime" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.maxAvgTime" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="上新天数">
          <div class="flex">
            <el-input-number v-model="filterForm.minNewArrivalDay" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.maxNewArrivalDay" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="库存可售">
          <div class="flex">
            <el-input-number v-model="filterForm.minEs" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.maxEs" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="库存可售含在途">
          <div class="flex">
            <el-input-number v-model="filterForm.minEsAvailableSaleDayTotal" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.maxEsAvailableSaleDayTotal" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="上海签收">
          <div class="flex">
            <el-input-number v-model="filterForm.minSign" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.maxSign" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="断货天数">
          <div class="flex">
            <el-input-number v-model="filterForm.outOfStockMin" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.outOfStockMax" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="推荐数量">
          <div class="flex">
            <el-input-number v-model="filterForm.recommendCountMin" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.recommendCountMax" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="可认领数量">
          <div class="flex">
            <el-input-number v-model="filterForm.totalClaimCountMin" :min="0" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="filterForm.totalClaimCountMax" :min="0" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="最晚补货">
          <div class="flex">
            <el-date-picker
              :key="latestDateKey"
              v-model="latestDate"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
            />
          </div>
        </el-form-item>
        <el-form-item label="春节最晚订货日">
          <div class="flex">
            <el-date-picker
              :key="springFestivalOrderDeadlineKey"
              v-model="springFestivalOrderDeadline"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
            />
          </div>
        </el-form-item>
        <el-form-item label="广告">
          <el-select v-model="filterForm.advStatus" clearable placeholder="请选择广告状态">
            <el-option v-for="item in adStatusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="handleResetFilter">清空</el-button>
        <el-button @click="filterVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmFilter">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 平滑指数设定 -->
    <vab-dialog v-model="smoothSettingVisible" title="平滑指数设定" width="20%">
      <el-form label-position="top" :model="smoothForm">
        <el-form-item label="平滑指数" prop="smoothness">
          <el-input v-model="smoothForm.smoothness" type="number" />
        </el-form-item>
        <el-form-item label="新款平滑指数设定" prop="newSmoothness">
          <el-input v-model="smoothForm.newSmoothness" type="number" />
        </el-form-item>
        <el-form-item label="上新天数设定" prop="newProductDays">
          <el-input v-model="smoothForm.newProductDays" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="smoothSettingVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpdateSmooth">确定</el-button>
      </template>
    </vab-dialog>

    <!-- 发布订货 -->
    <vab-release-order-dialog
      ref="releaseOrderDialogRef"
      v-model="releaseOrderVisible"
      :loading="orderListLoading"
      :sku-list="skuList"
      @confirm="handleReleaseOrder"
      @image-preview="imagePreviewShow"
      @switch-sku="handleSwitchSku"
    />
    <!-- 季节趋势 -->
    <vab-dialog v-model="seasonalVisible" title="季节趋势" width="40%" @open="handleSeasonalOpened">
      <div ref="chartContainer1" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 订货表 -->
    <vab-product-order-table v-model="productOrderTableVisible" :list="productOrderTableList" />
    <!-- 订货备注 -->
    <vab-dialog v-model="remarkVisible" title="订货备注" width="20%" @opened="handleDialogOpened">
      <el-input ref="inputRef" v-model="remark" placeholder="请输入订货备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateOrderRemark">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { Filter, QuestionFilled, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CheckboxValueType, ElInput, FormInstance, TableInstance } from 'element-plus'
import { debounce } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { adStatusOption, months } from '../../constantOption.ts'
import { getDistributionOptionUserList } from '/@/api/devlocal/productDistribution'
import {
  getOperationOrderSku,
  getOperationOrderSmoothness,
  getOperationOrderSpringFestival,
  getOperationOrderTable,
  getOperationWalmartOrderList,
  releaseOperationPlanPo,
  updateOperationOrderSmoothness,
  updateOperationOrderSpringFestival,
} from '/@/api/devlocal/productOrdering'
import {
  getOperationColumnList,
  getWalmartSiteList,
  hideOrShowOperationColumn,
  updateOperationASINOperateTypeList,
  updateOrderRemarkWalmartOperation,
  updateSortOperationColumn,
} from '/@/api/devlocal/productPerformance'
import { ROLE_BOSS_CODE, ROLE_ECOMMERCEOPERATIONLEAD_CODE, ROLE_ECOMMERCEOPERATOR_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user.ts'
import type { IGetOperationOrderList, IGetOperationOrderTable } from '/@/type/storeOperation/productOrdering'
import { IGetOperationColumnList } from '/@/type/storeOperation/productPerformanceType'
import { getAmazonStars, handleImgUrl } from '/@/utils/rate'
import { _addData } from '/@/utils/skuOptions'
import { calculateBrColumnWidth, flexColumnWidth, processField } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductOrderWalmart',
})

const productOrderTableList = ref<IGetOperationOrderTable[]>([])
const router = useRouter()
const route = useRoute()
const smoothSettingVisible = ref<boolean>(false)
const quantityCheckVisible = ref<boolean>(false)
const stockUpVisible = ref<boolean>(false)
const stockUpForm = reactive<any>({})
const filterVisible = ref<boolean>(false)
const filterForm = reactive<any>({})
const hasFilter = computed(() => {
  return (
    filterForm.minAvgTime != null ||
    filterForm.maxAvgTime != null ||
    filterForm.minNewArrivalDay != null ||
    filterForm.maxNewArrivalDay != null ||
    filterForm.minEs != null ||
    filterForm.maxEs != null ||
    filterForm.minEsAvailableSaleDayTotal != null ||
    filterForm.maxEsAvailableSaleDayTotal != null ||
    filterForm.minSign != null ||
    filterForm.maxSign != null ||
    filterForm.outOfStockMin != null ||
    filterForm.outOfStockMax != null ||
    filterForm.recommendCountMin != null ||
    filterForm.recommendCountMax != null ||
    filterForm.totalClaimCountMin != null ||
    filterForm.totalClaimCountMax != null ||
    (latestDate.value && latestDate.value.length > 0) ||
    (springFestivalOrderDeadline.value && springFestivalOrderDeadline.value.length > 0) ||
    filterForm.advStatus != null
  )
})
const filterFormRef = ref<FormInstance>()

const remarkVisible = ref<boolean>(false)
// 列宽缓存
const columnWidthCache = ref<Map<string, string>>(new Map())

// 判断是否为简单文本字段
const isSimpleTextField = (label: string) => {
  return [
    '今补',
    '今补广',
    '月净利润',
    '月销售额',
    '月净利率',
    'PASIN毛利率',
    '半年有货率',
    '毛利率',
    '月广告%',
    '月ACOS',
    '月TACOS',
    '月退货%',
    '库存可售',
    '可售含在途',
    '最近入库',
    '产品描述',
    '签收',
  ].includes(label)
}

// 获取简单文本字段的内容
const getSimpleTextContent = (row: any, item: any) => {
  const { label, prop } = item

  // 基本字段
  if (['今补', '今补广', '最近入库', '产品描述', '签收'].includes(label)) {
    // 允许0值，只排除null和undefined
    return row[prop] !== null && row[prop] !== undefined ? row[prop] : ''
  }

  // 天数字段
  if (label3.includes(label)) {
    const propKey = label3Map.get(label)
    const value = propKey ? row[propKey] : null
    return value != null ? value + '天' : ''
  }

  // 货币字段
  if (['月净利润', '月销售额'].includes(label)) {
    // 允许0值，只排除null和undefined
    return row[prop] !== null && row[prop] !== undefined ? row.currencyIcon + row[prop] : ''
  }

  // 百分比字段
  if (label === '月净利率') {
    return row.monthNetProfitMargin !== null && row.monthNetProfitMargin !== undefined
      ? (row.monthNetProfitMargin * 100).toFixed(2) + '%'
      : ''
  }

  if (label === 'PASIN毛利率') {
    return row.pAsinMonthNetProfitMargin !== null && row.pAsinMonthNetProfitMargin !== undefined
      ? (row.pAsinMonthNetProfitMargin * 100).toFixed(2) + '%'
      : ''
  }

  if (label === '毛利率') {
    return row.grossProfit !== null && row.grossProfit !== undefined ? (row.grossProfit * 100).toFixed(2) + '%' : ''
  }

  if (label === '半年有货率') {
    return row.availableRate !== null && row.availableRate !== undefined ? row.availableRate.toFixed(0) + '%' : ''
  }

  // 其他百分比字段
  if (['月广告%', '月ACOS', '月TACOS', '月退货%'].includes(label)) {
    const propKey = labelMap.get(label)
    const value = propKey ? row[propKey] : null
    return value !== null && value !== undefined ? value.toFixed(2) + '%' : ''
  }

  return ''
}

// 获取断货状态类型
const getOutOfStockType = (outOfStock: number) => {
  if (outOfStock >= 5) return 'danger'
  if (outOfStock > 0 && outOfStock < 5) return 'warning'
  return 'success'
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  operationUserId: -1,
  sites: '',
  orderByField: 'originalNowSupplement',
  orderDirection: 'desc',
})
const total = ref<number>(0)
const site = ref<number[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
const operateUserList = ref<{ id: number; label: string }[]>([])
const list = ref<IGetOperationOrderList[]>([])
const getCurrentMonthIndex = () => {
  return new Date().getMonth() // 获取当前月份索引(0-11)
}
const currentUser = useUserStore().getUsername
const seasonalXData = computed(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const currentMonthIndex = getCurrentMonthIndex()
  // 从当前月份开始重新排列月份数组
  return [...months.slice(currentMonthIndex), ...months.slice(0, currentMonthIndex)]
})
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const latestDate = ref<string[]>([])
const latestDateKey = computed(() => (latestDate.value && latestDate.value.length ? latestDate.value.join('|') : 'empty'))
const springFestivalOrderDeadline = ref<string[]>([])
const springFestivalOrderDeadlineKey = computed(() =>
  springFestivalOrderDeadline.value && springFestivalOrderDeadline.value.length ? springFestivalOrderDeadline.value.join('|') : 'empty'
)
const label = ['毛利率', '月广告%', '月ACOS', '月TACOS', '月退货%']
const label3 = ['库存可售', '可售含在途']
const labelMap = new Map([
  ['毛利率', 'grossProfit'],
  ['月广告%', 'monthAdv'],
  ['月ACOS', 'monthAcos'],
  ['月TACOS', 'monthTacos'],
  ['月退货%', 'monthReturnGoods'],
])
const label3Map = new Map([
  ['库存可售', 'esAvailableSaleDay'],
  ['可售含在途', 'esAvailableSaleDayTotal'],
])
const releaseOrderVisible = ref<boolean>(false)
// 发布订货表单

// 发布订货里面的sku列表
const skuList = ref<{ value: string; label: string }[]>([])

const smoothForm = reactive<any>({})
const orderListLoading = ref<boolean>(false)

const currentRoleCode = useAclStore().getRole[0]
const canViewSalesTrendDetail = computed(() => {
  return (
    currentRoleCode === ROLE_BOSS_CODE ||
    currentRoleCode === ROLE_ECOMMERCEOPERATOR_CODE ||
    currentRoleCode == ROLE_ECOMMERCEOPERATIONLEAD_CODE
  )
})
// 添加选中行的 ID
const currentRowId = ref<number | undefined>(undefined)

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
  queryForm.orderByField = prop
  // queryForm.orderDirection = order === 'ascending' ? 'asc' : 'desc'
  if (!order) {
    if (queryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (queryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}
const handleRowClick = (row: any, column: any, event: Event) => {
  currentRowId.value = row.id
}
const seasonalVisible = ref<boolean>(false)
let _seasonalCoefficient = {
  actualList: [],
  referenceList: [],
}
const productOrderTableVisible = ref<boolean>(false)
const option1 = ref<any>({})
const cellClick = async (row: any, column: any) => {
  const label = column.label
  switch (label) {
    case '销量趋势(点击看明细)': {
      if (!canViewSalesTrendDetail.value) {
        $baseMessage('仅运营角色和BOSS可以查看明细', 'warning')
        return
      }
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 0,
          field: 1,
          sku: row.sku,
          asin: row.asin,
          site: row.site,
        },
      })
      _addData(row)
      break
    }
    case '季节趋势': {
      seasonalVisible.value = true
      _seasonalCoefficient = row.seasonalCoefficient
      break
    }
    case '订货#': {
      productOrderTableVisible.value = true
      const { data } = await getOperationOrderTable({
        sku: row.sku,
        site: row.site,
      })
      productOrderTableList.value = data
      break
    }
    case '订货备注': {
      showRemark(row)
      break
    }
    // No default
  }
}
const _row = ref<any>({})
const remark = ref<string>('')
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)

const showRemark = (row: any) => {
  _row.value = row
  remark.value = row.orderRemark
  remarkVisible.value = true
}
const handleDialogOpened = () => {
  const textarea = inputRef.value?.$el.querySelector('textarea') as HTMLTextAreaElement
  if (textarea) {
    textarea.focus()
    textarea.setSelectionRange(0, 0) // 光标定位到开头
  }
}
const confirmUpdateOrderRemark = async () => {
  const { data } = await updateOrderRemarkWalmartOperation({
    id: _row.value.id,
    remark: remark.value,
  })
  if (data) {
    $baseMessage('订货备注修改成功！', 'success')
    remarkVisible.value = false
    _row.value.orderRemark = remark.value
  }
}
const initChart1 = () => {
  option1.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: _seasonalCoefficient.actualList,
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: _seasonalCoefficient.referenceList,
        itemStyle: {
          color: '#ff8fa5',
        },
        smooth: true,
      },
    ],
  }

  chartInstance1?.setOption(option1.value)
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === currentRowId.value) {
    return 'warning-row'
  }
  return ''
}
const operationSelect = () => {
  const role = currentRoleCode
  switch (role) {
    // 老板和运营主管
    case 'ROLE_BOSS':
    case 'ROLE_ECOMMERCEOPERATIONLEAD': {
      break
    }
    // 运营
    case 'ROLE_ECOMMERCEOPERATOR': {
      break
    }
    // No default
  }
}
// 确定修改春节备货
const handleConfirmSpringFestival = async () => {
  const { data } = await updateOperationOrderSpringFestival(stockUpForm)
  if (data === 0) {
    $baseMessage('触发成功！', 'success')
    stockUpVisible.value = false
  } else if (data === -1) {
    $baseMessage('有任务执行中', 'warning')
  } else if (data === null) {
    $baseMessage('修改成功', 'success')
  }
}
// 打开春节备货
const handleOpenSpringFestival = async () => {
  stockUpVisible.value = true
  const { data } = await getOperationOrderSpringFestival()
  Object.assign(stockUpForm, data)
}
// 确认修改平滑指数
const handleConfirmUpdateSmooth = async () => {
  const { data } = await updateOperationOrderSmoothness(smoothForm)
  if (data) {
    $baseMessage('修改平滑指数成功！', 'success')
    smoothSettingVisible.value = false
  }
}
// 打开平滑指数
const handleOpenSmooth = async () => {
  smoothSettingVisible.value = true
  const { data } = await getOperationOrderSmoothness()
  Object.assign(smoothForm, data)
}
// 确认发布订货
const handleReleaseOrder = async (formData: any) => {
  if (!formData.sku) {
    $baseMessage('请选择SKU', 'warning')
    return
  }
  // 先判断是否有可认领数量
  if (formData.totalClaimCount > 0) {
    $baseMessage('有其他站点多订数量，需要先认领完再订货。认领流程：去打包任务拆分需要订货的数量并将站点改为自己的站点。', 'error')
    return
  }
  if (!formData.number) {
    $baseMessage('请填写订货数量', 'warning')
    return
  }
  try {
    // 先关闭弹窗,提升体验
    releaseOrderVisible.value = false

    const { data } = await releaseOperationPlanPo({
      asinId: null,
      sku: formData.sku,
      number: formData.number,
      asin: copyRow.asin,
      site: copyRow.site,
    })

    if (data) {
      $baseMessage('发布订货成功！', 'success')

      // 延迟一小段时间后再更新数据，给UI足够的时间响应
      setTimeout(() => {
        copyRow.nowSupplementAdvCalcu = data.nowSupplementAdvCalcu
        copyRow.nowSupplementCalcu = data.nowSupplementCalcu
        copyRow.planPoPurchaseSkuNumber = data.planPoPurchaseSkuNumber
      }, 100)
    }
  } catch (error) {
    console.error('发布订货失败:', error)
    $baseMessage('发布订货失败，请重试', 'error')
    // 失败时重新打开弹窗
    releaseOrderVisible.value = true
  }
}
let copyRow: IGetOperationOrderList
const releaseOrderDialogRef = ref()

const handleSwitchSku = async (sku: string) => {
  const { data } = await getOperationOrderSku({
    id: copyRow.id!,
    sku: sku,
    asin: copyRow.asin,
    site: copyRow.site,
  })

  // 更新组件中的表单数据
  if (releaseOrderDialogRef.value) {
    releaseOrderDialogRef.value.setFormData(data)
  }
}
// 打开发布订货
const handleShowReleaseOrder = async (row: IGetOperationOrderList) => {
  currentRowId.value = row.id
  copyRow = row

  // 先显示弹窗和loading状态，提升用户体验
  releaseOrderVisible.value = true
  orderListLoading.value = true

  try {
    if (row.sku) {
      // 确保skuArray 是一个没有空值的数组
      const skuArray = row.sku?.trim().split(',').filter(Boolean) || []

      skuList.value = skuArray.map((item) => {
        return {
          label: item,
          value: item,
        }
      })

      // 修复：检查SKU是否包含搜索关键词
      const matchSkus = skuList.value.filter((item) => item.value.toLowerCase().includes(queryForm.keyWord.toLowerCase()))

      if (matchSkus.length > 0) {
        // 如果有多个匹配，可以选择最匹配的或者第一个
        const selectedSku = matchSkus[0].value

        const { data } = await getOperationOrderSku({
          id: row.id!,
          sku: selectedSku,
          asin: row.asin,
          site: row.site,
        })

        // 通过组件实例设置表单数据
        if (releaseOrderDialogRef.value) {
          releaseOrderDialogRef.value.setFormData(data)
        }
      } else {
        // 如果没有匹配的SKU，重置表单
        if (releaseOrderDialogRef.value) {
          releaseOrderDialogRef.value.resetForm()
        }
      }
    } else {
      skuList.value = []
      // 重置组件表单数据
      if (releaseOrderDialogRef.value) {
        releaseOrderDialogRef.value.resetForm()
      }
    }
  } catch (error) {
    console.error('获取SKU数据失败:', error)
    $baseMessage('获取SKU数据失败，请重试', 'error')
    // 出错时重置表单
    if (releaseOrderDialogRef.value) {
      releaseOrderDialogRef.value.resetForm()
    }
  } finally {
    orderListLoading.value = false
  }
}
// 修改运营分类
const handleUpdateAsinOpeType = async (row: IGetOperationOrderList) => {
  await updateOperationASINOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!,
  })
}
// 清空筛选
const handleResetFilter = () => {
  // 清空弹窗中的临时筛选数据
  filterForm.minAvgTime = undefined
  filterForm.maxAvgTime = undefined
  filterForm.minNewArrivalDay = undefined
  filterForm.maxNewArrivalDay = undefined
  filterForm.minEs = undefined
  filterForm.maxEs = undefined
  filterForm.minEsAvailableSaleDayTotal = undefined
  filterForm.maxEsAvailableSaleDayTotal = undefined
  filterForm.minSign = undefined
  filterForm.maxSign = undefined
  filterForm.outOfStockMin = undefined
  filterForm.outOfStockMax = undefined
  filterForm.recommendCountMin = undefined
  filterForm.recommendCountMax = undefined
  filterForm.totalClaimCountMin = undefined
  filterForm.totalClaimCountMax = undefined
  latestDate.value = []
  springFestivalOrderDeadline.value = []
  filterForm.advStatus = undefined
}
// 确认筛选
const handleConfirmFilter = async () => {
  // 将弹窗的筛选条件应用到查询表单
  Object.assign(queryForm, filterForm)
  queryForm.startLatestDate = latestDate.value[0] || ''
  queryForm.endLatestDate = latestDate.value[1] || ''

  queryForm.startSpringOrderDate = springFestivalOrderDeadline.value[0] || ''
  queryForm.endSpringOrderDate = springFestivalOrderDeadline.value[1] || ''

  queryForm.pageNo = 1
  queryForm.pageSize = 20

  filterVisible.value = false
  queryData()
}
// 计算并缓存列宽
const calculateColumnWidth = (item: any) => {
  const cacheKey = item.label

  // 检查缓存
  if (columnWidthCache.value.has(cacheKey)) {
    return columnWidthCache.value.get(cacheKey)
  }

  let width: string | number

  switch (item.label) {
    case 'SKU': {
      width = calculateBrColumnWidth(list.value, (row: any) => row._sku, 100)
      break
    }
    case '库存可售': {
      width = flexColumnWidth(list.value, '库存', 'esAvailableSaleDay', 40)
      break
    }
    case '可售含在途': {
      width = flexColumnWidth(list.value, '含在途', 'esAvailableSaleDayTotal', 50)
      break
    }
    case '运营分类': {
      width = flexColumnWidth(list.value, '运营分类', 'operationTypeList', 60) // 处理运营分类列
      break
    }
    case '站点': {
      width = flexColumnWidth(list.value, '站点', 'siteName') // 处理运营分类列
      break
    }
    case '今补': {
      width = flexColumnWidth(list.value, '今补', 'nowSupplementCalcu')
      break
    }
    case '月销售额': {
      width = flexColumnWidth(list.value, '月销售额', 'monthSalesPrice', 40)
      break
    }
    case '月净利润': {
      width = flexColumnWidth(list.value, '月净利润', 'monthNetProfit', 40)
      break
    }
    case '剩余库存': {
      width = `${flexColumnWidth(list.value, '剩余库存', 'availableInventory', 10) + flexColumnWidth(list.value, '/', 'acceptingCount', 10) + flexColumnWidth(list.value, '/', 'fbaCount', 0)}px`
      break
    }
    case '原始今补': {
      width = flexColumnWidth(list.value, '原始今补--', 'originalNowSupplement')
      break
    }
    case '签收': {
      width = flexColumnWidth(list.value, '签收', 'quantityReceived', 40)
      break
    }
    case '最近入库': {
      width = 120
      break
    }
    // case '订货#': {
    //   const width1 = flexColumnWidth(list.value, '订货#', 'orderCount')
    //   const width2 = flexColumnWidth(list.value, '订货#', 'orderTotalNumber')
    //   width = Math.max(width1, width2)
    //   break
    // }
    case 'ASIN': {
      width = Number(item.minWidth) + 10
      break
    }
    case '产品描述': {
      width = flexColumnWidth(list.value, '产品描述', 'productDesc')
      break
    }
    default: {
      width = item.minWidth
      break
    }
  }

  // 缓存结果
  columnWidthCache.value.set(cacheKey, String(width))
  return width
}

const handleWidth = (item: any) => {
  return calculateColumnWidth(item)
}
watch(site, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === siteList.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    site.value = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    site.value = []
    // 取消全选获取数据
    queryData()
  }
}
// 打开发货数检查
const showQuantityCheck = () => {
  quantityCheckVisible.value = true
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 防抖搜索函数
const debouncedQueryData = debounce(() => {
  queryForm.pageNo = 1
  fetchData()
}, 300)

const queryData = () => {
  queryForm.pageNo = 1
  // 查询条件变化时清空缓存
  columnWidthCache.value.clear()
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // 分页大小变化时清空缓存，因为不同页的数据可能有不同的列宽
  columnWidthCache.value.clear()
  fetchData()
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const headerStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  const label = data.column.label
  if (['原始今补', '可售含在途', '剩余库存'].includes(label)) {
    return 'column_caret'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', 'ASIN', '库龄', '产品描述'].includes(label)) {
    return {
      textAlign: 'left',
    }
  } else if (label === '剩余库存' || label === '最晚补货') {
    return {
      textAlign: 'right',
    }
  } else if (label === '订货#') {
    return {
      textAlign: 'right',
      cursor: 'pointer',
    }
  } else if (label === '月净利率') {
    const monthNetProfitMargin = data.row.monthNetProfitMargin * 100
    if (monthNetProfitMargin >= 20) {
      return {
        textAlign: 'center',

        color: 'var(--el-color-success)',
      }
    } else if (monthNetProfitMargin < 20 && monthNetProfitMargin > 0) {
      return {
        textAlign: 'center',

        color: 'var(--el-color-warning)',
      }
    } else {
      return {
        textAlign: 'center',

        color: 'var(--el-color-danger)',
      }
    }
  } else if (label === 'PASIN毛利率') {
    const pAsinMonthNetProfitMargin = data.row.pAsinMonthNetProfitMargin * 100
    if (pAsinMonthNetProfitMargin >= 20) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-success)',
      }
    } else if (pAsinMonthNetProfitMargin < 20 && pAsinMonthNetProfitMargin > 0) {
      return {
        textAlign: 'center',
        color: 'var(--el-color-warning)',
      }
    } else {
      return {
        textAlign: 'center',
        color: 'var(--el-color-danger)',
      }
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
}
// 获取站点列表
const fetchSiteList = async () => {
  const { data } = await getWalmartSiteList()
  siteList.value = data
}
// 获取运营列表
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
const columns = ref<any>([])
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 20 })
  columns.value = data
  columns.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (
      [
        'esAvailableSaleDayTotal',
        'planPoPurchaseSkuNumber',
        'recommendCount',
        'originalNowSupplement',
        'monthSalesVolume',
        'encasementCount',
        'outOfStock',
        'orderCount',
        'totalClaimCount',
      ].includes(item.prop)
    ) {
      item.sortable = true
    }
    if (['asinImgUrl', 'asin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
const reorderSeasonalData = (data: number[]) => {
  if (data.length !== 12) return data
  const currentMonthIndex = getCurrentMonthIndex()
  return [...data.slice(currentMonthIndex), ...data.slice(0, currentMonthIndex)]
}
// 获取 table 数据
const fetchData = async () => {
  listLoading.value = true
  queryForm.sites = site.value.join(',')
  const { data } = await getOperationWalmartOrderList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    processField(item, 'sku', 2)
    item._actualList = reorderSeasonalData(item.seasonalCoefficient.actualList)
    if (item.asinImgUrl) item.asinImgUrl = handleImgUrl(item.asinImgUrl)
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
    item.storageAge = `
       <div class="storage-list">
        <div class="storage-item">
          <span class="value1">181-270</span>
          <span class="value2">${item.inventoryAgeLevel1Days ? item.inventoryAgeLevel1Days : 0}</span>
          <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel1Value ? item.inventoryAgeLevel1Value : 0})</span>
        </div>
        <div class="storage-item">
          <span class="value1">271-360</span>
          <span class="value2">${item.inventoryAgeLevel2Days ? item.inventoryAgeLevel2Days : 0}</span>
          <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel2Value ? item.inventoryAgeLevel2Value : 0})</span>
        </div>
        <div class="storage-item">
          <span class="value1">361+</span>
          <span class="value2">${item.inventoryAgeLevel3Days ? item.inventoryAgeLevel3Days : 0}</span>
          <span class="value3">(${item.currencyIcon}${item.inventoryAgeLevel3Value ? item.inventoryAgeLevel3Value : 0})</span>
        </div>
      </div>
    `
  })
  listLoading.value = false

  // 数据更新后清空列宽缓存，下次计算时重新计算
  columnWidthCache.value.clear()
}

const tableRef = ref<TableInstance>()
const chartContainer1 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartObserver1: ResizeObserver

const handleSeasonalOpened = () => {
  nextTick(() => {
    if (chartContainer1.value) {
      chartInstance1 = echarts.init(chartContainer1.value)
      chartObserver1 = new ResizeObserver(() => {
        if (chartInstance1) {
          chartInstance1.resize()
        }
      })
      chartObserver1.observe(chartContainer1.value)
      initChart1()
    }
  })
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(async () => {
  await fetchColumn()
  fetchSiteList()
  fetchOperateUserList()
  await fetchData()
  operationSelect()
})
</script>

<style lang="scss" scoped>
.rate-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;

  .rate-value {
    width: 25px; /* 固定宽度，保证分数区域宽度一致 */
    text-align: left; /* 文本右对齐 */
  }
  .custom-rate {
    --el-rate-icon-size: 20px; /* 调整星星的大小 */
    --el-rate-fill-color: #f09000; /* 填充星星的颜色 */
    --el-rate-text-color: #f09000; /* 文本颜色一致 */
    --el-rate-disabled-void-color: #fff; /* 未填充星星的颜色 */
    --el-rate-void-color: #fff; /* 空星颜色 */

    :deep() {
      .el-rate__item {
        margin-top: -2px;
        margin-right: 0;
        margin-left: -9px;
        .el-icon {
          stroke: #f09000; /* 星星边框颜色 */
          stroke-width: 60px; /* 星星边框的粗细 */
        }
      }
    }
  }
  .rate-count {
    margin-left: -11px;
    color: #36788c;
  }
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
.noneHoverTable {
  :deep() {
    // 选中行样式优先级提高
    .warning-row > td {
      background-color: #edf1f7 !important;
    }

    // 普通行hover时保持白色
    .el-table__body tr:not(.warning-row) {
      &.hover-row > td,
      &:hover > td {
        background-color: #ffffff !important;
      }
    }

    // 选中行hover时保持黄色
    .warning-row {
      &.hover-row > td,
      &:hover > td {
        background-color: #edf1f7;
      }
    }
    .storage-list {
      display: grid;
    }

    .storage-item {
      display: grid;
      grid-template-columns: 70px 35px 60px; /* 设定固定列宽 */
      text-align: left;
    }

    .value2 {
      font-weight: 550;
      color: #000;
    }
    .value3 {
      font-weight: 550;
      color: var(--el-color-danger);
    }
  }
}
.flex {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.custom-inputNumber {
  width: 9em;
  :deep(.el-input__inner) {
    text-align: left;
  }
}

.customTag {
  width: 7em;
  padding: 0 30px;
  color: #fff;
  border: 0;
  border-radius: 17px;

  &-veryPoor {
    background-color: #e32e00;
  }
  &-good {
    background-color: #bad411;
  }
  &-fair {
    background-color: #ffc400;
  }
  &-poor {
    background-color: #ff9900;
  }
  &-excellent {
    background-color: #49850f;
  }
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
:deep(.column_caret .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-checkbox {
  transform: scale(1.3);
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
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
.noneHoverTable :deep(.recent-inbound-col .cell) {
  white-space: pre-wrap;
}
</style>
