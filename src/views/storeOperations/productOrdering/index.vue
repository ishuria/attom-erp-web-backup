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
              placeholder="请选择站点"
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
            <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" @change="queryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showQuantityCheck">发货数检查</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="smoothSettingVisible = true">平滑指数设定</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="filterVisible = true">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="stockUpVisible = true">春节备货</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" /> 
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      border 
      :cell-class-name="clearPadding" 
      :cell-style="cellStyle" 
      class="noneHoverTable" :data="fakeData" :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="item.minWidth"
        :prop="item.prop"
        :width="item.width"
      >
        <template #header>
          <span v-if="item.label==='库存可售'">
            库存<br />可售
          </span>
          <span v-if="item.label==='可售含在途'">
            库存<br />含在途
          </span>
        </template>
        <template #default="{ row }">
          <span v-if="item.label === '图片'">
            <el-image fit="fill" :src="row.componentImage" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.componentImage)" >
              <template #error>
                <el-icon/>
              </template>
            </el-image>
          </span>
          <span v-if="item.label === 'ASIN'">
            <el-link type="primary">{{ row.asin }}</el-link>
            <div class="rate-wrapper">
              <span class="rate-value">{{ row.rate }}</span>
              <span><el-rate v-model="row.rate" class="custom-rate" disabled :void-icon="Star" /></span>
              <span class="rate-count">{{ 484 }}</span>
            </div>
          </span>
          <span v-if="item.label === 'SKU'">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.sku) }}</div>
              </template>
              <span>{{ removeHtmlTags(row.sku) }}</span>
            </el-tooltip>
          </span>
          <span v-if="item.label === '销量趋势'">
            <div style="width: 100%; height: 59px">
              <vab-echarts-chart-bar :x-axis-data="row.saleTrendList.xAxis" :y-axis-data="row.saleTrendList.yAxis" />
            </div>
          </span>
          <span v-if="item.label === '广告'">
            <el-tag v-if="row.ad === 0" type="danger">关</el-tag>
            <el-tag v-if="row.ad === 1" type="success">开</el-tag>
          </span>
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
              v-model="filterForm.number1"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="filterForm.number2"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="上新天数">
          <div class="flex">
            <el-input-number
              v-model="filterForm.number3"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="filterForm.number4"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="库存可售">
          <div class="flex">
            <el-input-number
              v-model="filterForm.number5"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="filterForm.number6"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="上海签收">
          <div class="flex">
            <el-input-number
              v-model="filterForm.number7"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="filterForm.number8"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
        <el-form-item label="最晚补货">
          <div class="flex">
            <el-input-number
              v-model="filterForm.number9"
              :min="0"
              placeholder="最小值"
              style="flex: 1"
            />
            <span style="color: #303133; white-space: nowrap;">至</span>
            <el-input-number
              v-model="filterForm.number10"
              :min="0"
              placeholder="最大值"
              style="flex: 1"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 平滑指数设定 -->
    <vab-dialog
      v-model="smoothSettingVisible"
      title="平滑指数设定"
      width="20%"
    >
      <el-form label-position="top">
        <el-form-item label="平滑指数">
          <el-input type="number" />
        </el-form-item>
        <el-form-item label="新款平滑指数设定">
          <el-input type="number" />
        </el-form-item>
        <el-form-item label="上新天数设定">
          <el-input type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="smoothSettingVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 发货数检查 -->
    <vab-dialog
      v-model="quantityCheckVisible"
      title="发货数检查"
    >
      <el-table border :cell-style="{ textAlign: 'center' }" class="noneHoverTable" :data="fakeCheckData" :header-cell-style="{ textAlign: 'center' }" stripe>\
        <el-table-column type="selection"/>
        <el-table-column label="发货计划" prop="date"/>
        <el-table-column label="产品数量" prop=""/>
        <el-table-column label="重量" prop=""/>
        <el-table-column label="体积" prop=""/>
        <el-table-column label="箱数" prop=""/>
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
          <el-checkbox />
        </el-form-item>
        <el-form-item label="节后开工日期" label-position="top">
          <el-date-picker v-model="stockUpForm.date" type="date" value-format="YYYY-MM-DD"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockUpVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search, Star } from '@element-plus/icons-vue'
