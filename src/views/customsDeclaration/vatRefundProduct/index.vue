<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待退税" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button type="primary" @click="showInvoiceMatching">发票匹配</el-button>
            <el-button type="primary" @click="showBatchProfitMargin">批次利润率</el-button>
            <el-button type="primary" @click="ticketReminderVisible = true">云舟催票文件</el-button>
            <!-- <el-button type="primary">云舟开票导出</el-button> -->
            <!-- <el-button :loading="exportLoading" type="primary" @click="handleExportATM">埃托姆开票导出</el-button> -->
            <el-button type="primary" @click="invoiceMatchExportVisible = true">发票匹配导出</el-button>
            <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0">
              <el-date-picker
                v-model="date"
                :clearable="false"
                :disabled-date="(time: Date) => time.getTime() > Date.now()"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                value-format="YYYY-MM-DD"
                @change="queryDateData"
              />
            </span>
            <span style="margin: 0 0 calc(var(--el-margin) / 2) 0">
              <el-text>
                该区间剩余可退税金额：
                <span style="font-weight: 600; color: rgb(83, 186, 177)">23234.56元</span>
              </el-text>
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-select v-model="queryForm.searchFields" placeholder="请选择搜索字段">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="list"
          :default-sort="{ prop: 'shipmentDate', order: 'descending' }"
          :header-cell-class-name="headerCell"
          :header-cell-style="headerCellStyle"
          :row-class-name="tableRowClassName"
          show-summary
          :summary-method="handleSummaryMethod"
          @cell-click="cellClick"
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
        >
          <el-table-column fixed="left" label="selection" type="selection" width="60" />
          <el-table-column fixed="left" label="发货日期" min-width="120" prop="shipmentDate" sortable="custom">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="left"
            label="合同编号"
            :min-width="flexColumnWidth(list, '合同编号', 'contractNumber', 50)"
            prop="contractNumber"
            sortable="custom"
          />
          <el-table-column label="报关单出口日期" min-width="120" prop="exportDate" sortable="custom">
            <template #header>
              报关单
              <br />
              出口日期
            </template>
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="报关品名"
            :min-width="flexColumnWidth(list, '报关品名', 'customsDeclarationName', 50)"
            prop="customsDeclarationName"
            sortable="custom"
          />

          <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />

          <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit" />

          <el-table-column label="CIF售价$" min-width="120" prop="cifPrice" />
          <el-table-column label="运费$" min-width="100" prop="freightFee" />
          <el-table-column label="FOB售价$" min-width="120" prop="fobPrice" />
          <el-table-column label="汇率" min-width="90" prop="rate" />
          <el-table-column label="人民币售价￥" min-width="130" prop="salePrice" />
          <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost" />
          <el-table-column label="" min-width="100" prop="includingTaxPriceTotal">
            <template #header>
              匹配发票
              <br />
              总金额￥
            </template>
            <template #default="{ row }">
              <el-text v-if="row.includingTaxPriceTotal !== row.taxInclusiveCost" type="danger">{{ row.includingTaxPriceTotal }}</el-text>
              <span v-else>{{ row.includingTaxPriceTotal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退税后成本￥" min-width="130" prop="taxRefundsCost" />
          <el-table-column label="利润￥" :min-width="flexColumnWidth(list, '利润￥', 'profit', 50)" prop="profit" />
          <el-table-column label="利润率" min-width="100" prop="profitMargin">
            <template #default="{ row }">
              {{ row.profitMargin ? row.profitMargin + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="退税额￥" min-width="100" prop="taxRebate" />
          <el-table-column
            label="供应商"
            :min-width="flexColumnWidth(list, '供应商', 'suppliser', 50)"
            prop="suppliser"
            sortable="custom"
          />
          <el-table-column
            label="供应商税号"
            :min-width="flexColumnWidth(list, '供应商税号', 'suppliserTaxNumber')"
            prop="suppliserTaxNumber"
          />
          <el-table-column label="PO" min-width="100" prop="po" sortable="custom" />
          <el-table-column label="发票匹配日期" min-width="130" prop="formattedMatchDate">
            <template #default="{ row }">
              <div v-for="(item, index) in row.formattedMatchDate" :key="index" class="invoice-number-row">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发票代码" min-width="100" prop="formattedInvoiceCode">
            <template #default="{ row }">
              <div v-for="(item, index) in row.formattedInvoiceCode" :key="index" class="invoice-number-row">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发票号码" min-width="330" prop="invoiceNumber" sortable="custom">
            <template #default="{ row }">
              <div v-for="(item, index) in row.formattedInvoiceNumber" :key="index" class="invoice-number-row">
                <span>{{ item.invoiceNumber }}</span>
                <div class="button-group">
                  <el-button v-if="item.invoiceNumber" :icon="Document" size="small" @click="showPdf(item.invoiceFilePath)" />
                  <el-button
                    v-if="item.invoiceFilePath"
                    class="button-download"
                    :icon="Download"
                    size="small"
                    @click="downloadInvoice(item.invoiceFilePath)"
                  />
                  <el-tooltip content="" effect="dark" placement="top">
                    <template #content>
                      <div class="custom-tooltip">删除匹配</div>
                    </template>
                    <el-button class="button-delete" :icon="Delete" plain size="small" type="danger" @click="handleDeleteMatch(item)" />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发票数量" min-width="100" prop="invoiceTotal" />
          <el-table-column label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'sku')" prop="sku" />
          <el-table-column label="PO零件名" :min-width="flexColumnWidth(list, 'PO零件名', 'poComponentName')" prop="poComponentName" />
          <el-table-column label="PO零件数" min-width="100" prop="componentCount" />
          <el-table-column label="shipmentID" :min-width="flexColumnWidth(list, 'shipmentID-', 'shipmentId')" prop="shipmentId" />
          <el-table-column label="付款记录" :min-width="flexColumnWidth(list, '付款记录', 'payRecord', 60)" prop="payRecordList">
            <template #default="{ row }">
              <span v-html="row.payRecordList"></span>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="100">
            <template #default="{ row }">
              <div v-if="row.formattedInvoiceNumber.length > 0">
                <div v-for="(item, index) in row.formattedInvoiceNumber" :key="index">
                  <el-link type="danger" underline='never' @click="handleDeleteMatch(item)">删除匹配</el-link>
                </div>
              </div>
              <div v-else>
                <el-link type="danger" underline='never' @click="handleDeleteMatch(row)">删除匹配</el-link>
              </div>
            </template>
          </el-table-column> -->
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
      </el-tab-pane>
      <el-tab-pane label="已退税" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button type="primary" @click="showBatchProfitMargin">批次利润率</el-button>
            <!-- <el-button type="primary">云舟开票导出</el-button> -->
            <!-- <el-button type="primary">埃托姆开票导出</el-button> -->
            <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0">
              <el-date-picker
                v-model="date"
                :clearable="false"
                :disabled-date="(time: Date) => time.getTime() > Date.now()"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                value-format="YYYY-MM-DD"
                @change="queryDateData"
              />
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-select v-model="queryForm.searchFields" placeholder="请选择搜索字段">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          :cell-style="cellStyle2"
          class="noneHoveTable"
          :data="list"
          :default-sort="{ prop: 'shipmentDate', order: 'descending' }"
          :header-cell-class-name="headerCell"
          :header-cell-style="headerCellStyle"
          :row-class-name="tableRowClassName"
          show-summary
          :summary-method="handleSummaryMethod"
          @cell-click="cellClick"
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
        >
          <el-table-column fixed="left" label="selection" type="selection" width="60" />
          <el-table-column fixed="left" label="发货日期" min-width="120" prop="shipmentDate" sortable="custom">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="left"
            label="合同编号"
            :min-width="flexColumnWidth(list, '合同编号', 'contractNumber', 50)"
            prop="contractNumber"
            sortable="custom"
          />
          <el-table-column label="报关单出口日期" min-width="120" prop="exportDate" sortable="custom">
            <template #header>
              报关单
              <br />
              出口日期
            </template>
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关品名" min-width="120" prop="customsDeclarationName" sortable="custom" />
          <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />
          <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit" />
          <el-table-column label="CIF售价$" min-width="120" prop="cifPrice" />
          <el-table-column label="运费$" min-width="100" prop="freightFee" />
          <el-table-column label="FOB售价$" min-width="120" prop="fobPrice" />
          <el-table-column label="汇率" min-width="90" prop="rate" />
          <el-table-column label="人民币售价￥" min-width="130" prop="salePrice" />
          <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost" />
          <el-table-column label="" min-width="100" prop="includingTaxPriceTotal">
            <template #header>
              匹配发票
              <br />
              总金额￥
            </template>
            <template #default="{ row }">
              <el-text v-if="row.includingTaxPriceTotal !== row.taxInclusiveCost" type="danger">{{ row.includingTaxPriceTotal }}</el-text>
              <span v-else>{{ row.includingTaxPriceTotal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退税后成本￥" min-width="130" prop="taxRefundsCost" />
          <el-table-column label="利润￥" :min-width="flexColumnWidth(list, '利润￥', 'profit', 50)" prop="profit" />
          <el-table-column label="利润率" min-width="100" prop="profitMargin">
            <template #default="{ row }">
              {{ row.profitMargin ? row.profitMargin + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="退税额￥" min-width="100" prop="taxRebate" />
          <el-table-column
            label="供应商"
            :min-width="flexColumnWidth(list, '供应商', 'suppliser', 50)"
            prop="suppliser"
            sortable="custom"
          />
          <el-table-column
            label="供应商税号"
            :min-width="flexColumnWidth(list, '供应商税号', 'suppliserTaxNumber')"
            prop="suppliserTaxNumber"
          />
          <el-table-column label="PO" min-width="100" prop="po" sortable="custom" />
          <el-table-column label="发票匹配日期" min-width="130" prop="formattedMatchDate">
            <template #default="{ row }">
              <div v-for="(item, index) in row.formattedMatchDate" :key="index" class="invoice-number-row">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发票代码" min-width="100" prop="formattedInvoiceCode">
            <template #default="{ row }">
              <div v-for="(item, index) in row.formattedInvoiceCode" :key="index" class="invoice-number-row">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发票号码" min-width="330" prop="invoiceNumber" sortable="custom">
            <template #default="{ row }">
              <div v-for="(item, index) in row.formattedInvoiceNumber" :key="index" class="invoice-number-row">
                <span>{{ item.invoiceNumber }}</span>
                <div class="button-group">
                  <el-button v-if="item.invoiceNumber" :icon="Document" size="small" @click="showPdf(item.invoiceFilePath)" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发票数量" min-width="100" prop="invoiceTotal" />
          <el-table-column label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'sku')" prop="sku" />
          <el-table-column label="PO零件名" :min-width="flexColumnWidth(list, 'PO零件名', 'poComponentName')" prop="poComponentName" />
          <el-table-column label="PO零件数" min-width="100" prop="componentCount" />
          <el-table-column label="shipmentID" :min-width="flexColumnWidth(list, 'shipmentID-', 'shipmentId')" prop="shipmentId" />
          <el-table-column label="付款记录" :min-width="flexColumnWidth(list, '付款记录', 'payRecord', 60)" prop="payRecordList">
            <template #default="{ row }">
              <span v-html="row.payRecordList"></span>
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
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 发票匹配 -->
    <vab-invoice-matching :invoice-matching-visible="invoiceMatchingVisible" @update-invoice-matching-visible="closeInvoiceMatching" />
    <!-- 批次利润率 -->
    <vab-batch-profit-margin
      :batch-profit-margin-visible="batchProfitMarginVisible"
      @update-batch-profit-margin-visible="closeBatchProfitMargin"
    />
    <!-- 云舟催票文件 -->
    <vab-dialog v-model="ticketReminderVisible" title="生成云舟催票文件" width="25%" @close="closeTicketReminder">
      <el-form ref="ticketReminderFormRef" label-position="top" :model="ticketReminderForm" :rules="ticketReminderFormRules">
        <el-form-item label="发货日期">
          <el-date-picker
            v-model="ticketReminderForm.shipmentDate"
            :clearable="true"
            :editable="false"
            end-placeholder="最晚发货日期"
            range-separator="至"
            start-placeholder="最早发货日期"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="付款日期" prop="">
          <el-date-picker
            v-model="ticketReminderForm.dateRange"
            :clearable="true"
            :editable="false"
            end-placeholder="最晚付款日期"
            range-separator="至"
            start-placeholder="最早付款日期"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="供应商">
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
        </el-form-item>
        <!-- <el-form-item label="仅已报关" prop="">
          <el-checkbox :true-value="1" :false-value="0" ></el-checkbox>
        </el-form-item>
        <el-form-item label="采购方" prop="">
          <el-select ></el-select>
        </el-form-item> -->
        <!-- <vab-alert type="error">
          注意:系统生成催收文件的开票数量是按照PO数量，如果和供应商沟通拆分开票的系统无法识别，需要你手动处理。且当拆分的任何一张发票报关后，发票催收会跳过这个PO。
        </vab-alert> -->
      </el-form>
      <template #footer>
        <el-button @click="closeTicketReminder">取消</el-button>
        <el-button :loading="generateLoading" type="primary" @click="handleConfirmTicketReminder">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 发票匹配导出 -->
    <vab-dialog v-model="invoiceMatchExportVisible" title="发票匹配导出" width="20%" @close="closeInvoiceMatchExport">
      <el-form ref="invoiceMatchExportFormRef" label-position="top" :model="invoiceMatchExportForm">
        <el-form-item>
          <el-date-picker
            v-model="invoiceMatchExportForm.time"
            :clearable="false"
            :editable="false"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleExportInvoiceMatch">导出</el-button>
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
import { Delete, Document, Download, Search } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import { checkTaxRefundInvoiceExport, deleteTaxRefundMatch, getTaxRefundList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { downloadFilePD } from '/@/api/devlocal/download'
import VabPdf from '/@/plugins/VabPdf'
// import { useTabStateStore } from '/@/store/modules/tabsState'
import { getProductAllSupplier } from '/@/api/devlocal/productInformation'
import type { IGetTaxRefundBatchDetailList, IGetTaxRefundListQuery, PayRecordList } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'
import { focusAndSelectInput } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
defineOptions({
  name: 'VatRefundProduct',
})

const searchOptions = [
  { label: 'ShipmentId', value: 'shipmentId' },
  { label: 'PO', value: 'po' },
  { label: 'SKU', value: 'sku' },
  { label: '报关品名', value: 'declarationName' },
  { label: '合同号', value: 'contractNumber' },
  { label: '报关单出库日期', value: 'exportDate' },
  { label: '供应商', value: 'suppliser' },
  { label: '发票号码', value: 'invoiceNumber' },
]
const router = useRouter()
const route = useRoute()
// const dialogWidth = ref<number>(0)
const source = ref<string>('')
const pdfLoading = ref<boolean>(false)
const showPdf = (path: string) => {
  pdfLoading.value = true
  source.value = path
  pdfVisible.value = true
  pdfLoading.value = false
}
const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
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

const handleSummaryMethod = ({ columns, data }: { columns: any[]; data: any[] }): any[] => {
  const sums: string[] = []

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计' // 第一列显示“合计”字样
      return
    }

    // 对特定字段执行求和
    if (
      [
        'customsDeclarationCount',
        'cifPrice',
        'freightFee',
        'fobPrice',
        'salePrice',
        'taxInclusiveCost',
        'includingTaxPriceTotal',
        'taxRefundsCost',
        'profit',
        'taxRebate',
      ].includes(column.property)
    ) {
      const total = data.reduce((sum, row) => {
        const value = Number(row[column.property])
        return isNaN(value) ? sum : sum + value
      }, 0)
      sums[index] = total.toFixed(2) // 保留两位小数
    } else if (['invoiceTotal', 'componentCount'].includes(column.property)) {
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
/**
 * 下载发票信息
 * @param row
 */
const downloadInvoice = (path: string) => {
  const link = document.createElement('a')
  link.href = path
  link.download = link.href.split('/').pop()!
  // 触发下载
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  queryForm.orderByField = prop
  // queryForm.orderDirection = order === 'ascending' ? 'asc' : 'desc'
  if (!order) {
    if (queryForm.orderDirection === 'asc') {
      column.order = 'descending'
    } else if (queryForm.orderDirection === 'desc') {
      column.order = 'ascending'
    }
  }
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}
// 当 PDF 加载完成时获取宽度
// const onPdfLoaded = (pdf: any) => {
//   console.log(pdf);
// }
// // 当某一页加载完成时触发
// const onPageLoaded = (page: any) => {
//   const viewport = page.getViewport({ scale: 1 }); // 获取页面的视口信息
//   dialogWidth.value = viewport.width; // 设置弹窗宽度为 PDF 页面宽度
// }
// 发票匹配导出
const invoiceMatchExportVisible = ref<boolean>(false)
const invoiceMatchExportForm = reactive<{ time: [string, string] }>({
  time: ['', ''],
})
const invoiceMatchExportFormRef = ref<FormInstance>()

// 行高亮状态管理
const selectedRowIndex = ref<number>(-1)
// const invoiceMatchExportFormRules = reactive<FormRules<{time: [string, string]}>>({
//   time: [{ required: true, message: '请选择发票匹配日期', trigger: 'change' }]
// })
const closeInvoiceMatchExport = () => {
  invoiceMatchExportFormRef.value?.resetFields()
  invoiceMatchExportVisible.value = false
}
// const tabStateStore = useTabStateStore()
const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const total = ref<number>(0)
const list = ref<IGetTaxRefundBatchDetailList[]>([])
const date = ref<[string, string]>(getDefaultStringTime())
const queryForm = reactive<IGetTaxRefundListQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  taxRefundStatus: 0,
  fromDate: date.value[0],
  toDate: date.value[1],
  orderByField: 'shipmentDate',
  orderDirection: 'desc',
  searchFields: 'shipmentId',
})
const queryDateData = () => {
  queryForm.fromDate = date.value[0]
  queryForm.toDate = date.value[1]
  queryData()
}
let copyRow: any

const handleTabClick = (pane: TabsPaneContext) => {
  if (pane.props.name != undefined) {
    const tabValue = Number(pane.props.name)
    queryForm.taxRefundStatus = tabValue
    activeName.value = tabValue
    selectedRowIndex.value = -1 // 重置选中状态
    router.push({
      query: {
        ...route.query,
        tab: tabValue,
        pageNo: '1',
        pageSize: queryForm.pageSize,
      },
    })
    queryData()
  }
}
const closeInvoiceMatching = (value: boolean) => {
  invoiceMatchingVisible.value = value
  queryData()
}
const closeBatchProfitMargin = (value: boolean) => {
  batchProfitMarginVisible.value = value
}
// 埃托姆发票导出
const handleExportATM = async () => {
  exportLoading.value = true
  await downloadFilePD('/taxRefund/invoice/export', {
    fromDate: date.value[0],
    toDate: date.value[1],
  }).then(() => {
    exportLoading.value = false
  })
}
// 发票匹配导出
const handleExportInvoiceMatch = async () => {
  invoiceMatchExportFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await checkTaxRefundInvoiceExport({
        fromDate: invoiceMatchExportForm.time[0],
        toDate: invoiceMatchExportForm.time[1],
      })
      if (data) {
        const response = await downloadFilePD('/taxRefund/match/invoice/export', {
          fromDate: invoiceMatchExportForm.time[0],
          toDate: invoiceMatchExportForm.time[1],
        })
        // console.log(response)
        // if (response.type === 'application/json') {
        //     const text = await response.text(); // 把 blob 转成文本
        //     const json = JSON.parse(text);      // 解析成 JSON 对象
        //     $baseMessage(json?.msg, 'error')
        // }
      }
    }
  })
}
// 删除匹配
const handleDeleteMatch = async (row: IGetTaxRefundBatchDetailList) => {
  $baseConfirm('确定要删除匹配吗？', null, async () => {
    const { data } = await deleteTaxRefundMatch({
      id: row.id!,
      detailId: row.invoiceDetailId!,
    })
    if (data) {
      $baseMessage('删除匹配成功！', 'success')
      queryData()
    }
  })
}
// 云舟催票文件
const ticketReminderVisible = ref<boolean>(false)
type ITicketReminderForm = {
  dateRange: [string, string]
  shipmentDate: [string, string]
  suppliser: string
}
const ticketReminderForm = reactive<ITicketReminderForm>({
  dateRange: ['', ''],
  suppliser: '',
  shipmentDate: ['', ''],
})
const ticketReminderFormRules = reactive<FormRules<ITicketReminderForm>>({
  dateRange: [{ required: true, message: '请选择日期范围', trigger: 'change' }],
  suppliser: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
})
const ticketReminderFormRef = ref<FormInstance>()
const closeTicketReminder = () => {
  ticketReminderFormRef.value?.resetFields()
  ticketReminderVisible.value = false
}
const generateLoading = ref(false)
const handleConfirmTicketReminder = async () => {
  ticketReminderFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      try {
        generateLoading.value = true
        const response = await downloadFilePD('/taxRefund/hasten/invoice', {
          fromDate: ticketReminderForm.dateRange[0],
          toDate: ticketReminderForm.dateRange[1],
          suppliser: ticketReminderForm.suppliser,
          startDate: ticketReminderForm.shipmentDate[0],
          endDate: ticketReminderForm.shipmentDate[1],
        })

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
        generateLoading.value = false
      } catch (error) {
        console.error(error)
        $baseMessage('下载失败，请稍后重试', 'error')
        generateLoading.value = false
      }
    }
  })
}
// pdf 可见
const pdfVisible = ref<boolean>(false)
// 批次利润率可见
const batchProfitMarginVisible = ref<boolean>(false)
// 展示批次利润率
const showBatchProfitMargin = () => {
  batchProfitMarginVisible.value = true
}
// 发票匹配可见
const invoiceMatchingVisible = ref<boolean>(false)
// 展示发票匹配
const showInvoiceMatching = () => {
  invoiceMatchingVisible.value = true
}
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.id
}

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'warning-row'
  }
  return ''
}

