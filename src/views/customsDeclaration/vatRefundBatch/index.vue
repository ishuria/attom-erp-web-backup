<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>云舟退税批次</h2>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
      class="noneHoveTable"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货日期"></el-table-column>
      <el-table-column label="报关单出口日期">
        <template #default="{ row }">
          <el-date-picker
           type="date"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="合同编号"></el-table-column>
      <el-table-column label="未到发票"></el-table-column>
      <el-table-column label="发票总数"></el-table-column>
      <el-table-column label="退税完成">
        <el-checkbox :true-value="1" :false-value="0"></el-checkbox>
      </el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showDetail(row)">明细</el-link>
          <el-link type="primary" :underline="false" @click="showInvoiceCollection(row)">发票归集</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
    <!-- 明细 -->
    <VabDetailDialog
      :detail-visible="detailVisible"
      @update-detail-visible="closeDetail"
    />
    <!-- 发票归集 -->
    <vab-dialog
      title="发票归集"
      width="20%"
      v-model="invoiceCollectionVisible"
      @close="closeInvoiceCollection"
    >
      <el-form label-position="top" style="margin-left: 10px; margin-right: 10px;">
        <el-form-item label="归档路径">
          <el-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeInvoiceCollection">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>

  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TaxRefundBatch'
})
import { CSSProperties } from 'vue'

// 明细显示
const detailVisible = ref<boolean>(false)
const showDetail = (row: any) => {
  detailVisible.value = true
}
const closeDetail = (value: boolean) => {
  detailVisible.value = value
}
// 发票归集显示
const invoiceCollectionVisible = ref<boolean>(false)
const showInvoiceCollection = (row: any) => {
  invoiceCollectionVisible.value = true
}
const closeInvoiceCollection = (row: any) => {
  invoiceCollectionVisible.value = false
}
const fakeData = [
  {
    remark: '123'
  }
]
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>

<style lang="scss" scoped>
:deep(.noneHoveTable .el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
</style>
