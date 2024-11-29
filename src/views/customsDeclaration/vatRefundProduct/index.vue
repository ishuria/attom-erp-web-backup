<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>云舟退税管理</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="20">
        <el-button type="primary" @click="showInvoiceMatching">发票匹配</el-button>
        <el-button type="primary">批次利润率</el-button>
        <el-button type="primary">出口发票生成（云舟）</el-button>
        <el-button type="primary">出口发票生成（埃托姆）</el-button>
        <el-button type="primary">云舟开票导出</el-button>
        <el-button type="primary">埃托姆开票导出</el-button>
        <span style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0;">
          <el-date-picker 
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </span>
        <span style="margin: 0 10px calc(var(--el-margin) / 2) 0;">
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
      :data="fakeData"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货日期" prop="" min-width="120"></el-table-column>
      <el-table-column label="报关单出口日期" prop="" min-width="140">

      </el-table-column>
      <el-table-column label="合同编号" prop="" min-width="100"></el-table-column>
      <el-table-column label="报关品名" prop="name" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.name" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关数量" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="报关单位" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="CIF售价$" prop="" min-width="120">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="运费$" prop="" min-width="100"></el-table-column>
      <el-table-column label="FOB售价$" prop="" min-width="120"></el-table-column>
      <el-table-column label="汇率" prop="" min-width="90"></el-table-column>
      <el-table-column label="人民币售价￥" prop="" min-width="130">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="含税成本￥" prop="" min-width="110"></el-table-column>
      <el-table-column label="退税后成本￥" prop="" min-width="130"></el-table-column>
      <el-table-column label="利润￥" prop="" min-width="100"></el-table-column>
      <el-table-column label="利润率" prop="" min-width="100"></el-table-column>
      <el-table-column label="退税额￥" prop="" min-width="100"></el-table-column>
      <el-table-column label="供应商" prop="" min-width="100"></el-table-column>
      <el-table-column label="供应商税号" prop="" min-width="130"></el-table-column>
      <el-table-column label="PO" prop="" min-width="90"></el-table-column>
      <el-table-column label="发票匹配日期" prop="" min-width="130"></el-table-column>
      <el-table-column label="发票代码" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票号码" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票数量" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票文件" prop="" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="" min-width="100"></el-table-column>
      <el-table-column label="PO零件数" prop="" min-width="100"></el-table-column>
      <el-table-column label="shipmentID" prop="" min-width="130"></el-table-column>
      <el-table-column label="付款记录" prop="" min-width="160"></el-table-column>
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
    <!-- <vab-invoice-matching 
      :invoice-matching-visible="invoiceMatchingVisible"
    /> -->
  </div>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'TaxRefundManagement'
})

import { Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const list = ref<any>([])
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
let copyRow: any
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
const fakeData = [
  {
    name: '品名1'
  }
]
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 0 && data.columnIndex !== 1 && data.columnIndex !== 2 && data.columnIndex !== 3
    && data.columnIndex !== 17 && data.columnIndex !== 18 && data.columnIndex !== 19 && data.columnIndex !== 25 && data.columnIndex !== 28) {
    return {
      color: 'rgb(83, 186, 177)',
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3 || data.columnIndex === 28) {
    return {
      cursor: 'not-allowed',
      textAlign: 'left'
    }
  }
  if (data.columnIndex !== 4 && data.columnIndex !== 5 && data.columnIndex !== 6 && data.columnIndex !== 7 && data.columnIndex !== 11) {
    return {
      cursor: 'not-allowed',
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
.none {
  display: none;
}
.el-table :deep(.cell) {
  min-width: 32px;
}
</style>
