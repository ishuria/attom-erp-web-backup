<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabChange">
      <el-tab-pane label="未匹配" :name="0">
        <ai-tuo-mu-table
          :list="list"
          :loading="listLoading"
          :query-form="queryForm"
          :show-invoice="true"
          :showActions="false"
          :showButtons="true"
          :total="total"
          :totalPrice="totalPrice"
          @archive-no-invoice="handleArchiveNoInvoice"
          @export="atmExportVisible = true"
          @import="importVisible = true"
          @match="checkMatch"
          @obtain-id-list="handleAiTuoMuTableData"
          @page-change="handleCurrentChange"
          @query="queryData"
          @size-change="handleSizeChange"
          @update-status="handleUpdateStatus"
        />
      </el-tab-pane>
      <el-tab-pane label="已匹配" :name="1">
        <ai-tuo-mu-table
          :list="list"
          :loading="listLoading"
          :query-form="queryForm"
          :show-invoice="true"
          :showActions="true"
          :showButtons="false"
          :total="total"
          :totalPrice="totalPrice"
          @delete-match="deleteMatch"
          @page-change="handleCurrentChange"
          @query="queryData"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="无法开票" :name="2">
        <ai-tuo-mu-table
          :list="list"
          :loading="listLoading"
          :query-form="queryForm"
          remark-label="备注"
          :show-invoice="false"
          :showActions="false"
          :showArchiveNoInvoice="true"
          :showButtons="false"
          :showRemark="true"
          :total="total"
          :totalPrice="totalPrice"
          @archive-no-invoice="handleArchiveNoInvoice"
          @delete-match="deleteMatch"
          @obtain-id-list="handleAiTuoMuTableData"
          @page-change="handleCurrentChange"
          @query="queryData"
          @size-change="handleSizeChange"
          @update-remark="handleUpdateRemark"
        />
      </el-tab-pane>
      <el-tab-pane label="无需开票" :name="3">
        <ai-tuo-mu-table
          :list="list"
          :loading="listLoading"
          :query-form="queryForm"
          remark-label="无需开票原因"
          :show-invoice="false"
          :showActions="false"
          :showButtons="false"
          :showRemark="true"
          :total="total"
          :totalPrice="totalPrice"
          @delete-match="deleteMatch"
          @page-change="handleCurrentChange"
          @query="queryData"
          @size-change="handleSizeChange"
          @update-remark="handleUpdateRemark"
        />
      </el-tab-pane>
      <el-tab-pane label="发票" :name="4">
        <ai-tuo-mu-invoice-table
          v-model:queryForm="invoiceQueryForm"
          :list="invoiceList"
          :loading="listLoading"
          :not-match-rate="notMatchRate"
          :total="total"
          @page-change="handleInvoiceCurrentChange"
          @query="queryInvoiceData"
          @size-change="handleInvoiceSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 发票导入 -->
    <ai-tuo-mu-invoice-import
      from="import"
      :invoice-matching-visible="importVisible"
      @update-invoice-matching-visible="updateImportVisible"
    />
    <!-- 发票匹配 -->
    <ai-tuo-mu-invoice-import
      from="match"
      :idList="selectChildIdList"
      :invoice-matching-visible="matchVisible"
      @refresh="queryData"
      @update-invoice-matching-visible="updateMatchVisible"
    />
    <!-- 催票文件导出 -->
    <vab-dialog v-model="atmExportVisible" title="催票文件导出" width="20%">
      <el-form label-position="top">
        <el-form-item label="发货日期">
          <el-date-picker v-model="date" :clearable="false" :disabled-date="(time: Date) => time.getTime() > Date.now()" type="daterange" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="atmExportVisible = false">取消</el-button>
        <el-button :loading="exportLoading" type="primary" @click="handleExportATM">导出</el-button>
      </template>
    </vab-dialog>
    <!-- 无需开票归档 -->
    <vab-dialog v-model="archiveVisible" title="无需开票归档" width="24%">
      <el-form label-position="top">
        <el-form-item label="原因" required>
          <el-input v-model.trim="archiveReason" placeholder="请输入无需开票原因" :rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="archiveVisible = false">取消</el-button>
        <el-button :loading="archiveLoading" type="primary" @click="handleArchiveConfirm">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from 'element-plus'
import { formatDateToString } from '~/src/utils/dateUtils'
import { aiTuoMuInvoiceMatchDelete, aiTuoMuUpdateStatus, getAiTuoMuList, queryAiTuoMuInvoiceList } from '/@/api/devlocal/aiTuoMu'
import { downloadFilePD } from '/@/api/devlocal/download'
import { IAiTuoMuItem, IAiTuoMuListReq } from '/@/type/aiTuoMu/aiTuoMuList'

defineOptions({
  name: 'AituomuFapiaoManagement',
})

const date = ref<[string, string]>()
const activeName = ref<number>(0)

