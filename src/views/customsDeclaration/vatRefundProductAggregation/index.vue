<template>
  <div class="tabs-table-container no-background-container">
    <div class="table-content">
      <vab-query-form>
        <vab-query-form-left-panel :span="15">
          <el-button type="primary" @click="showInvoiceMatching">发票匹配</el-button>
          <el-button type="primary" @click="showTicketReminder">云舟催票文件</el-button>
          <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0">
            <el-date-picker
              :key="datePickerKey"
              v-model="date"
              :clearable="false"
              :disabled-date="(time: Date) => time.getTime() > Date.now()"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="width: 22em"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="queryDateData"
            />
          </span>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel :span="9">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-select v-model="queryForm.searchFields" placeholder="请选择搜索字段">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span :style="{ fontWeight: item.value === 'all' ? 'bold' : 'normal' }">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
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
      <el-table
        v-loading="listLoading"
        border
        :data="list"
        class="noneHoveTable"
        :default-sort="{ prop: 'shipmentDate', order: 'descending' }"
        show-summary
        :summary-method="handleSummaryMethod"
        @sort-change="handleSortChange"
      >
        <el-table-column fixed="left" label="selection" type="selection" width="60" />
        <el-table-column fixed="left" label="发货日期" min-width="110" prop="shipmentDate" sortable>
          <template #default="{ row }">
            {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="报关单出口日期" min-width="150" prop="exportDate" sortable />
        <el-table-column label="合同编号" min-width="150" prop="contractNumber" sortable />
        <el-table-column label="报关品名" min-width="150" prop="customsDeclarationName" sortable />
        <el-table-column label="报关单位" min-width="120" prop="customsDeclarationUnit">
          <template #default="{ row }">
            {{ row.customsDeclarationUnit }}
          </template>
        </el-table-column>
        <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />
        <el-table-column label="供应商" min-width="150" prop="suppliser" sortable />
        <el-table-column label="发票号码" min-width="180" prop="invoiceNumber">
          <template #default="{ row }">
            <template v-if="row.invoiceDetailList && row.invoiceDetailList.length > 0">
              <div v-for="(item, index) in row.invoiceDetailList" :key="item.id || index" class="invoice-number-row">
                <span>{{ item.invoiceNumber }}</span>
                <div v-if="item.invoiceNumber" class="button-group">
                  <el-button :icon="Document" size="small" @click="showPdf(item.invoicePath)" />
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
        <el-table-column label="PO" min-width="100" prop="po" sortable />
        <el-table-column label="PO零件数量" min-width="100" prop="count" sortable />
        <el-table-column label="CIF售价$" min-width="100" prop="cif">
          <template #default="{ row }">
            {{ row.cif || row.cifPrice }}
          </template>
        </el-table-column>
        <el-table-column label="FOB售价$" min-width="100" prop="fob">
          <template #default="{ row }">
            {{ row.fob || row.fobPrice }}
          </template>
        </el-table-column>
        <el-table-column label="运费$" min-width="100" prop="freightFee" />
        <el-table-column label="汇率" min-width="100" prop="exchangeRate" />
        <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost" />
        <el-table-column label="匹配发票总金额￥" min-width="140" prop="matchInvoicePrice">
          <template #header>
            匹配发票
            <br />
            总金额￥
          </template>
        </el-table-column>
        <el-table-column label="匹配发票数量" min-width="90" prop="matchInvoiceCount" />
        <el-table-column label="匹配日期" min-width="110" prop="matchDate" />
        <el-table-column label="利润￥" min-width="100" prop="profit" />
        <el-table-column label="利润率" min-width="90" prop="profitMargin">
          <template #default="{ row }">
            {{ row.profitMargin ? row.profitMargin + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="退税金额￥" min-width="110" prop="taxRebate" />
        <el-table-column label="税前成本￥" min-width="110" prop="acutalTaxCost" />
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
    <!-- 发票匹配 -->
    <vab-aggregation-invoice-math
      :invoice-matching-visible="invoiceMatchingVisible"
      @update-invoice-matching-visible="closeInvoiceMatching"
    />
    <!-- 云舟催票文件 -->
    <vab-dialog v-model="ticketReminderVisible" title="聚合生成云舟催票文件" width="25%" @close="closeTicketReminder">
      <el-form ref="ticketReminderFormRef" label-position="top" :model="ticketReminderForm" :rules="ticketReminderFormRules">
        <el-form-item label="发货日期" prop="shipmentDate">
          <el-date-picker
            v-model="ticketReminderForm.shipmentDate"
            :clearable="true"
            :editable="true"
            end-placeholder="最晚发货日期"
            range-separator="至"
            start-placeholder="最早发货日期"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="付款日期" prop="dateRange">
          <el-date-picker
            v-model="ticketReminderForm.dateRange"
            :clearable="true"
            :editable="true"
            end-placeholder="最晚付款日期"
            range-separator="至"
            start-placeholder="最早付款日期"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <div class="supplier-select-container">
            <el-select
              v-model="ticketReminderForm.suppliser"
              clearable
              default-first-option
              filterable
              :loading="loading"
              placeholder="点击输入和搜索"
              remote
              :remote-method="remoteMethod"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button
              v-if="ticketReminderForm.suppliser"
              circle
              class="copy-btn"
              :icon="CopyDocument"
              size="small"
              type="primary"
              @click="handleClip(ticketReminderForm.suppliser)"
            />
          </div>
        </el-form-item>
        <el-form-item label="催票选项">
          <el-radio-group v-model="ticketReminderForm.status">
            <el-radio border :value="0">仅需催票记录</el-radio>
            <el-radio border :value="1">所有记录</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeTicketReminder">取消</el-button>
        <el-button :loading="generateLoading" type="primary" @click="handleConfirmTicketReminder">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 预览pdf -->
    <vab-dialog v-model="pdfVisible" top="5vh" @close="pdfVisible = false">
      <div v-loading="pdfLoading" class="pdf-container">
        <vab-pdf :source="source" />
      </div>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CopyDocument, Document, Download, Search } from '@element-plus/icons-vue'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'
import { getTaxRefundMainList, taxRefundInvoiceBeforeCheck } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { type FormInstance, type FormRules, type TabsPaneContext } from 'element-plus'
import { downloadFilePD } from '/@/api/devlocal/download'
import { getProductAllSupplier } from '/@/api/devlocal/productInformation'
import type { IGetTaxRefundMainList, IGetTaxRefundMainListQuery } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { handleClip } from '/@/utils/clipboard'
import VabPdf from '/@/plugins/VabPdf'

defineOptions({
  name: 'VatRefundProductAggregation',
})

const searchOptions = [
  { label: '全部', value: 'all' },
  { label: 'PO', value: 'po' },
  { label: '报关品名', value: 'customs_declaration_name' },
  { label: '合同号', value: 'contract_number' },
  { label: '供应商', value: 'suppliser' },
]

const list = ref<IGetTaxRefundMainList[]>([])
const invoiceMatchingVisible = ref<boolean>(false)
const ticketReminderVisible = ref<boolean>(false)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const date = ref<[string, string]>(getDefaultStringTime())
const datePickerKey = ref<number>(0)

// PDF预览相关
const pdfVisible = ref<boolean>(false)
const pdfLoading = ref<boolean>(false)
const source = ref<string>('')

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

// 云舟催票文件相关
type ITicketReminderForm = {
  dateRange: [string, string]
  shipmentDate: [string, string]
  suppliser: string
  status: number
}
const ticketReminderForm = reactive<ITicketReminderForm>({
  dateRange: ['', ''],
  suppliser: '',
  shipmentDate: ['', ''],
  status: 0,
})
// 自定义校验器：dateRange 或 shipmentDate 必须填一个
const validateDateRangeOrShipmentDate = (rule: any, value: any, callback: any) => {
  const dateRangeFilled = ticketReminderForm.dateRange && ticketReminderForm.dateRange[0] && ticketReminderForm.dateRange[1]
  const shipmentDateFilled = ticketReminderForm.shipmentDate && ticketReminderForm.shipmentDate[0] && ticketReminderForm.shipmentDate[1]

  if (!dateRangeFilled && !shipmentDateFilled) {
    callback(new Error('发货日期和付款日期至少需要填写一个'))
  } else {
    callback()
  }
}
const ticketReminderFormRules = reactive<FormRules<ITicketReminderForm>>({
  dateRange: [{ validator: validateDateRangeOrShipmentDate, trigger: 'change' }],
  shipmentDate: [{ validator: validateDateRangeOrShipmentDate, trigger: 'change' }],
})
const ticketReminderFormRef = ref<FormInstance>()
const generateLoading = ref(false)
const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表

const queryForm = reactive<IGetTaxRefundMainListQuery>({
  keyWord: '',
  contractNumber: '',
  fromDate: date.value[0],
  toDate: date.value[1],
  orderByField: 'shipment_date',
  orderDirection: 'desc',
  searchFields: 'all',
  pageNo: 1,
  pageSize: 20,
})

// 获取列表数据
const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getTaxRefundMainList(queryForm)
    total.value = data?.total || 0
    list.value = data?.list || []
  } finally {
    listLoading.value = false
  }
}

