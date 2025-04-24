<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      border 
      :cell-class-name="clearPadding" 
      :data="fakeData" 
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column align="center" label="质检日期" prop="date" />
      <el-table-column align="center" label="PO" prop="po" />
      <el-table-column label="SKU图片" prop="" width="75">
        <template #header>
          SKU<br />图片
        </template>
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" @click="showImagePreview(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" >
        <template #default="{ row }">
          {{ row.sku }}<br />
          {{ row.productName }}-{{ row.variantName }}-{{ row.productDesc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="质检类型" prop="type" >
        <template #default="{ row }">
          {{ row.type === 0 ? '新品质检' : '打包质检' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="质检结论" prop="status" >
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '通过' : '不通过' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="" >
        <template #default="{ row }">
          <el-button text type="primary" @click="handleViewReport(row)">查看报告</el-button>
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
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="closeImagePreview" />
    
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'QualityInspectionHistory'
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const closeImagePreview = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const fakeData = [{ po: 'PO111111', status: 1 }, { po: 'PO111111', status: 0 }]
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)

const handleViewReport = (row: any) => {
  //
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === 'SKU图片') {
    return 'clear-padding'
  } 
  return ''
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
const fetchData = () => {
  //
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
</script>

<style lang="scss" scoped>
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>