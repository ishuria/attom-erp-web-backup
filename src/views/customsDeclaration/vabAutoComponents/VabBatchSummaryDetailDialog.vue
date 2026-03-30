<template>
  <vab-dialog
    v-model="dialogVisible"
    :draggable="false"
    :title="`汇总明细 | ${props.contractNumber || ''}`"
    top="10vh"
    width="95%"
    @close="closeDialog"
  >
    <div class="table-content">
      <vab-query-form>
        <vab-query-form-left-panel />
        <vab-query-form-right-panel>
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.keyWord"
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
      <el-table v-loading="listLoading" border class="noneHoveTable" :data="list" max-height="65vh" show-summary :summary-method="handleSummaryMethod">
        <el-table-column label="发货日期" min-width="110" prop="shipmentDate">
          <template #default="{ row }">
            {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="合同编号" min-width="140" prop="contractNumber" />
        <el-table-column label="报关品名" min-width="110" prop="customsDeclarationName" />
        <el-table-column label="报关数量" min-width="90" prop="customsDeclarationCount" />
        <el-table-column label="报关单位" min-width="70" prop="customsDeclarationUnit" />
        <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost" />
        <el-table-column label="未税成本￥" min-width="110" prop="taxRefundsCost" />
        <el-table-column label="匹配发票总金额￥" min-width="110" prop="matchInvoicePrice">
          <template #header>
            匹配发票
            <br />
            总金额￥
          </template>
        </el-table-column>
        <el-table-column label="供应商" min-width="180" prop="suppliser" />
        <el-table-column label="供应商税号" min-width="150" prop="taxNumber" />
        <el-table-column label="PO" min-width="100" prop="po" />
        <el-table-column label="匹配日期" min-width="150" prop="matchDate" />
        <el-table-column label="发票行号" min-width="90">
          <template #default="{ row }">
            <template v-if="row.invoiceDetailList && row.invoiceDetailList.length > 0">
              <div v-for="(item, index) in row.invoiceDetailList" :key="item.id || index" class="invoice-number-row">
                <span>{{ item.no }}</span>
              </div>
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" min-width="180">
          <template #default="{ row }">
            <template v-if="row.invoiceDetailList && row.invoiceDetailList.length > 0">
              <div v-for="(item, index) in row.invoiceDetailList" :key="item.id || index" class="invoice-number-row">
                <span>{{ item.invoiceNumber }}</span>
                <div v-if="item.invoiceNumber" class="button-group">
                  <el-button v-if="item.invoicePath" :icon="Document" size="small" @click="showPdf(item.invoicePath)" />
                  <el-button
                    v-if="item.invoicePath"
                    class="button-download"
                    :icon="Download"
                    size="small"
                    @click="downloadInvoice(item.invoicePath)"
                  />
                </div>
              </div>
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Sku" min-width="180" prop="sku" />
        <template #empty>
          <el-empty class="vab-data-empty" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <vab-dialog v-model="pdfVisible" top="5vh" @close="pdfVisible = false">
      <div v-loading="pdfLoading" class="pdf-container">
        <vab-pdf :source="source" />
      </div>
    </vab-dialog>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Document, Download, Search } from '@element-plus/icons-vue'
import { getTaxRefundBatchSummaryDetailList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import VabPdf from '/@/plugins/VabPdf'
import type {
  IGetTaxRefundBatchSummaryDetailList,
  IGetTaxRefundBatchSummaryDetailQuery,
} from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'VabBatchSummaryDetailDialog',
})

const props = defineProps<{
  visible: boolean
  contractNumber: string
}>()

const emit = defineEmits<{
  updateVisible: [value: boolean]
}>()

const dialogVisible = ref<boolean>(false)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const list = ref<IGetTaxRefundBatchSummaryDetailList[]>([])
const queryForm = reactive<IGetTaxRefundBatchSummaryDetailQuery>({
  contractNumber: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const pdfVisible = ref<boolean>(false)
const pdfLoading = ref<boolean>(false)
const source = ref<string>('')

watch(
  [() => props.visible, () => props.contractNumber],
  ([visible, contractNumber]) => {
    dialogVisible.value = visible
    if (!visible || !contractNumber) return
    queryForm.contractNumber = contractNumber
    fetchData()
  },
  { immediate: true }
)

const resetQueryForm = () => {
  queryForm.keyWord = ''
  queryForm.pageNo = 1
  queryForm.pageSize = 20
}

const closeDialog = () => {
  resetQueryForm()
  list.value = []
  total.value = 0
  emit('updateVisible', false)
}

const fetchData = async () => {
  if (!queryForm.contractNumber) return
  listLoading.value = true
  try {
    const { data } = await getTaxRefundBatchSummaryDetailList(queryForm)
    total.value = data?.total || 0
    list.value = data?.list || []
  } finally {
    listLoading.value = false
  }
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}

const handleSummaryMethod = ({ columns, data }: { columns: any[]; data: IGetTaxRefundBatchSummaryDetailList[] }): string[] => {
  const sums: string[] = []

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    if (['customsDeclarationCount', 'taxInclusiveCost', 'taxRefundsCost', 'matchInvoiceCount', 'matchInvoicePrice'].includes(column.property)) {
      const totalValue = data.reduce((sum, row) => {
        const value = Number(row[column.property as keyof IGetTaxRefundBatchSummaryDetailList])
        return Number.isNaN(value) ? sum : sum + value
      }, 0)
      sums[index] = totalValue.toFixed(2)
      return
    }

    sums[index] = ''
  })

  return sums
}

const showPdf = (path: string) => {
  pdfLoading.value = true
  source.value = path
  pdfVisible.value = true
  pdfLoading.value = false
}

const downloadInvoice = (path: string) => {
  const link = document.createElement('a')
  link.href = path
  link.download = link.href.split('/').pop()!
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style lang="scss" scoped>
.table-content {
  .invoice-number-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 28px;
  }

  .button-group {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
}

.pdf-container {
  height: 80vh;
  overflow: auto;
}
</style>