// 查询
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 日期查询
const queryDateData = () => {
  queryForm.fromDate = date.value[0]
  queryForm.toDate = date.value[1]
  queryData()

  // 强制重新渲染日期选择器，解决选择后无法再次打开的问题
  nextTick(() => {
    datePickerKey.value++
  })
}

// 处理排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
  queryForm.orderByField = prop || ''
  queryForm.orderDirection = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
  fetchData()
}

// 分页变化
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}

// 处理底部合计列
const handleSummaryMethod = ({ columns, data }: { columns: any[]; data: any[] }): any[] => {
  const sums: string[] = []

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计' // 第一列显示"合计"字样
      return
    }

    // 对特定字段执行求和
    if (
      [
        'customsDeclarationCount',
        'cif',
        'freightFee',
        'fob',
        'taxInclusiveCost',
        'matchInvoicePrice',
        'profit',
        'taxRebate',
        'acutalTaxCost',
      ].includes(column.property)
    ) {
      const total = data.reduce((sum, row) => {
        const value = Number(row[column.property])
        return isNaN(value) ? sum : sum + value
      }, 0)
      sums[index] = total.toFixed(2) // 保留两位小数
    } else if (['matchInvoiceTotalCount'].includes(column.property)) {
      const total = data.reduce((sum, row) => {
        const value = Number(row[column.property])
        return isNaN(value) ? sum : sum + value
      }, 0)
      sums[index] = total
    } else {
      // 其他列不显示合计
      sums[index] = ''
    }
  })

  return sums
}

