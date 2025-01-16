<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待退税" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="20">
            <el-button type="primary" @click="showInvoiceMatching">发票匹配</el-button>
            <el-button type="primary" @click="showBatchProfitMargin">批次利润率</el-button>
            <el-button type="primary" @click="ticketReminderVisible = true">云舟催票文件</el-button>
            <el-button type="primary">云舟开票导出</el-button>
            <el-button type="primary" :loading="exportLoading" @click="handleExportATM">埃托姆开票导出</el-button>
            <el-button type="primary" @click="invoiceMatchExportVisible = true">发票匹配导出</el-button>
            <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0;">
              <el-date-picker 
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @change="queryDateData"
                :clearable="false"
                :editable="false"
              >
              </el-date-picker>
            </span>
            <span style="margin: 0 0 calc(var(--el-margin) / 2) 0;">
              <el-text >该区间剩余可退税金额：<span style="color: rgb(83, 186, 177); font-weight: 600;">23234.56元</span></el-text>
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter.native="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" native-type="submit" :loading="listLoading" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          @cell-click="cellClick"
          class="noneHoveTable"
          :data="list"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="发货日期" prop="shipmentDate" min-width="120">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" prop="exportDate" min-width="140">
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')"></el-table-column>
          <el-table-column label="报关品名" prop="customsDeclarationName" min-width="100">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.customsDeclarationName" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.customsDeclarationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报关数量" prop="customsDeclarationCount" min-width="100">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.customsDeclarationCount" type="number" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.customsDeclarationCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报关单位" prop="customsDeclarationUnit" min-width="100">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.customsDeclarationUnit" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span></span>
            </template>
          </el-table-column>
          <el-table-column label="CIF售价$" prop="cifPrice" min-width="120"></el-table-column>
          <el-table-column label="运费$" prop="freightFee" min-width="100"></el-table-column>
          <el-table-column label="FOB售价$" prop="fobPrice" min-width="120"></el-table-column>
          <el-table-column label="汇率" prop="rate" min-width="90"></el-table-column>
          <el-table-column label="人民币售价￥" prop="salePrice" min-width="130"></el-table-column>
          <el-table-column label="含税成本￥" prop="taxInclusiveCost" min-width="110"></el-table-column>
          <el-table-column label="退税后成本￥" prop="taxRefundsCost" min-width="130"></el-table-column>
          <el-table-column label="利润￥" prop="profit" min-width="100"></el-table-column>
          <el-table-column label="利润率" prop="profitMargin" min-width="100"></el-table-column>
          <el-table-column label="退税额￥" prop="taxRebate" min-width="100"></el-table-column>
          <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')"></el-table-column>
          <el-table-column label="供应商税号" prop="suppliserTaxNumber" min-width="130"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="发票匹配日期" prop="invoiceMatchDate" min-width="130">
            <template #default="{ row }">
              {{ row.invoiceMatchDate ? formatDate(new Date(row.invoiceMatchDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="发票代码" prop="invoiceCode" min-width="100"></el-table-column>
          <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')"></el-table-column>
          <el-table-column label="发票数量" prop="invoiceCount" min-width="100"></el-table-column>
          <el-table-column label="发票文件" prop="invoiceFilePath" min-width="100">
            <template #default="{ row }">
              <el-button style="min-width: 100%;" @click="showPdf(row)">预览</el-button>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="PO零件数" prop="componentCount" min-width="100"></el-table-column>
          <el-table-column label="shipmentID" prop="shipmentId" :width="flexColumnWidth(list, 'shipmentID', 'shipmentId')"></el-table-column>
          <el-table-column label="付款记录" prop="payRecordList" min-width="200">
            <template #default="{ row }">
              <span v-html="row.payRecordList"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-link :underline="false" type="danger" @click="handleDeleteMatch(row)">删除匹配</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
          <vab-query-form-left-panel :span="20">
            <el-button type="primary" @click="showBatchProfitMargin">批次利润率</el-button>
            <el-button type="primary">云舟开票导出</el-button>
            <el-button type="primary">埃托姆开票导出</el-button>
            <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0;">
              <el-date-picker 
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @change="queryDateData"
                :clearable="false"
                :editable="false"
              >
              </el-date-picker>
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter.native="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" native-type="submit" :loading="listLoading" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle2"
          @cell-click="cellClick"
          class="noneHoveTable"
          :data="list"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="发货日期" prop="shipmentDate" min-width="120">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" prop="exportDate" min-width="140">
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')"></el-table-column>
          <el-table-column label="报关品名" prop="customsDeclarationName" min-width="100"></el-table-column>
          <el-table-column label="报关数量" prop="customsDeclarationCount" min-width="100"></el-table-column>
          <el-table-column label="报关单位" prop="customsDeclarationUnit" min-width="100"></el-table-column>
          <el-table-column label="CIF售价$" prop="cifPrice" min-width="120"></el-table-column>
          <el-table-column label="运费$" prop="freightFee" min-width="100"></el-table-column>
          <el-table-column label="FOB售价$" prop="fobPrice" min-width="120"></el-table-column>
          <el-table-column label="汇率" prop="rate" min-width="90"></el-table-column>
          <el-table-column label="人民币售价￥" prop="salePrice" min-width="130"></el-table-column>
          <el-table-column label="含税成本￥" prop="taxInclusiveCost" min-width="110"></el-table-column>
          <el-table-column label="退税后成本￥" prop="taxRefundsCost" min-width="130"></el-table-column>
          <el-table-column label="利润￥" prop="profit" min-width="100"></el-table-column>
          <el-table-column label="利润率" prop="profitMargin" min-width="100"></el-table-column>
          <el-table-column label="退税额￥" prop="taxRebate" min-width="100"></el-table-column>
          <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')"></el-table-column>
          <el-table-column label="供应商税号" prop="suppliserTaxNumber" min-width="130"></el-table-column>
          <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="发票匹配日期" prop="invoiceMatchDate" min-width="130">
            <template #default="{ row }">
              {{ row.invoiceMatchDate ? formatDate(new Date(row.invoiceMatchDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="发票代码" prop="invoiceCode" min-width="100"></el-table-column>
          <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')"></el-table-column>
          <el-table-column label="发票数量" prop="invoiceCount" min-width="100"></el-table-column>
          <el-table-column label="发票文件" prop="invoiceFilePath" min-width="100">
            <template #default="{ row }">
              <el-button style="min-width: 100%;" @click="showPdf(row)">预览</el-button>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="PO零件数" prop="componentCount" min-width="100"></el-table-column>
          <el-table-column label="shipmentID" prop="shipmentId" :width="flexColumnWidth(list, 'shipmentID', 'shipmentId')"></el-table-column>
          <el-table-column label="付款记录" prop="payRecordList" min-width="200">
            <template #default="{ row }">
              <span v-html="row.payRecordList"></span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
    <vab-invoice-matching 
      :invoice-matching-visible="invoiceMatchingVisible"
      @update-invoice-matching-visible="closeInvoiceMatching"
    />
    <!-- 批次利润率 -->
    <vab-batch-profit-margin 
      :batch-profit-margin-visible="batchProfitMarginVisible"
      @update-batch-profit-margin-visible="closeBatchProfitMargin"
    />
    <!-- 云舟催票文件 -->
    <vab-dialog
      title="生成云舟催票文件"
      v-model="ticketReminderVisible"
      width="25%"
      @close="closeTicketReminder"
    >
      <el-form ref="ticketReminderFormRef" :model="ticketReminderForm" :rules="ticketReminderFormRules" label-position="top">
        <el-form-item label="付款日期" prop="">
          <el-date-picker 
            v-model="ticketReminderForm.dateRange"
            type="daterange"
            start-placeholder="最早付款日期"
            end-placeholder="最晚付款日期"
            range-separator="至"
            :editable="false"
            :clearable="false"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="供应商" prop="">
          <el-input v-model="ticketReminderForm.suppliser" clearable />
        </el-form-item>
        <!-- <el-form-item label="仅已报关" prop="">
          <el-checkbox :true-value="1" :false-value="0" ></el-checkbox>
        </el-form-item>
        <el-form-item label="采购方" prop="">
          <el-select ></el-select>
        </el-form-item> -->
        <vab-alert type="error">
          注意:系统生成催收文件的开票数量是按照PO数量，如果和供应商沟通拆分开票的系统无法识别，需要你手动处理。且当拆分的任何一张发票报关后，发票催收会跳过这个PO。
        </vab-alert>
      </el-form>
      <template #footer>
        <el-button @click="closeTicketReminder">取消</el-button>
        <el-button type="primary" @click="handleConfirmTicketReminder">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 发票匹配导出 -->
    <vab-dialog
      title="发票匹配导出"
      v-model="invoiceMatchExportVisible"
      @close="closeInvoiceMatchExport"
      width="20%"
    >
      <el-form ref="invoiceMatchExportFormRef" :model="invoiceMatchExportForm" label-position="top">
        <el-form-item>
          <el-date-picker
            v-model="invoiceMatchExportForm.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            :editable="false"
            :clearable="false"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleExportInvoiceMatch">导出</el-button>
      </template>
    </vab-dialog>
    <!-- 预览pdf -->
    <vab-dialog
      v-model="pdfVisible"
      @close="pdfVisible = false"
      top="5vh"
    >
      <div class="pdf-container" >
        <vab-pdf :source="source" @loaded="" @page-loaded="" />
      </div>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'TaxRefundManagement'
})

import { Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import VabPdf from '/@/plugins/VabPdf'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'
import { deleteTaxRefundMatch, getTaxRefundList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetTaxRefundBatchDetailList, IGetTaxRefundListQuery, PayRecordList } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { flexColumnWidth } from '/@/utils/tableColum'
import { downloadFilePD } from '/@/api/devlocal/download'

const dialogWidth = ref<number>(0)
const source = ref<string>('')
const showPdf = (row: IGetTaxRefundBatchDetailList) => {
  source.value = row.invoiceFilePath!
  pdfVisible.value = true
}
// 当 PDF 加载完成时获取宽度
const onPdfLoaded = (pdf: any) => {
  console.log(pdf);
}
// 当某一页加载完成时触发
const onPageLoaded = (page: any) => {
  const viewport = page.getViewport({ scale: 1 }); // 获取页面的视口信息
  dialogWidth.value = viewport.width; // 设置弹窗宽度为 PDF 页面宽度
}
// 发票匹配导出
const invoiceMatchExportVisible = ref<boolean>(false)
const invoiceMatchExportForm = reactive<{time: [string, string]}>({
  time: ['','']
})
const invoiceMatchExportFormRef = ref<FormInstance>()
const invoiceMatchExportFormRules = reactive<FormRules<{time: [string, string]}>>({
  time: [{ required: true, message: '请选择发票匹配日期', trigger: 'change' }]
})
const closeInvoiceMatchExport = () => {
  invoiceMatchExportFormRef.value?.resetFields()
  invoiceMatchExportVisible.value = false
}
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
})
const queryDateData = () => {
  queryForm.fromDate = date.value[0]
  queryForm.toDate = date.value[1]
  queryData()
}
let copyRow: any

const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
  if (pane.props.name != undefined) {
    queryForm.taxRefundStatus = Number(pane.props.name)
    activeName.value = Number(pane.props.name)
    queryData()
  }
}
const closeInvoiceMatching = (value: boolean) => {
  invoiceMatchingVisible.value = value
}
const closeBatchProfitMargin = (value: boolean) => {
  batchProfitMarginVisible.value = value
}
// 埃托姆发票导出
const handleExportATM = async () => {
  exportLoading.value = true
  await downloadFilePD('/taxRefund/invoice/export', {
    fromDate: date.value[0],
    toDate: date.value[1]
  }).then((res) => {
    exportLoading.value = false
  })
}
// 发票匹配导出
const handleExportInvoiceMatch = async () => {
  invoiceMatchExportFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await downloadFilePD('/taxRefund/match/invoice/export', {
        fromDate: invoiceMatchExportForm.time[0],
        toDate: invoiceMatchExportForm.time[1]
      })
      console.log(data)
      
      // if (data.code === 5001) {
      //   $baseMessage(data.msg, 'error')
      // } else {
      //   invoiceMatchExportVisible.value = false
      // }
    }
  })
}
// 删除匹配
const handleDeleteMatch = async (row: IGetTaxRefundBatchDetailList) => {
  $baseConfirm('确定要删除匹配吗？', null, async () => {
    const { data } = await deleteTaxRefundMatch({
      id: row.id!,
      detailId: row.invoiceDetailId!
    })
    if (data) {
      $baseMessage('删除匹配成功！', 'success')
    }
  })
}
// 云舟催票文件
const ticketReminderVisible = ref<boolean>(false)
type ITicketReminderForm = {
  dateRange: [string, string]
  suppliser: string
}
const ticketReminderForm = reactive<ITicketReminderForm>({
  dateRange: ['',''],
  suppliser: ''
})
const ticketReminderFormRules = reactive<FormRules<ITicketReminderForm>>({
  dateRange: [{ required: true, message: '请选择日期范围', trigger: 'change' }],
  suppliser: [{ required: true, message: '请输入供应商', trigger: 'blur' }]
})
const ticketReminderFormRef = ref<FormInstance>()
const closeTicketReminder = () => {
  ticketReminderFormRef.value?.resetFields()
  ticketReminderVisible.value = false
}
const handleConfirmTicketReminder = async () => {
  ticketReminderFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      await downloadFilePD('/taxRefund/hasten/invoice', {
        fromDate: ticketReminderForm.dateRange[0],
        toDate: ticketReminderForm.dateRange[1],
        suppliser: ticketReminderForm.suppliser
      }).then((value: any) => {
      
          $baseMessage(value.msg, 'error')
        
      }).catch((err) => {
        console.log(err);
      })
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
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  copyRow = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }

}
const clickCancel = (event: Event, value: any) => {
  const rootElement = getRootElement(event?.target, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
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
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  // if (data.columnIndex !== 0 && data.columnIndex !== 1 && data.columnIndex !== 2 && data.columnIndex !== 3
  //   && data.columnIndex !== 17 && data.columnIndex !== 18 && data.columnIndex !== 19 && data.columnIndex !== 25 && data.columnIndex !== 28) {
  //   return {
  //     color: 'rgb(83, 186, 177)',
  //     textAlign: 'center'
  //   }
  // }
  return {
    textAlign: 'center'
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3 || data.columnIndex === 25 || data.columnIndex === 27 || data.columnIndex === 28) {
    return {
      cursor: 'not-allowed',
      textAlign: 'left'
    }
  }
  if (data.columnIndex === 17) {
    return {
      cursor: 'not-allowed',
      textAlign: 'left'
    }
  }
  if (data.columnIndex !== 4 && data.columnIndex !== 5 && data.columnIndex !== 6) {
    return {
      cursor: 'not-allowed',
      textAlign: 'center'
    }
  }
  
  return {
    textAlign: 'center'
  }
}
const cellStyle2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3 || data.columnIndex === 17 || data.columnIndex === 25 || data.columnIndex === 27 || data.columnIndex === 28) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  list.value.forEach((item: IGetTaxRefundBatchDetailList) => {
    if (item.payRecordList instanceof Array) {
      item.payRecordList = item.payRecordList.map((record: PayRecordList) => {
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
onBeforeMount(() => {
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
          .left-panel { //自加
            margin-bottom: 5px;
          }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child { //自加
              margin: 0 !important;
            }
          }
        }
        .noneHoveTable .el-checkbox {
          transform: scale(1.3);
          transform-origin: center;
        }
        .el-table {
          flex: 1;

          .el-table__body .cell {
            min-height: 32px;
            line-height: 34px;
          }
          .none {
            display: none;
          }
        }
        .create-time {
          color: #4E88F3;
        }
        .percentage {
          color: #24ADA1;
        }
        .pay-price {
          color: #8D5FCC;
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
</style>