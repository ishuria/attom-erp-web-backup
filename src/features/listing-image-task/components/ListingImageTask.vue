<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane v-for="tab in tabConfigs" :key="tab.name" :label="tab.label" :name="tab.name">
        <listing-image-task-table
          v-if="activeName === tab.name"
          :can-check-proofreading="canCheckProofreading"
          :column-widths="columnWidths"
          :current-user="currentUser"
          :is-assigned-designer="isAssignedDesigner"
          :list="list"
          :loading="listLoading"
          :operation-user-list="operationUserList"
          :query-form="queryForm"
          :tab-config="tab"
          :total="total"
          :update-required-address="handleUpdateRequiredAddress"
          @current-change="handleCurrentChange"
          @deadline-extension="handleDeadlineExtensionApplication"
          @delete-task="handleDelArtDesignTask"
          @long-task="handleLongTaskApplication"
          @long-term="handleLongTerm"
          @preview-image="imagePreviewShow"
          @query-debounced="queryDataDebounced"
          @query-immediate="queryDataImmediate"
          @selection-change="setSelectedRows"
          @show-assign-task="showAssignTask"
          @show-batch-selling-point="showBatchSellingPoint"
          @show-distribute-skus="handleShowDistributeSkus"
          @show-margin-setting="showMarginSetting"
          @show-post-task="showPostTask"
          @show-reasons="showReasons"
          @show-remark="showRemark"
          @show-selling-point="handleShowSellingPoint"
          @show-submit-approval="handleShowSubmitApproval"
          @show-task-statistics="showTaskStatistics"
          @size-change="handleSizeChange"
          @update-proofreading="handleUpdateProofreadingStatus"
        />
      </el-tab-pane>
    </el-tabs>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="closeImagePreview" />
    <post-task-dialog v-model:visible="postTaskVisible" :site-list="siteList" @success="fetchData" />

    <vab-dialog v-if="assignTaskVisible" v-model="assignTaskVisible" title="任务分配" width="26%">
      <el-form label-position="right" label-width="auto" :model="assignTaskForm" style="margin: 0 10px">
        <el-form-item v-if="showOldProductTaskFields" label="基础图片">
          <el-select
            v-model="assignTaskForm.baseImageUrlPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showOldProductTaskFields" label="建模">
          <el-select
            v-model="assignTaskForm.moldingPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showOldProductTaskFields" label="渲染">
          <el-select
            v-model="assignTaskForm.renderingPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showOldProductTaskFields" label="A+">
          <el-select
            v-model="assignTaskForm.aPlus"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showOldProductTaskFields" label="视频">
          <el-select
            v-model="assignTaskForm.videoPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showDesignTaskFields" label="说明书/包装">
          <el-select
            v-model="assignTaskForm.instructionPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showDesignTaskFields" label="配色设计">
          <el-select
            v-model="assignTaskForm.colorDesignPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showDesignTaskFields" label="产品平面设计">
          <el-select
            v-model="assignTaskForm.productPlaneDesignPerson"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="6"
            multiple
            placeholder="请选择人员"
          >
            <el-option v-for="item in artDesignUserListByIds" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px">
          <el-button type="danger" @click="assignTaskVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmAssignTask">确定</el-button>
        </div>
      </template>
    </vab-dialog>

    <vab-dialog v-if="marginSettingVisible" v-model="marginSettingVisible" title="余量设定" width="20%">
      <el-form ref="marginSettingFormRef" :model="marginSettingForm" :rules="marginSettingFormRules" style="margin: 0 10px">
        <el-form-item label="天数余量" prop="dayMargin">
          <el-input v-model="marginSettingForm.dayMargin" type="number" />
        </el-form-item>
        <el-form-item label="比例余量" prop="proportionMargin">
          <el-input v-model="marginSettingForm.proportionMargin" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px">
          <el-button type="danger" @click="marginSettingVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmMarginSetting">确定</el-button>
        </div>
      </template>
    </vab-dialog>

    <vab-dialog
      v-if="taskStatisticsVisible"
      v-model="taskStatisticsVisible"
      title="任务量统计"
      width="60%"
      @closed="handleStatisticsClosed"
      @open="handleStatisticsOpened"
    >
      <div ref="chartContainer1" style="width: 100%; height: 300px; margin-bottom: 20px"></div>
      <div ref="chartContainer2" style="width: 100%; height: 300px; margin-bottom: 20px"></div>
      <template #footer></template>
    </vab-dialog>

    <vab-dialog v-if="remarkVisible" v-model="remarkVisible" title="备注" width="20%">
      <el-input v-model="remark" placeholder="请输入备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>

    <vab-dialog v-if="reasonsVisible" v-model="reasonsVisible" title="选品理由设定" width="20%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="addReasonVisible = true">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table border :data="reasonsList" stripe>
        <el-table-column label="选品理由" prop="reason" />
        <el-table-column align="center" label="操作" width="80">
          <template #default="{ row, $index }">
            <el-link type="danger" underline="never" @click="handleDelReason(row, $index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>

    <vab-dialog v-if="addReasonVisible" v-model="addReasonVisible" title="新增选品理由" width="20%" @close="closeAddReason">
      <el-form ref="addFormRef" :model="addReasonForm" :rules="addFormRules" style="margin: 0">
        <el-form-item label="选品理由" prop="reason">
          <el-input v-model="addReasonForm.reason" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAddReason">取消</el-button>
        <el-button type="primary" @click="confirmAddReason">确定</el-button>
      </template>
    </vab-dialog>

    <distribute-skus v-model="distributeSkusVisible" title="分配SKU" @confirm="handleConfirmDistributeSkus" />
    <deadline-extension-application
      v-if="deadlineExtensionApplicationVisible"
      v-model:visible="deadlineExtensionApplicationVisible"
      :listing-task-id="deadlineExtensionApplicationListingTaskId"
    />
    <long-task-application
      v-if="longTaskApplicationVisible"
      v-model:visible="longTaskApplicationVisible"
      :listing-task-id="longTaskApplicationListingTaskId"
      @success="fetchData"
    />
    <submit-approval v-if="submitApprovalVisible" v-model:visible="submitApprovalVisible" :row="submitApprovalRow" @confirm="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { getDistributionOptionUserList } from '~/src/api/devlocal/productDistribution'
