<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待发布" :name="0">
        <planned-po-table
          ref="tableComp1"
          v-model:columns="columns"
          :data="plannedPoList"
          :loading="listLoading"
          :procurement-manager-options="procurementManagerOptions"
          :query-form="queryForm"
          show-procurement-filter
          :total="total"
          @cell-click="changeInput"
          @del-planned-po="handleDelPlannedPo"
          @del-sku-planned-po="handleDelSkuPlannedPo"
          @page-change="handleCurrentChange"
          @planned-po-detail="handlePlannedPoDetail"
          @publish-po="handlePublishPo"
          @query="queryData"
          @selection-change="setSelectRows"
          @size-change="handleSizeChange"
        >
          <template #actions>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.CREATE] }"
              :loading="createLoading"
              type="primary"
              @click="handlePlannedPoCreate"
            >
              创建
            </el-button>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.BATCH_RELEASE] }"
              :loading="batchReleaseLoading"
              type="success"
              @click="handleAllPublishPo"
            >
              批量发布
            </el-button>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.BATCH_NOT_MOQ] }"
              :loading="batchMoqLoading"
              type="warning"
              @click="handleAllMOQ"
            >
              批量未达MOQ
            </el-button>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.BATCH_DELETE] }"
              :loading="batchDelLoading"
              type="danger"
              @click="handleAllDelete"
            >
              批量删除
            </el-button>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.NOT_BG_RELEASE] }"
              :loading="notBgLoading"
              type="success"
              @click="handleNotBg"
            >
              不报关可发布
            </el-button>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.QTY_APPROVAL] }"
              :loading="qtyApprovalLoading"
              type="success"
              @click="handleQtyApproval"
            >
              数量审批
            </el-button>
          </template>
          <template #po-dropdown-extra="{ row }">
            <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.NOT_MOQ] }" @click="handleUpdateStatus(row)">
              <el-link type="primary" underline="never">未达起订量</el-link>
            </el-dropdown-item>
          </template>
        </planned-po-table>
      </el-tab-pane>
      <el-tab-pane label="未达起订量" :name="1">
        <planned-po-table
          ref="tableComp2"
          v-model:columns="columns"
          :data="plannedPoList"
          :loading="listLoading"
          :procurement-manager-options="procurementManagerOptions"
          :query-form="queryForm"
          :total="total"
          @cell-click="changeInput"
          @del-planned-po="handleDelPlannedPo"
          @del-sku-planned-po="handleDelSkuPlannedPo"
          @page-change="handleCurrentChange"
          @planned-po-detail="handlePlannedPoDetail"
          @publish-po="handlePublishPo"
          @query="queryData"
          @selection-change="setSelectRows"
          @size-change="handleSizeChange"
        >
          <template #actions>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.BATCH_DELETE] }"
              :loading="batchDelLoading"
              type="danger"
              @click="handleAllDelete"
            >
              批量删除
            </el-button>
            <el-button
              v-permissions="{ permission: [PlanPoPermission.BATCH_RELEASE] }"
              :loading="batchReleaseLoading"
              type="success"
              @click="handleAllPublishPo"
            >
              批量发布
            </el-button>
          </template>
          <template #po-dropdown-extra="{ row }">
            <el-dropdown-item v-permissions="{ permission: ['purchase:planPo:moq'] }" @click="handleUpdateRStatus(row)">
              <el-link type="primary" underline="never">达到起订量</el-link>
            </el-dropdown-item>
          </template>
        </planned-po-table>
      </el-tab-pane>
    </el-tabs>
    <wang-editor
      :classify="classify"
      :content="progressLogCopy"
      :progress-id="detailId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="clickLogBool"
      @click-child="clickLog"
    />
  </div>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import type { TabsPaneContext } from 'element-plus'
