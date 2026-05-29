<template>
  <div class="comprehensive-height-container auto-height-container tiktok-performance">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.site"
              clearable
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="全部站点"
              style="width: 200px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" clearable placeholder="全部" style="width: 120px" @change="queryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="开发人">
            <el-select v-model="queryForm.developUserId" clearable placeholder="全部" style="width: 120px" @change="queryData">
              <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleOpenFilter">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="6">
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="SKU / 产品描述 / Product ID"
              style="width: 240px"
              @input="queryData"
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
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :default-sort="{ prop: 'currentSalesNumber', order: 'descending' }"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="id"
      @cell-click="cellClick"
      @sort-change="sortChange"
    >
      <el-table-column fixed label="图片" width="82">
        <template #default="{ row }">
          <el-image fit="cover" :src="row.skuImgUrl" style="display: block; width: 72px; height: 72px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column fixed label="SKU" min-width="250">
        <template #default="{ row }">
          <div class="sku-cell">
            <el-link v-if="row.address" :href="row.address" target="_blank">{{ row.sku }}</el-link>
            <span v-else>{{ row.sku }}</span>
            <span class="copySku" @click.stop="handleClipboard($event, row.sku)">
              <vab-icon icon="file-copy-2-fill" />
            </span>
          </div>
          <div class="sku-meta">
            <span>{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
            <el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" />
            <span>{{ row.commentsNumbers || 0 }}</span>
            <span v-if="row.flag" class="flag-wrap">
              <country-flag :country="row.flag" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品描述" min-width="230" prop="productDesc" show-overflow-tooltip />
      <el-table-column label="站点" prop="siteName" width="110" />
      <el-table-column label="状态" prop="status" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' || row.status === 'ONLINE' ? 'success' : 'info'">{{ row.status || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="运营" prop="operationUserName" width="100" />
      <el-table-column label="开发人员" min-width="120">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._developNameFull }}</div>
            </template>
            <span v-html="row._developName"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="运营分类" min-width="132">
        <template #default="{ row }">
          <el-select v-model="row.operationTypeId" clearable style="width: 100%" @change="handleUpdateOpeType(row)">
            <el-option v-for="item in row.operationTypeList || []" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="停产" width="72">
        <template #default="{ row }">
          <el-checkbox v-model="row.stopProductStatus" :false-value="0" :true-value="1" @change="handleUpdateStopStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="运营建议" min-width="150" prop="operateSuggestion" show-overflow-tooltip />
      <el-table-column label="销量趋势" width="148">
        <template #default="{ row }">
          <div class="trend-bar">
            <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList || []" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="今销" prop="currentSalesNumber" sortable="custom" width="86" />
      <el-table-column label="今单" prop="currentSalesOrder" sortable="custom" width="86" />
      <el-table-column label="当前售价" prop="sellingPrice" sortable="custom" width="104">
        <template #default="{ row }">{{ money(row, 'sellingPrice') }}</template>
      </el-table-column>
      <el-table-column label="试算毛利" prop="grossProfit" width="104">
        <template #default="{ row }">{{ formatPercentage(row.grossProfit, 2) }}</template>
      </el-table-column>
      <el-table-column label="盈亏售价" prop="profitLossSellingPrice" width="104">
        <template #default="{ row }">{{ money(row, 'profitLossSellingPrice') }}</template>
      </el-table-column>
      <el-table-column label="毛利售价" prop="grossSellingPrice" width="104">
        <template #default="{ row }">{{ money(row, 'grossSellingPrice') }}</template>
      </el-table-column>
      <el-table-column label="月销量" prop="monthSalesVolume" sortable="custom" width="96" />
      <el-table-column label="月销售额" prop="monthSalesPrice" sortable="custom" width="112">
        <template #default="{ row }">{{ money(row, 'monthSalesPrice') }}</template>
      </el-table-column>
      <el-table-column label="月毛利润" prop="monthGrossProfit" sortable="custom" width="112">
        <template #default="{ row }">{{ money(row, 'monthGrossProfit') }}</template>
      </el-table-column>
      <el-table-column label="月退货%" prop="monthReturnGoods" width="96">
        <template #default="{ row }">{{ formatPercentage(row.monthReturnGoods, 2) }}</template>
      </el-table-column>
      <el-table-column label="月退款%" prop="monthRefund" width="96">
        <template #default="{ row }">{{ formatPercentage(row.monthRefund, 2) }}</template>
      </el-table-column>
      <el-table-column label="上新" prop="newArrivalDay" sortable="custom" width="86">
        <template #default="{ row }">{{ day(row.newArrivalDay) }}</template>
      </el-table-column>
      <el-table-column label="剩余库存" prop="availableInventory" sortable="custom" width="104" />
      <el-table-column label="FBA" prop="fbaCount" sortable="custom" width="86" />
      <el-table-column label="接受中" prop="acceptingCount" width="86" />
      <el-table-column label="最近入库" min-width="130" prop="recentlyInboundStorage" show-overflow-tooltip />
      <el-table-column label="入库合计" prop="inboundStorageTotal" width="96" />
      <el-table-column label="库存可售" prop="esAvailableSaleDay" sortable="custom" width="96">
        <template #default="{ row }">{{ day(row.esAvailableSaleDay) }}</template>
      </el-table-column>
      <el-table-column label="可售含在途" prop="esAvailableSaleDayTotal" sortable="custom" width="112">
        <template #default="{ row }">{{ day(row.esAvailableSaleDayTotal) }}</template>
      </el-table-column>
      <el-table-column label="断货" prop="outOfStock" width="86">
        <template #default="{ row }">{{ day(row.outOfStock) }}</template>
      </el-table-column>
      <el-table-column label="库龄" width="156">
        <template #default="{ row }">
          <div class="storage-list">
            <div class="storage-item">
              <span>181-270</span>
              <b>{{ row.inventoryAgeLevel1Days || 0 }}</b>
              <em>{{ moneyValue(row, row.inventoryAgeLevel1Value) }}</em>
            </div>
            <div class="storage-item">
              <span>271-360</span>
              <b>{{ row.inventoryAgeLevel2Days || 0 }}</b>
              <em>{{ moneyValue(row, row.inventoryAgeLevel2Value) }}</em>
            </div>
            <div class="storage-item">
              <span>361+</span>
              <b>{{ row.inventoryAgeLevel3Days || 0 }}</b>
              <em>{{ moneyValue(row, row.inventoryAgeLevel3Value) }}</em>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="今补(计算)" prop="nowSupplementCalcu" sortable="custom" width="110" />
      <el-table-column label="原始今补" prop="originalNowSupplement" sortable="custom" width="104" />
      <el-table-column label="推荐量" prop="recommendCount" width="88" />
      <el-table-column label="订货#" width="88">
        <template #default="{ row }">
          {{ row.orderCount || 0 }}
          <br />
          <b>{{ row.orderTotalNumber || 0 }}</b>
        </template>
      </el-table-column>
      <el-table-column label="订货备注" min-width="150" prop="orderRemark" show-overflow-tooltip />
      <el-table-column label="最晚补货" width="118">
        <template #default="{ row }">
          {{ row.latestRestock || '' }}
          <div v-if="row.avgTime" class="sub-value">{{ avgTimeDay(row.avgTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="运营备注" min-width="180">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.operationRemark) }}</div>
            </template>
            <el-text truncated>{{ removeHtmlTags(row.operationRemark) }}</el-text>
          </el-tooltip>
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

    <vab-operational-classify :ope-classify-visible="opeClassifyVisible" @update-visible="closeOpeClassify" />

    <vab-filter-walmart-dialog
      :fetch-operation-user-api="getTiktokOptionUserList"
      :filter-visible="filterVisible"
      :loading="filterLoading"
      month-profit-label="月毛利润"
      :operation-user-id="queryForm.operationUserId"
      :saved-filter-data="queryForm"
      @update-filter="handleConfirmFilter"
      @update-visible="handleCloseFilterDialog"
    />

    <vab-dialog v-model="remarkVisible" title="运营备注" width="420px">
      <el-input v-model="remark" placeholder="请输入运营备注" :rows="12" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search, Star } from '@element-plus/icons-vue'