import { useListingImageTask } from '../composables/useListingImageTask'
import type { ListingImageTaskRow, ListingImageTaskStatus, ListingImageTaskTabConfig } from '../types'
import ListingImageTaskTable from './ListingImageTaskTable.vue'
import {
  addArtDesignSelectionReasons,
  allocateArtDesignTask,
  delArtDesignSelectionReasons,
  delArtDesignTask,
  getArtDesignSelectionReasonsList,
  getArtDesignTaskMargin,
  getArtDesignTaskUserListByIds,
  queryArtDesignTaskDistribution,
  updateArtDesignDemandAddress,
  updateArtDesignTaskDistribute,
  updateArtDesignTaskMargin,
  updateArtDesignTaskRemark,
  updateLongTermArtDesignTask,
  updateProofreadingStatus,
} from '/@/api/devlocal/imageTask'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { ROLE_ECOMMERCEOPERATIONLEAD_CODE, ROLE_ECOMMERCEOPERATOR_CODE } from '/@/const/role'
import { useImagePreview } from '/@/hooks/useImagePreview'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import type {
  IArtDesignTaskMargin,
  IGetArtDesignSelectionReasonsList,
  IGetArtDesignTaskList,
  IGetArtDesignTaskUserListBySku,
} from '/@/type/listingTask/imageTaskType'
import { splitUsernames } from '/@/views/newProductTask/constantOption'

defineOptions({
  name: 'ListingImageTaskFeature',
})

const router = useRouter()

