<template>
  <vab-dialog v-model="dflag" :draggable="false" :title="`明细 | ${props.contractNumber}`" top="10vh" width="100%" @close="closeDetail">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">展示埃托姆</el-button>
      </vab-query-form-left-panel>
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
    <div style="max-height: 80vh">
      <el-table
        border
        :cell-style="cellStyle"
        :data="list"
        :default-sort="{ prop: 'invoiceNumber', order: 'descending' }"
        :header-cell-style="headerCellStyle"
        max-height="60vh"
        @sort-change="handleSortChange"
      >
        <el-table-column
          label="报关品名"
          min-width="100"
          prop="customsDeclarationName"
          :width="flexColumnWidth(list, '报关品名', 'customsDeclarationName')"
        />
        <el-table-column label="报关数量" prop="customsDeclarationCount" width="70">
          <template #header>
            报关
            <br />
            数量
          </template>
        </el-table-column>
        <el-table-column label="报关单位" min-width="60" prop="customsDeclarationUnit">
          <template #header>
            报关
            <br />
            单位
          </template>
        </el-table-column>
        <el-table-column label="CIF售价$" min-width="105" prop="cifPrice" />
        <el-table-column label="运费$" min-width="90" prop="freightFee" />
        <el-table-column label="FOB售价$" min-width="105" prop="fobPrice" />
        <el-table-column label="汇率" min-width="90" prop="rate" />
        <el-table-column label="人民币售价￥" min-width="100" prop="salePrice">
          <template #header>
            人民币
            <br />
            售价￥
          </template>
        </el-table-column>
        <el-table-column label="含税成本￥" min-width="90" prop="taxInclusiveCost">
          <template #header>
            含税
            <br />
            成本￥
          </template>
        </el-table-column>
        <el-table-column label="发票匹配金额" min-width="120" prop="includingTaxPriceTotal" />
        <el-table-column label="退税后成本￥" min-width="100" prop="taxRefundsCost">
          <template #header>
            退税后
            <br />
            成本￥
          </template>
        </el-table-column>
        <el-table-column label="利润￥" min-width="100" prop="profit" />
        <el-table-column label="利润率" min-width="100" prop="profitMargin" />
        <el-table-column label="退税额￥" min-width="100" prop="taxRebate" />
        <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')" />
        <el-table-column label="供应商税号展示" prop="suppliserTaxNumber" :width="flexColumnWidth(list, '税号展示', 'suppliserTaxNumber')">
          <template #header>
            供应商
            <br />
            税号展示
          </template>
        </el-table-column>
        <el-table-column label="PO" min-width="100" prop="po" />
        <el-table-column label="发票匹配日期" min-width="100" prop="matchDate" sortable="custom">
          <template #default="{ row }">
            <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-number-row">{{ item.invoiceMatchDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发票类型" min-width="100" prop="invoicing">
          <template #default="{ row }">
            <el-tag :type="row.invoicing === '专票' ? 'success' : 'danger'">{{ row.invoicing }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发票代码" min-width="100">
          <template #default="{ row }">
            <div v-if="Array.isArray(row.matchInvoiceRecord)">
              <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-item">
                {{ item.invoiceCode || '-' }}
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="发票行次" min-width="100" prop="invoiceMatchDate">
          <template #default="{ row }">
            <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-number-row">{{ item.no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" min-width="120" prop="invoiceNumber" sortable="custom">
          <template #default="{ row }">
            <div v-if="Array.isArray(row.matchInvoiceRecord)">
              <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-item copySku" @click="handleClipboard($event, item.invoiceNumber)">
                {{ item.invoiceNumber || '-' }}
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="发票数量" min-width="100" prop="invoiceMatchDate">
          <template #default="{ row }">
            <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-number-row">{{ item.invoiceCount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发票总数" min-width="100">
          <template #default="{ row }">
            <div v-if="Array.isArray(row.matchInvoiceRecord)">
              <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-item">
                {{ item.invoiceCount || '-' }}
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="发票文件" min-width="100">
          <template #default="{ row }">
            <div v-if="Array.isArray(row.matchInvoiceRecord)">
              <div v-for="(item, index) in row.matchInvoiceRecord" :key="index" class="invoice-item">
                <el-button v-if="item.invoiceFilePath" :icon="Document" size="small" @click="showPdf(item.invoiceFilePath)" />
                <span v-else>-</span>
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="90" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')" />
        <el-table-column label="PO零件数" min-width="110" prop="componentCount" />
        <el-table-column label="shipmentID" min-width="130" prop="shipmentId" :width="flexColumnWidth(list, 'shipmentID', 'shipmentId')" />
        <el-table-column label="付款记录" min-width="230" prop="payRecordList">
          <template #default="{ row }">
            <span v-html="row.payRecordList"></span>
          </template>
        </el-table-column>
      </el-table>

      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 预览pdf -->
    <vab-dialog v-model="pdfVisible" top="5vh" @close="pdfVisible = false">
      <div v-loading="pdfLoading" class="pdf-container">
        <vab-pdf :source="source" />
      </div>
    </vab-dialog>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Document, Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { getTaxRefundBatchDetail } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import VabPdf from '/@/plugins/VabPdf'
import type {
  IGetTaxRefundBatchDetailList,
  IGetTaxRefundBatchDetailQuery,
  PayRecordList,
} from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import handleClipboard from '/@/utils/clipboard'
import { flexColumnWidth } from '/@/utils/tableColum'

const props = defineProps<{
  detailVisible: boolean
  id: number | undefined
  contractNumber: string | undefined
}>()
const dflag = ref<boolean>(false)
watchEffect(() => {
  dflag.value = props.detailVisible
  if (dflag.value) {
    queryForm.id = props.id!
    fetchData()
  }
})
const emit = defineEmits<{
  updateDetailVisible: [value: boolean]
}>()
const closeDetail = () => {
  emit('updateDetailVisible', false)
}
const source = ref<string>('')
const pdfLoading = ref<boolean>(false)
// pdf 可见
const pdfVisible = ref<boolean>(false)

const showPdf = (path: string) => {
  pdfLoading.value = true
  source.value = path
  pdfVisible.value = true
  pdfLoading.value = false
}

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<IGetTaxRefundBatchDetailQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  id: props.id!,
  orderByField: 'invoiceNumber',
  orderDirection: 'desc',
})
const list = ref<IGetTaxRefundBatchDetailList[]>([])
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const headerCellStyle = (): CSSProperties => {
  return {
    textAlign: 'center',
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.row.matchInvoiceRecord && data.row.matchInvoiceRecord.length > 0) {
    // 检查是否匹配了发票（发票匹配金额存在）
    if (data.row.includingTaxPriceTotal == null || data.row.includingTaxPriceTotal === undefined) {
      return {
        textAlign: 'center',
      }
    }
    // 检查含税成本是否存在
    if (data.row.taxInclusiveCost == null || data.row.taxInclusiveCost === undefined) {
      return {
        textAlign: 'center',
      }
    }
    // 计算误差率：|含税成本 - 发票匹配金额| / max(含税成本, 发票匹配金额)
    const taxInclusiveCost = Number(data.row.taxInclusiveCost) || 0
    const includingTaxPriceTotal = Number(data.row.includingTaxPriceTotal) || 0
    // 如果两个值都为0，不标红
    if (taxInclusiveCost === 0 && includingTaxPriceTotal === 0) {
      return {
        textAlign: 'center',
      }
    }
    const maxValue = Math.max(Math.abs(taxInclusiveCost), Math.abs(includingTaxPriceTotal))
    if (maxValue === 0) {
      return {
        textAlign: 'center',
      }
    }
    const errorRate = Math.abs(taxInclusiveCost - includingTaxPriceTotal) / maxValue
    // 如果误差率超过千分之一（0.001），则标红
    if (errorRate > 0.001) {
      return {
        textAlign: 'center',
        backgroundColor: 'var(--el-color-danger-light-9)',
      }
    }
  }
  if (
    data.columnIndex === 0 ||
    data.columnIndex === 14 ||
    data.columnIndex === 15 ||
    data.columnIndex === 16 ||
    data.columnIndex === 22 ||
    data.columnIndex === 24 ||
    data.columnIndex === 25
  ) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
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
  listLoading.value = true
  const { data } = await getTaxRefundBatchDetail(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  list.value.forEach((item: IGetTaxRefundBatchDetailList) => {
    if (Array.isArray(item.payRecordList)) {
      item.payRecordList = item.payRecordList
        .map((record: PayRecordList) => {
          const percentage = parseInt(record.percentage!.replace('%', '')) // 去掉%并转换为整数
          const createTime = record.createTime!.split(' ')[0]
          if (percentage < 0) {
            return `
            <span class="create-time">${createTime}</span>:
            <span class="percentage-red">${percentage}%</span>
            <span class="pay-price">(${record.payPrice})</span>`
          } else {
            return `
            <span class="create-time">${createTime}</span>:
            <span class="percentage">${percentage}%</span>
            <span class="pay-price">(${record.payPrice})</span>`
          }
        })
        .join('<br>')
    }
  })
  listLoading.value = false
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  if (queryForm.orderByField === prop) {
    // 如果点击的是当前排序列
    if (!order) {
      // 取消排序时，切换排序方向
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    // 如果点击的是不同的列，默认设置为降序
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}
</script>

<style lang="scss" scoped>
:deep() {
  .create-time {
    color: #4e88f3;
  }
  .percentage {
    color: #24ada1;
  }
  .pay-price {
    color: #8d5fcc;
  }
  .percentage-red {
    color: var(--el-color-danger);
  }
}
.copySku {
  cursor: pointer;
  color: var(--el-color-primary);
  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}
</style>
