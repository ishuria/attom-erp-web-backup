<template>
  <div class="cost-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <!-- 支出构成 -->
        <expense-breakdown-card
          v-loading="expenseLoading"
          card-class="card1"
          :chart-data="data1"
          :chart-title="'支出构成'"
          :colors="colorList"
          :fixed-left="true"
          :name-column="{ label: '项目', prop: 'name', minWidth: 130 }"
          :symbol="expenseSymbol"
          :table-data="percentageData"
          :title="'支出构成'"
          :tooltip-title="'支出构成'"
          :total-label="'总支出'"
          :total-value="totalValue"
          :value-columns="[
            { label: '金额', prop: 'value', minWidth: 90, formatter: (row) => `${expenseSymbol}${row.value}` },
            { label: '占比', prop: 'percentage', minWidth: 60, align: 'right' },
          ]"
        />
      </el-col>
      <el-col :span="8">
        <!-- 库龄 -->
        <storage-age-card
          v-loading="storageAgeLoading"
          :additional-columns="[{ label: '预估下月费用', minWidth: 120 }]"
          card-class="card2"
          :chart-data="data2"
          :colors="storageAgeColorList"
          :name-column="{ label: '项目', prop: 'name', minWidth: 110 }"
          :table-data="percentageAgeData"
          :value-column="{ label: 'FBA仓', prop: 'value', minWidth: 90, align: 'right' }"
        />
      </el-col>
      <el-col :span="8">
        <!-- 包装信息 -->
        <vab-packaging-info-card :loading="packagingLoading" :packaging-info="packagingInformation" :sku="props.sku" />
        <!-- 每日成本图表 -->
        <sku-site-daily-cost-chart-card
          v-model:date-range="card4DateRange"
          v-loading="chart3Loading"
          card-class="card4"
          :chart-data="data3"
          @date-range-change="handleCard4DateSelect"
        />
      </el-col>
    </el-row>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-text>产品成本核算</el-text>
          </el-form-item>
          <el-form-item>
            <el-button :loading="addLoading" type="primary" @click="handleConfirmAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      v-loading="costLoading"
      border
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      @cell-click="cellClick"
    >
      <el-table-column fixed="left" label="日期" min-width="115" prop="createTime" />
      <!-- <el-table-column fixed="left" label="站点" min-width="175" prop="site">
        <template #default="{ row }">
          <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%" @change="handleUpdateList(row)">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column fixed="left" label="售价" min-width="100" prop="sellingPrice">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.sellingPrice != null ? row.symbol + row.sellingPrice : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="毛利率" min-width="100" prop="grossMarginRate">
        <template #default="{ row }">
          <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate < 20" type="danger">
            {{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}
          </el-text>
        </template>
      </el-table-column>

      <el-table-column label="产品价格¥" min-width="110" prop="price">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.price != null ? '￥' + row.price : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="关税%" min-width="100" prop="tariff">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.tariff != null ? row.tariff + '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关税" min-width="100" prop="tariffPrice">
        <template #default="{ row }">
          <span>{{ row.tariffPrice != null ? '￥' + row.tariffPrice : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="长(cm)" prop="length" :width="flexColumnWidth(list, '长(cm)', 'length1', 60)">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.length != null ? row.length + 'cm' : '' }}</span>
          <br />
          <span v-if="row.length1">({{ row.length1 != null ? row.length1 + 'cm' : '' }})</span>
        </template>
      </el-table-column>
      <el-table-column label="宽(cm)" prop="width" :width="flexColumnWidth(list, '宽(cm)', 'width1', 60)">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.width != null ? row.width + 'cm' : '' }}</span>
          <br />
          <span v-if="row.width1">({{ row.width1 != null ? row.width1 + 'cm' : '' }})</span>
        </template>
      </el-table-column>
      <el-table-column label="高(cm)" prop="height" :width="flexColumnWidth(list, '高(cm)', 'height1', 60)">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.height != null ? row.height + 'cm' : '' }}</span>
          <br />
          <span v-if="row.height1">({{ row.height1 != null ? row.height1 + 'cm' : '' }})</span>
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" :width="flexColumnWidth(list, '重量(g)', 'weight1', 60)">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.weight != null ? row.weight + 'g' : '' }}</span>
          <br />
          <span v-if="row.weight1">({{ row.weight1 != null ? row.weight1 + 'g' : '' }})</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="下一档位" min-width="200" prop="nextGear">
        <template #default="{ row }">
          <span v-html="row.nextGear"></span>
        </template>
      </el-table-column> -->
      <el-table-column label="尺寸/尾程来源" min-width="150" prop="sizeSource">
        <template #default="{ row }">
          <el-select v-model="row.sizeSource" style="min-width: 100%" @change="handleUpdateList(row)">
            <el-option v-for="item in sizeSourceOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="尾程" min-width="80" prop="lastMile">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.lastMile" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.lastMile != null ? row.symbol + row.lastMile : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打包¥" min-width="100" prop="packaging">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.packaging != null ? '￥' + row.packaging : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头程¥" min-width="100" prop="firstMile">
        <template #default="{ row }">
          {{ row.firstMile != null ? '￥' + row.firstMile : '' }}
        </template>
      </el-table-column>
      <el-table-column label="头程渠道" min-width="150" prop="firstMileChannel">
        <template #default="{ row }">
          <el-select v-model="row.firstMileChannel" placeholder="请选择头程渠道" style="min-width: 100%" @change="handleUpdateList(row)">
            <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="ROI" min-width="90" prop="roi">
        <template #default="{ row }">
          {{ row.roi != null ? row.roi + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="重量系数" min-width="100" prop="weightCoefficient">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.weightCoefficient }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.volumeCoefficient }}</span>
        </template>
      </el-table-column>

      <el-table-column label="VAT" min-width="100" prop="vat">
        <template #default="{ row }">
          <span>{{ row.vat != null ? row.vat + '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台佣金" min-width="100" prop="platformCommission">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.platformCommission" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.platformCommission != null ? row.symbol + row.platformCommission.toFixed(2) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓储费2个月" min-width="140" prop="storageFee">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.storageFee" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.storageFee != null ? row.symbol + Number(row.storageFee).toFixed(2) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外汇币种" min-width="100" prop="currencyType" />
      <el-table-column label="汇率" min-width="90" prop="foreignExchange" />
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="{ row, $index }">
          <el-dropdown>
            <el-button text type="primary" @click="handleReverseCalc(row.id)">
              逆算
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleReverseCalc(row.id)">
                  <el-link type="primary" underline="never">逆算</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleCopy(row.id)">
                  <el-link type="primary" underline="never">复制</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleDelete(row.id, $index)">
                  <el-link type="danger" underline="never">删除</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 500px" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 新增 -->
    <!-- <vab-dialog v-model="addVisible" title="新增" width="20%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" style="width: 100%">
        <el-form-item label="站点" prop="site">
          <el-select v-model="addForm.site" placeholder="请选择站点">
            <el-option v-for="item in siteAddList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { getLast7DaysStringTime } from '~/src/utils/dateUtils'
import { flexColumnWidth } from '~/src/utils/tableColum'
import { colorList, sizeSourceOption, storageAgeColorList } from '../constantOption'
import { getCostAccountingChannelList } from '/@/api/devlocal/encasement'
import { getSalesSiteList } from '/@/api/devlocal/evaluation'
import {
  addOperationAmazonCost,
  copyOperationAmazonCost,
  deleteOperationAmazonCost,
  getExpenseComposition,
  getOperationAmazonCostList,
  getOperationAmazonPackagingInformation,
  getSkuSiteDailyCost,
  getStorageAge,
  reverseCalcOperationAmazonCost,
  updateOperationAmazonCost,
} from '/@/api/devlocal/productAnalysis'
import type {
  IGetOperationAmazonCostList,
  IGetOperationAmazonCostListReq,
  IGetOperationAmazonPackagingInformationRes,
  IGetSkuSiteDailyCost,
} from '/@/type/storeOperation/productAnalysisType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'VabCostAnalysis',
})

