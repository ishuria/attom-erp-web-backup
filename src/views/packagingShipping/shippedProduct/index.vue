<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="queryForm.status" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未到货" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" placeholder="请选择站点" @change="queryData">
                  <el-option 
                    v-for="item in siteList"
                    :label="item.label"
                    :value="item.id"
                    :key="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="list" 
          :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="cellClassName"
          class="noneHoveTable"
          :span-method="objectSpanMethod"
          :row-class-name="stripedRowClass"
        >
          <el-table-column label="发货日期" prop="shipmentDate" min-width="115">
            <template #default="{ row }">
              {{ formatDate(new Date(row.shipmentDate)) }}
            </template>
          </el-table-column>
          <el-table-column label="初始预计到货" prop="initialArrivalDate" min-width="115">
            <template #default="{ row }">
              {{ formatDate(new Date(row.initialArrivalDate)) }}
            </template>
          </el-table-column>
          <el-table-column label="最新预计到货" prop="latestArrivalDate" min-width="115">
            <template #default="{ row }">
              {{ row.latestArrivalDate ? formatDate(new Date(row.latestArrivalDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="延误" prop="delayDays" min-width="80"></el-table-column>
          
          <el-table-column label="产品图片" prop="skuImgUrl" width="75">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" fit="contain" style="width: 100%; height: 100%; display: block;" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="发货总数" prop="shipmentTotalCount" min-width="100"></el-table-column>
          <el-table-column label="丢货" prop="lostGoodsStatus" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.lostGoodsStatus" :true-value="1" :false-value="0" @change="handleUpdateLostGoodsStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="site" min-width="120"></el-table-column>
          <el-table-column label="Shipment ID" prop="shipmentId" min-width="120"></el-table-column>
          <el-table-column label="货代单号" prop="freightForwardingNumber" min-width="100"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="发货数" prop="actualCount" min-width="100"></el-table-column>
          <el-table-column label="头程渠道" prop="channelName" :width="flexColumnWidth(list, '头程渠道', 'channelName')"></el-table-column>
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
                  <el-option 
                    v-for="item in siteList"
                    :label="item.label"
                    :value="item.id"
                    :key="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          border 
          :data="list" 
          :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="cellClassName2"
          class="noneHoveTable"
          :span-method="objectSpanMethod2"
        >
          <el-table-column label="产品图片" prop="skuImgUrl" width="75">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" fit="contain" style="width: 100%; height: 100%; display: block;" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="170">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="发货总数" prop="shipmentTotalCount" min-width="100"></el-table-column>
          <el-table-column label="已接收数" prop="receiptsCount" min-width="110"></el-table-column>
          <el-table-column label="缺数" prop="lackCount" min-width="80"></el-table-column>
          <el-table-column label="已接收" prop="acceptDays" min-width="90"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="发货数" prop="actualCount" min-width="100"></el-table-column>
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
        <el-empty class="vab-data-empty" description="暂无数据" />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { getShipmentArrivedList, updateLostGoodsStatus } from '/@/api/devlocal/encasement'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetShipmentArrivedList, IGetShipmentArrivedListReq } from '/@/type/packagingShipping/shippedType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ShippedProductTable',
})

const activeName = ref<number>(0)
const router = useRouter()

const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<IGetShipmentArrivedList[]>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<IGetShipmentArrivedListReq>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  site: -1,
  status: 0
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
const handleClick = (tab: TabsPaneContext) => {
  list.value = []
  queryForm.status = Number(tab.props.name)
  queryData()
}
// 修改丢货状态
const handleUpdateLostGoodsStatus = async (row: IGetShipmentArrivedList) => {
  try {
    const { data } = await updateLostGoodsStatus({
      id: row.id!,
      status: row.lostGoodsStatus!
    })
  } catch (error) {
    row.lostGoodsStatus = row.lostGoodsStatus === 1 ? 0 : 1
  }
}
let previous: any = null 
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row
  const currentId = row.id
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId
    currentGroupIndex++
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : ''
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
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const cellClassName = (data: {row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 4) {
    return 'clear-padding'
  } 
  if (data.columnIndex !== 5 && data.columnIndex !== 13) {
    return 'text-center'
  }
  return ''
}
const cellClassName2 = (data: {row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  } 
  if (data.columnIndex !== 1) {
    return 'text-center'
  }
  return ''
}

// 已发货（未到货）col合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex !== 11 && columnIndex !== 12) {
    const id = row.id;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}
// 已发货（接收中）col合并方法
const objectSpanMethod2 = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex !== 6 && columnIndex !== 7) {
    const id = row.id;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
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
            margin-left: 5px;
            margin-top: -3px;
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
              padding-left: 0;
              padding-right: 0;
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
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>

