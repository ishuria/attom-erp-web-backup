<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="tab in tabConfigs" :key="tab.name" :label="tab.label" :name="tab.name">
        <template v-if="activeName === tab.name">
          <vab-query-form>
            <vab-query-form-left-panel>
              <el-button
                v-permissions="{ permission: [PlanPoPermission.CREATE] }"
                :loading="createLoading"
                type="primary"
                @click="handleCreate"
              >
                创建
              </el-button>
              <el-button
                v-permissions="{ permission: [PlanPoPermission.QTY_APPROVAL] }"
                :loading="qtyApprovalLoading"
                type="success"
                @click="handleQtyApproval"
              >
                数量审批
              </el-button>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-select
                    v-model="queryForm.requisitioner"
                    clearable
                    filterable
                    placeholder="请购人"
                    style="width: 180px; margin-right: 10px"
                    @change="handleQuery"
                  >
                    <el-option v-for="u in operationUserList" :key="u.id" :label="u.label" :value="u.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="queryForm.keyWord"
                    clearable
                    placeholder="请输入 SKU / 请购人"
                    style="width: 240px"
                    @input="handleQuery"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="handleQuery" />
                </el-form-item>
              </el-form>
            </vab-query-form-right-panel>
          </vab-query-form>

          <el-table
            v-loading="loading"
            border
            :cell-style="cellStyle"
            :data="list"
            :header-cell-style="{ textAlign: 'center' }"
            height="100%"
            highlight-current-row
            stripe
            :span-method="objectSpanMethod"
            @selection-change="(rows: IStockReplenishmentItem[]) => (selectedRows = rows)"
          >
            <el-table-column type="selection" width="100" />
            <el-table-column label="状态" prop="publishStatus" width="200">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.publishStatus)">
                  {{ getStatusLabel(row.publishStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建日期" prop="createTime" width="300" />
            <el-table-column label="请购人" prop="userName" width="200" />
            <el-table-column label="站点" prop="siteName" width="300" />
            <el-table-column class-name="clear-padding" label="SKU图片" prop="skuImageUrl" width="75">
              <template #default="{ row }">
                <el-image
                  v-if="row.skuImageUrl"
                  close-on-press-escape
                  fit="cover"
                  hide-on-click-modal
                  :lazy="true"
                  :preview-src-list="[row.skuImageUrl]"
                  preview-teleported
                  :src="row.skuImageUrl"
                  style="width: 75px; height: 75px; border-radius: 4px; cursor: zoom-in"
                >
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="SKU" prop="sku">
              <template #default="{ row }">
                <span class="copySku" :data-sku="row.sku" @click="handleClipboard($event, row.sku)">
                  {{ row.sku }}
                  <vab-icon icon="file-copy-2-fill" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="purchaseSkuNumber" width="200" />
            <el-table-column label="曹县产品" prop="isCaoxian" width="200">
              <template #default="{ row }">
                <vab-icon v-if="row.isCaoxian" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
                {{ '' }}
              </template>
            </el-table-column>
            <el-table-column v-if="tab.showDelete" label="操作" width="200">
              <template #default="{ row }">
                <el-button v-permissions="{ permission: [PlanPoPermission.DELETE_PO_SKU] }" link type="danger" @click="handleDelete(row)">
                  删除
                </el-button>
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
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { getDistributionOptionUserList } from '/@/api/devlocal/productDistribution'
import { deletePurchasePlanPo, getStockReplenishmentList, planPoQtyApprovalPass } from '/@/api/devlocal/purchasePo'
import PlanPoPermission from '/@/permissions/planPo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import handleClipboard from '/@/utils/clipboard'
import { handleMatched, handleTabs } from '/@/utils/routes'

defineOptions({
  name: 'StockReplenishmentDashboard',
})

enum PoStatus {
  PENDING = 0,
  BELOW_MOQ = 1,
}

interface IStockReplenishmentItem {
  id: number
  poSkuId: number
  publishStatus: number
  createTime: string
  userName?: string
  siteId?: number
  siteName?: string
  sku: string
  skuImageUrl?: string
  purchaseSkuNumber?: number
  isCaoxian?: boolean
}

interface IStockReplenishmentQuery {
  pageNo: number
  pageSize: number
  status: PoStatus
  keyWord: string
  requisitioner: number
}

interface IOperationUserOption {
  id: number
  label: string
}

const tabConfigs = [
  { name: PoStatus.PENDING, label: '待发布', showDelete: true },
  { name: PoStatus.BELOW_MOQ, label: '未达起订量', showDelete: true },
]

type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

const getStatusType = (status: number): TagType => {
  const types: TagType[] = ['info', 'success', 'warning', 'danger']
  return types[status] ?? 'info'
}

const getStatusLabel = (status: number): string => {
  const labels = ['-', '可发布', '数量审批', '不报关审批']
  return labels[status] ?? '-'
}

const activeName = ref<PoStatus>(PoStatus.PENDING)
const list = ref<IStockReplenishmentItem[]>([])
const total = ref(0)
const loading = ref(false)
const operationUserList = ref<IOperationUserOption[]>([])
const selectedRows = ref<IStockReplenishmentItem[]>([])
const createLoading = ref(false)
const qtyApprovalLoading = ref(false)

const queryForm = reactive<IStockReplenishmentQuery>({
  pageNo: 1,
  pageSize: 50,
  status: PoStatus.PENDING,
  keyWord: '',
  requisitioner: -1,
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const { changeTabsMeta } = useTabsStore()

const fetchOperationUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operationUserList.value = data ?? []
  operationUserList.value.unshift({ id: -1, label: '全部请购人' })
}

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await getStockReplenishmentList(queryForm)
    list.value = data?.list ?? []
    total.value = data?.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handlePageChange = (page: number) => {
  queryForm.pageNo = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  queryForm.pageSize = size
  queryForm.pageNo = 1
  fetchData()
}

const handleDelete = (row: IStockReplenishmentItem) => {
  $baseConfirm('确定要删除当前采购计划吗', '系统提示', async () => {
    const { data } = await deletePurchasePlanPo({ poSkuId: row.poSkuId })
    if (data === true) {
      $baseMessage('删除采购计划成功', 'success', 'hey')
      fetchData()
    }
  })
}

const handleCreate = async () => {
  createLoading.value = true
  try {
    const query = { title: '采购计划创建', from: 'plannedPoCreate', source: 'stockReplenishmentDashboard' }
    const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
    const tab = handleTabs({
      ...matched.at(-1),
      query,
    })
    if (tab) {
      await router.push({
        path: '/purchase/poDetail',
        query,
      })
      await changeTabsMeta({ title: 'PO详情', meta: { title: `${tab.query.title}` } })
    }
  } finally {
    createLoading.value = false
  }
}

const handleQtyApproval = async () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  const ids = selectedRows.value.map((item) => item.id).join(',')
  try {
    qtyApprovalLoading.value = true
    const { data } = await planPoQtyApprovalPass({ ids })
    if (data === true) {
      $baseMessage('数量审批通过成功!', 'success', 'hey')
      fetchData()
    }
  } finally {
    qtyApprovalLoading.value = false
  }
}

const poMergeColumnLabels = new Set(['状态', '创建日期', '请购人', '站点'])

const objectSpanMethod = ({ row, column, rowIndex }: any) => {
  if (column.type === 'selection' || poMergeColumnLabels.has(column.label)) {
    const id = row.id
    let rowspan = 1
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].id === id) rowspan++
      else break
    }
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    }
    return { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}

const cellStyle = ({ column }: any): any => {
  if (column.label !== 'SKU') return { textAlign: 'center' }
}

watch(activeName, (val) => {
  queryForm.status = val
  queryForm.pageNo = 1
  fetchData()
})

onMounted(() => {
  fetchOperationUserList()
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

          .right-panel {
            margin-bottom: 5px !important;
          }
        }
      }
    }
  }
}

.copySku {
  cursor: pointer;
  user-select: text;
  transition: all 0.3s;

  &:hover {
    color: #000;
  }
}

:deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;

  .cell {
    padding-right: 0;
    padding-left: 0;
  }
}

:deep(.el-table) {
  .el-table__row.current-row > td.el-table__cell,
  .el-table__row.current-row:hover > td.el-table__cell {
    background-color: var(--el-color-primary-light-8);
  }
}
</style>