import { CheckboxValueType } from 'element-plus'
import type { CSSProperties } from 'vue'
import CountryFlag from 'vue-country-flag-next'
import {
  getDevelopUserList,
  getOperationTiktokList,
  getTiktokOptionUserList,
  getTiktokSiteList,
  updateOperationTiktokDisContinuedStatus,
  updateOperationTiktokOperateTypeList,
  updateRemarkTiktokOperation,
} from '/@/api/devlocal/productPerformance'
import type { IGetOperationTiktokList } from '/@/type/storeOperation/productPerformanceType'
import handleClipboard from '/@/utils/clipboard'
import { getAmazonStars } from '/@/utils/rate'
import { processField, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductPerformanceTiktok',
})

interface OptionType {
  id: number
  label: string
}

const listLoading = ref(false)
const total = ref(0)
const list = ref<IGetOperationTiktokList[]>([])
const siteList = ref<OptionType[]>([])
const operateUserList = ref<OptionType[]>([])
const developUserList = ref<OptionType[]>([])
const checkAll = ref(false)
const indeterminate = ref(false)
const xAxis = Array.from({ length: 30 }, (_, index) => index + 1)
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const remarkVisible = ref(false)
const remark = ref('')
const currentRow = ref<IGetOperationTiktokList>({})
const filterLoading = ref(false)
const filterVisible = ref(false)
const opeClassifyVisible = ref(false)

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: -1,
  developUserId: -1,
  orderByField: 'currentSalesNumber',
  orderDirection: 'desc',
})

const fetchSiteList = async () => {
  const { data } = await getTiktokSiteList()
  siteList.value = data
}

const fetchOperateUserList = async () => {
  const { data } = await getTiktokOptionUserList()
  operateUserList.value = [{ id: -1, label: '全部' }, ...data]
}

const fetchDevelopUserList = async () => {
  const { data } = await getDevelopUserList()
  developUserList.value = [{ id: -1, label: '全部' }, ...data, { id: -2, label: '离职人员' }]
}

