<template>
  <div class="default-table-detail-container">
    <div style="display: flex; align-items: center">
      <el-page-header :content="'商品分析和操作日志'" @back="goBack" />
      <el-select
        v-model="selectedSite"
        placeholder="请选择站点"
        style="width: 200px; margin-top: -20px; margin-left: -20px"
        @change="handleSiteChange"
      >
        <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
    </div>
    <el-row class="main-content-row" :gutter="20">
      <!-- 左侧 -->
      <el-col :span="18">
        <div style="position: relative">
          <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="趋势总览" :name="0">
              <vab-trend-overview
                v-if="activeName === 0"
                :asin="asin"
                :compare-type="compareType"
                :select-date-range="selectDateRange"
                :select-field="selectField"
                :selected-site="selectedSite"
                :selected-sku="selectedSku"
              />
            </el-tab-pane>
            <el-tab-pane label="SP广告饼图" :name="1">
              <vab-ad-pie-tab v-if="activeName === 1" />
            </el-tab-pane>
            <el-tab-pane label="产品成本分析" :name="2">
              <vab-cost-analysis v-if="activeName === 2" :selected-site="selectedSite" :sku="sku" />
            </el-tab-pane>
            <el-tab-pane label="评论Reviews" :name="3">
              <vab-comment-reviews v-if="activeName === 3" />
            </el-tab-pane>
            <el-tab-pane label="退货分析" :name="4">
              <vab-return-analysis v-if="activeName === 4" />
            </el-tab-pane>
            <el-tab-pane label="竞品" :name="5" />
          </el-tabs>
          <!-- tab右边的选项 -->
          <div style="position: absolute; top: 0px; right: -9px">
            <el-form v-if="activeName === 0" inline>
              <el-form-item label="展示">
                <el-select v-model="selectField">
                  <el-option
                    v-for="item in levelOption"
                    :key="item.value"
                    :disabled="item.value === 2"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="selectField === 0 && skuOptions.length > 1" label="SKU">
                <el-select v-model="selectedSku" placeholder="请选择SKU">
                  <el-option v-for="item in skuOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="compareType">
                  <el-radio style="margin-right: 10px" :value="0">同比</el-radio>
                  <el-radio :value="1">环比</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="selectDateRange"
                  :disabled-date="(time: Date) => time.getTime() > Date.now()"
                  end-placeholder="结束日期"
                  range-separator="至"
                  :shortcuts="dateShortcuts"
                  start-placeholder="开始日期"
                  type="daterange"
                />
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 1" inline>
              <el-form-item>
                <el-select>
                  <el-option v-for="item in adOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-checkbox>跳过无数据</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-select>
                  <el-option v-for="item in dayOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" type="daterange" />
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 2" inline>
              <el-form-item v-if="isSingle">
                <el-text>SKU: {{ queryForm3.sku }}</el-text>
              </el-form-item>
              <el-form-item v-else label="SKU">
                <el-select v-model="queryForm3.sku" placeholder="请选择SKU" @change="handleChangeSku">
                  <el-option v-for="item in skuOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select>
                  <el-option v-for="item in dateOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" type="daterange" />
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 3" inline>
              <el-form-item>
                <el-select>
                  <el-option v-for="item in dateOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" type="daterange" />
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 4" inline>
              <el-form-item>
                <el-radio-group v-model="returnRadio">
                  <el-radio-button label="退货时间" :value="0" />
                  <el-radio-button label="下单时间" :value="1" />
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-select>
                  <el-option v-for="item in dayOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" type="daterange" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col :span="6">
        <div class="right-sidebar">
          <product-info-card v-loading="productInfoLoading" :product-info="productInfo" />
          <!-- 运营备注 -->
          <div class="operation-remark" style="margin-bottom: 20px">
            <div style="margin-bottom: 10px">
              <el-text>运营备注</el-text>
              <el-select v-model="operationTypeId" style="width: 30%; margin-left: 10px" @change="handleChangeOperationType">
                <el-option v-for="item in operationTypeList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </div>
            <el-input
              v-model="operationRemark"
              placeholder="请输入运营备注"
              resize="none"
              :rows="6"
              style="width: 100%"
              type="textarea"
              @change="handleChangeOperationRemark"
            />
          </div>
          <!-- 操作日志/事件清单 -->
          <operation-log-card
            :asin="asin"
            :change-detail-config="changeDetailConfig"
            :filter-options="filterShowOption"
            :site-id="selectedSite"
            :type="-1"
            @content-click="handleShowChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import { updateProductAnalysisOperateTypeList, updateRemarkAmazonOperation } from '~/src/api/devlocal/productPerformance'
import { OperationTypeList } from '~/src/type/storeOperation/productPerformanceType'
import { getLast30DaysStringTime } from '~/src/utils/dateUtils'
import { adOption, dateOption, dayOption, filterShowOption, levelOption } from './constantOption'
import { getProductInfo } from '/@/api/devlocal/productAnalysis'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { useSkuOptionsStore } from '/@/store/modules/skuOptions'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IGetProductInfo } from '/@/type/storeOperation/productAnalysisType'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'ProductAnalysis',
})