const {
  activeName,
  columnWidths,
  dispose,
  fetchData,
  handleCurrentChange,
  handleSizeChange,
  handleTabChange,
  initFromRoute,
  list,
  listLoading,
  queryDataDebounced,
  queryDataImmediate,
  queryForm,
  selectedRows,
  setSelectedRows,
  total,
} = useListingImageTask()

const userName = useUserStore().getUsername
const currentUser = userName
const currentRoleCode = useAclStore().getRole[0]
const ableCheck = currentRoleCode === ROLE_ECOMMERCEOPERATIONLEAD_CODE || currentRoleCode === ROLE_ECOMMERCEOPERATOR_CODE

const tabConfigs: ListingImageTaskTabConfig[] = [
  {
    name: 3,
    label: '未完成',
    showToolbar: true,
    showOperationFilter: true,
    editableRequiredAddress: true,
    showNaturalDay: true,
    canEditProofreading: true,
    showSubmitApproval: true,
    showDelete: true,
  },
  {
    name: 0,
    label: '未分配',
    showToolbar: true,
    editableRequiredAddress: true,
    showNaturalDay: true,
    canEditProofreading: true,
    showDelete: true,
  },
  {
    name: 1,
    label: '已分配',
    assignButtonText: '任务分配修改',
    showToolbar: true,
    editableRequiredAddress: true,
    showNaturalDay: true,
    canEditProofreading: true,
    showSubmitApproval: true,
    showDelete: true,
    showLongTerm: true,
    showDeadlineActions: true,
  },
  {
    name: 2,
    label: '已完成',
    showToolbar: false,
    showTaskTypeFilter: true,
    showAdvanceDays: true,
    showLongTerm: true,
    showDeadlineActions: true,
  },
]

const canCheckProofreading = (row: ListingImageTaskRow) => {
  if (!ableCheck || !userName) return false
  const operations = row._usernamesByProp?.operation ?? splitUsernames(row.operation)
  if (operations.includes(userName)) return true
  const opSupervisors = splitUsernames(row.operationSupervisorNames)
  return opSupervisors.includes(userName)
}

const isAssignedDesigner = (row: ListingImageTaskRow) => {
  const designerFields = ['basePicture', 'modeling', 'rendering', 'aAdd', 'video', 'instructionManual', 'colorDesign', 'productPlaneDesign']
  return designerFields.some((field) => splitUsernames(row[field]).includes(userName))
}

const { imagePreviewVisible, imagePreviewList, openImagePreview, closeImagePreview, toOriginalImage } = useImagePreview()
const postTaskVisible = ref<boolean>(false)
const siteList = ref<{ id: number; label: string }[]>([])
const operationUserList = ref<{ id: number; label: string }[]>([])

const deadlineExtensionApplicationVisible = ref<boolean>(false)
const deadlineExtensionApplicationListingTaskId = ref<number>(-1)
const handleDeadlineExtensionApplication = (row: ListingImageTaskRow) => {
  deadlineExtensionApplicationVisible.value = true
  deadlineExtensionApplicationListingTaskId.value = row.id!
}

const longTaskApplicationVisible = ref<boolean>(false)
const longTaskApplicationListingTaskId = ref<number>(-1)
const handleLongTaskApplication = (row: ListingImageTaskRow) => {
  longTaskApplicationVisible.value = true
  longTaskApplicationListingTaskId.value = row.id!
}

const distributeSkusVisible = ref<boolean>(false)
const distributionSkusId = ref<number>(-1)
const handleShowDistributeSkus = (row: ListingImageTaskRow) => {
  distributeSkusVisible.value = true
  distributionSkusId.value = row.id!
}

const handleConfirmDistributeSkus = async (data: { transferValue: number[] }) => {
  const { data: res } = await allocateArtDesignTask({
    taskId: distributionSkusId.value,
    skuIds: data.transferValue,
  })
  if (res) {
    $baseMessage('分配成功！', 'success')
    distributeSkusVisible.value = false
    fetchData()
  } else {
    $baseMessage('分配失败！', 'error')
  }
}

