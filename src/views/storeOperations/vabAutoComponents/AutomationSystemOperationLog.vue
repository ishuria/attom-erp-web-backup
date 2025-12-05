<template>
  <div>
    <vab-dialog v-model="visible" title="系统操作日志" width="95%">
      <el-table :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="60vh" stripe>
        <el-table-column label="更新时间" prop="updateTime" width="115" />
        <el-table-column label="操作对象" prop="operationGroupName" width="100" />
        <el-table-column label="操作广告类型" prop="operationTypeName" width="120" />
        <el-table-column label="操作类型" prop="operationType" width="100">
          <template #default="{ row }">
            <el-tag :type="row.operationType === 0 ? 'danger' : 'success'">
              {{ row.operationType === 0 ? '关广告' : '开广告' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作结果" min-width="100" prop="operationResult">
          <template #default="{ row }">
            <el-tag :type="row.operationResult === 0 ? 'danger' : 'success'">
              {{ row.operationResult === 0 ? '失败' : '成功' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="广告活动名" min-width="150" prop="campaignName" />
        <el-table-column label="操作时">
          <el-table-column label="ACOS" min-width="90" prop="operationAcos">
            <template #default="{ row }">{{ row.operationAcos }}%</template>
          </el-table-column>
          <el-table-column label="剩余可售天数" min-width="120" prop="operationDays" />
          <el-table-column label="断货天数" min-width="100" prop="operationOutStockDays" />
          <el-table-column label="可售库存数" min-width="110" prop="operationStock" />
          <el-table-column label="毛利率" min-width="90" prop="operationGrossProfit">
            <template #default="{ row }">{{ row.operationGrossProfit }}%</template>
          </el-table-column>
          <el-table-column label="Rating" min-width="90" prop="operationRating" />
        </el-table-column>
        <el-table-column label="开广告设定">
          <el-table-column label="ACOS≤" min-width="90" prop="openAcos">
            <template #default="{ row }">
              {{ row.operationType === 0 ? '-' : `${row.openAcos}%` }}
            </template>
          </el-table-column>
          <el-table-column label="断货天数≤" min-width="100" prop="openOutStockDays">
            <template #default="{ row }">
              {{ row.operationType === 0 ? '-' : row.openOutStockDays }}
            </template>
          </el-table-column>
          <el-table-column label="剩余可售天数≥" min-width="125" prop="openDays">
            <template #default="{ row }">
              {{ row.operationType === 0 ? '-' : row.openDays }}
            </template>
          </el-table-column>
          <el-table-column label="可售库存数≥" min-width="110" prop="openStock">
            <template #default="{ row }">
              {{ row.operationType === 0 ? '-' : row.openStock }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率≥" min-width="110" prop="openGrossProfit">
            <template #default="{ row }">
              {{ row.operationType === 0 ? '-' : `${row.openGrossProfit}%` }}
            </template>
          </el-table-column>
          <el-table-column label="Rating≥" min-width="100" prop="openRating">
            <template #default="{ row }">
              {{ row.operationType === 0 ? '-' : row.openRating }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="关广告设定">
          <el-table-column label="断货天数≥" min-width="100" prop="closeOutStockDays">
            <template #default="{ row }">
              {{ row.operationType === 1 ? '-' : row.closeOutStockDays }}
            </template>
          </el-table-column>
          <el-table-column label="剩余可售天数≤" min-width="125" prop="closeDays">
            <template #default="{ row }">
              {{ row.operationType === 1 ? '-' : row.closeDays }}
            </template>
          </el-table-column>
          <el-table-column label="可售库存数≤" min-width="110" prop="closeStock">
            <template #default="{ row }">
              {{ row.operationType === 1 ? '-' : row.closeStock }}
            </template>
          </el-table-column>
          <el-table-column label="毛利率≤" min-width="110" prop="closeGrossProfit">
            <template #default="{ row }">
              {{ row.operationType === 1 ? '-' : `${row.closeGrossProfit}%` }}
            </template>
          </el-table-column>
          <el-table-column label="Rating≤" min-width="100" prop="closeRating">
            <template #default="{ row }">
              {{ row.operationType === 1 ? '-' : row.closeRating }}
            </template>
          </el-table-column>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { querySystemOperationLogListOperationAutoMation } from '~/src/api/devlocal/operationAutoMation'
import { IAutomationLogItem } from '/@/type/storeOperation/autoMation'

defineOptions({
  name: 'AutomationSystemOperationLog',
})

const props = defineProps<{
  modelValue: boolean
  id: number
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(visible, (val) => {
  if (val) {
    fetchData()
  }
})
const list = ref<IAutomationLogItem[]>([])
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})

// 表格单元格样式常量
const CELL_STYLES = {
  // 危险样式（红色背景+红色文字+居中）
  danger: {
    backgroundColor: 'var(--el-color-danger-light-9)',
    color: 'var(--el-color-danger)',
    textAlign: 'center',
  } as CSSProperties,
  // 成功样式（绿色背景+绿色文字+居中）
  success: {
    backgroundColor: 'var(--el-color-success-light-9)',
    color: 'var(--el-color-success)',
    textAlign: 'center',
  } as CSSProperties,
  // 默认居中样式
  default: {
    textAlign: 'center',
  } as CSSProperties,
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const row = data.row
  const column = data.column

  // 关广告时，只判断关广告条件，只显示红色
  if (row.operationType === 0) {
    if (column.label === '剩余可售天数') {
      if (row.operationDays <= row.closeDays) {
        return CELL_STYLES.danger
      }
    } else if (column.label === '断货天数') {
      if (row.operationOutStockDays >= row.closeOutStockDays) {
        return CELL_STYLES.danger
      }
    } else if (column.label === '可售库存数') {
      if (row.operationStock <= row.closeStock) {
        return CELL_STYLES.danger
      }
    } else if (column.label === '毛利率') {
      if (row.operationGrossProfit <= row.closeGrossProfit) {
        return CELL_STYLES.danger
      }
    } else if (column.label === 'Rating') {
      if (row.operationRating <= row.closeRating) {
        return CELL_STYLES.danger
      }
    }
  }
  // 开广告时，只判断开广告条件，只显示绿色
  else if (row.operationType === 1) {
    if (column.label === '剩余可售天数') {
      if (row.operationDays >= row.openDays) {
        return CELL_STYLES.success
      }
    } else if (column.label === '断货天数') {
      if (row.operationOutStockDays <= row.openOutStockDays) {
        return CELL_STYLES.success
      }
    } else if (column.label === '可售库存数') {
      if (row.operationStock >= row.openStock) {
        return CELL_STYLES.success
      }
    } else if (column.label === '毛利率') {
      if (row.operationGrossProfit >= row.openGrossProfit) {
        return CELL_STYLES.success
      }
    } else if (column.label === 'Rating') {
      if (row.operationRating >= row.openRating) {
        return CELL_STYLES.success
      }
    }
  }

  return CELL_STYLES.default
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const fetchData = async () => {
  const { data } = await querySystemOperationLogListOperationAutoMation({
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    id: props.id,
  })
  list.value = data?.list || []
  total.value = data?.total || 0
}
</script>
