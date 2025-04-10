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
              style="width: 220px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" :disabled="disabledOpe" placeholder="请选择运营人员" @change="queryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showQuantityCheck">发货数检查</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleOpenSmooth">平滑指数设定</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="filterVisible = true">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleOpenSpringFestival">春节备货</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" /> 
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
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
      class="noneHoverTable" :data="list" :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="(item, index) in orderColumns"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleWidth(item)"
        :prop="item.prop"
        :width="item.width"
      >
        <template #header>
          <span v-if="item.label==='库存可售'">
            库存<br />可售
          </span>
          <span v-if="item.label==='可售含在途'">
            可售<br />含在途
          </span>
          <span v-if="item.label === '月广告%'">
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">月广告% <el-icon><question-filled /></el-icon> </div>
              <template #content>
                <div class="custom-tooltip" >月广告销售占比</div>
              </template>
            </el-tooltip>
          </span>
        </template>
        <template #default="{ row }">
          <span v-if="item.label === '图片'">
            <el-image fit="fill" :src="row.asinImgUrl" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.asinImgUrl)" >
              <template #error>
                <el-icon/>
              </template>
            </el-image>
          </span>
          <span v-if="item.label === 'ASIN'">
            <el-link type="primary">{{ row.asin }}</el-link>
            <div class="rate-wrapper">
              <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
              <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
              <span class="rate-count">{{ row.commentsNumbers }}</span>
            </div>
          </span>
          <span v-if="item.label === 'SKU'">
            <el-tooltip content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row._skuFull }}</div>
              </template>
              <span v-html="row._sku"></span>
            </el-tooltip>
          </span>
          <span v-if="item.label === '销量趋势'">
            <div style="width: 100%; height: 59px">
              <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
            </div>
          </span>
          <span v-if="item.label === '广告'">
            <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
            <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
          </span>
          <span v-if="item.label === '运营分类'">
            <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="handleUpdateAsinOpeType(row)">
              <el-option v-for="select in row.operationTypeList" :key="select.id" :label="select.label" :value="select.id" />
            </el-select>
          </span>
          <span v-if="item.label === '今补'">
            {{ row.nowSupplementCalcu }}
          </span>
          <span v-if="item.label === '今补广'">
            {{ row.nowSupplementAdvCalcu }}
          </span>
          <span v-if="label3.includes(item.label)">
            <!-- 处理 天 -->
            {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
          </span>
          <span v-if="item.label === '月净利润'">
            {{ row.monthNetProfit ? row.currencyIcon + row.monthNetProfit : '' }}
          </span>
          <span v-if="item.label === '半年有货率'">
            {{ row.availableRate !== null ? row.availableRate.toFixed(0) + '%' : '' }}
          </span>
          <span v-if="label.includes(item.label)">
            {{ row[labelMap.get(item.label)!] !== null ? row[labelMap.get(item.label)!].toFixed(2) + '%' : '' }}
          </span>
          <span v-if="item.label === '剩余库存'">
            {{ row.availableInventory }} / {{ row.fbaCount }}
          </span>
          <span v-if="item.label === '操作'">
            <el-button type="primary" @click="handleShowReleaseOrder(row)">发布订货</el-button>
          </span>
          <span v-if="item.label === 'VOC满意度'">
            {{ row.vocNcxCount }} / {{ row.vocTotalOrderCount }}
            <el-tag v-if="row.vocSatisfaction === '极差'" class="customTag customTag-veryPoor">极差 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
            <el-tag v-if="row.vocSatisfaction === '一般'" class="customTag customTag-fair">一般 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
            <el-tag v-if="row.vocSatisfaction === '不合格'" class="customTag customTag-poor">不合格 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
            <el-tag v-if="row.vocSatisfaction === '良好'" class="customTag customTag-good">良好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
            <el-tag v-if="row.vocSatisfaction === '极好'" class="customTag customTag-excellent">极好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
          </span>
          <!-- <span v-if="item.label === 'VOC缺陷%'" >
            {{ row.vocDefect !== null ? (row.vocDefect * 100).toFixed(2) + '%' : '' }}
          </span> -->
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"/>
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
    <vab-dialog
      v-model="filterVisible"
      title="筛选"
      width="20%"
    >
      <el-form
        ref="filterFormRef"
        label-position="right"
        label-width="auto"
        :model="filterForm"
        style="width: 100%; margin-right: 10px"
      >
        <el-form-item label="交期">
          <div class="flex">
            <el-input-number
              v-model="queryForm.minDeliveryDate"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="queryForm.maxDeliveryDate"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="上新天数">
          <div class="flex">
            <el-input-number
              v-model="queryForm.minNewArrivalDay"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="queryForm.maxNewArrivalDay"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="库存可售">
          <div class="flex">
            <el-input-number
              v-model="queryForm.minEs"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="queryForm.maxEs"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="上海签收">
          <div class="flex">
            <el-input-number
              v-model="queryForm.minSign"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="queryForm.maxSign"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="最晚补货">
          <div class="flex">
            <el-date-picker 
              v-model="latestDate"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="filterVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmFilter">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 平滑指数设定 -->
    <vab-dialog
      v-model="smoothSettingVisible"
      title="平滑指数设定"
      width="20%"
    >
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
    <!-- 发货数检查 -->
    <vab-dialog
      v-model="quantityCheckVisible"
      title="发货数检查"
    >
      <el-table border :cell-style="{ textAlign: 'center' }" class="noneHoverTable" :data="shipList" :header-cell-style="{ textAlign: 'center' }" stripe>\
        <el-table-column type="selection"/>
        <el-table-column label="站点" prop="siteName" />
        <el-table-column label="发货计划" prop="shippingPlanDate"/>
        <el-table-column label="产品数量" prop="productCount"/>
        <el-table-column label="重量" prop="weight"/>
        <el-table-column label="体积" prop="volume"/>
        <el-table-column label="箱数" prop="encasementCount"/>
      </el-table>
      <template #footer>
        <el-button @click="quantityCheckVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 春节备货 -->
    <vab-dialog
      v-model="stockUpVisible"
      title="春节备货"
      width="20%"
    >
      <el-form class="noneHoverTable" style="margin: auto 0">
        <el-form-item label="春节备货">
          <el-checkbox v-model="stockUpForm.springFestivalStock" :false-value="0" :true-value="1" />
        </el-form-item>
        <el-form-item label="节后开工日期" label-position="top">
          <el-date-picker v-model="stockUpForm.startDate" type="date" value-format="YYYY-MM-DD"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockUpVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmSpringFestival">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 发布订货 -->
    <vab-dialog
      v-model="releaseOrderVisible"
      :draggable="false"
      title="发布订货"
      width="59%"
    >
      <el-form v-loading="orderListLoading" class="custom-form" inline label-position="top" :model="releaseOrderForm" style="justify-content: space-around; width: 100%">
        <el-form-item>
          <el-image :src="releaseOrderForm.skuImageUrl" style="display: block; width: 85px; height: 85px; cursor: pointer; border: 1px solid #e4e7ed; border-radius: 10%;" @click="imagePreviewShow(releaseOrderForm.skuImageUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </el-form-item>
        <el-form-item label="SKU">
          <el-select v-model="releaseOrderForm.sku" placeholder="请选择SKU" style="width: 20em;" @change="handleSwitchSku">
            <el-option 
              v-for="item in skuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="releaseOrderForm.description" disabled style="width: 18em" />
        </el-form-item>
        <el-form-item label="订货数量">
          <!-- <el-input v-model="releaseOrderForm.number" min="0" oninput="if(value<0)value=0" style="width: 8em;" type="number" /> -->
          <el-input-number v-model="releaseOrderForm.number" class="custom-inputNumber" controls-position="right" :min="0">
            <template #decrease-icon>
              <el-icon>
                <minus />
              </el-icon>
            </template>
            <template #increase-icon>
              <el-icon>
                <plus />
              </el-icon>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="起订量">
          <el-input v-model="releaseOrderForm.moq" disabled style="width: 8em;" />
        </el-form-item>
        <el-form-item label="整箱数">
          <el-input v-model="releaseOrderForm.numberOfCartons" disabled style="width: 8em;" />
        </el-form-item>
        <el-form-item label="产品经理" style="margin-right: 0;">
          <el-input v-model="releaseOrderForm.productManagerName" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="releaseOrderVisible = false">取消</el-button>
        <el-button :loading="orderListLoading" type="primary" @click="handleReleaseOrder">发布</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus, QuestionFilled, Search, Star } from '@element-plus/icons-vue'
