<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="广告库存规则" :name="0">
        <automation-rule-table
          v-model:check-all="checkAll"
          v-model:indeterminate="indeterminate"
          v-model:query-form="queryForm"
          :list="operationAutoMationList"
          :list-loading="listLoading"
          :operate-user-list="operateUserList"
          :query-total="queryTotal"
          :site-list="siteList"
          @batch-update="showBatchUpdateOperationAutoRules"
          @cell-blur="clickCreateCancel"
          @cell-click="changeCreateInput"
          @check-all="handleCheckAll"
          @current-change="currentChange"
          @default-params="queryDefautlParmas"
          @image-preview="imagePreviewShow"
          @query-data="queryData"
          @role-status-change="updateRoleStatus"
          @select-type-change="updateSelectType"
          @selection-change="handleSelectionChange"
          @size-change="sizeChange"
          @system-operation-log="openSystemOperationLog"
        />
      </el-tab-pane>
      <el-tab-pane label="调价库存规则" :name="1">
        <price-adjustment-inventory-rules
          v-model:query-form="priceAdjustmentInventoryRulesQueryForm"
          :list="priceAdjustmentInventoryRulesList"
          :loading="priceAdjustmentInventoryRulesLoading"
          :operate-user-list="operateUserList"
          :site-list="siteList"
          :total="priceAdjustmentInventoryRulesQueryTotal"
          @cell-blur="operationUpdateClickCreateCancel"
          @cell-click="changeCreateInput"
          @check-all="operationStockHandleCheckAll"
          @current-change="priceAdjustmentInventoryRulesCurrentChange"
          @image-preview="imagePreviewShow"
          @query-data="priceAdjustmentInventoryRulesQueryData"
          @role-status-change="updateOperationStockRoleStatus"
          @size-change="priceAdjustmentInventoryRulesSizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 批量修改 -->
    <batch-update-dialog
      v-model="pictureBatchUpdateVisible"
      :form="pictureBatchUpdateForm"
      :loading="batchBtnLoading"
      :operation-adv-type-list="operationAdvTypeList"
      :operation-type-list="operationTypeList"
      :title="dialogTitle"
      @confirm="batchUpdateTask"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <automation-system-operation-log :id="logId" v-model="systemOperationLogVisible" />
  </div>
</template>

<script lang="ts" setup>
import type { CheckboxValueType } from 'element-plus'
import { isEqual } from 'lodash-es'
import {
  queryDefaultParamsOperationAutoMation,
  queryOperationAutoMationList,
  queryPriceAdjustmentInventoryRulesList,
  updateBatchOperationAutoMation,
  updateDefailtParmasOperationAutoMation,
  updateOperationAutoMation,
  updateOperationStock,
} from '/@/api/devlocal/operationAutoMation'
import { getDistributionOptionUserList, getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { getUserAmazonOperation } from '/@/api/devlocal/productPerformance'
import { useAclStore } from '/@/store/modules/acl'
import type { IAutoMationItem, IAutoMationQueryReq, IAutoMationUpdateReq, IOperationType } from '/@/type/storeOperation/autoMation'
import { IOperationStocksItem } from '/@/type/storeOperation/operationStock.ts'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'Automation',
})

interface OptionType {
  id: number
  label: string
}
const router = useRouter()
const route = useRoute()
const aclStore = useAclStore()
const dialogTitle = ref<string>('批量修改')
const indeterminate = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const pictureBatchUpdateVisible = ref<boolean>(false)
const batchBtnLoading = ref<boolean>(false)
const activeName = ref(0)
const operationTypeList = ref<IOperationType[]>([])
const operationAdvTypeList = ref<IOperationType[]>([])
const queryForm = reactive<IAutoMationQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 30,
  sites: [],
  operationUserId: -1,
})
const priceAdjustmentInventoryRulesQueryForm = reactive<IAutoMationQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 30,
  sites: [],
  operationUserId: -1,
  priceChangeType: -1,
})
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const systemOperationLogVisible = ref<boolean>(false)
const pictureBatchUpdateForm = reactive<IAutoMationUpdateReq>({
  closeDays: undefined,
  closeGrossProfit: undefined,
  closeOutStockDays: undefined,
  closeRating: undefined,
  closeStock: undefined,
  group: { code: undefined, name: undefined },
  openAdvAcos: undefined,
  openDays: undefined,
  openGrossProfit: undefined,
  openOutStockDays: undefined,
  openRating: undefined,
  openStock: undefined,
  operationAdvType: [],
  roleStatus: 0,
})

