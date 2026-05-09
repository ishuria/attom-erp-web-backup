<template>
  <div class="listing-image-task-table">
    <vab-query-form>
      <vab-query-form-left-panel>
        <template v-if="tabConfig.showToolbar">
          <el-button v-permissions="{ permission: [ListingPermission.LISTING_TASK_ADD] }" type="primary" @click="$emit('show-post-task')">
            发布任务
          </el-button>
          <el-button
            v-permissions="{ permission: [ListingPermission.LISTING_TASK_MARGIN_SETTING] }"
            type="primary"
            @click="$emit('show-margin-setting')"
          >
            余量设定
          </el-button>
          <el-button v-permissions="{ permission: [ListingPermission.LISTING_TASK_REASONS] }" type="primary" @click="$emit('show-reasons')">
            选品理由设定
          </el-button>
          <el-button type="primary" @click="$emit('show-task-statistics')">任务量统计</el-button>
          <el-button
            v-permissions="{ permission: [ListingPermission.LISTING_TASK_SELLING_POINT] }"
            type="primary"
            @click="$emit('show-batch-selling-point')"
          >
            卖点填写(批量)
          </el-button>
          <el-button v-permissions="{ permission: [ListingPermission.LISTING_TASK_ASSIGN] }" type="primary" @click="$emit('show-assign-task')">
            {{ tabConfig.assignButtonText ?? '任务分配' }}
          </el-button>
        </template>
        <el-form v-if="tabConfig.showOperationFilter" inline>
          <el-form-item label="运营人员">
            <el-select v-model="queryForm.operationUserId" clearable placeholder="全部" @change="$emit('query-immediate')">
              <el-option v-for="item in operationUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form-item v-if="tabConfig.showTaskTypeFilter" label="任务类型">
          <el-select v-model="queryForm.taskType" clearable placeholder="请选择任务类型" @change="$emit('query-immediate')">
            <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label" :value="item.value">
              <el-text :style="{ color: getTaskTypeBaseColor(item.label), marginRight: '6px' }">{{ item.label }}</el-text>
            </el-option>
          </el-select>
        </el-form-item>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyword"
              class="search-input"
              clearable
              placeholder="请输入搜索关键词"
              @input="$emit('query-debounced')"
              @keyup.enter="$emit('query-immediate')"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="$emit('query-immediate')" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="loading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      @cell-click="cellClick"
      @selection-change="$emit('selection-change', $event)"
    >
      <el-table-column fixed="left" type="selection" />
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :lazy="true" :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="$emit('preview-image', row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="columnWidths.sku">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="ASIN" min-width="160" prop="asin">
        <template #default="{ row }">
          <el-link :href="row.amazonUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" min-width="110" prop="taskType">
        <template #default="{ row }">
          <el-tag :type="getTaskTypeColor(row.taskType)">{{ row.taskType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品定位" min-width="100" prop="positioning" />
      <el-table-column label="Vine数量" min-width="100" prop="vineCount" />
      <el-table-column label="要求完成日期" min-width="125" prop="finishDate">
        <template #default="{ row }">
          {{ row._finishDateText }}
        </template>
      </el-table-column>
      <el-table-column label="实际完成日期" min-width="125" prop="actualFinishDate">
        <template #default="{ row }">
          {{ row._actualFinishDateText }}
        </template>
      </el-table-column>
      <el-table-column v-if="tabConfig.showNaturalDay" label="剩余工作日" min-width="110" prop="naturalDay">
        <template #default="{ row }">
          <el-text v-if="row.naturalDay < 0" type="danger">{{ row.naturalDay }}</el-text>
          <el-text v-if="row.naturalDay >= 0 && row.naturalDay <= 7" type="warning">{{ row.naturalDay }}</el-text>
          <el-text v-if="row.naturalDay > 7" type="success">{{ row.naturalDay }}</el-text>
        </template>
      </el-table-column>
      <el-table-column v-if="tabConfig.showAdvanceDays" label="提前完成天数" min-width="130" prop="advanceDays">
        <template #default="{ row }">
          <el-text v-if="row.advanceDays >= 0" type="success">{{ row.advanceDays }}</el-text>
          <el-text v-if="row.advanceDays < 0" type="danger">{{ row.advanceDays }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="需求文件地址" min-width="160" prop="requiredAddress">
        <template #default="{ row }">
          <template v-if="tabConfig.editableRequiredAddress">
            <div class="none">
              <el-input v-model="row.requiredAddress" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.requiredAddress }}</div>
              </template>
              <div class="multi-line-ellipsis-1">{{ row.requiredAddress }}</div>
            </el-tooltip>
          </template>
          <template v-else>
            {{ row.requiredAddress }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="卖点完成" min-width="100" prop="sellingPointStatus">
        <template #default="{ row }">
          <vab-icon v-if="row.sellingPointStatus === 1" icon="checkbox-circle-fill" style="color: var(--el-color-success); font-size: 23px" />
          {{ '' }}
        </template>
      </el-table-column>
      <template v-for="col in columnConfigs" :key="col.prop">
        <el-table-column
          v-if="!col.isSpecial"
          :label="col.label"
          :prop="col.prop"
          :width="columnWidths.byProp[col.prop] ?? col.baseWidth"
        >
          <template #default="{ row }">
            <span
              v-for="(username, index) in row._usernamesByProp[col.prop]"
              :key="`${username}-${index}`"
              class="username-item"
              :class="getHighlightClass(username)"
            >
              {{ username }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="col.label" :prop="col.prop" :width="columnWidths.publisher" />
      </template>
      <el-table-column label="运营校对" min-width="100" prop="proofreadingStatus">
        <template #default="{ row }">
          <el-checkbox
            v-if="tabConfig.canEditProofreading && canCheckProofreading(row)"
            v-model="row.proofreadingStatus"
            :false-value="0"
            :true-value="1"
            @change="$emit('update-proofreading', row)"
          />
          <vab-icon v-else-if="row.proofreadingStatus === 1" icon="checkbox-circle-fill" style="color: var(--el-color-success); font-size: 23px" />
          {{ '' }}
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="130" prop="remark">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remark }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-permissions="ListingPermission.operationColume()" fixed="right" label="操作" width="110">
        <template #default="{ row }">
          <el-dropdown>
            <el-button
              v-permissions="{ permission: [ListingPermission.LISTING_TASK_SELLING_POINT_FILL] }"
              text
              type="primary"
              @click="$emit('show-selling-point', row)"
            >
              卖点
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [ListingPermission.LISTING_TASK_SELLING_POINT_FILL] })"
                  @click="$emit('show-selling-point', row)"
                >
                  <el-link type="primary" underline="never">卖点</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="row.taskType === '设计任务'" @click="$emit('show-distribute-skus', row)">
                  <el-link type="primary" underline="never">分配SKU</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="tabConfig.showLongTerm && hasPermission({ permission: [ListingPermission.LISTING_TASK_LONG_TERM] })"
                  @click="$emit('long-term', row)"
                >
                  <el-link type="primary" underline="never">长期提成</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="tabConfig.showSubmitApproval && isAssignedDesigner(row)" @click="$emit('show-submit-approval', row)">
                  <el-link type="success" underline="never">提交审批</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="tabConfig.showDeadlineActions" @click="$emit('deadline-extension', row)">
                  <el-link type="primary" underline="never">超时日期修改申请</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="tabConfig.showDeadlineActions" @click="$emit('long-task', row)">
                  <el-link type="primary" underline="never">美工长期申请</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="tabConfig.showDelete && hasPermission({ permission: [ListingPermission.LISTING_TASK_DELETE] })"
                  @click="$emit('delete-task', row)"
                >
                  <el-link type="danger" underline="never">删除</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="$emit('current-change', $event)"
      @size-change="$emit('size-change', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { columnConfigs, getTaskTypeColor, taskTypeOption } from '/@/views/newProductTask/constantOption'