const props = defineProps<{
  sku: string
  selectedSite: number | undefined
  startDate?: string
  endDate?: string
}>()

const list = ref<IGetOperationAmazonCostList[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetOperationAmazonCostListReq>({
  sku: '',
  pageNo: 1,
  pageSize: 20,
  siteId: 0,
})

// 支出构成数据
const data1 = ref<Array<{ name: string; value: number }>>([])
const expenseLoading = ref<boolean>(false)
const expenseSymbol = ref<string>('$')
// 库龄数据
const data2 = ref<Array<{ name: string; value: number }>>([])
const storageAgeLoading = ref<boolean>(false)
// 图表数据格式（直接使用后端字段）
const data3 = ref<IGetSkuSiteDailyCost[]>([])
const chart3Loading = ref<boolean>(false)

const card4DateRange = ref<[string, string]>(getLast7DaysStringTime())
// 计算总和
const totalValue = ref<number>(0)
// 计算库龄总和
const totalAgeValue = computed(() => {
  return data2.value.reduce((sum, item) => sum + item.value, 0)
})

// 计算占比
const percentageData = computed(() => {
  const total = totalValue.value
  if (total === 0) {
    return data1.value.map((item) => ({
      ...item,
      percentage: '0.00%',
    }))
  }
  return data1.value.map((item) => ({
    ...item,
    percentage: `${((item.value / total) * 100).toFixed(2)}%`,
  }))
})
// 计算库龄占比数据
const percentageAgeData = computed(() => {
  const total = totalAgeValue.value
  if (total === 0) {
    return data2.value.map((item) => ({
      ...item,
      percentage: '0.00',
    }))
  }
  return data2.value.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(2),
  }))
})
let copyRow: any