let copyRow: IAutoMationItem
const listLoading = ref<boolean>(false)
const priceAdjustmentInventoryRulesLoading = ref<boolean>(false)
const operationAutoMationList = ref<IAutoMationItem[]>([])
const priceAdjustmentInventoryRulesList = ref<IOperationStocksItem[]>([])
const siteList = ref<OptionType[]>([])
const operateUserList = ref<OptionType[]>([])
const queryTotal = ref<number>(0)
const priceAdjustmentInventoryRulesQueryTotal = ref<number>(0)
const disabledDev = ref<boolean>(false)
const multipleSelection = ref<IAutoMationItem[]>([])
const logId = ref<number>(-1)
// 打开系统操作日志
const openSystemOperationLog = (row: IAutoMationItem) => {
  logId.value = row.id!
  systemOperationLogVisible.value = true
}

// 获取站点列表
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}

// 获取运营列表
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}

// 获取当前登录账号信息
const fetchOperationUser = async () => {
  const { data } = await getUserAmazonOperation()
  queryForm.operationUserId = data.operationUserId
}

// 获取数据
const fetchData = async () => {
  try {
    listLoading.value = true
    const { data } = await queryOperationAutoMationList(queryForm)
    if (data?.list.length == 0) {
      listLoading.value = false
      operationAutoMationList.value = []
      queryTotal.value = 0
      return
    }
    operationAutoMationList.value = data?.list!
    queryTotal.value = data?.total!
    listLoading.value = false
  } catch (error) {
    listLoading.value = false
  }
}
const currentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const sizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fetchPriceAdjustmentInventoryRulesData = async () => {
  try {
    priceAdjustmentInventoryRulesLoading.value = true
    const { data } = await queryPriceAdjustmentInventoryRulesList(priceAdjustmentInventoryRulesQueryForm)
    if (data?.list.length == 0) {
      priceAdjustmentInventoryRulesLoading.value = false
      priceAdjustmentInventoryRulesList.value = []
      priceAdjustmentInventoryRulesQueryTotal.value = 0
      return
    }
    priceAdjustmentInventoryRulesList.value = data?.list!
    priceAdjustmentInventoryRulesQueryTotal.value = data?.total!
    priceAdjustmentInventoryRulesLoading.value = false
  } catch (error) {
    priceAdjustmentInventoryRulesLoading.value = false
  }
}
const priceAdjustmentInventoryRulesCurrentChange = (value: number) => {
  priceAdjustmentInventoryRulesQueryForm.pageNo = value
  fetchPriceAdjustmentInventoryRulesData()
}
const priceAdjustmentInventoryRulesSizeChange = (value: number) => {
  priceAdjustmentInventoryRulesQueryForm.pageNo = 1
  priceAdjustmentInventoryRulesQueryForm.pageSize = value
  fetchPriceAdjustmentInventoryRulesData()
}
const priceAdjustmentInventoryRulesQueryData = () => {
  priceAdjustmentInventoryRulesQueryForm.pageNo = 1
  fetchPriceAdjustmentInventoryRulesData()
}

// 创建blur修改
const clickCreateCancel = (event: any, value: IAutoMationItem, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

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
    updateCommon(value)
  }
  queryData()
}

