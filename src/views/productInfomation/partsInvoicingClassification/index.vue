<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-select clearable filterable placeholder="请选择或搜索分类名" style="min-width: 300px">
              <!-- <el-option label="All" value="All" /> -->
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 0">
            <el-button style="margin: 0 0 0 0 !important" type="success">应用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showDialog">分类编码设定</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :cell-class-name="clearPadding" class="noneHoverTable" :data="list" :header-cell-style="{ textAlign: 'center' }" >
      <el-table-column type="selection" />
      <el-table-column label="图片" width="75" />
      <el-table-column label="零件名" />
      <el-table-column label="属于SKU" />
      <el-table-column label="开票/报关品名" />
      <el-table-column label="申报要素" />
      <el-table-column label="分类" />
      <el-table-column label="税收分类编码" />
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
    <vab-classification-code-settings v-model="dialogVisible" />

  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
defineOptions({
  name: 'PartsInvoicingClassification'
})

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

const showDialog = () => {
  dialogVisible.value = true
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
const fetchData = async () => {
  //
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const clearPadding = (data: {row: any, column: any, rowIndex: number, columnIndex: number}) => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
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