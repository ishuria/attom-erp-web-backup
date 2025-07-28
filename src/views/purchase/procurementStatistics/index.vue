<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick" >
      <el-tab-pane label="供应商" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="4">
            <el-date-picker v-model="date" :clearable="false" :disabled-date="(time: Date) => time.getTime() > Date.now()" type="daterange" @change="queryData" />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="20">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table v-loading="listLoading" border :data="list" stripe>
          <el-table-column label="供应商" prop="supplierName" />
          <el-table-column label="总采购金额(￥)" prop="totalPurchaseAmount" />
          <el-table-column label="操作" >
            <template #default="{ row }">
              <el-link type="primary" underline='never' @click="showProductDetail(row)">产品明细</el-link>
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
      </el-tab-pane>
      <el-tab-pane label="产品" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="4">
            <el-date-picker v-model="productDate" :clearable="false" :disabled-date="(time: Date) => time.getTime() > Date.now()" type="daterange" @change="queryProductData"  />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="20">
            <el-form inline :model="productQueryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="productQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryProductData" @keydown.enter="queryProductData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryProductData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table v-loading="listLoading" border :data="productList" stripe >
          <el-table-column label="零件图片" prop="amount" width="91" >
            <template #default="{ row }">
              <el-image :src="row.componentImgUrl" style="width: 65px; height: 65px; display: block" @click="showImagePreview(row.componentImgUrl)">
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件ID" prop="id" />
          <el-table-column label="零件名" :min-width="flexColumnWidth(productList, '零件名', 'componentName')" prop="componentName" />
          <el-table-column label="零件采购总额(￥)" min-width="120" prop="componentPurchaseAmount" />
          <el-table-column label="供应商" :min-width="calculateBrColumnWidth(productList, (row: any) => row._supplierName)" prop="supplierName" >
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_supplierName" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row._supplierNameFull }}</div>
                </template>
                <span v-html="row._supplierName"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="采购总额(￥)" min-width="110" prop="totalPurchaseAmount" >
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_totalPurchaseAmount" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row._totalPurchaseAmountFull }}</div>
                </template>
                <span v-html="row._totalPurchaseAmount"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="采购总数" min-width="100" prop="purchaseCount" >
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_purchaseCount" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row._purchaseCountFull }}</div>
                </template>
                <span v-html="row._purchaseCount"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="unit" >
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_unit" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row._unitFull }}</div>
                </template>
                <span v-html="row._unit"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="SKU" :min-width="calculateBrColumnWidth(productList, (row: any) => row._sku)" prop="sku" >
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row._skuFull }}</div>
                </template>
                <span v-html="row._sku"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="产品经理" prop="productManagerName" >
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_productManagerName" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row._productManagerNameFull }}</div>
                </template>
                <span v-html="row._productManagerName"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination 
          :current-page="productQueryForm.pageNo"
          :page-size="productQueryForm.pageSize"
          :total="productTotal"
          @current-change="handleProductCurrentChange"
          @size-change="handleProductSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <product-statistics-detail :id="detailId" :key="`${date[0]}-${date[1]}`" v-model="detailVisible" :end-date="date[1]" :start-date="date[0]" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus'
import { getPurchaseStatisticsProductList, getPurchaseStatisticsSupplierList } from '/@/api/devlocal/purchaseStatistics'
import { IGetPurchaseStatisticsProductItem, IGetPurchaseStatisticsSupplierItem, IGetPurchaseStatisticsSupplierListReq } from '/@/type/purchase/statistics'
import { getThisYearStringTime } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth, processField } from '/@/utils/tableColum'

defineOptions({
  name: 'ProcurementStatistics',
})

const detailVisible = ref<boolean>(false)
const detailId = ref<number>(0)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const date = ref<[string, string]>(getThisYearStringTime())
const productDate = ref<[string, string]>(getThisYearStringTime())
const listLoading = ref<boolean>(false)
const activeName = ref<number>(0)
const queryForm = reactive<IGetPurchaseStatisticsSupplierListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: ''
})
const productQueryForm = reactive<IGetPurchaseStatisticsSupplierListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: ''
})

const list = ref<IGetPurchaseStatisticsSupplierItem[]>([])
const productList = ref<IGetPurchaseStatisticsProductItem[]>([])
const total = ref<number>(0)
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
  } else {
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

const fetchProductData = async () => {
  listLoading.value = true
  productQueryForm.startDate = productDate.value[0]
  productQueryForm.endDate = productDate.value[1]
  const { data } = await getPurchaseStatisticsProductList(productQueryForm)
  productTotal.value = data.total
  productList.value = data.list
  productList.value.forEach((item) => {
    processField(item, 'supplierName', 3)
    processField(item, 'totalPurchaseAmount', 3)
    processField(item, 'purchaseCount', 3)
    processField(item, 'unit', 3)
    processField(item, 'sku', 3)
    processField(item, 'productManagerName', 3)
  })
  listLoading.value = false
}

onBeforeMount(() => {
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
            margin-bottom: 5px !important;
          }
          .el-form {
            .el-form-item:first-child {
              margin-bottom: 5px !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin-bottom: 5px !important;
            }
          }
        }

        .el-table {
          flex: 1;
          .clear-padding {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            .cell {
              padding-right: 0px !important;
              padding-left: 0px !important;
            }
          }
        }
      }
    }
  }
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}

</style>