// 修改产品核算的站点
const handleUpdateList = async (row: IGetOperationAmazonCostList) => {
  const { data } = await updateOperationAmazonCost({
    ...row,
    grossMarginRate: Number(row.grossMarginRate) / 100,
    roi: Number(row.roi) / 100,
    tariff: Number(row.tariff) / 100,
  })
  if (data) {
    fetchData()
  }
}
// 确定新增
const addLoading = ref<boolean>(false)
const handleConfirmAdd = async () => {
  addLoading.value = true
  const { data } = await addOperationAmazonCost({
    sku: props.sku,
    site: props.selectedSite !== undefined ? props.selectedSite : 0,
  })
  if (data) {
    $baseMessage('新增成功！', 'success')
    fetchData()
  }
  addLoading.value = false
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
// 产品核算的复制
const handleCopy = async (id: number) => {
  $baseConfirm('确定要复制吗？', null, async () => {
    const { data } = await copyOperationAmazonCost({ id })
    if (data) {
      $baseMessage('复制成功！', 'success')
      fetchData()
    }
  })
}
// 产品核算的删除
const handleDelete = async (id: number, index: number) => {
  $baseConfirm('确定要删除吗？', null, async () => {
    const { data } = await deleteOperationAmazonCost({ id })
    if (data) {
      $baseMessage('删除成功！', 'success')
      list.value.splice(index, 1)
    }
  })
}
// 产品核算的逆算
const handleReverseCalc = async (id: number) => {
  const { data } = await reverseCalcOperationAmazonCost({ id })
  if (data) {
    $baseMessage('逆算成功！', 'success')
    fetchData()
  }
}
// 获取SKU每日成本数据
const fetchSkuSiteDailyCost = async () => {
  if (!props.sku || !card4DateRange.value[0] || !card4DateRange.value[1]) {
    data3.value = []
    return
  }
  const siteId = props.selectedSite !== undefined ? props.selectedSite : 0
  chart3Loading.value = true
  try {
    const { data } = await getSkuSiteDailyCost({
      sku: props.sku,
      siteId,
      startDate: card4DateRange.value[0],
      endDate: card4DateRange.value[1],
    })
    // 直接使用后端返回的数据
    data3.value = data
  } catch (error) {
    console.error('获取SKU每日成本数据失败:', error)
    data3.value = []
  } finally {
    chart3Loading.value = false
  }
}

const handleCard4DateSelect = () => {
  // 获取数据
  fetchSkuSiteDailyCost()
}

const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const clickCancel = async (event: Event, value: any) => {
  const rootElement = getRootElement(event.target, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    handleUpdateList(value)
  }
}
const headerCellStyle = (): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
    textAlign: 'center',
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['日期', '外汇币种', '汇率', '下一档位', '头程¥', '毛利率', 'ROI'].includes(label)) {
    return {
      fontWeight: 600,
      textAlign: 'center',
      cursor: 'not-allowed',
    }
  }
  if (
    data.row.sizeSource === 1 &&
    (label === '长(cm)' || label === '宽(cm)' || label === '高(cm)' || label === '重量(g)' || label === '尾程')
  ) {
    return {
      fontWeight: 600,
      textAlign: 'center',
      cursor: 'not-allowed',
      backgroundColor: 'rgba(245, 108, 108, 0.1)', // 浅红色背景
      // color: 'var(--el-color-danger)', // 红色文字
      // border: '1px solid rgba(245, 108, 108, 0.3)', // 淡红色边框
      // borderRadius: '4px', // 圆角
    }
  }
  return {
    textAlign: 'center',
    cursor: 'pointer',
  }
}

