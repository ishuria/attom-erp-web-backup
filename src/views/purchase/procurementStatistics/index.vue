<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="供应商" :name="0">
        <supplier-tab
          v-model:date="date"
          v-model:listLoading="listLoading"
          :list="list"
          :query-form="queryForm"
          :total="total"
          @handle-current-change="handleCurrentChange"
          @handle-size-change="handleSizeChange"
          @on-show-product-detail="showProductDetail"
          @query-data="queryData"
        />
      </el-tab-pane>
      <el-tab-pane label="零件" :name="1">
        <component-tab
          v-model:date="componentDate"
          v-model:listLoading="listLoading"
          :list="componentList"
          :query-form="componentQueryForm"
          :total="componentTotal"
          @handle-current-change="handleComponentCurrentChange"
          @handle-size-change="handleComponentSizeChange"
          @on-show-image-preview="showImagePreview"
          @query-data="queryComponentData"
        />
      </el-tab-pane>
      <el-tab-pane label="产品" :name="2">
        <product-tab
          v-model:columns="columns"
          v-model:date="productDate"
          v-model:listLoading="listLoading"
          :list="productList"
          :query-form="productQueryForm"
          :site-list="siteList"
          :total="productTotal"
          @handle-current-change="handleProductCurrentChange"
          @handle-size-change="handleProductSizeChange"
          @on-show-image-preview="showImagePreview"
          @query-data="queryProductData"
        />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <product-statistics-detail
      :id="detailId"
      :key="`${date[0]}-${date[1]}`"
      v-model="detailVisible"
      :end-date="date[1]"
      :start-date="date[0]"
    />
  </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from 'element-plus'
import { getOperationColumnList } from '~/src/api/devlocal/productPerformance'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import {
  getPurchaseStatisticsProductList,
  getPurchaseStatisticsSkuList,
  getPurchaseStatisticsSupplierList,
} from '/@/api/devlocal/purchaseStatistics'
import {
  IGetPurchaseStatisticsProductItem,
  IGetPurchaseStatisticsProductListReq,
  IGetPurchaseStatisticsSkuItem,
  IGetPurchaseStatisticsSupplierItem,
  IGetPurchaseStatisticsSupplierListReq,
} from '/@/type/purchase/statistics'
import { getThisYearStringTime } from '/@/utils/dateUtils'
import { processField } from '/@/utils/tableColum'

defineOptions({
  name: 'ProcurementStatistics',
})

// 产品明细
const detailVisible = ref<boolean>(false)
const detailId = ref<number>(0)
// 图片预览
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
// 供应商日期
const date = ref<[string, string]>(getThisYearStringTime())
// 零件日期
const componentDate = ref<[string, string]>(getThisYearStringTime())
// 产品日期
const productDate = ref<[string, string]>(getThisYearStringTime())
const listLoading = ref<boolean>(false)
const activeName = ref<number>(0)
const queryForm = reactive<IGetPurchaseStatisticsSupplierListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
})
const componentQueryForm = reactive<IGetPurchaseStatisticsSupplierListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
  type: -1,
})
const productQueryForm = reactive<IGetPurchaseStatisticsProductListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
  siteList: [],
  siteAgg: 0,
})
const list = ref<IGetPurchaseStatisticsSupplierItem[]>([])
const componentList = ref<IGetPurchaseStatisticsProductItem[]>([])
const productList = ref<IGetPurchaseStatisticsSkuItem[]>([])
const total = ref<number>(0)
const componentTotal = ref<number>(0)
const productTotal = ref<number>(0)
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleComponentCurrentChange = (val: number) => {
  componentQueryForm.pageNo = val
  fetchComponentData()
}
const handleComponentSizeChange = (val: number) => {
  componentQueryForm.pageNo = 1
  componentQueryForm.pageSize = val
  fetchComponentData()
}
const queryComponentData = () => {
  componentQueryForm.pageNo = 1
  fetchComponentData()
}
const handleProductCurrentChange = (val: number) => {
  productQueryForm.pageNo = val
  fetchProductData()
}
const handleProductSizeChange = (val: number) => {
  productQueryForm.pageNo = 1
  productQueryForm.pageSize = val
  fetchProductData()
}
const queryProductData = () => {
  productQueryForm.pageNo = 1
  fetchProductData()
}

const handleTabClick = (tab: TabsPaneContext) => {
  activeName.value = Number(tab.props.name)
  if (activeName.value === 0) {
    queryData()
  } else if (activeName.value === 1) {
    queryComponentData()
  } else if (activeName.value === 2) {
    queryProductData()
  }
}

const showProductDetail = (row: any) => {
  detailId.value = row.id
  detailVisible.value = true
}

const fetchData = async () => {
  listLoading.value = true
  queryForm.startDate = date.value[0]
  queryForm.endDate = date.value[1]
  const { data } = await getPurchaseStatisticsSupplierList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}

const fetchComponentData = async () => {
  listLoading.value = true
  componentQueryForm.startDate = componentDate.value[0]
  componentQueryForm.endDate = componentDate.value[1]
  const { data } = await getPurchaseStatisticsProductList(componentQueryForm)
  componentTotal.value = data.total
  componentList.value = data.list
  componentList.value.forEach((item) => {
    processField(item, 'supplierName', 3)
    processField(item, 'totalPurchaseAmount', 3)
    processField(item, 'purchaseCount', 3)
    processField(item, 'unit', 3)
    processField(item, 'sku', 3)
    processField(item, 'productManagerName', 3)
  })
  listLoading.value = false
}
const fetchProductData = async () => {
  listLoading.value = true
  productQueryForm.startDate = productDate.value[0]
  productQueryForm.endDate = productDate.value[1]
  const { data } = await getPurchaseStatisticsSkuList(productQueryForm)
  productTotal.value = data.total
  productList.value = data.list
  listLoading.value = false
}
const siteList = ref<{ id: number; label: string }[]>([])
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
const columns = ref<any>([])
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 19 })
  columns.value = data
  columns.value.forEach((item: any) => {
    item.minWidth = item.width
    // 设置 最小宽度
    if (item.prop !== 'skuImgUrl') {
      delete item.width
    }
    // 设置排序
    if (['totalVolume'].includes(item.prop)) {
      item.sortable = true
    }
  })
}
onBeforeMount(() => {
  fetchData()
  fetchSiteData()
  fetchColumn()
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
    }
  }
}
</style>