const handleUpdateProofreadingStatus = async (row: ListingImageTaskRow) => {
  const { data } = await updateProofreadingStatus({
    id: row.id!,
    value: row.proofreadingStatus,
  })
  if (data && row.proofreadingStatus === 1) {
    fetchData()
  }
}

const handleUpdateRequiredAddress = async (row: ListingImageTaskRow, originalRow: ListingImageTaskRow) => {
  try {
    await updateArtDesignDemandAddress({
      id: row.id!,
      demandAddress: String(row.requiredAddress ?? ''),
    })
  } catch {
    Object.assign(row, originalRow)
  }
}

const assignTaskVisible = ref<boolean>(false)
const assignTaskForm = reactive<any>({
  baseImageUrlPerson: [],
  moldingPerson: [],
  aPlus: [],
  videoPerson: [],
  instructionPerson: [],
  renderingPerson: [],
  colorDesignPerson: [],
  productPlaneDesignPerson: [],
})

const showOldProductTaskFields = computed(() => {
  if (selectedRows.value.length === 0) return false
  return selectedRows.value.some((row) => {
    const taskType = row.taskType
    return taskType === '老品优化' || taskType === '新品任务' || taskType === '临时任务'
  })
})

const showDesignTaskFields = computed(() => {
  if (selectedRows.value.length === 0) return false
  return selectedRows.value.some((row) => {
    const taskType = row.taskType
    return taskType === '设计任务' || taskType === '临时任务'
  })
})

const artDesignUserListByIds = ref<IGetArtDesignTaskUserListBySku[]>([])
const resetAssignTaskForm = () => {
  assignTaskForm.baseImageUrlPerson = []
  assignTaskForm.moldingPerson = []
  assignTaskForm.aPlus = []
  assignTaskForm.videoPerson = []
  assignTaskForm.instructionPerson = []
  assignTaskForm.renderingPerson = []
  assignTaskForm.colorDesignPerson = []
  assignTaskForm.productPlaneDesignPerson = []
}

const showAssignTask = async () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }

  const selectedIds = selectedRows.value.map((row) => row.id!)
  const { data: userListData } = await getArtDesignTaskUserListByIds({ ids: selectedIds })
  if (userListData) {
    artDesignUserListByIds.value = userListData
  }

  resetAssignTaskForm()

  if (selectedRows.value.length === 1 && (activeName.value === 1 || activeName.value === 3)) {
    const { data } = await queryArtDesignTaskDistribution({ taskId: selectedRows.value[0].id! })
    if (data) {
      assignTaskForm.baseImageUrlPerson = data.baseImageUrlPersons
      assignTaskForm.moldingPerson = data.moldingPersons
      assignTaskForm.aPlus = data.aPlus
      assignTaskForm.videoPerson = data.videoPersons
      assignTaskForm.instructionPerson = data.instructionPersons
      assignTaskForm.renderingPerson = data.renderingPersons
      assignTaskForm.colorDesignPerson = data.colorDesignPersons
      assignTaskForm.productPlaneDesignPerson = data.productPlaneDesignPersons
    }
  }

  assignTaskVisible.value = true
}

const handleConfirmAssignTask = async () => {
  const ids = selectedRows.value.map((item) => item.id).join(',')
  const { data } = await updateArtDesignTaskDistribute({
    ids,
    baseImageUrlPerson: assignTaskForm.baseImageUrlPerson.join(','),
    moldingPerson: assignTaskForm.moldingPerson.join(','),
    aPlus: assignTaskForm.aPlus.join(','),
    videoPerson: assignTaskForm.videoPerson.join(','),
    instructionPerson: assignTaskForm.instructionPerson.join(','),
    colorDesignPerson: assignTaskForm.colorDesignPerson.join(','),
    productPlaneDesignPerson: assignTaskForm.productPlaneDesignPerson.join(','),
    renderingPerson: assignTaskForm.renderingPerson.join(','),
    type: activeName.value,
  })
  if (data) {
    $baseMessage('任务分配修改成功！', 'success')
    assignTaskVisible.value = false
    fetchData()
  }
}

