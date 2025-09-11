<template>
  <div>
    <vab-dialog v-model="visible" title="本月销毁货值详情" top="7vh" width="70%">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model="queryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="handleSearch"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="handleSearch" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        :data="currentPageData"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="70vh"
        stripe
      >
        <el-table-column label="库存动作日期" min-width="130" prop="streamDate" />
        <el-table-column label="SKU" prop="msku" :width="flexColumnWidth(currentPageData, 'sku', 'msku')" />
        <el-table-column label="ASIN" min-width="120" prop="asin" />
        <el-table-column label="站点" min-width="130" prop="siteName" />
        <el-table-column label="库存属性" prop="dispositionType" />
        <el-table-column label="出入库类型名称" min-width="130" prop="businessTypeDesc" />
        <el-table-column label="变动采购成本" prop="changePurchaseAmount" />
        <el-table-column label="变动头程成本" prop="changeLogisticsAmount" />
        <el-table-column label="变动其他成本" prop="changeOtherAmount" />
        <el-table-column label="变动总金额" prop="totalAmount" />
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DestroyValueDetailTable',
})

import { Search } from '@element-plus/icons-vue'
import type { IGetFrontPageDestroyValueDetailItem } from '/@/type/index/frontPage'
import { flexColumnWidth } from '/@/utils/tableColum'

const props = defineProps<{
  list: IGetFrontPageDestroyValueDetailItem[]
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const listLoading = ref<boolean>(false)
// 前端分页和搜索
const list = ref<any>([])
const total = ref<number>(0)
const filteredList = ref<any>([])
const currentPageData = ref<any>([])

// 搜索功能
const handleSearch = () => {
  if (!queryForm.keyWord.trim()) {
    filteredList.value = [...props.list]
  } else {
    filteredList.value = props.list.filter(
      (item: any) =>
        item.msku?.toLowerCase().includes(queryForm.keyWord.toLowerCase()) ||
        item.asin?.toString().includes(queryForm.keyWord) ||
        item.siteName?.toString().includes(queryForm.keyWord)
    )
  }
  total.value = filteredList.value.length
  updateCurrentPageData()
}

// 更新当前页数据
const updateCurrentPageData = () => {
  const start = (queryForm.pageNo - 1) * queryForm.pageSize
  const end = start + queryForm.pageSize
  currentPageData.value = filteredList.value.slice(start, end)
}

// 分页处理
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  updateCurrentPageData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  updateCurrentPageData()
}

// 监听数据变化
watch(
  () => props.list,
  () => {
    handleSearch()
  },
  { immediate: true, deep: true }
)
</script>