const queryForm = reactive<IAiTuoMuListReq>({
  keyWord: '',
  status: activeName.value,
  pageNo: 1,
  pageSize: 20,
  customsDeclarationStatus: -1,
  purchaseDate: undefined,
})
const invoiceQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 100,
  status: 1,
  notEqual: 0,
  notMatchName: 0,
  notMatchUnit: 0,
  matchDate: ['', ''],
})
const list = ref<IAiTuoMuItem[]>([])
const invoiceList = ref<any[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const totalPrice = ref<number>(0)
const importVisible = ref<boolean>(false)
const matchVisible = ref<boolean>(false)
const atmExportVisible = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const archiveVisible = ref<boolean>(false)
const archiveLoading = ref<boolean>(false)
const archiveReason = ref<string>('')
const selectChildIdList = ref<number[]>([])

const handleTabChange = (tab: TabsPaneContext) => {
  activeName.value = Number(tab.props.name)
  selectChildIdList.value = []
  if (activeName.value === 4) {
    queryInvoiceData()
  } else {
    queryForm.status = activeName.value
    queryData()
  }
}
const deleteMatch = (row: any) => {
  $baseConfirm('确定要删除匹配吗？', null, async () => {
    const { data } = await aiTuoMuInvoiceMatchDelete({
      id: row.id,
      invoiceDetailId: row.invoiceDetailId,
    })
    if (data) {
      $baseMessage('删除匹配成功！', 'success')
      queryData()
    }
  })
}
const handleUpdateStatus = async () => {
  if (selectChildIdList.value.length === 0) {
    $baseMessage('请选择无法开票的零件！！', 'error')
    return
  }
  $baseConfirm('确定要修改为无法开票吗？', null, async () => {
    const { data } = await aiTuoMuUpdateStatus({ ids: selectChildIdList.value, status: 2 })
    if (data) {
      $baseMessage('修改为无法开票成功！', 'success')
      selectChildIdList.value = []
      queryData()
    }
  })
}
const handleArchiveNoInvoice = () => {
  if (selectChildIdList.value.length === 0) {
    $baseMessage('请选择无需开票归档的零件！！', 'error')
    return
  }
  archiveReason.value = ''
  archiveVisible.value = true
}
const handleArchiveConfirm = async () => {
  if (!archiveReason.value) {
    $baseMessage('请输入无需开票原因！', 'error')
    return
  }
  archiveLoading.value = true
  try {
    const { data } = await aiTuoMuUpdateStatus({
      ids: selectChildIdList.value,
      status: 3,
      remark: archiveReason.value,
    })
    if (data) {
      $baseMessage('无需开票归档成功！', 'success')
      selectChildIdList.value = []
      archiveVisible.value = false
      queryData()
    }
  } finally {
    archiveLoading.value = false
  }
}
const handleUpdateRemark = async (row: IAiTuoMuItem) => {
  if (activeName.value === 3 && !row.remark) {
    $baseMessage('请输入无需开票原因！', 'error')
    return
  }
  const { data } = await aiTuoMuUpdateStatus({
    ids: [row.id],
    status: activeName.value,
    remark: row.remark || '',
  })
  if (data) {
    $baseMessage('备注保存成功！', 'success')
  }
}
// 埃托姆发票导出
const handleExportATM = async () => {
  exportLoading.value = true
  if (date.value && date.value.length > 0) {
    await downloadFilePD('/taxRefund/invoice/export', {
      fromDate: date.value[0],
      toDate: date.value[1],
    }).then(() => {
      exportLoading.value = false
    })

    await downloadFilePD('/taxRefund/invoice/export/detail', {
      fromDate: date.value[0],
      toDate: date.value[1],
    }).then(() => {
      exportLoading.value = false
    })
  } else {
    $baseMessage('请选择日期', 'error')
  }
}

const checkMatch = () => {
  if (selectChildIdList.value.length === 0) {
    $baseMessage('请选择需要匹配埃托姆发票的零件！！', 'error')
    return
  }
  matchVisible.value = true
}

const updateMatchVisible = () => {
  matchVisible.value = false
}
const updateImportVisible = () => {
  importVisible.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const handleInvoiceCurrentChange = (val: number) => {
  invoiceQueryForm.pageNo = val
  fetchInvoiceData()
}
const handleInvoiceSizeChange = (val: number) => {
  invoiceQueryForm.pageNo = 1
  invoiceQueryForm.pageSize = val
  fetchInvoiceData()
}
const queryInvoiceData = () => {
  invoiceQueryForm.pageNo = 1
  fetchInvoiceData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAiTuoMuList(queryForm)
  list.value = data.list
  total.value = data.total
  totalPrice.value = data.totalPrice
  listLoading.value = false
}
const notMatchRate = ref<number>(0)
const fetchInvoiceData = async () => {
  listLoading.value = true
  const params = {
    ...invoiceQueryForm,
    matchDateStart: invoiceQueryForm.matchDate?.[0] ? formatDateToString(invoiceQueryForm.matchDate?.[0]) : null,
    matchDateEnd: invoiceQueryForm.matchDate?.[1] ? formatDateToString(invoiceQueryForm.matchDate?.[1]) : null,
  }
  const { data } = await queryAiTuoMuInvoiceList(params)
  invoiceList.value = data.list
  total.value = data.total
  notMatchRate.value = data.notMatchRate
  listLoading.value = false
}

const handleAiTuoMuTableData = (data: IAiTuoMuItem[]) => {
  selectChildIdList.value = []
  for (const item of data) {
    selectChildIdList.value.push(item.id)
  }
}

onBeforeMount(() => {
  if (activeName.value === 4) {
    fetchInvoiceData()
  } else {
    fetchData()
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
      }
    }
  }
}
</style>
