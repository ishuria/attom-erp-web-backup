<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-select v-model="queryForm.siteId" placeholder="请选择站点" @change="queryData">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Filter" :type="hasFilter ? 'warning' : 'default'" @click="filterVisible = true">筛选</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-style="cellStyle"
      class="noneHoveTable custom-table-hover"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      stripe
      @cell-click="cellClick"
      @row-click="handleRowClick"
    >
      <el-table-column
        label="FBA SHIPMENT ID"
        prop="fbaShipmentId"
        :width="flexColumnWidth(list, 'FBA SHIPMENT ID', 'fbaShipmentId', 30)"
      />
      <el-table-column label="合同号" prop="contractNumber" :width="flexColumnWidth(list, '合同号', 'contractNumber', 30)" />
      <el-table-column label="站点" min-width="130" prop="site" />
      <el-table-column label="状态" min-width="100" prop="status" />
      <el-table-column label="运输渠道" prop="channelName" :width="flexColumnWidth(list, '运输渠道', 'channelName')" />
      <el-table-column label="发货日期" min-width="115" prop="shipmentDate">
        <template #default="{ row }">
          {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="原始预计入库" min-width="130" prop="initialArrivalDate">
        <template #default="{ row }">
          {{ row.initialArrivalDate ? formatDate(new Date(row.initialArrivalDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="最新预计入库" min-width="130" prop="latestArrivalDate">
        <template #default="{ row }">
          {{ row.latestArrivalDate ? formatDate(new Date(row.latestArrivalDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="上架日期" min-width="115" prop="actualArrivalDate">
        <template #default="{ row }">
          {{ row.actualArrivalDate ? formatDate(new Date(row.actualArrivalDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="实际时效" min-width="100" prop="actualTimeliness" />
      <el-table-column label="已延误" min-width="100" prop="delayed" />
      <el-table-column label="实际延误" min-width="130" prop="actualDelay">
        <template #default="{ row }">
          <span :style="{ color: row.actualDelay <= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">{{ row.actualDelay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已接收天数" min-width="130" prop="acceptDays" />
      <el-table-column label="接收完成天数" min-width="130" prop="acceptFinishDays" />
      <el-table-column label="发货总数" min-width="100" prop="totalCount" />
      <el-table-column label="已接收数" min-width="100" prop="receiptsCount" />
      <el-table-column label="缺数" min-width="80" prop="lackCount">
        <template #default="{ row }">
          <span :style="{ color: row.lackCount > 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.lackCount > 0 ? '-' + row.lackCount : '+' + Math.abs(row.lackCount) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="箱数" min-width="80" prop="totalEncasementCount" />
      <el-table-column label="体积(m3)" min-width="100" prop="volume" />
      <el-table-column label="重量(kg)" min-width="100" prop="weight" />
      <el-table-column label="备注" min-width="100" prop="remarks">
        <template #default="{ row }">
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remarks }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.remarks }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="不计入渠道时效" min-width="140" prop="timelinessStatus">
        <template #default="{ row }">
          <el-checkbox v-model="row.timelinessStatus" :false-value="0" :true-value="1" @change="handleUpdate(row)" />
        </template>
      </el-table-column>
      <el-table-column label="丢货标记" min-width="100" prop="lostGoodsStatus">
        <template #default="{ row }">
          <el-checkbox v-model="row.lostGoodsStatus" :false-value="0" :true-value="1" @change="handleUpdateLostGoodsStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="260">
        <template #default="{ row }">
          <el-space :size="20">
            <el-link type="primary" underline="never" @click="showDetails(row)">明细</el-link>
            <el-link type="primary" underline="never" @click="showUpdateStorageTime(row)">修改最新预计入库时间</el-link>
          </el-space>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
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
    <!-- 明细 -->
    <vab-dialog v-model="detailsVisible" title="明细" top="10vh">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="detailQueryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="detailQueryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="detailQueryData"
                @keyup.enter="detailQueryData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="detailListLoading" native-type="submit" type="primary" @click="detailQueryData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        border
        :cell-class-name="cellClassName"
        class="detailsTable"
        :data="detailList"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="60vh"
        stripe
      >
        <el-table-column label="图片" width="70">
          <template #default="{ row }">
            <el-image fit="contain" :src="row.skuImgUrl" style="display: block; width: 70px; height: 70px" @click="showImagePreview(row)">
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="200" prop="sku">
          <template #default="{ row }">
            {{ row.sku }}
            <br />
            {{ row.description }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="PO" min-width="100" prop="po" />
        <el-table-column align="center" label="发货数量" min-width="100" prop="shipmentTotalCount" />
        <el-table-column align="center" label="已接收数量" min-width="110" prop="receiptsCount" />
        <el-table-column align="center" label="缺数" min-width="100" prop="lackCount" />
      </el-table>
      <vab-pagination
        :current-page="detailQueryForm.pageNo"
        :page-size="detailQueryForm.pageSize"
        :total="detailTotal"
        @current-change="handleDetailCurrentChange"
        @size-change="handleDetailSizeChange"
      />
    </vab-dialog>
    <!-- 修改预计入库时间 -->
    <vab-dialog v-model="storageTimeVisible" title="修改最新预计入库时间" width="20%" @close="closeUpdateStorageTime">
      <el-form ref="storageTimeFormRef" :model="storageTimeForm" :rules="storageTimeRule" style="margin-right: 0px; margin-left: 0px">
        <el-form-item label="最新预计入库时间" prop="date">
          <el-date-picker
            v-model="storageTimeForm.date"
            format="YYYY-MM-DD"
            placeholder="选择最新预计入库时间"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeUpdateStorageTime">取消</el-button>
        <el-button type="primary" @click="confirmUpdateStorageTime">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 备注 -->
    <vab-remark-dialog v-model="remarkVisible" :remark="remark" title="修改备注" @update:remark="handleUpdateRemark" />
    <!-- 筛选 -->
    <vab-dialog v-model="filterVisible" title="筛选" width="26%" @close="closeFilter">
      <el-form label-position="top" label-width="120px" :model="queryForm" style="margin-right: 10px; margin-left: 10px">
        <el-form-item label="缺数">
          <div style="display: flex; align-items: center; gap: 10px; width: 100%">
            <el-input-number v-model="queryForm.lackCountStart" placeholder="最小值" style="flex: 1" />
            <span style="color: #303133; white-space: nowrap">至</span>
            <el-input-number v-model="queryForm.lackCountEnd" placeholder="最大值" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="发货日期">
          <el-date-picker
            v-model="date1"
            clearable
            :editable="false"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            style="width: 100%"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="上架日期">
          <el-date-picker
            v-model="date2"
            clearable
            :editable="false"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            style="width: 100%"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleResetFilter">重置</el-button>
        <el-button type="primary" @click="handleFilter">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { Filter, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { CSSProperties } from 'vue'
import { getPackageSiteList } from '~/src/api/devlocal/packagingShipping'
import {
  getShipmentFbaDetailList,
  getShipmentFbaList,
  updateShipmentFBA,
  updateShipmentFbaDate,
  updateShipmentFBALostGoodsStatus,
} from '/@/api/devlocal/encasement'
import type { IGetShipmentFbaList, IGetShipmentFbaListReq } from '/@/type/packagingShipping/shippedType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ShippedBatch',
})

const date1 = ref<[string, string] | null>(null)
const date2 = ref<[string, string] | null>(null)
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')

const router = useRouter()
const route = useRoute()
const listLoading = ref<boolean>(true)
const queryForm = reactive<IGetShipmentFbaListReq>({
  siteId: -1,
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  lackCountStart: undefined,
  lackCountEnd: undefined,
  shipmentDateStart: undefined,
  shipmentDateEnd: undefined,
  arrivalDateStart: undefined,
  arrivalDateEnd: undefined,
})
const list = ref<IGetShipmentFbaList[]>([])
const total = ref<number>(0)

// 明细
const detailListLoading = ref<boolean>(false)
const detailQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const detailList = ref<any>([])
const detailTotal = ref<number>(0)

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<any>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (row: any) => {
  imagePreviewList.value = []
  imagePreviewList.value.push(row.skuImgUrl)
  imagePreviewVisible.value = true
}
// 明细可见
const detailsVisible = ref<boolean>(false)
// 预计入库时间可见
const storageTimeVisible = ref<boolean>(false)
// 筛选可见
const filterVisible = ref<boolean>(false)
// 入库时间表单
const storageTimeForm = reactive<any>({
  date: '',
})
// 入库时间rule
const storageTimeRule = reactive<any>({
  date: [{ required: true, message: '请选择预计入库时间', trigger: 'change' }],
})
// 判断是否有筛选条件
const hasFilter = computed(() => {
  return (
    queryForm.lackCountStart !== undefined ||
    queryForm.lackCountEnd !== undefined ||
    queryForm.shipmentDateStart !== undefined ||
    queryForm.shipmentDateEnd !== undefined ||
    queryForm.arrivalDateStart !== undefined ||
    queryForm.arrivalDateEnd !== undefined
  )
})
const storageTimeFormRef = ref<FormInstance>()
// 传给明细的id
const _id = ref<number | undefined>(0)

let copyRow: any
const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '备注') {
    remarkVisible.value = true
    remark.value = row.remarks
    copyRow = row
  }
}
const handleUpdateRemark = async (val: string) => {
  try {
    const { data } = await updateShipmentFBA({
      id: copyRow.id!,
      remarks: val,
    })
    if (data) {
      $baseMessage('修改备注成功！', 'success')
      remarkVisible.value = false
      copyRow.remarks = val
    }
  } catch (error) {}
}
const handleUpdate = async (row: IGetShipmentFbaList) => {
  await updateShipmentFBA({
    id: row.id,
    timelinessStatus: row.timelinessStatus,
  })
}
const handleUpdateLostGoodsStatus = async (row: IGetShipmentFbaList) => {
  await updateShipmentFBALostGoodsStatus({
    id: row.id,
    lostGoodsStatus: row.lostGoodsStatus,
  })
}
// 展示明细
const showDetails = (row: IGetShipmentFbaList) => {
  detailsVisible.value = true
  _id.value = row.id
  fetchDetailData()
}
const fetchDetailData = async () => {
  detailListLoading.value = true
  const { data } = await getShipmentFbaDetailList({
    id: _id.value,
    ...detailQueryForm,
  })
  detailTotal.value = data?.total!
  detailList.value = data?.list!
  detailListLoading.value = false
}
let _row: IGetShipmentFbaList
// 展示修改预计入库时间
const showUpdateStorageTime = (row: IGetShipmentFbaList) => {
  _row = row
  storageTimeVisible.value = true
  storageTimeForm.date = row.latestArrivalDate
}
// 关闭修改入库时间对话框
const closeUpdateStorageTime = () => {
  storageTimeVisible.value = false
}
// 确定修改预计入库时间
const confirmUpdateStorageTime = async () => {
  storageTimeFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateShipmentFbaDate({
        id: _row.id!,
        date: storageTimeForm.date,
      })
      if (data) {
        $baseMessage('修改最新预计入库时间成功！', 'success')
        closeUpdateStorageTime()
        fetchData()
      }
    }
  })
}
// 关闭筛选对话框
const closeFilter = () => {
  filterVisible.value = false
}

// 处理筛选
const handleFilter = async () => {
  if (queryForm.lackCountStart !== undefined && queryForm.lackCountEnd !== undefined && queryForm.lackCountStart > queryForm.lackCountEnd) {
    $baseMessage('最小值不能大于最大值，请重新填写', 'error')
    return
  }

  // 将日期范围转换为独立的开始和结束日期
  if (date1.value && date1.value.length === 2 && date1.value[0] && date1.value[1]) {
    queryForm.shipmentDateStart = date1.value[0]
    queryForm.shipmentDateEnd = date1.value[1]
  } else {
    queryForm.shipmentDateStart = undefined
    queryForm.shipmentDateEnd = undefined
  }

  if (date2.value && date2.value.length === 2 && date2.value[0] && date2.value[1]) {
    queryForm.arrivalDateStart = date2.value[0]
    queryForm.arrivalDateEnd = date2.value[1]
  } else {
    queryForm.arrivalDateStart = undefined
    queryForm.arrivalDateEnd = undefined
  }

  // 重置页码为第一页
  queryForm.pageNo = 1

  filterVisible.value = false
  fetchData()
}

// 重置筛选
const handleResetFilter = () => {
  // 清除 queryForm 中的筛选条件
  queryForm.lackCountStart = undefined
  queryForm.lackCountEnd = undefined
  queryForm.shipmentDateStart = undefined
  queryForm.shipmentDateEnd = undefined
  queryForm.arrivalDateStart = undefined
  queryForm.arrivalDateEnd = undefined
  date1.value = null
  date2.value = null

  // 重置页码为第一页
  queryForm.pageNo = 1

  fetchData()
  closeFilter()
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
const detailQueryData = () => {
  detailQueryForm.pageNo = 1
  fetchDetailData()
}
const handleDetailCurrentChange = (value: number) => {
  detailQueryForm.pageNo = value
  fetchDetailData()
}
const handleDetailSizeChange = (value: number) => {
  detailQueryForm.pageNo = 1
  detailQueryForm.pageSize = value
  fetchDetailData()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.column.label === '备注') {
    return {
      textAlign: 'left',
      cursor: 'pointer',
    }
  }
  if (data.column.label !== 'FBA SHIPMENT ID' && data.column.label !== '运输渠道') {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
}
const cellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getShipmentFbaList(queryForm)
  list.value = data?.list!
  total.value = data?.total!
  listLoading.value = false
}
// 站点列表类型
type ISiteList = {
  id: number
  label: string
}
// 初始化站点列表
const siteList = ref<ISiteList[]>([])
// 获取站点列表
const getSiteList = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '所有' })
}
onBeforeMount(() => {
  getSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
.detailsTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.detailsTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