import type { CheckboxValueType, FormInstance, TableInstance } from 'element-plus'
import type { CSSProperties } from 'vue'
import { orderColumns } from '../constantOption'
import { getDistributionOptionUserList, getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import {
  getOperationOrderList,
  getOperationOrderShippingInspection,
  getOperationOrderSku,
  getOperationOrderSmoothness,
  getOperationOrderSpringFestival,
  releaseOperationPlanPo,
  updateOperationOrderSmoothness,
  updateOperationOrderSpringFestival
} from '/@/api/devlocal/productOrdering'
import { updateOperationASINOperateTypeList } from '/@/api/devlocal/productPerformance'
import { useAclStore } from '/@/store/modules/acl'
import type { IGetOperationOrderList, IGetOperationOrderListReq } from '/@/type/storeOperation/productOrdering'
import { formatPercentage, getAmazonStars, handleImgUrl } from '/@/utils/rate'
import { calculateBrColumnWidth, flexColumnWidth, processField } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductOrdering'
})
const router = useRouter()
const route = useRoute()
const smoothSettingVisible = ref<boolean>(false)
const quantityCheckVisible = ref<boolean>(false)
const stockUpVisible = ref<boolean>(false)
const stockUpForm = reactive<any>({})
const filterVisible = ref<boolean>(false)
const filterForm = reactive<any>({})
const filterFormRef = ref<FormInstance>()
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const listLoading = ref<boolean>(false)
const queryForm = reactive<IGetOperationOrderListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  operationUserId: -1,
  sites: ''
})
const total = ref<number>(0)
const site = ref<number[]>([])
const siteList = ref<{ id: number, label: string }[]>([])
const operateUserList = ref<{ id: number, label: string }[]>([])
const list = ref<IGetOperationOrderList[]>([])
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const latestDate = ref<string[]>([])
const label = [
  '毛利率',
  '月广告%',
  '月ACOS',
  '月TACOS',
  '月退货%',
]
const label3 = ['库存可售', '可售含在途', '断货']
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
  ['断货', 'outOfStock'],
])
const releaseOrderVisible = ref<boolean>(false)
// 发布订货表单
const releaseOrderForm = reactive<any>({})
// 发布订货里面的sku列表
const skuList = ref<{ value: string, label: string }[]>([])
const asinId = ref<number>(-1)
const smoothForm = reactive<any>({})
const shipList = ref<any[]>([])
const orderListLoading = ref<boolean>(false)
const disabledOpe = ref<boolean>(false)
const aclStore = useAclStore()
// 添加选中行的 ID
const currentRowId = ref<number | undefined>(undefined)