const marginSettingVisible = ref<boolean>(false)
const marginSettingForm = reactive<any>({})
const marginSettingFormRef = ref<FormInstance>()
const marginSettingFormRules = reactive<FormRules<IArtDesignTaskMargin>>({
  dayMargin: [{ required: true, message: '请输入天数余量', trigger: 'blur' }],
  proportionMargin: [{ required: true, message: '比例', trigger: 'blur' }],
})

const handleConfirmMarginSetting = async () => {
  marginSettingFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateArtDesignTaskMargin(marginSettingForm)
      if (data) {
        $baseMessage('余量设定修改成功！', 'success')
        marginSettingVisible.value = false
      }
    }
  })
}

const showMarginSetting = async () => {
  const { data } = await getArtDesignTaskMargin()
  Object.assign(marginSettingForm, data)
  marginSettingVisible.value = true
}

const reasonsVisible = ref<boolean>(false)
const reasonsList = ref<IGetArtDesignSelectionReasonsList[]>([])
const addReasonVisible = ref<boolean>(false)
const addReasonForm = reactive<{ reason: string }>({
  reason: '',
})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules<{ reason: string }>>({
  reason: [{ required: true, message: '请输入选品理由', trigger: 'blur' }],
})

const fetchReasonsData = async () => {
  const { data } = await getArtDesignSelectionReasonsList()
  reasonsList.value = data
}

const showReasons = async () => {
  fetchReasonsData()
  reasonsVisible.value = true
}

const closeAddReason = () => {
  addFormRef.value?.resetFields()
  addReasonVisible.value = false
}

const confirmAddReason = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addArtDesignSelectionReasons({
        reason: addReasonForm.reason,
      })
      if (data) {
        $baseMessage('新增选品理由成功！', 'success')
        closeAddReason()
        fetchReasonsData()
      }
    }
  })
}

const handleDelReason = async (row: IGetArtDesignSelectionReasonsList, index: number) => {
  $baseConfirm('确定要删除选品理由吗？', null, async () => {
    const { data } = await delArtDesignSelectionReasons({
      id: row.id,
    })
    if (data) {
      $baseMessage('删除成功！', 'success')
      reasonsList.value.splice(index, 1)
    }
  })
}

const remark = ref<string>('')
const remarkVisible = ref<boolean>(false)
const remarkId = ref<number>(0)
const showRemark = (row: ListingImageTaskRow) => {
  remarkId.value = row.id!
  remark.value = String(row.remark ?? '')
  remarkVisible.value = true
}
const handleUpdateRemark = async () => {
  const { data } = await updateArtDesignTaskRemark({
    id: remarkId.value,
    remark: remark.value,
  })
  if (data) {
    $baseMessage('备注更新成功！', 'success')
    remarkVisible.value = false
    fetchData()
  }
}

const taskStatisticsVisible = ref<boolean>(false)
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: any = null
let chartInstance2: any = null
let chartObserver1: ResizeObserver | null = null
let chartObserver2: ResizeObserver | null = null
const option1 = ref<any>({})
const option2 = ref<any>({})

