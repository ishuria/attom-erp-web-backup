<template>
  <vab-dialog
    title="批次利润率"
    width="80%"
    v-model="dflag"
  >
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 22em; margin: 0 10px calc(var(--el-margin) / 2) 0;"
        >
        </el-date-picker>
      </vab-query-form-top-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent >
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter.native="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" native-type="submit" :loading="listLoading" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-style="cellStyle"
    >
      <el-table-column label="出库日期" prop="" min-width=""></el-table-column>
      <el-table-column label="合同编号" prop="" min-width=""></el-table-column>
      <el-table-column label="Shipment ID" prop="" min-width=""></el-table-column>
      <el-table-column label="总CIF售价$" prop="" min-width=""></el-table-column>
      <el-table-column label="运费$" prop="" min-width=""></el-table-column>
      <el-table-column label="汇率" prop="" min-width=""></el-table-column>
      <el-table-column label="总人民币售价" prop="" min-width=""></el-table-column>
      <el-table-column label="总成本￥" prop="" min-width=""></el-table-column>
      <el-table-column label="总利润￥" prop="" min-width=""></el-table-column>
      <el-table-column label="利润率" prop="" min-width=""></el-table-column>
      <el-table-column label="总退税额" prop="" min-width=""></el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrencyChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabBatchProfitMargin'
})
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'

const dflag = ref<boolean>(false)
const props = defineProps<{
  batchProfitMarginVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.batchProfitMarginVisible
})
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrencyChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}

</script>