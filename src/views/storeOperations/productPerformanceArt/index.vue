<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="亚马逊" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点">
                <el-select
                  v-model="queryForm.site"
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
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                      所有
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="currency" clearable placeholder="请选择币种" @change="changeCurrency">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: bold;" >数据更新时间: 2025年1月16日09:34</el-text>
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
              <vab-draggable v-model="columns" :animation="600" filter=".non-draggable" handle=".handle" :on-move="handleMove">
                <div
                  v-for="item in columns"
                  :key="item.label"
                  :class="{'non-draggable': item.disableCheck}"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base); " 
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-hover" style="display: flex; align-items: center;">
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer; " @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm" @submit.prevent >
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @click="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle" class="noneHoverTable" :data="list"
          :header-cell-style="{ textAlign: 'center' }"
        >
          <el-table-column
            v-for="(item, index) in checkList"
            :key="index"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '小类排名'">
                小类排名
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '大类排名'">
                大类排名
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === 'VOC满意度'">
                VOC满意度
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告
                <br />
                转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告
                <br />
                点击
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)" >
                  <template #error><el-icon/></template>
                </el-image>
              </span>
              <span v-if="item.label === 'SKU'">
                {{ row.sku }}
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rating }}</span>
                  <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
                  <span class="rate-count">{{ row.commentsNumbers }}</span>
                </div>
              </span>
              <span v-if="item.label === 'ASIN'" >
                <el-link type="primary" >{{ row.asin }}</el-link>
              </span>
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary" >{{ row.parentAsin }}</el-link>
              </span>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                <div style="width: 100%; height: 50px;">
                  <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
                </div>
              </span>
              <span v-if="item.label === '上新'">
                {{ row.newArrivalDay != null ? row.newArrivalDay + '天' : '' }}
              </span>
              <span v-if="item.label === '停产'">
                <el-checkbox v-model="row.stopProductStatus" :false-value="0" :true-value="1" />
              </span>
              <span v-if="item.label === 'VOC满意度'">
                <el-tag v-if="row.vocSatisfaction === 0" class="customTag customTag-veryPoor">
                  Very poor
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 1" class="customTag customTag-fair">
                  Fair
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 2" class="customTag customTag-poor">
                  Poor
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 3" class="customTag customTag-good">
                  Good
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 4" class="customTag customTag-excellent">
                  Excellent
                </el-tag>
              </span>
              <span v-if="item.label === '小类排名'">
                <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking !== 0">
                  <div>{{ row.nowSubcategoryRanking }}</div>
                  <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                  <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
                  <span style="color: #999">{{ Math.abs(row.nowSubcategoryRanking - row.beforeSubcategoryRanking) }}</span>
                </div>
                <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking === 0">
                  <el-space>
                    {{ row.nowSubcategoryRanking }}
                    <span style="font-weight: 600;">-</span>
                  </el-space>
                </div>
              </span>
              <span v-if="item.label === '大类排名'">
                <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking !== 0">
                  <div>{{ row.nowMajorCategoryRanking }}</div>
                  <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                  <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking > 0" class="arrow-down" icon="arrow-down-fill"/>
                  <span style="color: #999">{{ Math.abs(row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking) }}</span>
                </div>
                <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking === 0">
                  <el-space>
                    {{ row.nowMajorCategoryRanking }}
                    <span style="font-weight: 600;">-</span>
                  </el-space>
                </div>
              </span>
              <span v-if="item.label === '开发人员'">
                <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ row._developNameFull }}</div>
                  </template>
                  <span v-html="row._developName"></span>
                </el-tooltip>
              </span>
              <span v-if="['月退货%', '月退款%', 'VOC缺陷%'].includes(item.label)" >
                {{ row[item.prop] != null ? row[item.prop].toFixed(2) + '%' : '' }}
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
      </el-tab-pane>
      <el-tab-pane label="沃尔玛" :name="1" />
      <el-tab-pane label="Tiktok" :name="2" />
    </el-tabs>
    
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Search, Star } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { getCurrencyList, getCurrencySKUAmazonOperation, getOperationAmazonArtDesignList, updateCurrencySKUAmazonOperation } from '/@/api/devlocal/productPerformance'
import { getAmazonStars } from '/@/utils/rate'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductPerformanceArt'
})
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const activeName = ref<number>(0)
const currency = ref<number | undefined>(0)
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const siteList = ref<{ id: number, label: string }[]>([])
const currencyList = ref<{ id: number, label: string }[]>([])
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  site: [],
  pageNo: 1,
  pageSize: 20
})
const { site } = toRefs(queryForm)
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const columns = ref<any>([
  {
    label: '图片',
    prop: 'skuImgUrl',
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
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: '父体ASIN',
    prop: 'parentAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
    isFixed: 'left'
  },
  {
    label: '今销量',
    prop: 'currentSalesNumber',
    checked: true,
    minWidth: 90,
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 180,
  },
  {
    label: '今销',
    prop: 'currentSalesPrice',
    checked: true,
    minWidth: 90,
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 100,
  },
  {
    label: '站点',
    prop: 'siteName',
    checked: true,
    minWidth: 150,
  },
  {
    label: '小类排名',
    prop: 'nowSubcategoryRanking',
    checked: true,
    minWidth: 120,
  },
  {
    label: '大类排名',
    prop: 'nowMajorCategoryRanking',
    checked: true,
    minWidth: 120,
  },
  {
    label: 'VOC满意度',
    prop: 'vocSatisfaction',
    checked: true,
    minWidth: 130,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    checked: true,
    minWidth: 130,
  },
  {
    label: '上新',
    prop: 'newArrivalDay',
    checked: true,
    minWidth: 90,
  },
  {
    label: '停产',
    prop: 'stopProductStatus',
    checked: true,
    minWidth: 60,
  },
  {
    label: '2周广告转化',
    prop: 'tWksAdvRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '2周广告点击',
    prop: 'tWksClickRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '2周总转化',
    prop: 'tWksTotalConv',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退货%',
    prop: 'monthReturnGoods',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退款%',
    prop: 'monthRefund',
    checked: true,
    minWidth: 100,
  },
  
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'VOC缺陷%',
    prop: 'vocDefect',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC缺陷#',
    prop: 'vocNcxCount',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC总订单',
    prop: 'vocTotalOrderCount',
    checked: true,
    minWidth: 110,
  },
  {
    label: '产品描述',
    prop: '',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品经理',
    prop: '',
    checked: true,
    minWidth: 100,
  },
])
const handleTabClick = () => {
  //
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
    queryForm.site = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    queryForm.site = []
    // 取消全选获取数据
    queryData()
  }
}
const changeCurrency = async () => {
  const { data } = await updateCurrencySKUAmazonOperation({ currency: currency.value! })
  if (data) {
    queryData()
  }
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 处理自适应宽度
const handleWidth = (item: any) => {
  
  switch (item.label) {
    case 'SKU': {
      return flexColumnWidth(list.value, 'SKU-SKU-SKU-SKU-', 'sku')
    }
    case 'ASIN': {
      return flexColumnWidth(list.value, 'ASIN', 'asin')
    }
    case '父体ASIN': {
      return flexColumnWidth(list.value, '父体ASIN', 'parentAsin')
    }
    default: {
      return item.minWidth
    }
  }
}
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
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', 'ASIN', '父体ASIN', '最近入库', '产品描述'].includes(label)) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
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
const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data
}

