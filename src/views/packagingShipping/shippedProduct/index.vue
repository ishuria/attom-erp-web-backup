<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="queryForm.status" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未到货" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" placeholder="请选择站点" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
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
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-class-name="cellClassName"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
          @cell-click="cellClick"
          @row-click="handleRowClick"
        >
          <el-table-column label="发货日期" min-width="115" prop="shipmentDate">
            <template #default="{ row }">
              {{ formatDate(new Date(row.shipmentDate)) }}
            </template>
          </el-table-column>
          <el-table-column label="初始预计到货" min-width="115" prop="initialArrivalDate">
            <template #default="{ row }">
              {{ formatDate(new Date(row.initialArrivalDate)) }}
            </template>
          </el-table-column>
          <el-table-column label="最新预计到货" min-width="115" prop="latestArrivalDate">
            <template #default="{ row }">
              {{ row.latestArrivalDate ? formatDate(new Date(row.latestArrivalDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="延误" min-width="80" prop="delayDays" />

          <el-table-column label="产品图片" prop="skuImgUrl" width="75">
            <template #header>
              产品
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image fit="contain" :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="发货总数" min-width="100" prop="shipmentTotalCount" />
          <el-table-column label="丢货" min-width="60" prop="lostGoodsStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.lostGoodsStatus" :false-value="0" :true-value="1" @change="handleUpdateLostGoodsStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="发货数量调整" min-width="120" prop="shippingCountAdjustment">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.shippingCountAdjustment" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.shippingCountAdjustment }}</span>
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="site" :width="flexColumnWidth(list, '站点', 'site')" />
          <el-table-column label="Shipment ID" prop="shipmentId" :width="flexColumnWidth(list, 'Shipment ID', 'shipmentId', 30)" />
          <el-table-column
            label="货代单号"
            prop="freightForwardingNumber"
            :width="flexColumnWidth(list, '货代单号', 'freightForwardingNumber')"
          />
          <el-table-column label="PO" min-width="100" prop="po" />
          <el-table-column label="发货数" min-width="100" prop="actualCount" />
          <el-table-column label="头程渠道" prop="channelName" :width="flexColumnWidth(list, '头程渠道', 'channelName', 50)" />
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
      </el-tab-pane>
      <el-tab-pane label="接收中" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="请选择站点" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
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
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-class-name="cellClassName2"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod2"
          @row-click="handleRowClick"
        >
          <el-table-column label="产品图片" prop="skuImgUrl" width="75">
            <template #header>
              产品
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image fit="contain" :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="170" prop="sku">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="发货总数" min-width="100" prop="shipmentTotalCount" />
          <el-table-column label="已接收数" min-width="110" prop="receiptsCount" />
          <el-table-column label="缺数" min-width="80" prop="lackCount" />
          <el-table-column label="已接收" min-width="90" prop="acceptDays" />
          <el-table-column label="PO" min-width="100" prop="po" />
          <el-table-column label="发货数" min-width="100" prop="actualCount" />
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
      </el-tab-pane>
      <el-tab-pane label="接收完毕" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="请选择站点" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
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
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-class-name="cellClassName2"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod2"
          @row-click="handleRowClick"
        >
          <el-table-column label="产品图片" prop="skuImgUrl" width="75">
            <template #header>
              产品
              <br />
              图片
            </template>
            <template #default="{ row }">
              <el-image fit="contain" :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="170" prop="sku">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="发货总数" min-width="100" prop="shipmentTotalCount" />
          <el-table-column label="已接收数" min-width="110" prop="receiptsCount" />
          <el-table-column label="缺数" min-width="80" prop="lackCount" />
          <el-table-column label="已接收" min-width="90" prop="acceptDays" />
          <el-table-column label="Shipment ID" min-width="100" prop="shipmentId" />
          <el-table-column label="PO" min-width="100" prop="po" />
          <el-table-column label="发货数" min-width="100" prop="actualCount" />
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
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash-es'
import { CSSProperties } from 'vue'
import { getShipmentArrivedList, updateLostGoodsStatus } from '/@/api/devlocal/encasement'
import { getPackageSiteList, updateShippingCountAdjustment } from '/@/api/devlocal/packagingShipping'
import type { IGetShipmentArrivedList, IGetShipmentArrivedListReq } from '/@/type/packagingShipping/shippedType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ShippedProduct',
})

const router = useRouter()
const route = useRoute()
const tableRef = ref<TableInstance>()
const list = ref<IGetShipmentArrivedList[]>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const queryForm = reactive<IGetShipmentArrivedListReq>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  site: -1,
  status: 0,
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (row: any) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(row.skuImgUrl)
}

let copyRow: any
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
const clickCancel = async (event: Event, value: IGetShipmentArrivedList) => {
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
    try {
      await updateShippingCountAdjustment({
        id: value.id!,
        count: value.shippingCountAdjustment!,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const handleClick = (tab: TabsPaneContext) => {
  list.value = []
  queryForm.status = Number(tab.props.name)
  router.push({
    query: {
      ...route.query,
      tab: queryForm.status,
    },
  })
  fetchData()
}
// 修改丢货状态
const handleUpdateLostGoodsStatus = async (row: IGetShipmentArrivedList) => {
  try {
    await updateLostGoodsStatus({
      id: row.id!,
      status: row.lostGoodsStatus!,
    })
  } catch {
    row.lostGoodsStatus = row.lostGoodsStatus === 1 ? 0 : 1
  }
}
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row

  const stripedClass = row.id % 2 === 0 ? 'el-table__row--striped' : ''

  // 选中状态
  const selectedClass = row.id === selectedRowIndex.value ? 'select-row' : ''

  // 组合类名
  return [stripedClass, selectedClass].filter(Boolean).join(' ')
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getShipmentArrivedList(queryForm)
  list.value = data?.list!
  total.value = data?.total!
  listLoading.value = false
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
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
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '发货数量调整') {
    return {
      cursor: 'pointer',
    }
  } else if (
    label === '发货日期' ||
    label === '初始预计到货' ||
    label === '最新预计到货' ||
    label === 'PO' ||
    label === '发货数' ||
    label === '发货总数' ||
    label === 'Shipment ID' ||
    label === '丢货'
  ) {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
}
const cellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 4) {
    return 'clear-padding'
  }
  if (data.columnIndex !== 5 && data.columnIndex !== 13) {
    return 'text-center'
  }
  return ''
}
const cellClassName2 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  if (data.columnIndex !== 1) {
    return 'text-center'
  }
  return ''
}

// 未到货col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (columnIndex !== 11 && columnIndex !== 12 && columnIndex !== 13) {
    const id = row.id
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
// 已发货（接收中）col合并方法
const objectSpanMethod2 = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (columnIndex !== 7 && columnIndex !== 8) {
    const id = row.id
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
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
onActivated(() => {
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    queryForm.status = Number(tab)
  }
  fetchData()
  getSiteList()
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
            margin-top: -3px;
            margin-left: 5px;
          }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin: 0 !important;
            }
          }
        }

        .el-table {
          flex: 1;
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-right: 0;
              padding-left: 0;
            }
          }
          .text-center {
            text-align: center;
          }
        }
        .noneHoveTable {
          .el-checkbox {
            transform: scale(1.5);
            transform-origin: center;
          }
        }
      }
    }
  }
}
.none {
  display: none;
}
</style>
