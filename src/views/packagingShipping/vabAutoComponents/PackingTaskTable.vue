<template>
  <el-table
    ref="tableRef"
    v-loading="loading"
    border
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    class="noneHoveTable custom-table-hover"
    :data="data"
    :header-cell-style="headerCellStyle"
    :row-class-name="rowClassName"
    stripe
    @cell-click="handleCellClick"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
  >
    <template v-for="column in visibleColumns" :key="column.key">
      <!-- 选择列 -->
      <el-table-column v-if="column.type === 'selection'" :fixed="column.fixed" :type="column.type" />

      <!-- 发货日期 -->
      <el-table-column v-else-if="column.key === 'sendDate'" :label="column.label" :prop="column.prop" :width="column.width">
        <template #default="{ row }">
          {{ row.sendDate ? formatDate(new Date(row.sendDate)) : '' }}
        </template>
      </el-table-column>

      <!-- 订货日期 -->
      <el-table-column v-else-if="column.key === 'releaseDate'" :label="column.label" :prop="column.prop" :width="column.width">
        <template #default="{ row }">
          {{ row.releaseDate ? row.releaseDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>

      <!-- 已签收天数 -->
      <el-table-column v-else-if="column.key === 'signDay'" :label="column.label" :prop="column.prop" :width="column.width">
        <template #default="{ row }">
          <span v-if="row.signDay" :style="{ color: row.signDay > 21 ? 'var(--el-color-danger)' : '' }">{{ row.signDay }}天</span>
        </template>
      </el-table-column>

      <!-- 产品图片 -->
      <el-table-column v-else-if="column.key === 'productImage'" :label="column.label" :width="column.width">
        <template #header>
          产品
          <br />
          图片
        </template>
        <template #default="{ row }">
          <el-image
            fit="fill"
            :src="row.skuImageUrl"
            style="display: block; width: 75px; height: 75px"
            @click="handleImageClick(row.skuImageUrl)"
          >
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>

      <!-- SKU -->
      <el-table-column v-else-if="column.key === 'sku'" :label="column.label" :prop="column.prop" :width="skuColumnWidth">
        <template #default="{ row }">
          <span class="copySku" @click="handleClipboard($event, row.sku)">
            {{ row.sku }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
          <br />
          {{ row.desc }}
        </template>
      </el-table-column>

      <!-- 到货状态 -->
      <el-table-column v-else-if="column.key === 'status'" :label="column.label" :prop="column.prop" :width="column.width">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'warning' : 'success'">
            {{ row.status === 0 ? '未到货' : '已到货' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 优先打包 -->
      <el-table-column v-else-if="column.key === 'priorityPackaging'" :label="column.label" :prop="column.prop" :width="column.width">
        <template #default="{ row }">
          <el-checkbox v-model="row.priorityPackaging" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
        </template>
      </el-table-column>

      <!-- 需拍照 -->
      <el-table-column v-else-if="column.key === 'requirePhoto'" :label="column.label" :prop="column.prop" :width="column.width">
        <template #default="{ row }">
          <el-checkbox v-model="row.requirePhoto" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
        </template>
      </el-table-column>

      <!-- 带磁、木制品、玩具、应季产品 -->
      <el-table-column
        v-else-if="['magnetic', 'woodenProduct', 'toy', 'seasonal'].includes(column.key)"
        :label="column.label"
        :min-width="column.minWidth"
        :prop="column.prop"
      >
        <template #default="{ row }">
          <vab-icon v-if="row[column.prop!] === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
          <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
        </template>
      </el-table-column>

      <!-- 清点质检 -->
      <el-table-column
        v-else-if="column.key === 'qualityCheckStatus'"
        :label="column.label"
        :min-width="column.minWidth"
        :prop="column.prop"
      >
        <template #default="{ row }">
          <el-switch
            v-model="row.qualityCheckStatus"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66"
            @change="handleQualityCheckChange(row)"
          />
        </template>
      </el-table-column>

      <!-- 打包注意事项 -->
      <el-table-column
        v-else-if="column.key === 'packageRemarkList'"
        :label="column.label"
        :min-width="column.minWidth"
        :prop="column.prop"
      >
        <template #default="{ row }">
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.packageRemarkList) }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ removeHtmlTags(row.packageRemarkList) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column v-else-if="column.key === 'operation'" :fixed="column.fixed" :label="column.label" :width="column.width">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="handleGetPackageCodePath(row)">
              条码文件夹
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_BARCODE_FOLDER] })"
                  @click="handleGetPackageCodePath(row)"
                >
                  <el-link type="primary" underline="never">条码文件夹</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_PART_LIST] })"
                  @click="handleShowPartsList(row)"
                >
                  <el-link type="primary" underline="never">零件清单</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_PACK_INSPECTION] })"
                  @click="handleShowQualityInspectionReport(row)"
                >
                  <el-link type="primary" underline="never">打包质检</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_NEW_INSPECTION] })"
                  @click="handleShowNewInspectionReport(row)"
                >
                  <el-link type="primary" underline="never">新品质检</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_GENERATE_BARCODE] })"
                  @click="handleShowBarcode(row)"
                >
                  <el-link type="primary" underline="never">生成条形码</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_SPLIT] })"
                  @click="handleShowSplitTask(row)"
                >
                  <el-link type="primary" underline="never">拆分</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_SITE_UPDATE] })"
                  @click="handleShowModify(row)"
                >
                  <el-link type="primary" underline="never">站点修改</el-link>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_TASK_NUMBER_UPDATE] })"
                  @click="handleShowModifyTask(row)"
                >
                  <el-link type="primary" underline="never">任务数修改</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

      <!-- 普通列 -->
      <el-table-column
        v-else
        :fixed="column.fixed"
        :label="column.label"
        :min-width="column.minWidth"
        :prop="column.prop"
        :width="column.width"
      />
    </template>

    <template #empty>
      <el-empty class="vab-data-empty" description="暂无数据" />
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { computed } from 'vue'
import PackingTaskPermission from '/@/permissions/packingTask'
import handleClipboard from '/@/utils/clipboard'
import { formatDate } from '/@/utils/dateUtils'
import { hasPermission } from '/@/utils/permission'
import { calculateBrColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import type { PackingTaskColumn } from '/@/views/packagingShipping/packingTask/packingTaskColumns'

defineOptions({
  name: 'PackingTaskTable',
})

interface Props {
  columns: PackingTaskColumn[]
  data: any[]
  loading?: boolean
  cellStyle?: (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => any
  headerCellStyle?: any
  rowClassName?: (data: { row: any; rowIndex: number }) => string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  cellClick: [row: any, column: any]
  rowClick: [row: any, column: any, event: Event]
  selectionChange: [selection: any[]]
  imagePreview: [url: string]
  getPackageCodePath: [row: any]
  showPartsList: [row: any]
  showQualityInspectionReport: [row: any]
  showNewInspectionReport: [row: any]
  showBarcode: [row: any]
  showSplitTask: [row: any]
  showModify: [row: any]
  showModifyTask: [row: any]
  qualityCheckChange: [row: any]
}>()

// 过滤出可见的列
const visibleColumns = computed(() => props.columns)

// 计算SKU列宽度
const skuColumnWidth = computed(() => {
  const skuColumn = props.columns.find((col) => col.key === 'sku')
  if (!skuColumn) {
    return 100
  }
  return calculateBrColumnWidth(props.data, (row: any) => row._sku, 100, 60)
})

// 事件处理
const handleCellClick = (row: any, column: any) => {
  emit('cellClick', row, column)
}

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('rowClick', row, column, event)
}

const handleSelectionChange = (selection: any[]) => {
  emit('selectionChange', selection)
}

const handleImageClick = (url: string) => {
  emit('imagePreview', url)
}

const handleGetPackageCodePath = (row: any) => {
  emit('getPackageCodePath', row)
}

const handleShowPartsList = (row: any) => {
  emit('showPartsList', row)
}

const handleShowQualityInspectionReport = (row: any) => {
  emit('showQualityInspectionReport', row)
}

const handleShowNewInspectionReport = (row: any) => {
  emit('showNewInspectionReport', row)
}

const handleShowBarcode = (row: any) => {
  emit('showBarcode', row)
}

const handleShowSplitTask = (row: any) => {
  emit('showSplitTask', row)
}

const handleShowModify = (row: any) => {
  emit('showModify', row)
}

const handleShowModifyTask = (row: any) => {
  emit('showModifyTask', row)
}

const handleQualityCheckChange = (row: any) => {
  emit('qualityCheckChange', row)
}

// 图片取消padding
const cellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  // 使用 label 来判断，因为 Element Plus 的 column 对象可能没有 key 属性
  if (data.column.label === '产品图片') {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.copySku {
  display: inline-block;
  padding: 0;
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  &:hover {
    color: #000;
  }
}

.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-tooltip {
  max-width: 300px;
  word-break: break-word;
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
</style>
