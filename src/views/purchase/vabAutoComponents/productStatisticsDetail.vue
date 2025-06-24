<template>
  <vab-dialog v-model="visible" title="产品明细" top="10vh"> 
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form :model="queryForm" inline @submit.prevent >
          <el-form-item>
            <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="listLoading" :icon="Search" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="listLoading" :data="list" border stripe max-height="60vh" >
      <el-table-column label="零件图片" prop="componentImgUrl" width="91">
        <template #default="{ row }">
          <el-image :src="row.componentImgUrl" style="width: 65px; height: 65px; display: block" @click="showImagePreview(row.componentImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件ID" prop="id" min-width="90" />
      <el-table-column label="零件名" prop="componentName" :min-width="flexColumnWidth(list, '零件名', 'componentName')" />
      <el-table-column label="采购总额(￥)" prop="totalPurchaseAmount" min-width="120" />
      <el-table-column label="采购总数" prop="purchaseCount" min-width="100" />
      <el-table-column label="单位" prop="unit" min-width="70" />
      <el-table-column label="SKU" prop="sku" :min-width="calculateBrColumnWidth(list, (row: any) => row._sku, 90)" >
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._skuFull }}</div>
            </template>
            <span v-html="row._sku"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品经理" prop="productManagerName" min-width="100" >
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_productManagerName" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._productManagerNameFull }}</div>
            </template>
            <span v-html="row._productManagerName"></span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getPurchaseStatisticsProductDetailList } from '/@/api/devlocal/purchaseStatistics'
import { calculateBrColumnWidth, flexColumnWidth, processField } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductStatisticsDetail'
})

const props = defineProps<{
  modelValue: boolean
  id: number
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

watch(() => props.modelValue, (val) => {
  if (val) {
    fetchData()
  }
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const list = ref<any[]>([])
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  queryForm.id = props.id
  const { data } = await getPurchaseStatisticsProductDetailList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    processField(item, 'sku', 3)
    processField(item, 'productManagerName', 3)
  })
  listLoading.value = false
}
</script>