// 展示发票匹配
const showInvoiceMatching = () => {
  invoiceMatchingVisible.value = true
}

// 展示云舟催票文件
const showTicketReminder = () => {
  ticketReminderVisible.value = true
}

// 供应商搜索
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
      suppliserName: query,
    })

    supplierList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = supplierList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

// 关闭云舟催票文件
const closeTicketReminder = () => {
  ticketReminderFormRef.value?.resetFields()
  ticketReminderVisible.value = false
}

// 确认云舟催票文件
const handleConfirmTicketReminder = async () => {
  ticketReminderFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      try {
        generateLoading.value = true

        const params = {
          fromDate: ticketReminderForm.dateRange[0],
          toDate: ticketReminderForm.dateRange[1],
          suppliser: ticketReminderForm.suppliser,
          startDate: ticketReminderForm.shipmentDate[0],
          endDate: ticketReminderForm.shipmentDate[1],
          status: ticketReminderForm.status,
        }

        // if (data) {
          const response = await downloadFilePD('/taxRefund/main/hasten/invoice', params)
          // 如果返回的是 JSON 类型，说明可能是错误信息
          if (response.type === 'application/json') {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
              const result = JSON.parse(reader.result as string)
              if (result.code === 5000) {
                $baseMessage(result.msg, 'error')
              }
            })
            reader.readAsText(response)
          }
        // }
        generateLoading.value = false
      } catch (error) {
        console.error(error)
        generateLoading.value = false
      }
    }
  })
}

// 关闭发票匹配
const closeInvoiceMatching = (value: boolean) => {
  invoiceMatchingVisible.value = value
  if (!value) {
    fetchData() // 刷新数据
  }
}

// 初始化加载数据
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-form {
      .el-form-item:first-child {
        margin: 0 5px 0 0 !important;
      }
      .el-form-item:nth-child(2) {
        margin: 0 !important;

        .el-check-tag,
        .el-form-item__label {
          margin: 0 5px 5px 0;
          border-radius: 99px;
        }
      }
      .el-form-item:last-child {
        margin: 0 !important;
      }
    }

    .noneHoveTable {
      .invoice-number-row {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 0;

        .button-group {
          display: flex;
          margin-left: 6px;

          .button-download {
            margin-left: 6px;
          }
        }
      }

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
  }
}

// 供应商选择框容器样式
.supplier-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .el-select {
    flex: 1;
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

.table-content {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px);

  .vab-query-form {
    flex-shrink: 0;
  }

  .noneHoveTable {
    flex: 1;
  }

  .vab-pagination {
    flex-shrink: 0;
  }
}

.multi-line-ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.custom-tooltip {
  max-width: 300px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
