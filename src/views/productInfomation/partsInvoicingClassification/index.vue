<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-select v-model="typeId" clearable filterable placeholder="请选择或搜索分类名" style="min-width: 300px">
              <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 0">
            <el-button style="margin: 0 0 0 0 !important" type="success" @click="handleApply">应用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showDialog">分类编码设定</el-button>
          </el-form-item>
        </el-form>
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
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column label="已有零件id" prop="componentId" width="110" />
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <el-image
            :src="row.componentImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="showImagePreview(row.componentImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件名" prop="componentName" />
      <el-table-column label="属于SKU" prop="sku" />
      <el-table-column label="开票/报关品名" prop="customsDeclarationNameZh" />
      <el-table-column label="申报要素" prop="declarationElementsAbbreviation" />
      <el-table-column label="分类" prop="type" />
      <el-table-column label="税收分类编码" prop="taxationEncoding" />
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
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="closeImageViewer" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getComponentInvoiceTypeList, getComponentTypeList, updateBatchComponentType } from '/@/api/devlocal/productInformation'
defineOptions({
  name: 'PartsInvoicingClassification',
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const closeImageViewer = () => {
  imagePreviewVisible.value = false
}
const typeId = ref<number | undefined>(undefined)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const selectionList = ref<any[]>([])
const handleSelectionChange = (val: any) => {
  selectionList.value = val
}
const handleApply = async () => {
  if (selectionList.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  if (typeId.value == undefined) {
    $baseMessage('请选择分类名！', 'warning')
    return
  }
  // console.log(selectionList.value)
  const { data } = await updateBatchComponentType({
    ids: selectionList.value.map((item) => item.id).join(','),
    typeEncodingId: typeId.value,
  })
  if (data) {
    $baseMessage('修改分类成功！', 'success')
    queryData()
  }
}
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
  listLoading.value = true
  const { data } = await getComponentInvoiceTypeList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
// 获取分类名列表
const typeList = ref<any>([])
const fetchTypeList = async () => {
  const { data } = await getComponentTypeList()
  typeList.value = data
}
onBeforeMount(() => {
  fetchData()
  fetchTypeList()
})
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
:deep(.el-checkbox) {
  transform: scale(1.3);
}
</style>
