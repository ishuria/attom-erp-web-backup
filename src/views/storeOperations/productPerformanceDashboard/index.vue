<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select />
          </el-form-item>
          <el-form-item label="展示级别">
            <el-select v-model="queryForm.level" style="width: 7em;" >
              <el-option 
                v-for="item in levelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="币种">
            <el-select />
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operations" style="width: 5em;" >
              <el-option 
                v-for="item in operationsOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开发人">
            <el-select v-model="queryForm.developer" style="width: 5em;" >
              <el-option 
                v-for="item in developerOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">运营分类设定</el-button>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" >关键词排名趋势</el-button>
          </el-form-item>
          <el-form-item >
            <el-text style="margin-left: 10px; font-weight: 600;">数据更新时间：2024年12月22日14:02</el-text>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="4">
        <el-popover :width="240" popper-style="max-height: 550px; overflow: auto;">
          <template #reference>
            <el-button>
              <vab-icon icon="settings-line" />
            </el-button>
          </template>
          <vab-draggable v-model="columns" :animation="600" handle=".handle" filter=".non-draggable" :onMove="handleMove">
            <div
              v-for="item in columns"
              :key="item.label"
              style="font-size: var(--el-font-size-base); display: flex; align-items: center;"
              :class="{'non-draggable': item.disableCheck}" 
            >
              <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
              <span style="flex: 1">{{ item.label }}</span>
              <span v-if="item.disableCheck" style="display: flex; align-items: center;" class="icon-hover">
                <el-icon><View /></el-icon>
              </span>
              <span v-else @click="handleChecked(item)" class="icon-hover" style="cursor: pointer; display: flex; align-items: center;">
                <el-icon v-show="!item.checked"><Hide /></el-icon>
                <el-icon v-show="item.checked"><View /></el-icon>
              </span>
            </div>
          </vab-draggable>
        </el-popover>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      class="noneHoverTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :cell-class-name="clearPadding" 
      :data="fakeData"
    >
      <el-table-column
        v-for="(item, index) in checkList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :minWidth="item.minWidth || 100"
        :fixed="item.isFixed"
      >
        <template #header>
          <span v-if="item.label === '销量趋势(点击看明细)'">
            销量趋势<br />(点击看明细)
          </span>
        </template>
        <template #default="{ row }">
          <span v-if="item.label === '图片'">
            <el-image :src="row.componentImage" style="width: 75px; height: 75px; display: block;" fit="fill" @click="imagePreviewShow(row.componentImage)" >
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </span>
          <span v-if="item.label === '运营分类'">
            <el-select style="min-width: 100%;">
              <el-option 
                v-for="item in classOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hideOnClickModal/>
  </div>
</template>

<script lang="ts" setup>
import { Search, View, Hide } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'