const initChart1 = () => {
  option1.value = {
    title: {
      text: '任务总数',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 5,
      left: 60,
      right: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['2024-10-21', '2024-11-15', '2024-12-01', '2024-12-12'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: 14,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLabel: {
        fontSize: 14,
      },
      name: '任务个数',
    },
    series: [
      {
        name: '任务个数',
        type: 'line',
        data: [1, 1, 3, 3],
        itemStyle: {
          color: '#ff8fa5',
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  }
  chartInstance1?.setOption(option1.value)
}

const initChart2 = () => {
  option2.value = {
    title: {
      text: '人均任务数',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 5,
      left: 60,
      right: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['本周', '下一周', '下二周', '下三周', '下四周', '下五周'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: 14,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLabel: {
        fontSize: 14,
      },
      name: '人均周任务个数',
    },
    series: [
      {
        name: '人均周任务个数',
        type: 'line',
        data: [2.5, 1.5, 1, 0, 0, 0],
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  }
  chartInstance2?.setOption(option2.value)
}

const handleStatisticsOpened = async () => {
  const echarts = await import('echarts')
  nextTick(() => {
    if (chartContainer1.value) {
      chartInstance1 = echarts.init(chartContainer1.value)
      chartObserver1 = new ResizeObserver(() => {
        chartInstance1?.resize()
      })
      chartObserver1.observe(chartContainer1.value)
      initChart1()
    }
    if (chartContainer2.value) {
      chartInstance2 = echarts.init(chartContainer2.value)
      chartObserver2 = new ResizeObserver(() => {
        chartInstance2?.resize()
      })
      chartObserver2.observe(chartContainer2.value)
      initChart2()
    }
  })
}

const handleStatisticsClosed = () => {
  chartObserver1?.disconnect()
  chartObserver2?.disconnect()
  chartObserver1 = null
  chartObserver2 = null
  chartInstance1?.dispose()
  chartInstance2?.dispose()
  chartInstance1 = null
  chartInstance2 = null
}

const showTaskStatistics = async () => {
  taskStatisticsVisible.value = true
}

const handleShowSellingPoint = (row: ListingImageTaskRow) => {
  router.push({
    path: '/newProductTask/sellingPoint',
    query: {
      sku: row.sku,
      id: row.id,
    },
  })
}

const showBatchSellingPoint = () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  const skus = selectedRows.value.map((item) => item.sku).join(',')
  const ids = selectedRows.value.map((item) => item.id).join(',')
  router.push({
    path: '/newProductTask/sellingPoint',
    query: {
      skus,
      ids,
    },
  })
}

const handleLongTerm = async (row: ListingImageTaskRow) => {
  $baseConfirm('确定要长期提成美工任务吗？', null, async () => {
    const { data } = await updateLongTermArtDesignTask({ id: row.id! })
    if (data) {
      $baseMessage('长期提成成功！', 'success')
      fetchData()
    }
  })
}

const handleDelArtDesignTask = async (row: ListingImageTaskRow) => {
  $baseConfirm('确定要删除美工任务吗？', null, async () => {
    const { data } = await delArtDesignTask({ id: row.id! })
    if (data) {
      $baseMessage('删除美工任务成功！', 'success')
      fetchData()
    }
  })
}

const submitApprovalVisible = ref<boolean>(false)
const submitApprovalRow = ref<IGetArtDesignTaskList | null>(null)
const handleShowSubmitApproval = (row: ListingImageTaskRow) => {
  submitApprovalRow.value = row
  submitApprovalVisible.value = true
}

const showPostTask = () => {
  postTaskVisible.value = true
}

const imagePreviewShow = (url: string) => {
  const processedUrl = toOriginalImage(url)
  const img = new Image()
  img.onload = () => {
    openImagePreview(processedUrl)
  }
  img.onerror = () => {
    openImagePreview(url)
  }
  img.src = processedUrl
}

const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    handleTabChange(Number(tab.props.name) as ListingImageTaskStatus)
  }
}

const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}

const fetchOperationUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operationUserList.value = data
  operationUserList.value.unshift({ id: -1, label: '全部' })
}

onBeforeMount(async () => {
  initFromRoute()
  await Promise.all([fetchOperationUserList(), fetchSiteList(), fetchData()])
})

onBeforeUnmount(() => {
  dispose()
  handleStatisticsClosed()
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

        .listing-image-task-table {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
        }

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

          .custom-check {
            color: var(--el-color-success);
            transform: scale(1.4);
          }

          .el-checkbox {
            transform: scale(1.3);
            transform-origin: center;
          }

          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;

            .cell {
              padding-right: 0;
              padding-left: 0;
            }
          }

          .highlight {
            color: var(--el-color-danger);
          }

          .username-item {
            display: block;
          }
        }
      }
    }
  }
}

.none {
  display: none;
}

.search-input {
  width: 300px !important;
}
</style>