const handleRowClick = (row: any, column: any, event: Event) => {
  currentRowId.value = row.id
}
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: any
  rowIndex: number
}) => {
  if (row.id === currentRowId.value) {
    return 'warning-row'
  }
}
const operationSelect = () => {
  const role = aclStore.getRole[0]
  switch (role) {
    // 老板和运营主管
    case 'ROLE_BOSS': 
    case 'ROLE_ECOMMERCEOPERATIONLEAD': {
      disabledOpe.value = false
     
      break;
    }
    // 运营
    case 'ROLE_ECOMMERCEOPERATOR': {
      disabledOpe.value = true
    
      break;
    }
  // No default
  }
}
// 确定修改春节备货
const handleConfirmSpringFestival = async () => {
  const { data } = await updateOperationOrderSpringFestival(stockUpForm)
  if (data) {
    $baseMessage('修改春节备货成功！', 'success')
    stockUpVisible.value = false
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
const handleReleaseOrder = async () => {
  if (!releaseOrderForm.sku) {
    $baseMessage('请选择SKU', 'warning')
    return
  }
  if (!releaseOrderForm.number) {
    $baseMessage('请填写订货数量', 'warning')
    return
  }
  try {
    // 先关闭弹窗,提升体验
    releaseOrderVisible.value = false
    orderListLoading.value = true
    
    const { data } = await releaseOperationPlanPo({
      asinId: asinId.value,
      sku: releaseOrderForm.sku,
      number: releaseOrderForm.number
    })
    
    if (data) {
      $baseMessage('发布订货成功！', 'success')
      fetchData()
    }
  } catch (error) {
    console.error('发布订货失败:', error)
    $baseMessage('发布订货失败，请重试', 'error')
    // 失败时重新打开弹窗
    releaseOrderVisible.value = true
  } finally {
    orderListLoading.value = false
  }
}
let copyRow: IGetOperationOrderList
const handleSwitchSku = async () => {
  // const { data } = await getSkuInfo({ sku: releaseOrderForm.sku })
  // Object.assign(releaseOrderForm, data)
  const { data } = await getOperationOrderSku({
    id: copyRow.id!,
    sku: releaseOrderForm.sku
  })
  // const { data } = await getSkuInfo({ sku: skuArray[0] })
  Object.assign(releaseOrderForm, data)
  releaseOrderForm.number = data.orderQuantity
}
// 打开发布订货
const handleShowReleaseOrder = async (row: IGetOperationOrderList) => {
  currentRowId.value = row.id
  copyRow = row
  releaseOrderVisible.value = true
  if (row.sku) {
    orderListLoading.value = true
    // const skuArray = row.sku.split(',')
    // 确保skuArray 是一个没有空值的数组
    const skuArray = row.sku?.trim().split(',').filter(Boolean) || []
    // console.log(skuArray)
    skuList.value = skuArray.map((item) => {
      return {
        label: item,
        value: item
      }
    })
    const { data } = await getOperationOrderSku({
      id: row.id!,
      sku: skuArray[0]
    })
    // const { data } = await getSkuInfo({ sku: skuArray[0] })
    Object.assign(releaseOrderForm, data)
    releaseOrderForm.number = data.orderQuantity
    asinId.value = row.id!
    orderListLoading.value = false
  } else {
    skuList.value = []
    Object.keys(releaseOrderForm).forEach(key => {
      delete releaseOrderForm[key]
    })
  }
}
// 修改运营分类
const handleUpdateAsinOpeType = async (row: IGetOperationOrderList) => {
  await updateOperationASINOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!
  })
}
// 确认筛选
const handleConfirmFilter = async () => {
  queryForm.startLatestDate = latestDate.value[0] || ''
  queryForm.endLatestDate = latestDate.value[1] || ''
  queryForm.pageNo = 1
  queryForm.pageSize = 20
  fetchData()
  filterVisible.value = false
}
const handleWidth = (item: any) => {
  switch (item.label) {
    case 'SKU': {
      return calculateBrColumnWidth(list.value, (row: any) => row._sku, 100)
    }
    case '库存可售': {
      return flexColumnWidth(list.value, '库存可售', 'esAvailableSaleDay', 30)
    }
    case '可售含在途': {
      return flexColumnWidth(list.value, '可售含在途', 'esAvailableSaleDayTotal', 30)
    }
    default: {
      return item.minWidth
    }
  }
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
const showQuantityCheck = async () => {
  quantityCheckVisible.value = true
  const { data } = await getOperationOrderShippingInspection()
  shipList.value = data
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
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
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', 'ASIN', '库龄'].includes(label)) {
    return {
      textAlign: 'left',
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
}
// 获取站点列表
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
// 获取运营列表
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
// 获取 table 数据
const fetchData = async () => {
  listLoading.value = true
  queryForm.sites = site.value.join(',')
  const { data } = await getOperationOrderList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    processField(item, 'sku', 2)
    if (item.asinImgUrl) item.asinImgUrl = handleImgUrl(item.asinImgUrl)
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
  })
  listLoading.value = false
}

