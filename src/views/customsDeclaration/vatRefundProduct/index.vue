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
            <el-button :loading="exportLoading" type="primary" @click="handleExportATM">埃托姆开票导出</el-button>
            <el-button type="primary" @click="invoiceMatchExportVisible = true">发票匹配导出</el-button>
            <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0;">
              <el-date-picker 
                v-model="date"
                :clearable="false"
                :editable="false"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                value-format="YYYY-MM-DD"
                @change="queryDateData"
              />
            </span>
            <span style="margin: 0 0 calc(var(--el-margin) / 2) 0;">
              <el-text >该区间剩余可退税金额：<span style=" font-weight: 600;color: rgb(83, 186, 177);">23234.56元</span></el-text>
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="headerCellStyle"
          @cell-click="cellClick"
        >
          <el-table-column fixed="left" type="selection"/>
          <el-table-column label="发货日期" min-width="120" prop="shipmentDate">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" min-width="140" prop="exportDate">
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')"/>
          <el-table-column label="报关品名" min-width="100" prop="customsDeclarationName">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.customsDeclarationName" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.customsDeclarationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.customsDeclarationCount" type="number" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.customsDeclarationCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.customsDeclarationUnit" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span></span>
            </template>
          </el-table-column>
          <el-table-column label="CIF售价$" min-width="120" prop="cifPrice"/>
          <el-table-column label="运费$" min-width="100" prop="freightFee"/>
          <el-table-column label="FOB售价$" min-width="120" prop="fobPrice"/>
          <el-table-column label="汇率" min-width="90" prop="rate"/>
          <el-table-column label="人民币售价￥" min-width="130" prop="salePrice"/>
          <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost"/>
          <el-table-column label="退税后成本￥" min-width="130" prop="taxRefundsCost"/>
          <el-table-column label="利润￥" min-width="100" prop="profit"/>
          <el-table-column label="利润率" min-width="100" prop="profitMargin"/>
          <el-table-column label="退税额￥" min-width="100" prop="taxRebate"/>
          <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')"/>
          <el-table-column label="供应商税号" min-width="130" prop="suppliserTaxNumber"/>
          <el-table-column label="PO" min-width="100" prop="po"/>
          <el-table-column label="发票匹配日期" min-width="130" prop="invoiceMatchDate">
            <template #default="{ row }">
              {{ row.invoiceMatchDate ? formatDate(new Date(row.invoiceMatchDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="发票代码" min-width="100" prop="invoiceCode"/>
          <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')"/>
          <el-table-column label="发票数量" min-width="100" prop="invoiceCount"/>
          <el-table-column label="发票文件" min-width="100" prop="invoiceFilePath">
            <template #default="{ row }">
              <el-button style="min-width: 100%;" @click="showPdf(row)">预览</el-button>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"/>
          <el-table-column label="PO零件数" min-width="100" prop="componentCount"/>
          <el-table-column label="shipmentID" prop="shipmentId" :width="flexColumnWidth(list, 'shipmentID-', 'shipmentId')"/>
          <el-table-column label="付款记录" min-width="230" prop="payRecordList">
            <template #default="{ row }">
              <span v-html="row.payRecordList"></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="{ row }">
              <el-link type="danger" :underline="false" @click="handleDeleteMatch(row)">删除匹配</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"/>
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
                :clearable="false"
                :editable="false"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                value-format="YYYY-MM-DD"
                @change="queryDateData"
              />
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :cell-style="cellStyle2"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="headerCellStyle"
          @cell-click="cellClick"
        >
          <el-table-column fixed="left" type="selection"/>
          <el-table-column label="发货日期" min-width="120" prop="shipmentDate">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" min-width="140" prop="exportDate">
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')"/>
          <el-table-column label="报关品名" min-width="100" prop="customsDeclarationName"/>
          <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount"/>
          <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit"/>
          <el-table-column label="CIF售价$" min-width="120" prop="cifPrice"/>
          <el-table-column label="运费$" min-width="100" prop="freightFee"/>
          <el-table-column label="FOB售价$" min-width="120" prop="fobPrice"/>
          <el-table-column label="汇率" min-width="90" prop="rate"/>
          <el-table-column label="人民币售价￥" min-width="130" prop="salePrice"/>
          <el-table-column label="含税成本￥" min-width="110" prop="taxInclusiveCost"/>
          <el-table-column label="退税后成本￥" min-width="130" prop="taxRefundsCost"/>
          <el-table-column label="利润￥" min-width="100" prop="profit"/>
          <el-table-column label="利润率" min-width="100" prop="profitMargin"/>
          <el-table-column label="退税额￥" min-width="100" prop="taxRebate"/>
          <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')"/>
          <el-table-column label="供应商税号" min-width="130" prop="suppliserTaxNumber"/>
          <el-table-column label="PO" min-width="100" prop="po"/>
          <el-table-column label="发票匹配日期" min-width="130" prop="invoiceMatchDate">
            <template #default="{ row }">
              {{ row.invoiceMatchDate ? formatDate(new Date(row.invoiceMatchDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="发票代码" min-width="100" prop="invoiceCode"/>
          <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')"/>
          <el-table-column label="发票数量" min-width="100" prop="invoiceCount"/>
          <el-table-column label="发票文件" min-width="100" prop="invoiceFilePath">
            <template #default="{ row }">
              <el-button style="min-width: 100%;" @click="showPdf(row)">预览</el-button>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"/>
          <el-table-column label="PO零件数" min-width="100" prop="componentCount"/>
          <el-table-column label="shipmentID" prop="shipmentId" :width="flexColumnWidth(list, 'shipmentID', 'shipmentId')"/>
          <el-table-column label="付款记录" min-width="200" prop="payRecordList">
            <template #default="{ row }">
              <span v-html="row.payRecordList"></span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"/>
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
      v-model="ticketReminderVisible"
      title="生成云舟催票文件"
      width="25%"
      @close="closeTicketReminder"
    >
      <el-form ref="ticketReminderFormRef" label-position="top" :model="ticketReminderForm" :rules="ticketReminderFormRules">
        <el-form-item label="发货日期">
          <el-date-picker 
          
            :clearable="false"
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
            :clearable="false"
            :editable="false"
            end-placeholder="最晚付款日期"
            range-separator="至"
            start-placeholder="最早付款日期"
            type="daterange"
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
        <!-- <vab-alert type="error">
          注意:系统生成催收文件的开票数量是按照PO数量，如果和供应商沟通拆分开票的系统无法识别，需要你手动处理。且当拆分的任何一张发票报关后，发票催收会跳过这个PO。
        </vab-alert> -->
      </el-form>
      <template #footer>
        <el-button @click="closeTicketReminder">取消</el-button>
        <el-button type="primary" @click="handleConfirmTicketReminder">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 发票匹配导出 -->
    <vab-dialog
      v-model="invoiceMatchExportVisible"
      title="发票匹配导出"
      width="20%"
      @close="closeInvoiceMatchExport"
    >
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
    <vab-dialog
      v-model="pdfVisible"
      top="5vh"
      @close="pdfVisible = false"
    >
      <div class="pdf-container" >
        <vab-pdf :source="source" />
      </div>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>

import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { useRoute } from 'vue-router'
import { deleteTaxRefundMatch, getTaxRefundList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { downloadFilePD } from '/@/api/devlocal/download'
import VabPdf from '/@/plugins/VabPdf'
import { useTabStateStore } from '/@/store/modules/tabsState'
import type { IGetTaxRefundBatchDetailList, IGetTaxRefundListQuery, PayRecordList } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'TaxRefundManagement'
})

// const dialogWidth = ref<number>(0)
const source = ref<string>('')
const showPdf = (row: IGetTaxRefundBatchDetailList) => {
  source.value = row.invoiceFilePath!
  pdfVisible.value = true
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
const invoiceMatchExportForm = reactive<{time: [string, string]}>({
  time: ['','']
})
const invoiceMatchExportFormRef = ref<FormInstance>()
// const invoiceMatchExportFormRules = reactive<FormRules<{time: [string, string]}>>({
//   time: [{ required: true, message: '请选择发票匹配日期', trigger: 'change' }]
// })
const closeInvoiceMatchExport = () => {
  invoiceMatchExportFormRef.value?.resetFields()
  invoiceMatchExportVisible.value = false
}
const route = useRoute()
const tabStateStore = useTabStateStore()
const activeName = ref<number>(tabStateStore.getTabState(route.path, 0))
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

const handleTabClick = (pane: TabsPaneContext) => {
  if (pane.props.name != undefined) {
    queryForm.taxRefundStatus = Number(pane.props.name)
    activeName.value = Number(pane.props.name)
    tabStateStore.setTabState(route.path, Number(pane.props.name));
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
    toDate: date.value[1]
  }).then(() => {
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
      queryData()
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
      try {
        const response = await downloadFilePD('/taxRefund/hasten/invoice', {
          fromDate: ticketReminderForm.dateRange[0],
          toDate: ticketReminderForm.dateRange[1],
          suppliser: ticketReminderForm.suppliser
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
      } catch (error) {
        console.error(error)
        $baseMessage("下载失败，请稍后重试", 'error')
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
const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
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
const headerCellStyle = (): CSSProperties => {
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
    if (Array.isArray(item.payRecordList)) {
      item.payRecordList = item.payRecordList.map((record: PayRecordList) => {
        const percentage = parseInt(record.percentage!.replace('%', '')) // 去掉%并转换为整数
        const createTime = record.createTime!.split(' ')[0]
        if (percentage < 0) {
          return `
            <span class="create-time">${createTime}</span>: 
            <span class="percentage-red">${percentage * 100}%</span>
            <span class="pay-price">(${record.payPrice})</span>`
        } else {
          return `
            <span class="create-time">${createTime}</span>: 
            <span class="percentage">${percentage * 100}%</span>
            <span class="pay-price">(${record.payPrice})</span>`
        }
      })
      .join('<br>')
    }
   
  })
  listLoading.value = false
}
onBeforeMount(() => {
  queryForm.taxRefundStatus = activeName.value
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