const channelList = ref<{ id: number; label: string }[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
// 新增的站点列表，过滤掉沃尔玛
const siteAddList = ref<{ id: number; label: string }[]>([])
// const fetchChannelData = async () => {
//   const { data } = await getChannelList()
//   channelList.value = data
// }
const fetchCostAccountingChannelData = async () => {
  const { data } = await getCostAccountingChannelList()
  channelList.value = data
}
const fetchSalesSiteList = async () => {
  const { data } = await getSalesSiteList()
  siteList.value = data
  siteAddList.value = siteList.value.filter((item) => item.label !== '沃尔玛US美国')
}
const costLoading = ref<boolean>(false)
// 获取成本核算数据
const fetchData = async () => {
  costLoading.value = true
  queryForm.sku = props.sku
  queryForm.siteId = props.selectedSite !== undefined ? props.selectedSite : 0
  const { data } = await getOperationAmazonCostList(queryForm)
  list.value = data.list
  total.value = data.total
  costLoading.value = false
}
const packagingInformation = ref<IGetOperationAmazonPackagingInformationRes>()
const packagingLoading = ref<boolean>(false)
const route = useRoute()
const fetchPackagingInformation = async () => {
  if (!props.sku) {
    return
  }
  // 优先使用 props.selectedSite，如果没有则从 route.query.site 获取
  const siteId = props.selectedSite !== undefined ? props.selectedSite : route.query.site ? Number(route.query.site) : undefined
  // 检查 siteId 是否为 undefined 或 null，而不是使用 !siteId（因为 0 也是 falsy）
  if (siteId === undefined || siteId === null) {
    return
  }
  packagingLoading.value = true
  try {
    const { data } = await getOperationAmazonPackagingInformation({ sku: props.sku, site: siteId })
    packagingInformation.value = data
  } finally {
    packagingLoading.value = false
  }
}
// 获取支出构成数据
const fetchExpenseComposition = async () => {
  if (!props.sku) {
    data1.value = []
    totalValue.value = 0
    expenseSymbol.value = '$'
    return
  }
  if (!props.startDate || !props.endDate) {
    data1.value = []
    totalValue.value = 0
    expenseSymbol.value = '$'
    return
  }
  const siteId = props.selectedSite !== undefined ? props.selectedSite : 0
  expenseLoading.value = true
  try {
    const { data } = await getExpenseComposition({
      sku: props.sku,
      siteId,
      startDate: props.startDate,
      endDate: props.endDate,
    })
    // 后端返回的数据格式是 { name, value }，直接使用
    data1.value = data.list || []
    totalValue.value = data.totalExpenditure ?? 0
    expenseSymbol.value = data.symbol || '$'
  } catch (error) {
    console.error('获取支出构成数据失败:', error)
    data1.value = []
    totalValue.value = 0
    expenseSymbol.value = '$'
  } finally {
    expenseLoading.value = false
  }
}
// 获取库龄数据
const fetchStorageAge = async () => {
  if (!props.sku) {
    data2.value = []
    return
  }
  const siteId = props.selectedSite !== undefined ? props.selectedSite : 0
  storageAgeLoading.value = true
  try {
    const { data } = await getStorageAge({ sku: props.sku, siteId })
    // 后端返回的数据格式是 { name, value }，直接使用
    data2.value = data || []
  } catch (error) {
    console.error('获取库龄数据失败:', error)
    data2.value = []
  } finally {
    storageAgeLoading.value = false
  }
}
watch(
  () => [props.sku, props.selectedSite],
  () => {
    if (props.sku) {
      fetchData()
      fetchPackagingInformation()
      fetchStorageAge()
      // 如果日期范围已选择，重新获取图表数据
      if (card4DateRange.value[0] && card4DateRange.value[1]) {
        fetchSkuSiteDailyCost()
      }
    }
  },
  { immediate: false }
)
watch(
  () => [props.sku, props.selectedSite, props.startDate, props.endDate],
  () => {
    if (props.startDate && props.endDate) {
      fetchExpenseComposition()
    }
  }
)
onBeforeMount(() => {
  fetchCostAccountingChannelData()
  // fetchSalesSiteList()
  // 初始化时，如果 props 有值，手动触发一次数据获取
  // 避免 watch 的 immediate 在组件创建时立即触发
  if (props.sku) {
    fetchData()
    fetchPackagingInformation()
    fetchExpenseComposition()
    fetchStorageAge()
    // 如果日期范围已设置，获取图表数据
    if (card4DateRange.value[0] && card4DateRange.value[1]) {
      fetchSkuSiteDailyCost()
    }
  }
})

onMounted(() => {
  // console.log(var(--el-font-size-base));
})
</script>

<style lang="scss" scoped>
.cost-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .none {
    display: none;
  }
  .el-table {
    flex: 1;
  }
  .card1 {
    :deep() {
      .el-card__header {
        border-bottom: 0;
      }
      .el-card__body {
        padding-top: 0;
        padding-left: 0;
      }
    }
  }
  .table-item {
    position: relative;
    padding-left: 13px;

    &::before {
      position: absolute;
      top: 50%;
      left: -5px;
      width: 10px;
      height: 10px;
      content: '';
      background-color: var(--dot-color, gray);
      border-radius: 16px;
      transform: translateY(-50%);
    }
  }
  .card2 {
    :deep() {
      .el-card__header {
        padding-bottom: 0;
        border-bottom: 0;
      }
      .el-card__body {
        padding-top: 0;
        padding-left: 0;
      }
    }
  }
  .card4 {
    :deep() {
      .el-card__body {
        padding: 0;
      }
    }
  }
  .custom-cancel {
    width: 1em;
    height: 1em;
    margin-left: 2px;
    &:hover {
      color: #4e88f3;
      cursor: pointer;
    }
  }
}
</style>