const tableRef = ref<TableInstance>()
// // 添加保存滚动位置的方法
// const saveScrollPosition = () => {
//   const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
//   if (scrollBarRef?.wrapRef) {
//     const scrollStatus = {
//       scrollTop: scrollBarRef.wrapRef.scrollTop
//     }
//     localStorage.setItem('productOrderingScrollPosition', JSON.stringify(scrollStatus))
//   }
// }

// // 监听表格滚动事件
// const handleTableScroll = () => {
//   saveScrollPosition()
// }
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchSiteList()
  fetchOperateUserList()
  fetchData()
  operationSelect()
})

// onMounted(() => {
//   nextTick(() => {
//     // 添加滚动事件监听
//     const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
//     if (scrollBarRef?.wrapRef) {
//       scrollBarRef.wrapRef.addEventListener('scroll', handleTableScroll)
      
//       // 恢复滚动位置
//       const savedStatus = JSON.parse(localStorage.getItem('productOrderingScrollPosition') || '{}')
//       if (savedStatus.scrollTop) {
//         setTimeout(() => {
//           scrollBarRef.wrapRef.scrollTop = savedStatus.scrollTop
//         }, 100)
//       }
//     }
//   })
// })

// onBeforeUnmount(() => {
//   // 移除滚动事件监听
//   const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef
//   if (scrollBarRef?.wrapRef) {
//     scrollBarRef.wrapRef.removeEventListener('scroll', handleTableScroll)
//   }
//   localStorage.removeItem('productOrderingScrollPosition')
// })
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
    color: #36788C;
  }
}
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
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
      background-color: var(--el-color-warning-light-9) !important;
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
        background-color: var(--el-color-warning-light-9) !important;
      }
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
</style>