import { defineAsyncComponent, ref } from 'vue'
import { getOperationColumnList } from '/@/api/devlocal/productPerformance'
import {
  deleteAllPlanPo,
  deletePlanPo,
  deletePurchasePlanPo,
  getPlanPoList,
  getPoPurchaseMatters,
  planPoNbgFlagHander,
  planPoNrMoq,
  planPoQtyApprovalPass,
  planPorMoq,
  releaseBatchPlanPo,
  releasePlanPo,
  updatePlanPoStatus,
  updatePoPurchaseMatters,
} from '/@/api/devlocal/purchasePo'
import { getUserProcurementName } from '/@/api/devlocal/user'
import PlanPoPermission from '/@/permissions/planPo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IGetPlanPoList, IGetPlanPoListQuery } from '/@/type/purchase/po'
import { focusAndSelectInput } from '/@/utils/nodeUtils'
import { handleMatched, handleTabs } from '/@/utils/routes'
import PlannedPoTable from '/@/views/purchase/vabAutoComponents/PlannedPoTable.vue'

const wangEditor = defineAsyncComponent(() => import('/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'))

defineOptions({ name: 'PlannedPo' })

const activeName = ref<number>(0)
const router = useRouter()
const route = useRoute()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore

const selectRows = ref<any>([])
const setSelectRows = (value: any) => {
  selectRows.value = value
}

const deraltProcurementManager = { userId: -1, userName: '全部采购负责人' }
const procurementManagerOptions = ref<any>([])
const queryProcurementManagerData = async () => {
  procurementManagerOptions.value = []
  const { data } = await getUserProcurementName({ name: '' })
  data.unshift(deraltProcurementManager)
  procurementManagerOptions.value = data
}

// 列配置
const columns = ref<any[]>([])
const COLUMN_CACHE_KEY = 'plannedPo_columns'
const fetchColumn = async () => {
  try {
    const cachedColumns = localStorage.getItem(COLUMN_CACHE_KEY)
    if (cachedColumns) {
      columns.value = JSON.parse(cachedColumns)
      columns.value.forEach((item: any) => {
        item.minWidth = item.width
      })
    }
    const { data } = await getOperationColumnList({ type: 9 })
    if (data) {
      columns.value = data
      columns.value.forEach((item: any) => {
        item.minWidth = item.width
      })
      localStorage.setItem(COLUMN_CACHE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.warn('Column config load error:', error)
  }
}

// 数据列表
const listLoading = ref<boolean>(true)
const plannedPoList = ref<IGetPlanPoList[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 50,
  keyWord: '',
  status: 0,
  customsStatus: -1,
  procurementManager: deraltProcurementManager,
})

// 子组件引用(用于 keep-alive 激活后重排表格/清空选择)
const tableComp1 = ref<{ doLayout: () => void; clearSelection: () => void }>()
const tableComp2 = ref<{ doLayout: () => void; clearSelection: () => void }>()

// 分页 / 搜索
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({ query: { ...route.query, pageNo: queryForm.pageNo, pageSize: queryForm.pageSize } })
  fetchData(false)
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({ query: { ...route.query, pageNo: queryForm.pageNo, pageSize: queryForm.pageSize } })
  fetchData(false)
}
const searchDebounceTimer = ref<NodeJS.Timeout>()
const queryData = () => {
  if (searchDebounceTimer.value) clearTimeout(searchDebounceTimer.value)
  searchDebounceTimer.value = setTimeout(() => {
    queryForm.pageNo = 1
    router.push({ query: { ...route.query, pageNo: queryForm.pageNo, pageSize: queryForm.pageSize } })
    fetchData(false)
  }, 300)
}

