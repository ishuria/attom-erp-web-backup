<template>
  <div>
    <vab-dialog v-model="visible" title="订货明细" width="850">
      <el-table
        v-loading="loading"
        border
        :cell-style="{ textAlign: 'center' }"
        :data="list"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="订货日期" prop="releaseDate" width="120">
          <template #default="{ row }">
            {{ formatDate(row.releaseDate) }}
          </template>
        </el-table-column>
        <el-table-column label="PO" prop="po" width="100" />
        <el-table-column label="订货数量" prop="packageTaskCount" width="100" />
        <el-table-column label="站点" prop="sendSite" width="125" />
        <el-table-column label="原始预计到货时间" prop="arrivalDate" width="160">
          <template #default="{ row }">
            <el-text :type="isArrivalOverdue(row) ? 'danger' : ''">
              {{ formatDate(row.arrivalDate) }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" prop="status" width="100">
          <template #default="{ row }">
            <el-tag :type="getPackageTaskStatus(row.status).type">{{ getPackageTaskStatus(row.status).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="需跟进产品" prop="needFollowUp" width="110">
          <template #default="{ row }">
            <el-checkbox :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>

      <div v-if="repackageList.length > 0" class="repackage-section">
        <el-divider class="repackage-divider">
          <el-text class="repackage-divider-text" type="warning">
            以下为装箱记录（原打包任务已归档，可能为补发/换码/历史数据）
          </el-text>
        </el-divider>
        <el-table
          v-loading="repackageLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="repackageList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="装箱日期" prop="encasementDate" width="120">
            <template #default="{ row }">
              {{ formatDate(row.encasementDate) }}
            </template>
          </el-table-column>
          <el-table-column label="装箱数量" prop="encasementCount" width="100" />
          <el-table-column label="站点" prop="sendSite" width="125" />
          <el-table-column label="备注" min-width="180" prop="remarks" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.remarks || '-' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { getOperationOrderTable, getOperationRepackageTable } from '/@/api/devlocal/productOrdering'
import type { IGetOperationOrderTable, IGetRepackageDetail, IProductOrderTableOpenParams } from '/@/type/storeOperation/productOrdering'

defineOptions({
  name: 'VabProductOrderTable',
})

type TagType = 'success' | 'warning' | 'info' | 'primary' | 'danger'

const packageTaskStatusMap: Record<number, { label: string; type: TagType }> = {
  [-1]: { label: '进行中', type: 'primary' },
  0: { label: '未到货', type: 'warning' },
  1: { label: '待打包', type: 'success' },
  2: { label: '已完成', type: 'success' },
  3: { label: '零头', type: 'info' },
  4: { label: '售后', type: 'danger' },
}

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const list = ref<IGetOperationOrderTable[]>([])
const repackageLoading = ref<boolean>(false)
const repackageList = ref<IGetRepackageDetail[]>([])
let querySeq = 0

const formatDate = (date?: string | null) => {
  return date ? date.split(' ')[0] : '-'
}

const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isArrivalOverdue = (row: IGetOperationOrderTable) => {
  const arrivalDate = formatDate(row.arrivalDate)
  return arrivalDate !== '-' && arrivalDate < getToday() && row.status === 0
}

const getPackageTaskStatus = (status?: number | null) => {
  return status == null ? { label: '-', type: 'info' as TagType } : packageTaskStatusMap[status] || { label: '-', type: 'info' as TagType }
}

const open = async (params: IProductOrderTableOpenParams) => {
  const currentSeq = ++querySeq
  visible.value = true
  list.value = []
  repackageList.value = []

  if (!params.sku || params.site == null) {
    $baseMessage('缺少SKU或站点，无法查询订货明细!', 'warning')
    return
  }

  loading.value = true
  repackageLoading.value = true
  try {
    const [orderRes, repackageRes] = await Promise.allSettled([getOperationOrderTable(params), getOperationRepackageTable(params)])
    if (currentSeq !== querySeq) return

    if (orderRes.status === 'fulfilled') {
      list.value = orderRes.value.data
    } else {
      $baseMessage('订货明细查询失败!', 'warning')
    }

    if (repackageRes.status === 'fulfilled') {
      repackageList.value = repackageRes.value.data
    }
  } finally {
    if (currentSeq === querySeq) {
      loading.value = false
      repackageLoading.value = false
    }
  }
}

defineExpose({
  open,
})
</script>

<style style="scss" scoped>
.repackage-divider :deep(.el-divider__text),
  .repackage-divider-text {
    white-space: nowrap;
  }
</style>
