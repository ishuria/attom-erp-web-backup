<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="站点">
            <el-select></el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select></el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">发货数检查</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">平滑指数设定</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">春节备货</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form :model="queryForm" inline @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" /> 
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table :data="fakeData" border class="noneHoverTable" :header-cell-style="{ textAlign: 'center' }" :cell-class-name="clearPadding">
      <el-table-column
        v-for="item in columns"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        :fixed="item.isFixed"
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
            <el-image :src="row.componentImage" style="width: 75px; height: 75px; display: block;" fit="fill" @click="imagePreviewShow(row.componentImage)" >
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </span>
          <span v-if="item.label === 'ASIN'">
            <el-link type="primary">{{ row.asin }}</el-link>
            <div class="rate-wrapper">
              <span class="rate-value">{{ row.rate }}</span>
              <span><el-rate v-model="row.rate" :void-icon="Star" disabled class="custom-rate" /></span>
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
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
  </div>
</template>

<script setup lang="ts">
import { Search, Star } from '@element-plus/icons-vue'
import { removeHtmlTags } from '/@/utils/tableColum'

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
const fakeData = [
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    asin: 'ASIN12345',
    rate: 3.5
  }
]
const columns = ref<any>([
  {
    label: '图片',
    prop: 'componentImage',
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
    prop: 'todaySell',
    minWidth: 90,
  },
  {
    label: '销量趋势',
    prop: 'trend',
    minWidth: 180,
  },
  {
    label: '库存可售',
    prop: 'stockSale',
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'saleTransit',
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'remark',
    minWidth: 150,
  },
  {
    label: '运营',
    prop: 'remark',
    minWidth: 150,
  },
  {
    label: '运营分类',
    prop: 'remark',
    minWidth: 150,
  },
  {
    label: '月销量',
    prop: 'monthlySell',
    minWidth: 90,
  },
  {
    label: '月销售额',
    prop: 'monthlySales',
    minWidth: 100,
  },
  {
    label: '月净利润',
    prop: 'monthlyNetProfit',
    minWidth: 100,
  },
  {
    label: '库龄',
    prop: 'storageAge',
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: 'remainingStock',
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'receiving',
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyStorage',
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'totalStorage',
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: 'order',
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
    prop: 'sign',
    minWidth: 90,
  },
  {
    label: '装箱#',
    prop: 'sign',
    minWidth: 90,
  },
  {
    label: '最晚补货',
    prop: 'sign',
    minWidth: 90,
  },
  {
    label: '今补',
    prop: 'sign',
    minWidth: 90,
  },
  {
    label: '今补广',
    prop: 'sign',
    minWidth: 90,
  },
  {
    label: '操作',
    prop: 'suggestions',
    minWidth: 100,
  },
  {
    label: '当前售价',
    prop: 'currentPrice',
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
    prop: 'monthlyACOS',

    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthlyTACOS',
    minWidth: 100,
  },
  {
    label: '月退货%',
    prop: 'monthlyReturns',
    minWidth: 100,
  },
])
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
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
</script>

<style lang="scss" scoped>
.rate-wrapper {
  display: flex; 
  align-items: center; 
  gap: 8px;

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
    color: #36788C;
    margin-left: -11px;
  }
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
</style>