<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待发布" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
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
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <!-- 列设置面板 -->
            <div class="column-settings">
              <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
                <template #reference>
                  <el-button>
                    <vab-icon icon="settings-line" />
                  </el-button>
                </template>
                <vab-draggable
                  v-model="columns"
                  :animation="600"
                  filter=".non-draggable"
                  handle=".handle"
                  :on-end="handleEnd"
                  :on-move="handleMove"
                >
                  <div
                    v-for="item in columns"
                    :key="item.label"
                    :class="{ 'non-draggable': item.disableCheck }"
                    style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                  >
                    <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                    <span style="flex: 1">{{ item.label }}</span>
                    <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                      <vab-icon icon="eye-line" />
                    </span>
                    <span
                      v-else
                      class="icon-hover"
                      style="display: flex; align-items: center; cursor: pointer"
                      @click="handleChecked(item)"
                    >
                      <vab-icon v-show="!item.checked" icon="eye-off-line" />
                      <vab-icon v-show="item.checked" icon="eye-line" />
                    </span>
                  </div>
                </vab-draggable>
              </el-popover>
            </div>
            <el-form inline :model="queryForm" @submit.prevent>
              <!-- 新增：报关状态筛选 -->
              <el-form-item label="">
                <el-select v-model="queryForm.customsStatus" clearable placeholder="报关状态筛选" style="width: 150px" @change="queryData">
                  <el-option label="全部报关状态" :value="-1" />
                  <el-option label="报关" :value="0" />
                  <el-option label="不报关" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select
                  v-model="queryForm.procurementManager"
                  clearable
                  placeholder="采购负责人筛选"
                  style="width: 150px"
                  value-key="userId"
                  @change="queryData"
                >
                  <el-option v-for="item in procurementManagerOptions" :key="item.userId" :label="item.userName" :value="item" />
                </el-select>
              </el-form-item>
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
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="plannedPoList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
        >
          <el-table-column class="custom-checkbox" fixed="left" type="selection" />

          <el-table-column v-permissions="PlanPoPermission.poOperationColumnPermission()" fixed="left" label="PO操作" width="100">
            <template #default="{ row }">
              <el-dropdown>
                <el-button v-permissions="{ permission: [PlanPoPermission.RELEASE_PO] }" text type="primary" @click="handlePublishPo(row)">
                  发布PO
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.RELEASE_PO] }" @click="handlePublishPo(row)">
                      <el-link type="primary" underline="never">发布PO</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.NOT_MOQ] }" @click="handleUpdateStatus(row)">
                      <el-link type="primary" underline="never">未达起订量</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.DELETE] }" @click="handleDelPlannedPo(row)">
                      <el-link type="danger" underline="never">删除</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <!-- 状态列 -->
          <el-table-column label="状态" min-width="115" prop="publishStatus">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.publishStatus)">
                {{ getStatusLabel(row.publishStatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            v-for="(item, index) in checkList"
            :key="item.label"
            :label="item.label"
            :min-width="handleCalculateWidth(item)"
            :prop="item.prop"
          >
            <template v-if="item.label === 'SKU图片'" #header>
              SKU
              <br />
              图片
            </template>
            <template v-if="item.label === '创建日期'" #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
            <template v-if="item.label === 'SKU图片'" #default="{ row }">
              <el-image :lazy="true" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
            <template v-if="item.label === 'SKU'" #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
            <template v-if="item.label === '货币'" #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
            <template v-else-if="item.label === '不报关'" #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>
            <template v-else-if="item.label === '零件采购注意事项'" #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </el-tooltip>
            </template>
            <template v-else-if="item.label === '收货仓库'" #default="{ row }">
              <div :style="{ color: row.characteristic === 1 ? 'var(--el-color-danger)' : '' }">{{ row.repositoryName }}</div>
            </template>
          </el-table-column>

          <el-table-column v-permissions="PlanPoPermission.skuOperationColumnPermission()" fixed="right" label="SKU操作" width="120">
            <template #default="{ row }">
              <el-space>
                <el-button
                  v-permissions="{ permission: [PlanPoPermission.DETAIL] }"
                  link
                  type="primary"
                  @click="handlePlannedPoDetail(row)"
                >
                  详情
                </el-button>
                <el-button
                  v-permissions="{ permission: [PlanPoPermission.DELETE_PO_SKU] }"
                  link
                  type="danger"
                  @click="handleDelSkuPlannedPo(row)"
                >
                  删除
                </el-button>
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
      </el-tab-pane>
      <el-tab-pane label="未达起订量" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
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
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <!-- 列设置面板 -->
            <div class="column-settings">
              <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
                <template #reference>
                  <el-button>
                    <vab-icon icon="settings-line" />
                  </el-button>
                </template>
                <vab-draggable
                  v-model="columns"
                  :animation="600"
                  filter=".non-draggable"
                  handle=".handle"
                  :on-end="handleEnd"
                  :on-move="handleMove"
                >
                  <div
                    v-for="item in columns"
                    :key="item.label"
                    :class="{ 'non-draggable': item.disableCheck }"
                    style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                  >
                    <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                    <span style="flex: 1">{{ item.label }}</span>
                    <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                      <vab-icon icon="eye-line" />
                    </span>
                    <span
                      v-else
                      class="icon-hover"
                      style="display: flex; align-items: center; cursor: pointer"
                      @click="handleChecked(item)"
                    >
                      <vab-icon v-show="!item.checked" icon="eye-off-line" />
                      <vab-icon v-show="item.checked" icon="eye-line" />
                    </span>
                  </div>
                </vab-draggable>
              </el-popover>
            </div>
            <el-form inline :model="queryForm" @submit.prevent>
              <!-- 新增：报关状态筛选 -->
              <el-form-item label="">
                <el-select v-model="queryForm.customsStatus" clearable placeholder="报关状态筛选" style="width: 150px" @change="queryData">
                  <el-option label="全部报关状态" :value="-1" />
                  <el-option label="报关" :value="0" />
                  <el-option label="不报关" :value="1" />
                </el-select>
              </el-form-item>
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
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef2"
          v-loading="listLoading"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="plannedPoList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
        >
          <el-table-column class="custom-checkbox" fixed="left" type="selection" />

          <el-table-column v-permissions="PlanPoPermission.poOperationColumnPermission()" fixed="left" label="PO操作" width="100">
            <template #default="{ row }">
              <el-dropdown>
                <el-button v-permissions="{ permission: [PlanPoPermission.RELEASE_PO] }" text type="primary" @click="handlePublishPo(row)">
                  发布PO
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.RELEASE_PO] }" @click="handlePublishPo(row)">
                      <el-link type="primary" underline="never">发布PO</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-permissions="{ permission: ['purchase:planPo:moq'] }" @click="handleUpdateRStatus(row)">
                      <el-link type="primary" underline="never">达到起订量</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-permissions="{ permission: [PlanPoPermission.DELETE] }" @click="handleDelPlannedPo(row)">
                      <el-link type="danger" underline="never">删除</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <!-- 状态列 -->
          <el-table-column label="状态" min-width="115" prop="publishStatus">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.publishStatus)">
                {{ getStatusLabel(row.publishStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 第一组：PO操作到站点 (支持合并单元格) -->
          <el-table-column
            v-for="(item, index) in checkList"
            :key="item.label"
            :label="item.label"
            :min-width="handleCalculateWidth(item)"
            :prop="item.prop"
          >
            <template v-if="item.label === 'SKU图片'" #header>
              SKU
              <br />
              图片
            </template>
            <template v-if="item.label === '创建日期'" #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>

            <template v-if="item.label === 'SKU图片'" #default="{ row }">
              <el-image :lazy="true" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
            <template v-if="item.label === 'SKU'" #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
            <template v-if="item.label === '货币'" #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
            <template v-else-if="item.label === '不报关'" #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>
            <template v-else-if="item.label === '零件采购注意事项'" #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column v-permissions="PlanPoPermission.skuOperationColumnPermission()" fixed="right" label="SKU操作" width="120">
            <template #default="{ row }">
              <el-space>
                <el-button
                  v-permissions="{ permission: [PlanPoPermission.DETAIL] }"
                  link
                  type="primary"
                  @click="handlePlannedPoDetail(row)"
                >
                  详情
                </el-button>
                <el-button
                  v-permissions="{ permission: [PlanPoPermission.DELETE_PO_SKU] }"
                  link
                  type="danger"
                  @click="handleDelSkuPlannedPo(row)"
                >
                  删除
                </el-button>
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
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
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
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { defineAsyncComponent, ref } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
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
import handleClipboard from '/@/utils/clipboard'
import { focusAndSelectInput } from '/@/utils/nodeUtils'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import type { CurrencyCode } from '/@/views/purchase/constantOption'
import { currencyMap } from '/@/views/purchase/constantOption'

// 懒加载 wangEditor 组件，减少初始加载时间
const wangEditor = defineAsyncComponent(() => import('/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'))

defineOptions({
  name: 'PlannedPo',
})

const activeName = ref<number>(0)
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore
const selectRows = ref<any>([])
const procurementManagerOptions = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const deraltProcurementManager = { userId: -1, userName: '全部采购负责人' }
// 状态类型映射
const getStatusType = (status: number) => {
  const types = ['', 'success', 'warning', 'danger'] as const
  return types[status] || 'info'
}

const getStatusLabel = (status: number) => {
  const labels = ['', '可发布', '数量审批', '不报关审批']
  return labels[status] || '-'
}

// 列配置数据
const columns = ref<any>([])
const checkList = computed(() => {
  return columns.value.filter((item: any) => item.checked)
})

// 列配置缓存
const COLUMN_CACHE_KEY = 'plannedPo_columns'
const fetchColumn = async () => {
  try {
    // 先使用缓存的列配置
    const cachedColumns = localStorage.getItem(COLUMN_CACHE_KEY)
    if (cachedColumns) {
      columns.value = JSON.parse(cachedColumns)
      columns.value.forEach((item: any) => {
        item.minWidth = item.width
      })
    }

    // 后台更新最新配置
    const { data } = await getOperationColumnList({ type: 9 })
    if (data) {
      columns.value = data
      columns.value.forEach((item: any) => {
        item.minWidth = item.width
      })
      // 更新缓存
      localStorage.setItem(COLUMN_CACHE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.warn('Column config load error:', error)
  }
}
// 列显示/隐藏切换
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const handleEnd = async () => {
  const req = columns.value.map((item: any, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
// 列宽计算缓存
const columnWidthCache = ref<Map<string, number>>(new Map())

const handleCalculateWidth = (item: any) => {
  const cacheKey = `${item.label}-${item.prop}-${plannedPoList.value.length}`

  // 检查缓存
  if (columnWidthCache.value.has(cacheKey)) {
    return columnWidthCache.value.get(cacheKey)!
  }

  let width = item.minWidth

  switch (item.label) {
    case 'SKU': {
      width = flexColumnWidth(plannedPoList.value, 'SKU', 'sku')
      break
    }
    case '零件名': {
      width = flexColumnWidth(plannedPoList.value, '零件名', 'componentName')
      break
    }
    case '供应商': {
      width = flexColumnWidth(plannedPoList.value, '供应商', 'suppliser')
      break
    }
    default: {
      width = item.minWidth
    }
  }

  // 缓存结果
  columnWidthCache.value.set(cacheKey, width)
  return width
}
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
// 采购计划列表
let plannedPoList = ref<IGetPlanPoList[]>([])
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 50,
  keyWord: '',
  status: 0, //po状态 0待发布 1未达起订量
  customsStatus: -1, //报关状态 -1全部 0报关 1不报关
  procurementManager: deraltProcurementManager,
})
const route = useRoute()
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
// 防抖搜索
const searchDebounceTimer = ref<NodeJS.Timeout>()
const queryData = () => {
  // 清除之前的定时器
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }

  // 设置新的防抖定时器
  searchDebounceTimer.value = setTimeout(() => {
    queryForm.pageNo = 1
    router.push({
      query: {
        ...route.query,
        pageNo: queryForm.pageNo,
        pageSize: queryForm.pageSize,
      },
    })
    fetchData()
  }, 300) // 300ms 防抖
}
const getCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  const label = data.column.label
  if (label === 'SKU图片' || label === 'PO操作') {
    return 'clear-padding'
  }
  return ''
}
// 缓存合并单元格计算结果
const spanCache = ref<Map<string, { rowspan: number; colspan: number }>>(new Map())

// 重置缓存
const resetSpanCache = () => {
  spanCache.value.clear()
}

//采购计划col合并方法（优化版）
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  const label = column.label
  const cacheKey = `${rowIndex}-${columnIndex}-${label}`

  // 检查缓存
  if (spanCache.value.has(cacheKey)) {
    return spanCache.value.get(cacheKey)!
  }

  let result = { rowspan: 1, colspan: 1 }

  if (columnIndex === 0 || label === 'PO操作' || label === '创建日期' || label === '请购人' || label === '站点' || label === '状态') {
    const id = row.id

    // 只在第一次出现时计算
    const isFirstOccurrence = rowIndex === 0 || plannedPoList.value[rowIndex - 1].id !== id

    if (isFirstOccurrence) {
      // 只计算当前PO的span
      let rowspan = 1
      for (let i = rowIndex + 1; i < plannedPoList.value.length; i++) {
        if (plannedPoList.value[i].id === id) {
          rowspan++
        } else {
          break
        }
      }
      result = { rowspan, colspan: 1 }
    } else {
      result = { rowspan: 0, colspan: 0 }
    }
  }

  // 合并 SKU 行
  if (label === '采购负责人' || label === 'SKU' || label === '数量' || label === 'SKU图片' || label === 'SKU操作') {
    const poSkuId = row.poSkuId
    const isFirstOccurrence =
      rowIndex === 0 || plannedPoList.value[rowIndex - 1].poSkuId !== poSkuId || plannedPoList.value[rowIndex - 1].id !== row.id

    if (isFirstOccurrence) {
      let rowspan = 1
      for (let i = rowIndex + 1; i < plannedPoList.value.length; i++) {
        if (plannedPoList.value[i].poSkuId === poSkuId && plannedPoList.value[i].id === row.id) {
          rowspan++
        } else {
          break
        }
      }
      result = { rowspan, colspan: 1 }
    } else {
      result = { rowspan: 0, colspan: 0 }
    }
  }

  // 缓存结果
  spanCache.value.set(cacheKey, result)
  return result
}

const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}

const stripedRowClass = (_row: any) => {
  const { row } = _row

  const stripedClass = row.id % 2 === 0 ? 'el-table__row--striped' : ''

  // 选中状态
  const selectedClass = row.id === selectedRowIndex.value ? 'select-row' : ''

  // 组合类名
  return [stripedClass, selectedClass].filter(Boolean).join(' ')
}

// 处理未达起订量
const handleUpdateStatus = async (row: any) => {
  try {
    $baseConfirm('确定该条PO未达起订量吗', null, async () => {
      const { data } = await updatePlanPoStatus({
        id: row.id,
      })
      if (data === true) {
        $baseMessage('该条PO未达起订量成功', 'success', 'hey')
        fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 处理达起订量
const handleUpdateRStatus = async (row: any) => {
  try {
    $baseConfirm('确定该条PO达到起订量吗', null, async () => {
      const { data } = await planPorMoq({
        id: row.id,
      })
      if (data === true) {
        $baseMessage('该条PO达到起订量成功', 'success', 'hey')
        fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const batchMoqLoading = ref<boolean>(false)
const handleAllMOQ = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  try {
    batchMoqLoading.value = true
    const ids = selectRows.value.map((item: any) => item.id).join(',') // 组合 ID
    const { data } = await planPoNrMoq({
      ids,
    })
    if (data === true) {
      $baseMessage('批量未达起订量成功', 'success', 'hey')
      fetchData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    batchMoqLoading.value = false
  }
}
const batchDelLoading = ref<boolean>(false)
// 批量删除
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
        fetchData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      batchDelLoading.value = false
    }
  })
}

// 不报关可发布标记
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
      $baseMessage('不报关审批通过！', 'success', 'hey')
      fetchData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    notBgLoading.value = false
  }
}

// 数量审批通过
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
      $baseMessage('数量审批通过成功！', 'success', 'hey')
      fetchData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    qtyApprovalLoading.value = false
  }
}

// 删除SKU
const handleDelSkuPlannedPo = (row: any) => {
  try {
    $baseConfirm('确定要删除当前SKU吗', '系统提示', async () => {
      const { data } = await deletePurchasePlanPo({
        poSkuId: row.poSkuId,
      })
      if (data === true) {
        $baseMessage('删除SKU成功', 'success', 'hey')
        fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 删除planPO
const handleDelPlannedPo = (row: any) => {
  try {
    $baseConfirm('确定要删除当前PO吗', '系统提示', async () => {
      const { data } = await deletePlanPo({
        poId: row.id,
      })
      if (data === true) {
        $baseMessage('删除PO成功', 'success', 'hey')
        fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const batchReleaseLoading = ref<boolean>(false)
// 批量发布PO成功
const _handleAllPublishPo = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
    return
  }
  const ids = selectRows.value.map((item: any) => item.id).join(',')
  try {
    batchReleaseLoading.value = true

    const { data } = await releaseBatchPlanPo({
      poIds: ids,
    })
    if (data === true) {
      $baseMessage('批量发布到PO成功', 'success', 'hey')
      fetchData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    batchReleaseLoading.value = false
  }
}
// 防抖包装
const handleAllPublishPo = useDebounceFn(_handleAllPublishPo, 1000)

// 发布po
const _handlePublishPo = async (row: any) => {
  try {
    $baseConfirm('确定要发布到PO吗', null, async () => {
      const { data } = await releasePlanPo({
        id: row.id,
      })
      if (data === true) {
        $baseMessage('发布到PO成功', 'success', 'hey')
        fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 防抖包装
const handlePublishPo = useDebounceFn(_handlePublishPo, 1000)
const handlePlannedPoDetail = async (row: any) => {
  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query: {
      title: '采购计划订单详情',
      from: 'plannedPoDetail',
      poSkuId: row.poSkuId,
      poId: row.id,
      // timestamp: Date.now(),
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
        // timestamp: Date.now(),
      },
    })
    await changeTabsMeta({
      title: 'PO详情',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
}
const createLoading = ref<boolean>(false)
const handlePlannedPoCreate = async () => {
  createLoading.value = true
  const matched = handleMatched(allRoutes.value, '/purchase/poDetail')
  const tab = handleTabs({
    ...matched.at(-1),
    query: {
      title: '采购计划创建',
      from: 'plannedPoCreate',
      // timestamp: Date.now(),
    },
  })
  if (tab) {
    await router.push({
      path: '/purchase/poDetail',
      query: {
        title: '采购计划创建',
        from: 'plannedPoCreate',
        // timestamp: Date.now(),
      },
    })
    await changeTabsMeta({
      title: 'PO详情',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
  createLoading.value = false
}

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const classify = ref<string>('')

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const handleTabClick = (tab: TabsPaneContext) => {
  plannedPoList.value = []
  if (tab.props.name !== undefined) {
    // activeName.value = tab.props.name;
    queryForm.status = Number(tab.props.name)
  }
  activeName.value = queryForm.status
  router.push({
    query: {
      ...route.query,
      tab: tab.props.name,
    },
  })
  fetchData()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (label !== 'SKU' && label !== '零件名' && label !== '零件采购注意事项' && label !== '供应商') {
    return {
      textAlign: 'center',
    }
  }
}

/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>() // 当点击零件采购注意事项时候的行
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

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  const { data } = await updatePoPurchaseMatters({ id: clickRow.value.componentId, purchaseMatters: val })
  if (data === true) {
    progressLogCopy.value = val
    clickRow.value.purchaseMatters = val
  }
}

// 获取采购负责人列表
const queryProcurementManagerData = async () => {
  procurementManagerOptions.value = []
  const { data } = await getUserProcurementName({
    name: '',
  })
  data.unshift(deraltProcurementManager)
  procurementManagerOptions.value = data
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = (val: any) => {
  wangEditorLogVisible.value = val
}

// 本地缓存管理
const CACHE_KEY = 'plannedPo_cache'
const CACHE_EXPIRY = 2 * 60 * 1000 // 2分钟缓存

const getCacheData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data
      }
    }
  } catch (error) {
    console.warn('Cache read error:', error)
  }
  return null
}

const setCacheData = (data: any) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    )
  } catch (error) {
    console.warn('Cache write error:', error)
  }
}

// 快速加载模式：优先显示缓存数据
const fetchData = async (useCache = true) => {
  try {
    // 优先加载缓存数据（立即显示）
    if (useCache) {
      const cached = getCacheData()
      if (cached && cached.list && cached.list.length > 0) {
        plannedPoList.value = cached.list
        total.value = cached.total
        listLoading.value = false
      }
    }

    // 后台请求最新数据
    const { data } = await getPlanPoList({
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      keyWord: queryForm.keyWord,
      status: queryForm.status,
      customsStatus: queryForm.customsStatus,
      procurementManagerId: queryForm.procurementManager.userId,
    })

    if (data) {
      // 清理缓存
      resetSpanCache()
      columnWidthCache.value.clear()

      listLoading.value = false
      total.value = data.total
      plannedPoList.value = data.list

      // 更新缓存
      setCacheData(data)
    }
  } catch (error) {
    console.error(error)
    listLoading.value = false
  }
}
onActivated(() => {
  tableRef.value?.doLayout()
})
onBeforeMount(async () => {
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    activeName.value = Number(tab)
    queryForm.status = Number(tab)
  }

  // 并发请求：同时加载所有初始数据
  await Promise.all([
    fetchColumn(),
    queryProcurementManagerData(),
    fetchData(true), // 使用缓存优先模式
  ])
})
// 清理定时器
onBeforeUnmount(() => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
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
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:nth-child(2) {
              margin: 0 !important;
            }
            .el-form-item:last-child {
              margin: 0 !important;
            }
          }
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

// 控制编辑框显示与隐藏
.none {
  display: none;
}
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// 开模申请
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}

:deep(.shareSelectDialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.overflow-text {
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 "✔" 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

// 列设置面板样式
.column-settings {
  margin-right: 10px;
}

.drag-group {
  margin-bottom: 16px;

  h4 {
    margin: 0 0 8px 0;
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 600;
  }
}

.column-label {
  flex: 1;
  color: var(--el-text-color-primary);
}

.handle {
  cursor: grab;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}
.disabled-handle {
  cursor: not-allowed;
}
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
</style>