const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
const fetchData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const siteIds = site.join(',')
  const { data } = await getOperationAmazonArtDesignList({
    ...filterQueryForm,
    siteIds
  })
  if (data) {
    total.value = data.total
    list.value = data.list
    list.value.forEach((item: any) => {
      item.displayRating = computed(() => getAmazonStars(item.rating!, item.commentsNumbers));
      item.saleTrendList = {
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
      }
    })
  }
  listLoading.value = false
}
const fetchCurrency = async () => {
  const { data } = await getCurrencySKUAmazonOperation()
  currency.value = data
}
onBeforeMount(() => {
  fetchCurrencyList()
  fetchCurrency()
  fetchSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .left-panel {
            margin-bottom: 0;
          }
          .el-form {
            .el-form-item:first-child {
              .el-check-tag,
              .el-form-item__label {
                margin: 0 5px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */

  &:hover {
    color: var(--el-color-primary);
    background-color: #f2f2f2; /* 浅灰色背景 */
  }
}
.disabled-handle {
  cursor: not-allowed;
}

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
  }
}
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

.arrow-up {
  margin-left: 3px;
  font-weight: 600;
  color: #ff3f48; 
  transform: scale(0.9, 1.4);  
  
}
.arrow-down {
  margin-left: 3px;
  font-weight: 600;
  color: #67C23A;
  transform: scale(0.9, 1.4);  
}
</style>