const updateCommon = async (value: IAutoMationItem) => {
  const advTypes = value.operationAdvType.map((el) => el.code).join(',')

  const { data } = await updateOperationAutoMation({
    id: value.id,
    closeDays: value.closeDays,
    closeOutStockDays: value.closeOutStockDays,
    closeRating: value.closeRating,
    closeGrossProfit: value.closeGrossProfit,
    closeStock: value.closeStock,
    openAdvAcos: value.openAdvAcos,
    openDays: value.openDays,
    openGrossProfit: value.openGrossProfit,
    openOutStockDays: value.openOutStockDays,
    openRating: value.openRating,
    openStock: value.openStock,
    groupId: value.group.code,
    operationAdvTypeStr: advTypes,
    roleStatus: value.roleStatus,
  })

  if (data) {
    $baseMessage('修改成功！', 'success')
  }
}

/**
 * 调价库存规则更新
 * @param value
 */
const updateOperationStockCommon = async (value: IOperationStocksItem) => {
  const { data } = await updateOperationStock({
    ...value,
  })
  if (data) {
    $baseMessage('修改成功！', 'success')
    fetchPriceAdjustmentInventoryRulesData()
  }
}

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.sites = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    if (activeName.value === 0) {
      queryData()
    }
  } else {
    queryForm.sites = []
    // 取消全选获取数据
    if (activeName.value === 0) {
      fetchData()
    }
  }
}

const operationStockHandleCheckAll = (val: CheckboxValueType) => {
  if (val) {
    priceAdjustmentInventoryRulesQueryForm.sites = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    if (activeName.value === 1) {
      fetchPriceAdjustmentInventoryRulesData()
    }
  } else {
    priceAdjustmentInventoryRulesQueryForm.sites = []
    // 取消全选获取数据
    if (activeName.value === 1) {
      fetchPriceAdjustmentInventoryRulesData()
    }
  }
}

const operationUpdateClickCreateCancel = (event: any, value: IOperationStocksItem, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

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
    updateOperationStockCommon(value)
  }
}