const fetchData = async () => {
  if (listLoading.value) return
  listLoading.value = true
  try {
    const { site, keyWord, ...filterQueryForm } = queryForm
    const { data } = await getOperationTiktokList({
      ...filterQueryForm,
      keyword: keyWord,
      siteIds: site.join(','),
    })
    total.value = data?.total || 0
    list.value = data?.list || []
    list.value.forEach((item: any) => {
      processField(item, 'developName', 2)
      item.displayRating = getAmazonStars(item.rating || 0, item.commentsNumbers || 0)
    })
  } finally {
    listLoading.value = false
  }
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
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

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  queryForm.site = val ? siteList.value.map((item) => item.id) : []
  queryData()
}

const sortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop } = data
  if (queryForm.orderByField === prop) {
    if (!column.order) {
      column.order = queryForm.orderDirection === 'asc' ? 'descending' : 'ascending'
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}

const handleUpdateOpeType = async (row: IGetOperationTiktokList) => {
  await updateOperationTiktokOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!,
  })
}

const handleUpdateStopStatus = async (row: IGetOperationTiktokList) => {
  await updateOperationTiktokDisContinuedStatus({
    skuId: row.id!,
    status: row.stopProductStatus!,
  })
}

const handleOpenFilter = () => {
  filterVisible.value = true
}

const handleCloseFilterDialog = (value: boolean) => {
  filterVisible.value = value
}

const handleConfirmFilter = (filterForm: any) => {
  Object.assign(queryForm, filterForm)
  filterVisible.value = false
  queryData()
}

const showOpeClassify = () => {
  opeClassifyVisible.value = true
}

const closeOpeClassify = () => {
  opeClassifyVisible.value = false
}

const confirmUpdateRemark = async () => {
  const { data } = await updateRemarkTiktokOperation({
    id: currentRow.value.id!,
    remark: remark.value,
  })
  if (data) {
    currentRow.value.operationRemark = remark.value
    remarkVisible.value = false
    $baseMessage('运营备注修改成功！', 'success')
  }
}

const cellClick = (row: IGetOperationTiktokList, column: any) => {
  if (column.label !== '运营备注') return
  currentRow.value = row
  remark.value = row.operationRemark || ''
  remarkVisible.value = true
}

const imagePreviewShow = (url?: string) => {
  if (!url) return
  imagePreviewList.value = [url]
  imagePreviewVisible.value = true
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const money = (row: IGetOperationTiktokList, key: keyof IGetOperationTiktokList) => {
  const value = row[key]
  return value == null || value === '' ? '' : `${row.currencyIcon || ''}${value}`
}

const moneyValue = (row: IGetOperationTiktokList, value?: number | string | null) => {
  return value == null || value === '' ? '' : `${row.currencyIcon || ''}${value}`
}

const day = (value?: number) => {
  return value == null ? '' : `${value}天`
}

const avgTimeDay = (value?: string | number | null) => {
  return value == null || value === '' ? '' : `${value}天`
}

function formatPercentage(value?: number | null, num = 2): string {
  if (value == null) return ''
  return `${(value * 100).toFixed(num)}%`
}

const clearPadding = (data: { column: any }): string => {
  return data.column.label === '图片' ? 'clear-padding' : ''
}

const cellStyle = (data: { column: any; row: IGetOperationTiktokList }): CSSProperties => {
  if (['SKU', '产品描述', '运营建议', '最近入库', '库龄', '订货备注', '运营备注'].includes(data.column.label)) {
    return {
      textAlign: 'left',
      cursor: data.column.label === '运营备注' ? 'pointer' : 'default',
    }
  }
  if (data.column.label === '月毛利润') {
    return {
      textAlign: 'center',
      color: (data.row.monthGrossProfit || 0) >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)',
    }
  }
  return {
    textAlign: 'center',
  }
}

onBeforeMount(async () => {
  await Promise.all([fetchSiteList(), fetchOperateUserList(), fetchDevelopUserList()])
  await fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }
    .el-checkbox {
      transform: scale(1.16);
      transform-origin: center;
    }
  }
}

.sku-cell {
  display: flex;
  gap: 6px;
  align-items: center;
  line-height: 20px;
}

.sku-meta {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 4px;
  color: var(--el-text-color-secondary);

  .custom-rate {
    --el-rate-icon-size: 17px;
    --el-rate-fill-color: #f09000;
    --el-rate-disabled-void-color: #fff;
    :deep(.el-rate__item) {
      cursor: default;
    }
  }
}

.flag-wrap {
  display: inline-flex;
  align-items: center;
  height: 18px;
  overflow: hidden;
}

.trend-bar {
  width: 120px;
  height: 48px;
}

.sub-value {
  margin-top: 2px;
  color: var(--el-text-color-secondary);
}

.storage-list {
  display: grid;
  gap: 2px;

  .storage-item {
    display: grid;
    grid-template-columns: 62px 34px 1fr;
    gap: 4px;
    align-items: center;

    b {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    em {
      overflow: hidden;
      font-style: normal;
      color: var(--el-text-color-secondary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
