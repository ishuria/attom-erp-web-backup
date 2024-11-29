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
      @cell-click="cellClick"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货日期" prop="" min-width="115"></el-table-column>
      <el-table-column label="报关单出口日期" prop="" min-width="120">
        <template #default="{ row }">
          <el-date-picker
            type="date"
            style="width: 100%;"
            v-model="row.date"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="合同编号" prop="" min-width="200"></el-table-column>
      <el-table-column label="未到发票" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票总数" prop="" min-width="100"></el-table-column>
      <el-table-column label="退税完成" prop="" min-width="100">
        <el-checkbox :true-value="1" :false-value="0"></el-checkbox>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="300">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remark }}</div>
            </template>
            <span>{{ row.remark }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160">
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
      <el-form ref="invoiceCollectionFormRef" :model="invoiceCollectionForm" :rules="invoiceCollectionFormRules" label-position="top" style="margin-left: 10px; margin-right: 10px;">
        <el-form-item label="归档路径" prop="path">
          <el-input v-model="invoiceCollectionForm.path" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeInvoiceCollection">取消</el-button>
        <el-button type="primary" @click="confirmInvoiceCollection">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 修改备注 -->
    <vab-dialog
      title="备注"
      width="25%"
      v-model="updateRemarkVisible"
    >
      <el-input type="textarea" v-model="remark" :rows="20" />
      <template #footer>
        <el-button @click="updateRemarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TaxRefundBatch'
})
import { FormInstance } from 'element-plus'
import { CSSProperties } from 'vue'

// 修改备注可见
const updateRemarkVisible = ref<boolean>(false)
// 备注
const remark = ref<string>('')
// 展示备注
const showUpdateRemark = () => {
  updateRemarkVisible.value = true
}
// 确认修改备注
const confirmUpdateRemark = () => {
  updateRemarkVisible.value = false
}
// 点击备注单元格
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.property === 'remark') {
    showUpdateRemark()
  }
}
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
const invoiceCollectionForm = reactive<any>({
  path: ''
})
const invoiceCollectionFormRef = ref<FormInstance>()
const invoiceCollectionFormRules = reactive<any>({
  path: [{ required: 'true', message: '请输入归档路径', trigger: 'blur' }]
})
const showInvoiceCollection = (row: any) => {
  invoiceCollectionVisible.value = true
}
const closeInvoiceCollection = (row: any) => {
  invoiceCollectionVisible.value = false
  invoiceCollectionFormRef.value?.resetFields()
}
const confirmInvoiceCollection = () => {
  invoiceCollectionFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      
    }
  })
}
const fakeData = [
  {
    remark: '修改备注'
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
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>
