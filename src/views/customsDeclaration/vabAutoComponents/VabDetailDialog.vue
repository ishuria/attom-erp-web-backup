<template>
  <vab-dialog
    title="明细 | 合同编号"
    v-model="dflag"
    width="97%"
    top="10vh"
    @close="closeDetail"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">展示埃托姆</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter.native="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" :loading="listLoading" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :data="list"
    >
      <el-table-column label="报关品名" prop="customsDeclarationName" min-width="100"></el-table-column>
      <el-table-column label="报关数量" prop="customsDeclarationCount" min-width="100"></el-table-column>
      <el-table-column label="报关单位" prop="customsDeclarationUnit" min-width="100"></el-table-column>
      <el-table-column label="CIF售价$" prop="cifPrice" min-width="105"></el-table-column>
      <el-table-column label="运费$" prop="freightFee" min-width="95"></el-table-column>
      <el-table-column label="FOB售价$" prop="fobPrice" min-width="105"></el-table-column>
      <el-table-column label="汇率" prop="rate" min-width="90"></el-table-column>
      <el-table-column label="人民币售价￥" prop="salePrice" min-width="130">
        <template #header>
          人民币<br />售价￥
        </template>
      </el-table-column>
      <el-table-column label="含税成本￥" prop="taxInclusiveCost" min-width="110">
        <template #header>
          含税<br />成本￥
        </template>
      </el-table-column>
      <el-table-column label="退税后成本￥" prop="taxRefundsCost" min-width="130">
        <template #header>
          退税后<br />成本￥
        </template>
      </el-table-column>
      <el-table-column label="利润￥" prop="profit" min-width="100"></el-table-column>
      <el-table-column label="利润率" prop="profitMargin" min-width="100"></el-table-column>
      <el-table-column label="退税额￥" prop="taxRebate" min-width="100"></el-table-column>
      <el-table-column label="供应商" prop="suppliser" min-width="100"></el-table-column>
      <el-table-column label="供应商税号展示" prop="suppliserTaxNumber" min-width="110">
        <template #header>
          供应商<br />税号展示
        </template>
      </el-table-column>
      <el-table-column label="PO" prop="po" min-width="90"></el-table-column>
      <el-table-column label="发票匹配日期" prop="invoiceMatchDate" min-width="100">
        <template #header>
          发票匹<br />配日期
        </template>
      </el-table-column>
      <el-table-column label="发票代码" prop="invoiceCode" min-width="100"></el-table-column>
      <el-table-column label="发票号码" prop="invoiceNumber" min-width="100"></el-table-column>
      <el-table-column label="发票数量" prop="invoiceCount" min-width="100"></el-table-column>
      <el-table-column label="发票文件" prop="invoiceFilePath" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="90"></el-table-column>
      <el-table-column label="PO零件数" prop="componentCount" min-width="110"></el-table-column>
      <el-table-column label="shipmentID" prop="shipmentId" min-width="130"></el-table-column>
      <el-table-column label="付款记录" prop="payRecordList" min-width="100"></el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <template #footer></template>
  </vab-dialog>

</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { getTaxRefundBatchDetail } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetTaxRefundBatchDetailList, IGetTaxRefundBatchDetailQuery } from '/@/type/customsDeclarationAndTaxRefund/refundTax'

const props = defineProps<{
  detailVisible: boolean
  id: number | undefined
}>()
const dflag = ref<boolean>(false)
watchEffect(() => {
  dflag.value = props.detailVisible
  if (dflag.value) {
    fetchData()
  }
})
const emit = defineEmits<{
  updateDetailVisible: [value: boolean]
}>()
const closeDetail = () => {
  emit('updateDetailVisible', false)
}

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<IGetTaxRefundBatchDetailQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  id: props.id!
})
const list = ref<IGetTaxRefundBatchDetailList[]>([])
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  return {
    textAlign: 'center'
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 13) {
    return {
      textAlign: 'left'
    }
  } else if (data.columnIndex === 15) {
    return {
      color: 'var(--el-color-danger)',
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
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
  listLoading.value = true
  const { data } = await getTaxRefundBatchDetail(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  listLoading.value = false
}
</script>