const fakeData = ref<any>([
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    asin: 'B08N5M7S6K',
    pAsin: 'B08N5M7S6K',
    trend: '点击看明细',
    todaySell: 100,
    todayOrder: 50,
    todaySellD: 1500,
    todayAd: 10,
    ad: 500,
    pieChart: 'https://example.com/piechart1.png',
    seasonalCoefficient: 1.5,
    classify: '电子产品',
    sRank: 5,
    bRank: 2,
    topProduct: 200,
    remark: '备注信息1',
    monthlyStorageFee: 100,
    currentPrice: 29.99,
    trialGrossProfit: 10.5,
    fba: '是',
    conversion: 12,
    click: 300,
    totalConvert: 25,
    monthlySell: 1500,
    monthlyNetProfit: 5000,
    monthlySales: 45000,
    monthlyNetInterestRate: 11.1,
    monthlyAdSales: 1500,
    monthlyAdSpend: 800,
    monthlyAd: 30,
    monthlyACOS: 15,
    monthlyTACOS: 10,
    yearACOS: 12,
    yearTACOS: 8,
    removeValue: 100,
    remove: 5,
    replaceValue: 200,
    replace: 10,
    monthlyReturns: 3,
    monthlyRefund: 2,
    VOCSatisfaction: 90,
    VOCDefectP: 1,
    VOCDefect: 10,
    VOCOrder: 200,
    newReleases: 20,
    storageAge: 30,
    remainingStock: 100,
    receiving: 50,
    recentlyStorage: 200,
    totalStorage: 500,
    stockSale: 300,
    saleTransit: 100,
    outOfStock: 0,
    order: 150,
    sign: '已签收',
    monthlyAvailabilityRate: 95,
    lowFeeDays: 5,
    estimatedFees: 2000,
    profitLossPrice: 18,
    profitPrice: 22,
    suggestions: '增加广告投放',
    status: '正常',
    productDes: '这是一款电子产品',
    person: '张三'
  },
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU67890',
    asin: 'B08XYZ1234',
    pAsin: 'B08XYZ1234',
    trend: '点击看明细',
    todaySell: 200,
    todayOrder: 100,
    todaySellD: 2500,
    todayAd: 15,
    ad: 800,
    pieChart: 'https://example.com/piechart2.png',
    seasonalCoefficient: 1.8,
    classify: '家居用品',
    sRank: 3,
    bRank: 1,
    topProduct: 400,
    remark: '备注信息2',
    monthlyStorageFee: 150,
    currentPrice: 45.99,
    trialGrossProfit: 15.5,
    fba: '否',
    conversion: 10,
    click: 500,
    totalConvert: 20,
    monthlySell: 2000,
    monthlyNetProfit: 7000,
    monthlySales: 80000,
    monthlyNetInterestRate: 8.75,
    monthlyAdSales: 2500,
    monthlyAdSpend: 1200,
    monthlyAd: 24,
    monthlyACOS: 14,
    monthlyTACOS: 9,
    yearACOS: 13,
    yearTACOS: 7,
    removeValue: 200,
    remove: 3,
    replaceValue: 400,
    replace: 12,
    monthlyReturns: 2,
    monthlyRefund: 1,
    VOCSatisfaction: 85,
    VOCDefectP: 2,
    VOCDefect: 5,
    VOCOrder: 300,
    newReleases: 15,
    storageAge: 25,
    remainingStock: 200,
    receiving: 70,
    recentlyStorage: 150,
    totalStorage: 600,
    stockSale: 350,
    saleTransit: 120,
    outOfStock: 0,
    order: 180,
    sign: '未签收',
    monthlyAvailabilityRate: 98,
    lowFeeDays: 4,
    estimatedFees: 2500,
    profitLossPrice: 22,
    profitPrice: 26,
    suggestions: '增加促销活动',
    status: '待处理',
    productDes: '这是一款家居用品',
    person: '李四'
  }
])
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const columns = ref<any>([
  {
    label: '图片',
    prop: 'componentImage',
    disableCheck: true,
    checked: true,
    width: 75,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: 'ASIN',
    prop: 'asin',
    checked: true,
    minWidth: 80,
  },
  {
    label: '父体ASIN',
    prop: 'pAsin',
    checked: true,
    minWidth: 110,
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 120,
  },
  {
    label: '今销#',
    prop: 'todaySell',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今单#',
    prop: 'todayOrder',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今销$',
    prop: 'todaySellD',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今广%',
    prop: 'todayAd',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'ad',
    checked: true,
    minWidth: 80,
  },
  {
    label: '饼图',
    prop: 'pieChart',
    checked: true,
    minWidth: 100,
  },
  {
    label: '季节系数',
    prop: 'seasonalCoefficient',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营分类',
    prop: 'classify',
    checked: true,
    minWidth: 130,
  },
  {
    label: '小类排名',
    prop: 'sRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: '大类排名',
    prop: 'bRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: '头部产品#',
    prop: 'topProduct',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营备注',
    prop: 'remark',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月仓储费',
    prop: 'monthlyStorageFee',
    checked: true,
    minWidth: 100,
  },
  {
    label: '当前售价',
    prop: 'currentPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '试算毛利',
    prop: 'trialGrossProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'FBA',
    prop: 'fba',
    checked: true,
    minWidth: 80,
  },
  {
    label: '2周广告转化',
    prop: 'conversion',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周广告点击',
    prop: 'click',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周总转化',
    prop: 'totalConvert',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月销量',
    prop: 'monthlySell',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月净利润',
    prop: 'monthlyNetProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月销售额',
    prop: 'monthlySales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月净利率',
    prop: 'monthlyNetInterestRate',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月广告销售',
    prop: 'monthlyAdSales',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告支出',
    prop: 'monthlyAdSpend',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告%',
    prop: 'monthlyAd',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月ACOS',
    prop: 'monthlyACOS',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthlyTACOS',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年ACOS',
    prop: 'yearACOS',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年TACOS',
    prop: 'yearTACOS',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移除货值',
    prop: 'removeValue',
    checked: true,
    minWidth: 100,
  },
  {
    label: '移除%',
    prop: 'remove',
    checked: true,
    minWidth: 90,
  },
  {
    label: '替换货值',
    prop: 'replaceValue',
    checked: true,
    minWidth: 100,
  },
  {
    label: '替换%',
    prop: 'replace',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月退货%',
    prop: 'monthlyReturns',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退款%',
    prop: 'monthlyRefund',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'VOC满意度',
    prop: 'VOCSatisfaction',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC缺陷%',
    prop: 'VOCDefectP',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC缺陷#',
    prop: 'VOCDefect',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC总订单',
    prop: 'VOCOrder',
    checked: true,
    minWidth: 110,
  },
  {
    label: '上新',
    prop: 'newReleases',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库龄',
    prop: 'storageAge',
    checked: true,
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: 'remainingStock',
    checked: true,
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'receiving',
    checked: true,
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'totalStorage',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库存可售',
    prop: 'stockSale',
    checked: true,
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'saleTransit',
    checked: true,
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    checked: true,
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: 'order',
    checked: true,
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'sign',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月有货率',
    prop: 'monthlyAvailabilityRate',
    checked: true,
    minWidth: 100,
  },
  {
    label: '低量仓储费天数',
    prop: 'lowFeeDays',
    checked: true,
    minWidth: 140,
  },
  {
    label: '预估下月仓储费',
    prop: 'estimatedFees',
    checked: true,
    minWidth: 140,
  },
  {
    label: '盈亏售价',
    prop: 'profitLossPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '30毛利售价',
    prop: 'profitPrice',
    checked: true,
    minWidth: 110,
  },
  {
    label: '操作建议',
    prop: 'suggestions',
    checked: true,
    minWidth: 100,
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品描述',
    prop: 'productDes',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品经理',
    prop: 'person',
    checked: true,
    minWidth: 100,
  },
])
const levelOption = [
  {
    label: 'SKU',
    value: 0
  },
  {
    label: 'ASIN',
    value: 1
  },
  {
    label: '父体ASIN',
    value: 2
  }
]
const operationsOption = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '王鑫',
    value: 1
  },
  {
    label: '赵前程',
    value: 2
  },
]
const developerOption = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '王宏',
    value: 1
  },
  {
    label: '王文育',
    value: 2
  },
  {
    label: '任佳茗',
    value: 3
  },
]
const classOption = [
  {
    label: '每日关注',
    value: 0
  },
  {
    label: '停产',
    value: 1
  }
]
const handleChecked = (item: any) => {
  item.checked = !item.checked
}
const handleMove = (event: any) => {
  const { related  } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false; // 禁止移动到目标
  }

  return true; // 允许其他操作
}

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const queryForm = reactive<any>({

})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  // fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  background-color: #f2f2f2; /* 浅灰色背景 */
  color: var(--el-color-primary);
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.reduce-padding .cell) {
  padding-right: 2px;
  padding-left: 2px;
}
.disabled-handle {
  cursor: not-allowed;
}
</style>