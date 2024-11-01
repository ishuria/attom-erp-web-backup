<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未到货" :name="0">
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
          :data="fakeData" 
          :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="cellClassName"
          class="noneHoveTable"
        >
          <el-table-column label="发货日期" prop="" min-width="115"></el-table-column>
          <el-table-column label="初始预计到货" prop="" min-width="115"></el-table-column>
          <el-table-column label="最新预计到货" prop="" min-width="115"></el-table-column>
          <el-table-column label="延误" prop="" min-width="80"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="产品图片" prop="" width="75">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.imgUrl" fit="contain" style="width: 100%; height: 100%; display: block;" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="150"></el-table-column>
          <el-table-column label="发货数" prop="" min-width="100"></el-table-column>
          <el-table-column label="站点" prop="site" min-width="120"></el-table-column>
          <el-table-column label="Shipment ID" prop="" min-width="120"></el-table-column>
          <el-table-column label="货代单号" prop="" min-width="100"></el-table-column>
          <el-table-column label="丢货" prop="" min-width="60">
            <template #default="{ row }">
              <el-checkbox :true-value="1" :false-value="0" />
            </template>
          </el-table-column>
          <el-table-column label="不计入时效" prop="" min-width="100">
            <template #default="{ row }">
              <el-checkbox :true-value="1" :false-value="0" />
            </template>
          </el-table-column>
          <el-table-column label="头程渠道" prop="" min-width="150"></el-table-column>
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
          :data="fakeData" 
          :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="cellClassName"
          class="noneHoveTable"
        >
          <el-table-column label="发货日期" prop="" min-width="115"></el-table-column>
          <el-table-column label="初始预计到货" prop="" min-width="120"></el-table-column>
          <el-table-column label="实际到货" prop="" min-width="100"></el-table-column>
          <el-table-column label="延误" prop="" min-width="80"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="产品图片" prop="" width="75">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.imgUrl" fit="contain" style="width: 100%; height: 100%; display: block;" @click="imagePreviewShow(row)">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="150"></el-table-column>
          <el-table-column label="发货数" prop="" min-width="100"></el-table-column>
          <el-table-column label="已接收数量" prop="" min-width="110"></el-table-column>
          <el-table-column label="缺数" prop="" min-width="80"></el-table-column>
          <el-table-column label="已接收" prop="" min-width="90"></el-table-column>
          <el-table-column label="丢货" prop="" min-width="60">
            <template #default="{ row }">
              <el-checkbox :true-value="1" :false-value="0" />
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="site" min-width="120"></el-table-column>
          <el-table-column label="Shipment ID" prop="" min-width="120"></el-table-column>
          <el-table-column label="货代单号" prop="" min-width="100"></el-table-column>
          <el-table-column label="头程渠道" prop="" min-width="150"></el-table-column>
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
import type { TableInstance } from 'element-plus'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'

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
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  site: undefined,
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (row: any) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(row.imgUrl)
}
const handleClick = () => {
  queryData()
}

// const fetchData = async () => {
//   listLoading.value = true
//   const { data } = await getList(queryForm)
//   list.value = data.list
//   total.value = data.total
//   listLoading.value = false
// }

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}

const statusFilter = (status: string | number) => {
  const statusMap: any = {
    published: 'success',
    draft: 'primary',
    deleted: 'danger',
  }
  return statusMap[status]
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row = {}) => {
  editRef.value.showEdit(row)
}


const cellClassName = (data: {row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 5) {
    return 'clear-padding'
  } 
  if (data.columnIndex !== 6) {
    return 'text-center'
  }
  return ''
}

const fakeData = [
  {
    po: 'PO19627',
    sku: 'HOME-0020-WHT',
    imgUrl: 'https://picsum.photos/200/200'
  }
]

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
  siteList.value.unshift({ id: 5, label: '所有' })
}
onActivated(() => {
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  // fetchData()
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
            transform: scale(1.2);
            transform-origin: center;
          }
        }
      }
    }
  }
}
</style>