// 单条:未达起订量 / 达到起订量
const handleUpdateStatus = async (row: any) => {
  try {
    $baseConfirm('确定该条PO未达起订量吗', null, async () => {
      const { data } = await updatePlanPoStatus({ id: row.id })
      if (data === true) {
        $baseMessage('该条PO未达起订量成功', 'success', 'hey')
        fetchData(false)
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleUpdateRStatus = async (row: any) => {
  try {
    $baseConfirm('确定该条PO达到起订量吗', null, async () => {
      const { data } = await planPorMoq({ id: row.id })
      if (data === true) {
        $baseMessage('该条PO达到起订量成功', 'success', 'hey')
        fetchData(false)
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 批量操作
const batchMoqLoading = ref<boolean>(false)
const handleAllMOQ = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  try {
    batchMoqLoading.value = true
    const ids = selectRows.value.map((item: any) => item.id).join(',')
    const { data } = await planPoNrMoq({ ids })
    if (data === true) {
      $baseMessage('批量未达起订量成功', 'success', 'hey')
      fetchData(false)
    }
  } catch (error) {
    console.error(error)
  } finally {
    batchMoqLoading.value = false
  }
}

const batchDelLoading = ref<boolean>(false)
const handleAllDelete = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  $baseConfirm('确定要批量删除所选PO吗', null, async () => {
    try {
      batchDelLoading.value = true
      const ids = selectRows.value.map((item: any) => item.id).join(',')
      const { data } = await deleteAllPlanPo({ ids })
      if (data === true) {
        $baseMessage('批量删除PO成功', 'success', 'hey')
        fetchData(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      batchDelLoading.value = false
    }
  })
}

const notBgLoading = ref<boolean>(false)
const handleNotBg = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  const ids = selectRows.value.map((item: any) => item.id).join(',')
  try {
    notBgLoading.value = true
    const { data } = await planPoNbgFlagHander({ ids })
    if (data === true) {
      $baseMessage('不报关审批通过!', 'success', 'hey')
      fetchData(false)
    }
  } catch (error) {
    console.error(error)
  } finally {
    notBgLoading.value = false
  }
}

const qtyApprovalLoading = ref<boolean>(false)
const handleQtyApproval = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  const ids = selectRows.value.map((item: any) => item.id).join(',')
  try {
    qtyApprovalLoading.value = true
    const { data } = await planPoQtyApprovalPass({ ids })
    if (data === true) {
      $baseMessage('数量审批通过成功!', 'success', 'hey')
      fetchData(false)
    }
  } catch (error) {
    console.error(error)
  } finally {
    qtyApprovalLoading.value = false
  }
}

// 删除
const handleDelSkuPlannedPo = (row: any) => {
  try {
    $baseConfirm('确定要删除当前SKU吗', '系统提示', async () => {
      const { data } = await deletePurchasePlanPo({ poSkuId: row.poSkuId })
      if (data === true) {
        $baseMessage('删除SKU成功', 'success', 'hey')
        fetchData(false)
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleDelPlannedPo = (row: any) => {
  try {
    $baseConfirm('确定要删除当前PO吗', '系统提示', async () => {
      const { data } = await deletePlanPo({ poId: row.id })
      if (data === true) {
        $baseMessage('删除PO成功', 'success', 'hey')
        fetchData(false)
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 发布PO
const batchReleaseLoading = ref<boolean>(false)
const _handleAllPublishPo = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  const ids = selectRows.value.map((item: any) => item.id).join(',')
  try {
    batchReleaseLoading.value = true
    const { data } = await releaseBatchPlanPo({ poIds: ids })
    if (data === true) {
      $baseMessage('批量发布到PO成功', 'success', 'hey')
      fetchData(false)
    }
  } catch (error) {
    console.error(error)
  } finally {
    batchReleaseLoading.value = false
  }
}
const handleAllPublishPo = useDebounceFn(_handleAllPublishPo, 1000)

const _handlePublishPo = async (row: any) => {
  try {
    $baseConfirm('确定要发布到PO吗', null, async () => {
      const { data } = await releasePlanPo({ id: row.id })
      if (data === true) {
        $baseMessage('发布到PO成功', 'success', 'hey')
        fetchData(false)
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handlePublishPo = useDebounceFn(_handlePublishPo, 1000)

// 详情 / 创建跳转
const handlePlannedPoDetail = async (row: any) => {
  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query: {
      title: '采购计划订单详情',
      from: 'plannedPoDetail',
      poSkuId: row.poSkuId,
      poId: row.id,
    },
  })
  if (tab) {
    await router.push({
      path: '/purchase/poDetail',
      query: {
        title: '采购计划订单详情',
        from: 'plannedPoDetail',
        poSkuId: row.poSkuId,
        poId: row.id,
      },
    })
    await changeTabsMeta({ title: 'PO详情', meta: { title: `${tab.query.title}` } })
  }
}

const createLoading = ref<boolean>(false)
const handlePlannedPoCreate = async () => {
  createLoading.value = true
  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query: { title: '采购计划创建', from: 'plannedPoCreate' },
  })
  if (tab) {
    await router.push({
      path: '/purchase/poDetail',
      query: { title: '采购计划创建', from: 'plannedPoCreate' },
    })
    await changeTabsMeta({ title: 'PO详情', meta: { title: `${tab.query.title}` } })
  }
  createLoading.value = false
}

// 富文本(零件采购注意事项)
const wangEditorTitle = ref<string>('')
const wangEditorLogVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const classify = ref<string>('')
const clickRow = ref<any>()
const detailId = ref<number>(-1)

const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.property == 'purchaseMatters') {
    clickRow.value = row
    detailId.value = row.componentId
    const { data } = await getPoPurchaseMatters({ id: row.componentId })
    progressLogCopy.value = data
    row.purchaseMatters = data
    wangEditorTitle.value = '编辑零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  }

  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]
  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) return
  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')
    focusAndSelectInput(cell)
  }
}

const clickLog = async (val: any) => {
  const { data } = await updatePoPurchaseMatters({ id: clickRow.value.componentId, purchaseMatters: val })
  if (data === true) {
    progressLogCopy.value = val
    clickRow.value.purchaseMatters = val
  }
}
const clickLogBool = (val: any) => {
  wangEditorLogVisible.value = val
}

// tab 切换
const handleTabClick = (tab: TabsPaneContext) => {
  plannedPoList.value = []
  if (tab.props.name !== undefined) {
    queryForm.status = Number(tab.props.name)
  }
  queryForm.pageNo = 1
  selectRows.value = []
  tableComp1.value?.clearSelection()
  tableComp2.value?.clearSelection()
  activeName.value = queryForm.status
  router.push({ query: { ...route.query, tab: tab.props.name, pageNo: queryForm.pageNo, pageSize: queryForm.pageSize } })
  fetchData(false)
}

// 本地缓存 + 拉取列表
const CACHE_KEY = 'plannedPo_cache'
const CACHE_EXPIRY = 2 * 60 * 1000
const getProcurementManagerId = () => queryForm.procurementManager?.userId ?? -1
const getCustomsStatus = () => queryForm.customsStatus ?? -1
const getCacheKey = () =>
  `${CACHE_KEY}:${JSON.stringify({
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    keyWord: queryForm.keyWord,
    status: queryForm.status,
    customsStatus: getCustomsStatus(),
    procurementManagerId: getProcurementManagerId(),
  })}`

const getCacheData = () => {
  try {
    const cached = localStorage.getItem(getCacheKey())
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_EXPIRY) return data
    }
  } catch (error) {
    console.warn('Cache read error:', error)
  }
  return null
}
const setCacheData = (data: any) => {
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify({ data, timestamp: Date.now() }))
  } catch (error) {
    console.warn('Cache write error:', error)
  }
}

const fetchData = async (useCache = true) => {
  try {
    if (useCache) {
      const cached = getCacheData()
      if (cached && cached.list && cached.list.length > 0) {
        plannedPoList.value = cached.list
        total.value = cached.total
        listLoading.value = false
      }
    }
    const { data } = await getPlanPoList({
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      keyWord: queryForm.keyWord,
      status: queryForm.status,
      customsStatus: getCustomsStatus(),
      procurementManagerId: getProcurementManagerId(),
    })
    if (data) {
      listLoading.value = false
      total.value = data.total
      plannedPoList.value = data.list
      setCacheData(data)
    }
  } catch (error) {
    console.error(error)
    listLoading.value = false
  }
}

onActivated(() => {
  tableComp1.value?.doLayout()
  tableComp2.value?.doLayout()
})
onBeforeMount(async () => {
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  if (tab) {
    activeName.value = Number(tab)
    queryForm.status = Number(tab)
  }
  await Promise.all([fetchColumn(), queryProcurementManagerData(), fetchData(true)])
})
onBeforeUnmount(() => {
  if (searchDebounceTimer.value) clearTimeout(searchDebounceTimer.value)
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
        }
      }
    }
  }
}

.none {
  display: none;
}

:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}

:deep(.shareSelectDialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
