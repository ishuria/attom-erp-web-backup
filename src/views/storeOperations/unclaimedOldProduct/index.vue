<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="关键词">
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入 asin / parentAsin / sku"
              style="width: 260px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="审批状态">
            <el-select v-model="queryForm.status" placeholder="全部" style="width: 160px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="handleQuery">查询</el-button>
            <el-button :disabled="listLoading" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column label="ASIN" min-width="140" prop="asin" />
      <el-table-column label="父体 ASIN" min-width="140" prop="parentAsin" />
      <el-table-column label="亚马逊链接" min-width="220">
        <template #default="{ row }">
          <el-link v-if="row.amazonUrl" :href="row.amazonUrl" target="_blank" type="primary">{{ row.amazonUrl }}</el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="SKU 信息" min-width="220">
        <template #default="{ row }">
          <div v-if="row.skuList?.length" class="sku-list">
            <div v-for="(item, index) in row.skuList" :key="`${item.sku || 'sku'}-${index}`" class="sku-item">
              {{ formatSkuLine(item.sku, item.productDesc) }}
            </div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="站点" min-width="100" prop="siteName" />
      <el-table-column label="原负责人" min-width="120" prop="originUserName" />
      <el-table-column label="提交人" min-width="120" prop="submitUserName" />
      <el-table-column label="提交时间" min-width="160" prop="submitDate" />
      <el-table-column label="审批状态" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="160">
        <template #default="{ row }">
          <el-space v-if="row.status === 0 && canApproval" :size="12">
            <el-link :disabled="approvalLoadingId === row.id" type="primary" underline="never" @click="handleApprove(row.id)">通过</el-link>
            <el-link :disabled="approvalLoadingId === row.id" type="danger" underline="never" @click="showRejectDialog(row.id)">不通过</el-link>
          </el-space>
          <span v-else>-</span>
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

    <vab-dialog v-model="rejectDialogVisible" title="审批不通过" width="36%" @close="handleCloseRejectDialog">
      <el-form label-position="top" :model="rejectForm">
        <el-form-item label="备注">
          <el-input
            v-model.trim="rejectForm.remark"
            maxlength="500"
            placeholder="请输入备注"
            :rows="6"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="rejectSubmitLoading" @click="handleCloseRejectDialog">取消</el-button>
        <el-button :loading="rejectSubmitLoading" type="primary" @click="handleReject">提交</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { approvalUnclaimed, getUnclaimedList } from '/@/api/devlocal/productDistribution'
import { ROLE_BOSS_CODE } from '/@/const/role'
import StoreOperationPermission from '/@/permissions/storeOperation'
import { useAclStore } from '/@/store/modules/acl'
import type { IGetUnclaimedListItem } from '/@/type/storeOperation/productDistributionType'
import { hasPermission } from '/@/utils/permission'

defineOptions({
  name: 'UnclaimedOldProduct',
})

const currentRoleCode = useAclStore().getRole[0]
const canApproval = computed(() => currentRoleCode === ROLE_BOSS_CODE || hasPermission([StoreOperationPermission.UNCLAIMED_APPROVAL]))

const statusOptions = [
  { label: '全部', value: -1 },
  { label: '待审批', value: 0 },
  { label: '审批通过', value: 1 },
  { label: '审批不通过', value: 2 },
]

const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  status: -1,
})

const listLoading = ref(false)
const list = ref<IGetUnclaimedListItem[]>([])
const total = ref(0)
const approvalLoadingId = ref<number | null>(null)
const rejectDialogVisible = ref(false)
const rejectSubmitLoading = ref(false)
const rejectForm = reactive({
  id: undefined as number | undefined,
  remark: '',
})

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待审批',
    1: '审批通过',
    2: '审批不通过',
  }
  return statusMap[status] ?? '-'
}

const getStatusTagType = (status: number) => {
  const statusMap: Record<number, 'warning' | 'success' | 'info'> = {
    0: 'warning',
    1: 'success',
    2: 'info',
  }
  return statusMap[status] ?? 'info'
}

const formatSkuLine = (sku?: string, productDesc?: string) => {
  if (sku && productDesc) {
    return `${sku} / ${productDesc}`
  }
  return sku || productDesc || '-'
}

const cellStyle = ({ column }: { column: { label: string } }): CSSProperties => {
  if (['亚马逊链接', 'SKU 信息'].includes(column.label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getUnclaimedList(queryForm)
    list.value = data.list
    total.value = data.total
  } finally {
    listLoading.value = false
  }
}

const handleQuery = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleReset = () => {
  queryForm.keyWord = ''
  queryForm.status = -1
  queryForm.pageNo = 1
  fetchData()
}

const handleCurrentChange = (pageNo: number) => {
  queryForm.pageNo = pageNo
  fetchData()
}

const handleSizeChange = (pageSize: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = pageSize
  fetchData()
}

const shouldRefreshAfterApprovalError = (error: unknown) => {
  if (typeof error === 'object' && error && 'msg' in error && typeof error.msg === 'string') {
    return error.msg.includes('已审批')
  }
  if (error instanceof Error && error.message) {
    return error.message.includes('已审批')
  }
  return false
}

const handleApprove = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认审批通过该待认领申请吗？', '审批确认', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      type: 'warning',
    })
  } catch {
    return
  }

  approvalLoadingId.value = id
  try {
    const { data } = await approvalUnclaimed({
      id,
      remark: '审批通过',
      status: 1,
    })
    if (data) {
      $baseMessage('审批成功', 'success')
      await fetchData()
    }
  } catch (error) {
    if (shouldRefreshAfterApprovalError(error)) {
      await fetchData()
    }
  } finally {
    approvalLoadingId.value = null
  }
}

const showRejectDialog = (id: number) => {
  rejectForm.id = id
  rejectForm.remark = ''
  rejectDialogVisible.value = true
}

const closeRejectDialog = (force = false) => {
  if (rejectSubmitLoading.value && !force) {
    return
  }
  rejectDialogVisible.value = false
  rejectForm.id = undefined
  rejectForm.remark = ''
}

const handleCloseRejectDialog = () => {
  closeRejectDialog()
}

const handleReject = async () => {
  if (!rejectForm.id) {
    return
  }
  rejectSubmitLoading.value = true
  approvalLoadingId.value = rejectForm.id
  try {
    const { data } = await approvalUnclaimed({
      id: rejectForm.id,
      remark: rejectForm.remark,
      status: 2,
    })
    if (data) {
      $baseMessage('审批成功', 'success')
      closeRejectDialog(true)
      await fetchData()
    }
  } catch (error) {
    if (shouldRefreshAfterApprovalError(error)) {
      closeRejectDialog(true)
      await fetchData()
    }
  } finally {
    rejectSubmitLoading.value = false
    approvalLoadingId.value = null
  }
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.sku-list {
  line-height: 1.6;
  text-align: left;
}

.sku-item {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