import ListingPermission from '/@/permissions/listing'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { hasPermission } from '/@/utils/permission'
import type { IGetArtDesignTaskListReq } from '/@/type/listingTask/imageTaskType'
import type { ListingImageTaskColumnWidths, ListingImageTaskRow, ListingImageTaskTabConfig } from '../types'

const props = defineProps<{
  canCheckProofreading: (row: ListingImageTaskRow) => boolean
  columnWidths: ListingImageTaskColumnWidths
  currentUser: string
  isAssignedDesigner: (row: ListingImageTaskRow) => boolean
  list: ListingImageTaskRow[]
  loading: boolean
  operationUserList: { id: number; label: string }[]
  queryForm: IGetArtDesignTaskListReq
  tabConfig: ListingImageTaskTabConfig
  total: number
  updateRequiredAddress: (row: ListingImageTaskRow, originalRow: ListingImageTaskRow) => Promise<void>
}>()

const emit = defineEmits<{
  'current-change': [value: number]
  'deadline-extension': [row: ListingImageTaskRow]
  'delete-task': [row: ListingImageTaskRow]
  'long-task': [row: ListingImageTaskRow]
  'long-term': [row: ListingImageTaskRow]
  'preview-image': [url: string]
  'query-debounced': []
  'query-immediate': []
  'selection-change': [rows: ListingImageTaskRow[]]
  'show-assign-task': []
  'show-batch-selling-point': []
  'show-distribute-skus': [row: ListingImageTaskRow]
  'show-margin-setting': []
  'show-post-task': []
  'show-reasons': []
  'show-remark': [row: ListingImageTaskRow]
  'show-selling-point': [row: ListingImageTaskRow]
  'show-submit-approval': [row: ListingImageTaskRow]
  'show-task-statistics': []
  'size-change': [value: number]
  'update-proofreading': [row: ListingImageTaskRow]
}>()

let copyRow: ListingImageTaskRow | null = null

const getHighlightClass = (username: string) => {
  return username === props.currentUser ? 'highlight' : ''
}

const getTaskTypeBaseColor = (taskTypeName: string) => {
  if (!taskTypeName) return '#909399'
  const colorMap: Record<string, string> = {
    新品任务: '#67C23A',
    老品任务: '#409EFF',
    临时任务: '#E6A23C',
    设计任务: '#F56C6C',
  }
  return colorMap[taskTypeName] ?? '#909399'
}

const clickCancel = async (event: any, value: ListingImageTaskRow) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }

  if (!copyRow || isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
    await props.updateRequiredAddress(value, copyRow)
  }
}

const cellClick = (row: ListingImageTaskRow, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '备注') {
    emit('show-remark', row)
    return
  }

  if (!props.tabConfig.editableRequiredAddress || column.label !== '需求文件地址') {
    return
  }

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

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', '站点', '需求文件地址', '备注'].includes(label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

.search-input {
  width: 300px !important;
}
</style>