const route: any = useRoute()
const router: any = useRouter()
// 选择的维度 SKU ASIN 父体ASIN
const selectField = ref<number>(0)
// 选择的日期范围
const selectDateRange = ref<[string, string]>(getLast30DaysStringTime())
// 同比/环比类型：0=同比，1=环比
const compareType = ref<number>(0)
// 选择的SKU（当selectField为0时使用）
const selectedSku = ref<string>('')

// 日期选择器快捷选项
const dateShortcuts = [
  {
    text: '30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
  {
    text: '60天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 59)
      return [start, end]
    },
  },
  {
    text: '180天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 179)
      return [start, end]
    },
  },
  {
    text: '360天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 359)
      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return [start, end]
    },
  },
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date('2020-01-01') // 设置一个较早的起始日期
      return [start, end]
    },
  },
]
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const activeName = ref<number>(Number(route.query.activeName) || 0)
const returnRadio = ref<number>(0)
const queryForm3 = reactive<any>({})
// ASIN（从 route.query 获取，如果没有则使用默认值）
const asin = ref<string>((route.query.asin as string) || 'B08N5M7S6K')
const fakeChangeData = [{}]
// 变化详情配置
const changeDetailConfig = computed(() => ({
  标题修改: {
    title: '标题变化详情',
    type: '标题',
    data: fakeChangeData,
  },
  描述修改: {
    title: '描述变化详情',
    type: '描述',
    data: fakeChangeData,
  },
  图片修改: {
    title: '图片变化详情',
    type: '图片',
    data: fakeChangeData,
  },
}))

// 处理内容点击（保留用于其他逻辑，组件内部已处理对话框显示）
const handleShowChange = (row: any) => {
  // 组件内部已处理对话框显示，这里可以添加其他逻辑
  console.log('点击内容:', row)
}
const handleChangeOperationRemark = async () => {
  const { data } = await updateRemarkAmazonOperation({
    site: selectedSite.value,
    asin: asin.value,
    remark: operationRemark.value,
  })
  if (data) {
    $baseMessage('运营备注修改成功！', 'success')
  }
}
const handleChangeOperationType = async () => {
  const { data } = await updateProductAnalysisOperateTypeList({
    asin: asin.value,
    site: selectedSite.value || 0,
    typeId: operationTypeId.value,
  })
  if (data) {
    $baseMessage('运营分类修改成功！', 'success')
  }
}
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  router.push({
    path: '/storeOperations/productPerformanceDashboard',
  })
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    activeName.value = Number(tab.props.name)
    // window.addEventListener('resize', function () {
    //   chartInstance.resize()
    // })
  }
}
const skuOptionsStore = useSkuOptionsStore()
const skuOptions = ref<any[]>([])
// 判断是单个显示还是多个显示
const isSingle = ref<boolean>(false)
// 传递给成本分析组件的sku参数
const sku = ref<string>('')
const handleChangeSku = () => {
  sku.value = queryForm3.sku
  // SKU变化时重新获取产品信息
  if (sku.value && selectedSite.value !== undefined) {
    fetchProductInfo()
  }
}

// 站点相关
const siteList = ref<{ id: number; label: string }[]>([])
const selectedSite = ref<number | undefined>(route.query.site ? Number(route.query.site) : undefined)

// 获取站点列表
const fetchSiteList = async () => {
  try {
    const { data } = await getDistributionSiteList()
    siteList.value = data
  } catch (error) {
    console.error('获取站点列表失败:', error)
  }
}

// 站点变化处理
const handleSiteChange = (siteId: number | undefined) => {
  selectedSite.value = siteId
  // 站点变化时重新获取产品信息
  if (sku.value && selectedSite.value !== undefined) {
    fetchProductInfo()
  }
}

// 产品信息（直接使用后端字段类型）
const productInfo = ref<IGetProductInfo | null>(null)
const productInfoLoading = ref<boolean>(false)
const operationTypeList = ref<OperationTypeList[]>([])
const operationTypeId = ref<number>(0)
const operationRemark = ref<string>('')
// 获取产品信息
const fetchProductInfo = async () => {
  if (!sku.value || selectedSite.value === undefined) {
    return
  }
  productInfoLoading.value = true
  try {
    const { data } = await getProductInfo({
      sku: sku.value,
      siteId: selectedSite.value,
    })
    // 直接使用后端返回的数据
    productInfo.value = data
    // 更新 asin
    asin.value = data.asin || ''
    operationTypeList.value = data.operationTypeList || []
    operationTypeId.value = data.operationTypeId || 0
    operationRemark.value = data.operationRemark || ''
  } catch (error) {
    console.error('获取产品信息失败:', error)
  } finally {
    productInfoLoading.value = false
  }
}
onBeforeMount(() => {
  // 检查 store 中是否已有数据
  if (skuOptionsStore.data.sku) {
    skuOptions.value = skuOptionsStore.data.sku.split(',')
    // console.log('进入页面的数据：', skuOptions.value)
    const length = skuOptions.value.length
    if (length === 1) {
      isSingle.value = true
    } else if (length > 1) {
      isSingle.value = false
    }
    queryForm3.sku = skuOptions.value[0]
    sku.value = queryForm3.sku
    // 初始化趋势总览的SKU选择
    selectedSku.value = skuOptions.value[0]
    // 初始化时获取产品信息
    if (sku.value && selectedSite.value !== undefined) {
      fetchProductInfo()
    }
  }
})