// table点击事件
const changeCreateInput = async (row: IAutoMationItem, column: any, cell: HTMLTableCellElement) => {
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

const operationAndDevelopSelect = () => {
  const role = aclStore.getRole[0]
  switch (role) {
    // 老板和运营主管
    case 'ROLE_BOSS': {
      disabledDev.value = false
      queryForm.sites = [0]
      priceAdjustmentInventoryRulesQueryForm.sites = [0]
      break
    }
    case 'ROLE_ECOMMERCEOPERATIONLEAD': {
      disabledDev.value = false

      break
    }
    // 运营
    case 'ROLE_ECOMMERCEOPERATOR': {
      disabledDev.value = true
      break
    }
  }
}

// table多选事件
const handleSelectionChange = (val: IAutoMationItem[]) => {
  multipleSelection.value = val
}

// 批量修改按钮
const showBatchUpdateOperationAutoRules = async () => {
  dialogTitle.value = '批量修改'
  resetForm()
  if (multipleSelection.value.length === 0) {
    $baseMessage('请选择需要批量修改的数据！', 'warning')
    return
  }
  operationTypeList.value = operationAutoMationList.value[0].operationTypeList
  operationAdvTypeList.value = operationAutoMationList.value[0].operationAdvTypeList
  pictureBatchUpdateVisible.value = true
}

// 批量修改确定
const batchUpdateTask = async () => {
  try {
    if (isEqual(dialogTitle.value, '批量修改')) {
      batchBtnLoading.value = true
      let ids: number[] = []
      multipleSelection.value.forEach((el) => {
        ids.push(el.id!)
      })
      $baseConfirm('确定要批量修改吗？', null, async () => {
        const { ...filterForm } = pictureBatchUpdateForm

        const advsTypes = pictureBatchUpdateForm.operationAdvType?.map((el) => el.code).join(',')

        const params = {
          ids: ids,
          ...filterForm,
          groupId: filterForm.group?.code,
          operationAdvTypeStr: advsTypes,
        }
        const { data } = await updateBatchOperationAutoMation(params)
        if (data) {
          $baseMessage('批量修改成功！', 'success')
          batchBtnLoading.value = false
          pictureBatchUpdateVisible.value = false
          resetForm()
          queryData()
        }
      })
    } else {
      batchBtnLoading.value = true
      let ids: number[] = []
      multipleSelection.value.forEach((el) => {
        ids.push(el.id!)
      })
      const { ...filterForm } = pictureBatchUpdateForm
      const advsTypes = pictureBatchUpdateForm.operationAdvType?.map((el) => el.code).join(',')
      const params = {
        ...filterForm,
        groupId: filterForm.group?.code,
        operationAdvTypeStr: advsTypes,
      }
      const { data } = await updateDefailtParmasOperationAutoMation(params)
      if (data) {
        $baseMessage('默认参数修改成功！', 'success')
        batchBtnLoading.value = false
        pictureBatchUpdateVisible.value = false
        resetForm()
        queryData()
      }
    }
  } catch (error) {
    batchBtnLoading.value = false
    pictureBatchUpdateVisible.value = false
  }
}

// 获取默认参数信息
const queryDefautlParmas = async () => {
  dialogTitle.value = '自动化默认参数'
  operationTypeList.value = operationAutoMationList.value[0].operationTypeList
  operationAdvTypeList.value = operationAutoMationList.value[0].operationAdvTypeList
  const { data } = await queryDefaultParamsOperationAutoMation()
  pictureBatchUpdateForm.closeDays = data?.closeDays!
  pictureBatchUpdateForm.roleStatus = data?.roleStatus!
  pictureBatchUpdateForm.closeGrossProfit = data?.closeGrossProfit!
  pictureBatchUpdateForm.closeOutStockDays = data?.closeOutStockDays!
  pictureBatchUpdateForm.closeRating = data?.closeRating!
  pictureBatchUpdateForm.closeStock = data?.closeStock!
  pictureBatchUpdateForm.group = data?.group!
  pictureBatchUpdateForm.openAdvAcos = data?.openAdvAcos!
  pictureBatchUpdateForm.openDays = data?.openDays!
  pictureBatchUpdateForm.openGrossProfit = data?.openGrossProfit!
  pictureBatchUpdateForm.openOutStockDays = data?.openOutStockDays!
  pictureBatchUpdateForm.openRating = data?.openRating!
  pictureBatchUpdateForm.openStock = data?.openStock!
  pictureBatchUpdateForm.operationAdvType = data?.operationAdvType!
  pictureBatchUpdateVisible.value = true
}

const resetForm = () => {
  pictureBatchUpdateForm.closeDays = undefined
  pictureBatchUpdateForm.closeGrossProfit = undefined
  pictureBatchUpdateForm.closeOutStockDays = undefined
  pictureBatchUpdateForm.closeRating = undefined
  pictureBatchUpdateForm.closeStock = undefined
  pictureBatchUpdateForm.group = undefined
  pictureBatchUpdateForm.openAdvAcos = undefined
  pictureBatchUpdateForm.openDays = undefined
  pictureBatchUpdateForm.openGrossProfit = undefined
  pictureBatchUpdateForm.openOutStockDays = undefined
  pictureBatchUpdateForm.openRating = undefined
  pictureBatchUpdateForm.openStock = undefined
  pictureBatchUpdateForm.operationAdvType = undefined
  pictureBatchUpdateForm.roleStatus = 0
}

const updateRoleStatus = (value: IAutoMationItem) => {
  updateCommon(value)
}

const updateSelectType = (value: IAutoMationItem) => {
  updateCommon(value)
}

const updateOperationStockRoleStatus = (value: IOperationStocksItem) => {
  updateOperationStockCommon(value)
}

onBeforeMount(() => {
  operationAndDevelopSelect()
  fetchData()
  fetchPriceAdjustmentInventoryRulesData()
  fetchSiteList()
  fetchOperateUserList()
  fetchOperationUser()
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

        .el-table {
          flex: 1;
          .el-table__body {
            .cell {
              max-height: 81.2px;
            }
          }
          .clear-padding {
            padding-top: 0px;
            padding-bottom: 0px;
          }
          .clear-padding .cell {
            padding-right: 0px;
            padding-left: 0px;
          }
        }
      }
      .el-checkbox {
        transform: scale(1.2); // 放大 20%
        transform-origin: center; // 确保放大从中心开始
      }
    }
  }
}
</style>
