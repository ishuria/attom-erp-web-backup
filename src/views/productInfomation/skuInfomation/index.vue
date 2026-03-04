<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleHideStopProduction">{{ queryForm.haltStatus === 0 ? '隐藏停产' : '展示停产' }}</el-button>
        <el-button v-permissions="{ permission: [SkuPermission.SKU_COMPONENT_CREATE] }" type="primary" @click="showBatchPackingPrecautions">
          批量新增质检项
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              class="search-input"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="tableRef"
      v-loading="listLoading"
      v-permissions="{ permission: [SkuPermission.SKU_LIST] }"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoveTable custom-table-hover"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      stripe
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column fixed="left" type="selection" width="53" />
      <el-table-column class="image-wall" label="图片" width="75">
        <template #default="{ row }">
          <el-image
            fit="fill"
            :src="row.skuImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="setPreviewImage(row.skuImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="calculateBrColumnWidth(list, (row: any) => row.sku, 70, 50)">
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row._sku[0])">
            {{ row._sku[0] }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
          <br />
          {{ row._sku[1] }}
        </template>
      </el-table-column>
      <el-table-column label="FNSKUUPC" prop="fnSkuUpc" :width="calculateBrColumnWidth(list, (row: any) => row.fnSkuUpc, 70)">
        <template #header>
          FNSKU
          <br />
          UPC
        </template>
        <template #default="{ row }">
          <span v-html="row.fnSkuUpc"></span>
        </template>
      </el-table-column>
      <el-table-column label="产品经理" min-width="90" prop="productManager" />
      <el-table-column v-permissions="{ permission: [SkuPermission.SKU_STATUS_UPDATE] }" label="停产" prop="productionHaltStatus">
        <template #default="{ row }">
          <el-switch
            v-model="row.productionHaltStatus"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #ff4949"
            @change="handleUpdateStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-permissions="{ permission: [SkuPermission.SKU_STATUS_UPDATE] }"
        label="优先打包"
        min-width="90"
        prop="priorityPacking"
      >
        <template #default="{ row }">
          <el-switch
            v-model="row.priorityPacking"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66"
            @change="handleUpdateStatus(row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="打包拍照" min-width="90" prop="packagePhotograph">
        <template #default="{ row }">
          <el-switch v-model="row.packagePhotograph" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66;" @change="handleUpdateStatus(row)"/>
        </template>
      </el-table-column> -->
      <el-table-column label="带磁" min-width="70" prop="magnetic">
        <template #default="{ row }">
          <el-checkbox v-model="row.magnetic" class="custom-checkbox" :false-value="0" :true-value="1" @change="handleUpdateStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="木制品" min-width="80" prop="woodenProduct">
        <template #default="{ row }">
          <el-checkbox
            v-model="row.woodenProduct"
            class="custom-checkbox"
            :false-value="0"
            :true-value="1"
            @change="handleUpdateStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="玩具" min-width="70" prop="toy">
        <template #default="{ row }">
          <el-checkbox v-model="row.toy" class="custom-checkbox" :false-value="0" :true-value="1" @change="handleUpdateStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="应季产品" min-width="75" prop="toy">
        <template #default="{ row }">
          <el-checkbox v-model="row.seasonal" class="custom-checkbox" :false-value="0" :true-value="1" @change="handleUpdateStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="总实际成本" min-width="100" prop="procurementCost" sortable="custom">
        <template #header>
          总实际
          <br />
          成本
        </template>
      </el-table-column>
      <el-table-column label="" min-width="110" prop="dilapidationCost" sortable="custom">
        <template #header>
          损耗成本
          <br />
          (近10次)
        </template>
      </el-table-column>
      <el-table-column label="" min-width="115" prop="packingCost" sortable="custom">
        <template #header>
          打包成本
          <br />
          (近20次)
        </template>
      </el-table-column>
      <el-table-column label="" min-width="110" prop="freightFeeCost" sortable="custom">
        <template #header>
          运费
          <br />
          (近10次)
        </template>
      </el-table-column>
      <el-table-column label="货币" prop="currency" width="110px" />
      <el-table-column label="" min-width="110" prop="avgTime" sortable="custom">
        <template #header>
          平均交期
          <br />
          (近10次)
        </template>
      </el-table-column>
      <el-table-column label="" min-width="110" prop="avgFluctuation" sortable="custom">
        <template #header>
          交期平均
          <br />
          波动
        </template>
      </el-table-column>
      <el-table-column label="长(cm)" min-width="90" prop="length" />
      <el-table-column label="宽(cm)" min-width="90" prop="width" />
      <el-table-column label="高(cm)" min-width="90" prop="height" />
      <el-table-column label="重量(g)" min-width="90" prop="weight" />
      <el-table-column label="重量系数" min-width="110" prop="weightCoefficient" sortable="custom">
        <template #default="{ row }">
          {{ row.weightCoefficient != null ? row.weightCoefficient.toFixed(4) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="体积系数" min-width="110" prop="volumeCoefficient" sortable="custom">
        <template #default="{ row }">
          {{ row.volumeCoefficient != null ? row.volumeCoefficient.toFixed(4) : '' }}
        </template>
      </el-table-column>
      <el-table-column v-permissions="SkuPermission.skuOperationColPermission()" fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-dropdown>
            <el-button v-permissions="{ permission: [SkuPermission.SKU_DETAIL] }" text type="primary" @click="handleSkuDetail(row)">
              SKU详情
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="hasPermission({ permission: [SkuPermission.SKU_DETAIL] })" @click="handleSkuDetail(row)">
                  <el-link type="primary" underline="never">SKU详情</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleViewHts(row)">
                  <el-link type="primary" underline="never">查看HTS</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="hasPermission({ permission: [SkuPermission.SKU_COPY] })" @click="handleCopySku(row)">
                  <el-link type="primary" underline="never">SKU复制</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click.stop="showPackingTimeDetails(row)">
                  <el-link type="primary" underline="never">打包工时</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click.stop="showSkuDeliverTimeDetails(row)">
                  <el-link type="primary" underline="never">交期查看</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" underline="never">证书</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 复制SKU -->
    <vab-dialog v-model="copySkuVisible" title="复制SKU" top="35vh" width="20%" @close="copySkuClose">
      <el-form ref="copySkuFormRef" label-position="top" :model="copySkuForm" :rules="copySkuFormRules">
        <el-form-item label="新SKU" prop="sku">
          <el-input v-model.trim="copySkuForm.sku" clearable placeholder="请输入新SKU" />
        </el-form-item>
        <el-form-item label="是否需要重新拍摄详情页图片">
          <el-radio-group v-model="copySkuForm.listingTask">
            <el-radio size="large" :value="0">否</el-radio>
            <el-radio size="large" :value="2">不确定</el-radio>
            <el-radio size="large" :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否需要新品质检">
          <el-radio-group v-model="copySkuForm.needQualityInspection">
            <el-radio size="large" :value="0">否</el-radio>
            <el-radio size="large" :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="copySkuClose">取消</el-button>
        <el-button type="primary" @click="handleCopySkuConfirm">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 批量新增打包注意事项 -->
    <vab-batch-packing-precautions v-model="batchPackingPrecautionsVisible" :sku-id-list="skuIdList" />
    <!-- 打包工时明细 -->
    <vab-packing-time-details v-model="packingTimeDetailsVisible" :sku="sku" />
    <!-- 查看HTS（只读） -->
    <vab-hts-dialog v-model="htsVisible" :readonly="true" :sku="currentSku" />
    <!-- Sku交期明细  -->
    <vab-sku-delivery-time-details v-model="skuDeliveryTimeVisible" :sku="sku" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { copyProductSku, getProductList, updateProductStatus } from '/@/api/devlocal/productInformation'
import SkuPermission from '/@/permissions/sku'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IgetProductList } from '/@/type/productInformation/skuInformationType'
import handleClipboard from '/@/utils/clipboard'
import { hasPermission } from '/@/utils/permission'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { calculateBrColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuInfomation',
})

const tableRef = ref()
const packingTimeDetailsVisible = ref<boolean>(false)
const sku = ref<string>('')
const showPackingTimeDetails = (row: any) => {
  selectedRowIndex.value = row.skuId
  packingTimeDetailsVisible.value = true
  sku.value = row._sku[0]
}
const skuDeliveryTimeVisible = ref<boolean>(false)
const showSkuDeliverTimeDetails = (row: any) => {
  selectedRowIndex.value = row.skuId
  skuDeliveryTimeVisible.value = true
  sku.value = row._sku[0]
}
const htsVisible = ref<boolean>(false)
const currentSku = ref<string>('')
const handleViewHts = (row: any) => {
  selectedRowIndex.value = row.skuId
  currentSku.value = row._sku[0] || row.sku
  htsVisible.value = true
}
const headerCell = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  const prop = data.column.prop
  if (
    [
      'procurementCost',
      'dilapidationCost',
      'packingCost',
      'freightFeeCost',
      'avgTime',
      'avgFluctuation',
      'weightCoefficient',
      'volumeCoefficient',
    ].includes(prop)
  ) {
    return 'header-cell'
  }
  return ''
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(prop, order)
  if (queryForm.orderByField === prop) {
    if (!order) {
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.skuId
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.skuId === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
const selectedRows = ref<any[]>([])
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}
// 批量新增打包注意事项
const batchPackingPrecautionsVisible = ref<boolean>(false)
const skuIdList = ref<number[]>([])
const showBatchPackingPrecautions = () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('请先选择要新增质检项的SKU', 'warning', 'hey')
    return
  }
  batchPackingPrecautionsVisible.value = true
  skuIdList.value = selectedRows.value.map((item: any) => item.skuId)
}
const listLoading = ref<boolean>(true)
// 零件列表
const list = ref<any>([])
const router = useRouter()
const route = useRoute()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore
const copySkuVisible = ref<boolean>(false)
const copySkuForm = reactive({
  sku: '',
  listingTask: 0,
  needQualityInspection: 0,
})
const copySkuFormRef = ref()
const copySkuClose = () => {
  copySkuVisible.value = false
  copySkuFormRef.value.resetFields()
}
const copySkuFormRules = reactive({
  sku: [{ required: true, message: '请输入新SKU', trigger: 'blur' }],
})
const handleCopySkuConfirm = async () => {
  copySkuFormRef.value.validate(async (isValid: boolean) => {
    if (isValid) {
      try {
        const { data } = await copyProductSku({
          skuId: skuId.value,
          sku: copySkuForm.sku,
          listingTask: copySkuForm.listingTask,
          needQualityInspection: copySkuForm.needQualityInspection,
        })
        if (data) {
          if (copySkuForm.listingTask === 1) {
            $baseMessage('Sku复制成功，美工图片任务发布成功！', 'success')
          } else {
            $baseMessage('Sku复制成功！', 'success')
          }
          copySkuVisible.value = false
          fetchData()
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}
const skuId = ref<number>(0)
const handleCopySku = (row: any) => {
  selectedRowIndex.value = row.skuId
  $baseConfirm('只能复制相同产品，不支持复制后修改成其他产品', null, () => {
    copySkuVisible.value = true
    skuId.value = row.skuId
  })
}
const handleSkuDetail = async (row: any) => {
  selectedRowIndex.value = row.skuId
  const query = { title: `${row.sku.split('<br/>')[0]}`, skuId: row.skuId }
  const matched = handleMatched(allRoutes.value, '/productInfomation/skuDetailView')
  const tab = handleTabs({
    ...matched.at(-1),
    query,
  })
  if (tab) {
    await router.push({
      path: '/productInfomation/skuDetailView',
      query,
    })
    await changeTabsMeta({
      title: 'SKU详情',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
}
const handleHideStopProduction = () => {
  if (queryForm.haltStatus === 0) {
    queryForm.haltStatus = 1
  } else {
    queryForm.haltStatus = 0
  }
  fetchData()
}

const handleUpdateStatus = async (row: IgetProductList) => {
  await updateProductStatus({
    skuId: row.skuId,
    haltStatus: row.productionHaltStatus,
    photographStatus: row.packagePhotograph,
    priorityStatus: row.priorityPacking,
    magnetic: row.magnetic,
    woodenProduct: row.woodenProduct,
    toy: row.toy,
    seasonal: row.seasonal,
  })
}
const queryForm = reactive<any>({
  keyWord: '',
  haltStatus: 1, // 0展示停产 1隐藏停产
  pageNo: 1,
  pageSize: 20,
  orderByField: '',
  orderDirection: '',
})
const total = ref<number>(0)
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const setPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.column.label !== 'SKU') {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

// 获取拿样零件添加数据
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductList(queryForm)
  list.value = data.list
  total.value = data.total
  list.value.forEach((item: any) => {
    item.fnSkuUpc = item.fnSkuUpc.replaceAll(',', '<br>')
    item._sku = item.sku.split('<br/>')
    item.magnetic = item.magnetic === null ? 0 : item.magnetic
    item.woodenProduct = item.woodenProduct === null ? 0 : item.woodenProduct
    item.toy = item.toy === null ? 0 : item.toy
  })
  listLoading.value = false
}

// 在组件加载时执行
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  queryForm.pageNo = Number(pageNo) || 1
  queryForm.pageSize = Number(pageSize) || 20
  fetchData() // 执行数据获取
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
.el-checkbox {
  transform: scale(1.3);
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
// .noneHoveTable :deep(.header-cell .cell) {
//   display: flex; /* 应用 Flexbox 布局 */
//   align-items: center; /* 垂直居中 */
//   justify-content: center;
// }
.overflow-text {
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}

/* 修复排序图标位置和样式 */
:deep(.el-table__header-wrapper .el-table__header th) {
  position: relative;
}

/* 确保表头文字不会与排序图标重叠 */
:deep(.el-table__header-wrapper .el-table__header th .cell) {
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

// /* 将排序图标定位到表头右侧 */
// :deep(.el-table__header-wrapper .el-table__header th .el-table__column-sort) {
//   position: absolute;
//   right: 8px;
//   top: 50%;
//   transform: translateY(-50%);
//   z-index: 1;
// }

// /* 确保排序图标在表头右侧显示 */
// :deep(.el-table__header-wrapper .el-table__header th .el-table__column-sort .el-icon) {
//   position: absolute;
//   right: 0;
//   top: 50%;
//   transform: translateY(-50%);
// }
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
</style>
