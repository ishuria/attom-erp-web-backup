<template>
  <div>
    <vab-dialog v-model="visible" title="价格变更日志" width="45%">
      <el-form inline @submit.prevent>
        <el-form-item>
          <el-input
            v-model.trim="queryForm.keyWord"
            clearable
            placeholder="请输入关键词搜索"
            @input="handleSearch"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        :data="list"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="700"
        stripe
      >
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')" />
        <el-table-column label="站点" prop="siteName" />
        <el-table-column label="价格类型" prop="priceType" width="100">
          <template #default="{ row }">
            <el-tag :type="priceTagType(row.priceType)">
              {{ priceTypeLabel(row.priceType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="变更前价格" prop="beforePrice" width="130" />
        <el-table-column label="变更后价格" prop="afterPrice" width="130" />
        <el-table-column label="操作人" prop="operatorName" width="100" />
        <el-table-column label="创建时间" min-width="160" prop="createTime" />
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
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

<script lang="ts" setup>
import { flexColumnWidth } from '~/src/utils/tableColum'
import { queryOperationStockPriceCalcLogList } from '/@/api/devlocal/operationAutoMation'
import { IOperationStockPriceCalcLog } from '/@/type/storeOperation/operationStock.ts'

defineOptions({
  name: 'VabDialogOperationStockPriceCalcLog',
})

const visible = defineModel<boolean>('visible', { required: true })

watch(
  () => visible.value,
  (val) => {
    if (val) fetchData()
  }
)

const list = ref<IOperationStockPriceCalcLog[]>([])
const total = ref<number>(0)
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const priceTypeLabel = (type: number) => {
  const map: Record<number, string> = { 0: '最优价', 1: '最低价', 2: '最高价' }
  return map[type] ?? '未知'
}

const priceTagType = (type: number): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = { 0: '', 1: 'success', 2: 'warning' }
  return map[type] ?? 'info'
}

const handleSearch = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const fetchData = async () => {
  const res = await queryOperationStockPriceCalcLogList({
    keyWord: queryForm.keyWord || undefined,
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
  })
  list.value = res?.data?.list ?? []
  total.value = res?.data?.total ?? 0
}
</script>
