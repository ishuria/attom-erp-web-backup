<template>
  <div class="automation-rule-tab">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-button type="primary" @click="handleBatchUpdate">批量修改</el-button>
            <el-button type="primary" @click="handleDefaultParams">默认参数</el-button>
          </el-form-item>
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.sites"
              class="multiple-select"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="全部站点"
              style="width: 220px"
              @change="handleQueryData"
            >
              <template #header>
                <el-checkbox :indeterminate="indeterminate" :model-value="checkAll" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" @change="handleQueryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="规则开关">
            <el-select v-model="queryForm.roleStatus" clearable placeholder="请选择规则开关状态" @change="handleQueryData">
              <el-option label="全部" :value="-1" />
              <el-option label="开启" :value="1" />
              <el-option label="关闭" :value="0" />
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
              @input="handleQueryData"
              @keyup.enter="handleQueryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="handleQueryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <div v-if="listLoading">
      <el-skeleton animated :loading="listLoading">
        <template #template>
          <div style="display: flex; flex-direction: column; height: calc(100vh - 270px)">
            <div style="display: flex; flex: 1; flex-direction: column; padding: 0">
              <el-skeleton-item style="flex: 1; min-height: 300px" variant="p" />
              <div style="display: flex; justify-content: center; margin-top: 20px">
                <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="handleCellClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed="left" type="selection" width="38" />
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImg" style="display: block; width: 75px; height: 75px" @click="handleImagePreview(row.skuImg)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')" />
      <el-table-column label="站点" prop="siteName" width="135" />
      <el-table-column label="运营" prop="operationUser" width="95" />
      <el-table-column label="规则开关" width="95">
        <template #default="scope1">
          <el-switch
            v-model="scope1.row.roleStatus"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="handleRoleStatusChange(scope1.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作对象" width="130">
        <template #default="scope">
          <el-select
            v-model="scope.row.group"
            placeholder="请选择操作对象"
            style="min-width: 100%"
            @change="handleSelectTypeChange(scope.row)"
          >
            <el-option v-for="item in scope.row.operationTypeList" :key="item.code" :label="item.name" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作广告类型" width="130">
        <template #default="scope">
          <el-select
            v-model="scope.row.operationAdvType"
            multiple
            placeholder="请选择广告类型"
            style="min-width: 100%"
            @change="handleSelectTypeChange(scope.row)"
          >
            <el-option v-for="item in scope.row.operationAdvTypeList" :key="item.code" :label="item.name" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="开启广告（满足全部条件）">
        <el-table-column label="剩余可售天数≥" min-width="125" prop="openDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.openDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.openDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可售库存数≥" min-width="110" prop="openStock">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.openStock"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.openStock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="断货天数≤" min-width="95" prop="openOutStockDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.openOutStockDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.openOutStockDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告ACOS≤" min-width="120" prop="openAdvAcos">
          <template #header>
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                广告ACOS≤
                <el-icon><info-filled /></el-icon>
              </div>
              <template #content>
                <div class="custom-tooltip">最近30个有广告花费记录日期的整体ACOS</div>
              </template>
            </el-tooltip>
          </template>
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.openAdvAcos"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.openAdvAcos }}%</span>
          </template>
        </el-table-column>

        <el-table-column label="Rating≥" min-width="90" prop="openRating">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.openRating"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.openRating }}</span>
          </template>
        </el-table-column>

        <el-table-column label="毛利率≥" min-width="110" prop="openGrossProfit">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.openGrossProfit"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.openGrossProfit }}%</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="关闭广告（满足任一条件）">
        <el-table-column label="断货天数≥" min-width="95" prop="closeOutStockDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.closeOutStockDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.closeOutStockDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余可售天数≤" min-width="125" prop="closeDays">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.closeDays"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.closeDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可售库存数≤" min-width="110" prop="closeStock">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.closeStock"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.closeStock }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Rating≤" min-width="90" prop="closeRating">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.closeRating"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.closeRating }}</span>
          </template>
        </el-table-column>

        <el-table-column label="毛利率≤" min-width="110" prop="closeGrossProfit">
          <template #default="{ row, $index }">
            <div class="none">
              <el-input
                v-model="row.closeGrossProfit"
                type="number"
                @blur="handleCellBlur($event, row, $index)"
                @keyup.enter="handleCellBlur($event, row, $index)"
              />
            </div>
            <span>{{ row.closeGrossProfit }}%</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="系统最新操作日期" prop="lastUpdateTime" width="110">
        <template #header>
          系统最新
          <br />
          操作日期
        </template>
      </el-table-column>
      <el-table-column label="操作类型" prop="operationType" width="100">
        <template #default="{ row }">
          <el-tag :type="row.operationType === 0 ? 'danger' : 'success'">
            {{ row.operationType === 0 ? '关广告' : '开广告' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作结果" prop="operationResult" width="100">
        <template #default="{ row }">
          <el-tag :type="row.operationResult === 0 ? 'danger' : 'success'">
            {{ row.operationResult === 0 ? '失败' : '成功' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="130">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="handleSystemOperationLog(row)">系统操作日志</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :page-no="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="queryTotal"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { InfoFilled, Search } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import { CSSProperties } from 'vue'
import type { IAutoMationItem, IAutoMationQueryReq } from '/@/type/storeOperation/autoMation'
import { getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'AutomationRuleTable',
})

interface Props {
  listLoading: boolean
  list: IAutoMationItem[]
  queryTotal: number
  siteList: Array<{ id: number; label: string }>
  operateUserList: Array<{ id: number; label: string }>
}

const props = defineProps<Props>()

// 使用 defineModel 的参数
const queryForm = defineModel<IAutoMationQueryReq>('queryForm', { required: true })
const checkAll = defineModel<boolean>('checkAll', { default: false })
const indeterminate = defineModel<boolean>('indeterminate', { default: false })

const emit = defineEmits<{
  'batch-update': []
  'default-params': []
  'query-data': []
  'selection-change': [val: IAutoMationItem[]]
  'cell-click': [row: IAutoMationItem, column: any, cell: HTMLTableCellElement]
  'cell-blur': [event: any, row: IAutoMationItem, index: number]
  'current-change': [value: number]
  'size-change': [value: number]
  'check-all': [val: CheckboxValueType]
  'image-preview': [url: string]
  'role-status-change': [row: IAutoMationItem]
  'select-type-change': [row: IAutoMationItem]
  'system-operation-log': [row: IAutoMationItem]
}>()

const handleBatchUpdate = () => {
  emit('batch-update')
}

const handleDefaultParams = () => {
  emit('default-params')
}

const handleQueryData = () => {
  emit('query-data')
}

const handleSelectionChange = (val: IAutoMationItem[]) => {
  emit('selection-change', val)
}

const handleCellClick = (row: IAutoMationItem, column: any, cell: HTMLTableCellElement) => {
  emit('cell-click', row, column, cell)
}

const handleCellBlur = (event: any, row: IAutoMationItem, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  emit('cell-blur', event, row, index)
}

const handleCurrentChange = (value: number) => {
  emit('current-change', value)
}

const handleSizeChange = (value: number) => {
  emit('size-change', value)
}

const handleCheckAll = (val: CheckboxValueType) => {
  checkAll.value = !!val
  indeterminate.value = false
  emit('check-all', val)
}

const handleImagePreview = (url: string) => {
  emit('image-preview', url)
}

const handleRoleStatusChange = (row: IAutoMationItem) => {
  emit('role-status-change', row)
}

const handleSelectTypeChange = (row: IAutoMationItem) => {
  emit('select-type-change', row)
}

const handleSystemOperationLog = (row: IAutoMationItem) => {
  emit('system-operation-log', row)
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  } else if (label !== '站点' && label !== '运营') {
    return {
      cursor: 'pointer',
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'center',
  }
}
</script>

<style lang="scss" scoped>
.automation-rule-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
}
.none {
  display: none;
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
</style>