const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
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

const headerCell = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (['报关单出口日期'].includes(data.column.label)) {
    return 'header-cell'
  }
  return ''
}
const queryData = () => {
  queryForm.pageNo = 1
  selectedRowIndex.value = -1 // 重置选中状态
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  selectedRowIndex.value = -1 // 重置选中状态
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const headerCellStyle = (): CSSProperties => {
  // if (data.columnIndex !== 0 && data.columnIndex !== 1 && data.columnIndex !== 2 && data.columnIndex !== 3
  //   && data.columnIndex !== 17 && data.columnIndex !== 18 && data.columnIndex !== 19 && data.columnIndex !== 25 && data.columnIndex !== 28) {
  //   return {
  //     color: 'rgb(83, 186, 177)',
  //     textAlign: 'center'
  //   }
  // }
  return {
    textAlign: 'center',
    verticalAlign: 'top',
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (
    label === 'selection' ||
    label === '发货日期' ||
    label === '报关单出口日期' ||
    label === '报关单位' ||
    label === '汇率' ||
    label === 'PO' ||
    label === '发票匹配日期'
  ) {
    return {
      textAlign: 'center',
    }
  }
  // else if (label !== '报关数量' && label !== '报关单位') {
  //   return {
  //     textAlign: 'center',
  //   }
  // }
  return {
    textAlign: 'left',
  }
}
const cellStyle2 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (
    label === 'selection' ||
    label === '发货日期' ||
    label === '报关单出口日期' ||
    label === '报关单位' ||
    label === '汇率' ||
    label === 'PO' ||
    label === '发票匹配日期'
  ) {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  list.value.forEach((item: IGetTaxRefundBatchDetailList) => {
    item.payRecord = []
    if (Array.isArray(item.payRecordList)) {
      item.payRecordList = item.payRecordList
        .map((record: PayRecordList) => {
          const percentage = record.percentage
          const numberPercentage = Number(record.percentage?.slice(0, -1))
          const createTime = record.createTime!.split(' ')[0]
          item.payRecord.push(`${createTime}: ${percentage}(${record.payPrice})`)
          if (numberPercentage < 0) {
            return `
            <span class="create-time">${createTime}</span>:
            <span class="percentage-red">${percentage}</span>
            <span class="pay-price">(${record.payPrice})</span>`
          } else {
            return `
            <span class="create-time">${createTime}</span>:
            <span class="percentage">${percentage}</span>
            <span class="pay-price">(${record.payPrice})</span>`
          }
        })
        .join('<br>')
    }
    // 处理发票匹配记录
    if (Array.isArray(item.matchInvoiceRecord)) {
      item.formattedMatchDate = item.matchInvoiceRecord.map((record) => {
        if (!record.invoiceMatchDate) return ''
        return formatDate(new Date(record.invoiceMatchDate))
      })
      item.formattedInvoiceCode = item.matchInvoiceRecord.map((record) => record.invoiceCode)
      item.formattedInvoiceNumber = item.matchInvoiceRecord.map((record) => ({
        invoiceNumber: record.invoiceNumber,
        invoiceFilePath: record.invoiceFilePath,
        invoiceDetailId: record.invoiceDetailId,
        id: item.id,
      }))
    }
    // console.log(item.payRecord)
  })
  listLoading.value = false
}
onBeforeMount(() => {
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  if (tab) {
    queryForm.taxRefundStatus = Number(tab)
    activeName.value = Number(tab)
  }
  fetchData()
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

        .vab-query-form {
          .left-panel {
            //自加
            margin-bottom: 5px;
          }
          .el-form {
            .el-form-item:first-child {
              margin: 0 10px 0 0 !important;
            }
            .el-form-item:nth-child(2) {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              //自加
              margin: 0 !important;
            }
          }
        }

        .el-checkbox {
          transform: scale(1.3);
          transform-origin: center;
        }
        .el-table {
          flex: 1;

          // .el-table__body .cell {
          //   min-height: 32px;
          //   line-height: 34px;
          // }
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
              .button-delete {
                margin-left: 6px;
              }
            }
          }

          .none {
            display: none;
          }
          // 选中行样式优先级提高
          .warning-row > td {
            background-color: #7bddde !important;
          }

          // 普通行hover时保持白色
          .el-table__body tr:not(.warning-row) {
            &.hover-row > td,
            &:hover > td {
              background-color: #ffffff !important;
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
  .el-dialog .el-checkbox {
    transform: scale(1.3);
    transform-origin: center;
  }
}
.noneHoveTable :deep(.header-cell .cell) {
  display: flex; /* 应用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center;
}
</style>