import { removeHtmlTags } from '/@/utils/tableColum'
import type { CheckboxValueType, FormInstance } from 'element-plus'
import type { CSSProperties } from 'vue'
import type { IGetOperationOrderListReq } from '/@/type/storeOperation/productOrdering'
import { getDistributionOptionUserList, getDistributionSiteList } from '~/src/api/devlocal/productDistribution'

const smoothSettingVisible = ref<boolean>(false)
const quantityCheckVisible = ref<boolean>(false)
const stockUpVisible = ref<boolean>(false)
const stockUpForm = reactive<any>({})
const filterVisible = ref<boolean>(false)
const filterForm = reactive<any>({})
const filterFormRef = ref<FormInstance>()
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const checkAll = ref<boolean>(true)
const indeterminate = ref<boolean>(false)
const site = ref<number[]>([])
const siteList = ref<{ id: number, label: string }[]>([])
const operateUserList = ref<{ id: number, label: string }[]>([])
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
const fakeCheckData = [
  {
    date: '2025-01-02'
  }
]
const fakeData = [
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    asin: 'ASIN12345',
    rate: 3.5,
    ad: 0,
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
  }
]
const columns = ref<any>([
  {
    label: '图片',
    prop: 'asinImgUrl',
    width: 75,
    isFixed: 'left'
  },
  {
    label: 'ASIN',
    prop: 'asin',
    minWidth: 170,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    minWidth: 140,
    isFixed: 'left'
  },
  {
    label: '今销#',
    prop: 'currentSalesNumber',
    minWidth: 90,
  },
  {
    label: '销量趋势',
    prop: 'trend',
    minWidth: 180,
  },
  {
    label: '库存可售',
    prop: '',
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'esAvailableSaleDayTotal',
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'advertisementStatus',
    minWidth: 90,
  },
  {
    label: '运营',
    prop: 'operationUserName',
    minWidth: 150,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    minWidth: 150,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    minWidth: 90,
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    minWidth: 100,
  },
  {
    label: '月净利润',
    prop: '',
    minWidth: 100,
  },
  {
    label: '库龄',
    prop: 'inventoryAge',
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: '',
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'acceptingCount',
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'inboundStorageTotal',
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: 'orderCount',
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: 'order',
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'sign',
    minWidth: 90,
  },
  {
    label: '推荐#',
    prop: 'recommendCount',
    minWidth: 90,
  },
  {
    label: '装箱#',
    prop: '',
    minWidth: 90,
  },
  {
    label: '最晚补货',
    prop: 'latestRestock',
    minWidth: 90,
  },
  {
    label: '今补',
    prop: 'nowSupplement',
    minWidth: 90,
  },
  {
    label: '今补广',
    prop: 'nowSupplementAdv',
    minWidth: 90,
  },
  {
    label: '操作',
    prop: '',
    minWidth: 100,
  },
  {
    label: '当前售价',
    prop: 'sellingPrice',
    minWidth: 100,
  },
  {
    label: '毛利率',
    prop: 'trialGrossProfit',
    minWidth: 100,
  },
  {
    label: '月有货率',
    prop: 'monthlyNetInterestRate',
    minWidth: 100,
  },
  {
    label: '月广告售%',
    prop: 'monthlyAdSales',
    minWidth: 110,
  },
  {
    label: '月ACOS',
    prop: 'monthAcos',

    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthTacos',
    minWidth: 100,
  },
  {
    label: '月退货%',
    prop: 'monthlyReturns',
    minWidth: 100,
  },
])
const listLoading = ref<boolean>(false)
const queryForm = reactive<IGetOperationOrderListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  operationUserId: -1,
  sites: ''
})
const total = ref<number>(0)

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 8) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
  site.value = siteList.value.map((_) => _.id)
}
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
onBeforeMount(() => {
  fetchSiteList()
  fetchOperateUserList()
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
.flex {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}
</style>