// 监听 store 数据变化
watch(
  () => skuOptionsStore.data.sku,
  (newSku) => {
    if (newSku) {
      skuOptions.value = newSku.split(',')
      // console.log('store 数据更新后的 skuOptions：', skuOptions.value)
      const length = skuOptions.value.length
      if (length === 1) {
        isSingle.value = true
      } else if (length > 1) {
        isSingle.value = false
      }
      queryForm3.sku = skuOptions.value[0]
      sku.value = queryForm3.sku
      // 更新趋势总览的SKU选择
      if (!selectedSku.value || !skuOptions.value.includes(selectedSku.value)) {
        selectedSku.value = skuOptions.value[0]
      }
    }
  },
  { immediate: true }
)
onMounted(() => {
  activeName.value = Number(route.query.activeName)
  selectField.value = Number(route.query.field)
  // 获取站点列表
  fetchSiteList()
})
watch(
  () => route.query.field,
  (newField) => {
    if (newField) {
      selectField.value = Number(newField)
    }
  }
)
// 监听路由中的站点参数变化
watch(
  () => route.query.site,
  (newSite) => {
    if (newSite) {
      selectedSite.value = Number(newSite)
    } else {
      selectedSite.value = undefined
    }
  }
)
// 监听路由中的 ASIN 参数变化
watch(
  () => route.query.asin,
  (newAsin) => {
    if (newAsin) {
      asin.value = newAsin as string
    }
  }
)
// 监听 selectedSku 和 selectedSite 的变化，重新获取产品信息
watch(
  () => [selectedSku.value, selectedSite.value],
  ([newSku, newSite]) => {
    // 当 SKU 或站点变化时，更新 sku 变量并重新获取产品信息
    if (newSku && newSite !== undefined) {
      sku.value = String(newSku)
      fetchProductInfo()
    }
  }
)
</script>

<style lang="scss" scoped>
.main-content-row {
  height: 100%;
  min-height: 0;

  .el-col {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}

.right-sidebar {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 15px) !important;

  :deep(.el-table) {
    flex: 1;
  }
}

.default-table-detail-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  .main-content-row {
    flex: 1;
    min-height: 0;
  }

  :deep() {
    .el-form--inline {
      .el-form-item {
        margin-right: 10px;
      }
    }

    .el-descriptions__label {
      min-width: 80px !important;
      text-align: right;
    }

    .vab-query-form {
      .left-panel {
        margin-bottom: 0;
      }
      .right-panel {
        margin-bottom: 0;
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
      .rate-count {
        margin-left: -11px;
        color: #36788c;
      }
    }
    .custom-link.is-underline::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 0;
      content: '';
      border-bottom: 1px solid var(--el-color-primary);
    }
    .top-card {
      position: relative;
      height: 126px !important;
      border-radius: 7%;

      &:hover {
        cursor: pointer;
      }

      .el-card__body {
        padding-top: 0;
        padding-right: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
      }
      .el-tag {
        float: right;
      }

      .parting-line {
        float: top;
        width: 100%;
        height: 6px;
        margin-bottom: 10px;
        clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
        background: #e9f5fe;
        /* 梯形形状：
          - 左上角 (0, 0)
          - 右上角 (100%, 0)
          - 右下角 (95%, 100%)
          - 左下角 (5%, 100%) */
        &-primary {
          background: #ff99cc;
        }
        &-orange {
          background: #e6a23c;
        }
        &-green {
          background: #34a9a9;
        }
        &-red {
          background: #e36060;
        }
        &-purple {
          background: #8a7ae3; // 一种柔和的紫色
        }
        &-yellow {
          background: #ffd700; // 明亮的金黄色
        }
      }
      p {
        margin-top: 13px;
        margin-bottom: 13px;
        font-size: 28px;
        font-weight: 600;
      }

      .right-icon {
        position: absolute;
        top: 50%;
        right: 20px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        color: var(--el-color-primary);
        text-align: center;
        background: var(--el-color-primary-light-9);
        border-radius: 50%;
        transform: translateY(-50%);

        i {
          font-size: 35px;
        }
      }

      .bottom {
        &-up {
          .ri-arrow-up-line {
            width: 18px;
            height: 18px;
            margin: 0 3px 0 2px;
            color: var(--el-color-success);
            background: var(--el-color-success-light);
            border-radius: 50%;
          }

          span {
            color: var(--el-color-success);
          }
        }
        &-down {
          .ri-arrow-down-line {
            width: 18px;
            height: 18px;
            margin: 0 3px 0 2px;
            color: var(--el-color-warning);
            background: var(--el-color-warning-light);
            border-radius: 50%;
          }

          span {
            color: var(--el-color-warning);
          }
        }
      }
    }
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }
      .el-tabs__item.is-active {
        background-color: rgb(78, 136, 243, 0.1);
      }
    }
  }
}
</style>
