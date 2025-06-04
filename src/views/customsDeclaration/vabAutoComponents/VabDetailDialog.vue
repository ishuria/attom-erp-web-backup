<template>
  <vab-dialog
    v-model="dflag"
    :title="`明细 | ${props.contractNumber}`"
    top="10vh"
    width="100%"
    @close="closeDetail"
    :draggable="false"
  >
    <vab-query-form >
      <vab-query-form-left-panel>
        <el-button type="primary">展示埃托姆</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <div style="max-height: 80vh; ">
      <el-table
        border
        :cell-style="cellStyle"
        :data="list"
        :header-cell-style="headerCellStyle"
        max-height="60vh"
      >
        <el-table-column label="报关品名" min-width="100" prop="customsDeclarationName" :width="flexColumnWidth(list, '报关品名', 'customsDeclarationName')"/>
        <el-table-column label="报关数量" width="70" prop="customsDeclarationCount">
          <template #header>
            报关<br />数量
          </template>
        </el-table-column>
        <el-table-column label="报关单位" min-width="60" prop="customsDeclarationUnit">
          <template #header>
            报关<br />单位
          </template>
        </el-table-column>
        <el-table-column label="CIF售价$" min-width="105" prop="cifPrice"/>
        <el-table-column label="运费$" min-width="90" prop="freightFee"/>
        <el-table-column label="FOB售价$" min-width="105" prop="fobPrice"/>
        <el-table-column label="汇率" min-width="90" prop="rate"/>
        <el-table-column label="人民币售价￥" min-width="100" prop="salePrice">
          <template #header>
            人民币<br />售价￥
          </template>
        </el-table-column>
        <el-table-column label="含税成本￥" min-width="90" prop="taxInclusiveCost">
          <template #header>
            含税<br />成本￥
          </template>
        </el-table-column>
        <el-table-column label="退税后成本￥" min-width="100" prop="taxRefundsCost">
          <template #header>
            退税后<br />成本￥
          </template>
        </el-table-column>
        <el-table-column label="利润￥" min-width="100" prop="profit"/>
        <el-table-column label="利润率" min-width="100" prop="profitMargin"/>
        <el-table-column label="退税额￥" min-width="100" prop="taxRebate"/>
        <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')"/>
        <el-table-column label="供应商税号展示" prop="suppliserTaxNumber" :width="flexColumnWidth(list, '税号展示', 'suppliserTaxNumber')">
          <template #header>
            供应商<br />税号展示
          </template>
        </el-table-column>
        <el-table-column label="PO" min-width="100" prop="po"/>
        <el-table-column label="发票匹配日期" min-width="100" prop="invoiceMatchDate">
          <template #header>
            发票匹<br />配日期
          </template>
        </el-table-column>
        <el-table-column label="发票代码" min-width="100" prop="invoiceCode"/>
        <el-table-column label="发票号码" min-width="100" prop="invoiceNumber"/>
        <el-table-column label="发票数量" min-width="100" prop="invoiceCount"/>
        <el-table-column label="发票文件" min-width="100" prop="invoiceFilePath"/>
        <el-table-column label="SKU" min-width="90" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"/>
        <el-table-column label="PO零件数" min-width="110" prop="componentCount"/>
        <el-table-column label="shipmentID" min-width="130" prop="shipmentId" :width="flexColumnWidth(list, 'shipmentID', 'shipmentId')"/>
        <el-table-column label="付款记录" min-width="230" prop="payRecordList">
          <template #default="{ row }">
            <span v-html="row.payRecordList"></span>
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
    </div>
   
  </vab-dialog>

</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { getTaxRefundBatchDetail } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type { IGetTaxRefundBatchDetailList, IGetTaxRefundBatchDetailQuery, PayRecordList } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { flexColumnWidth } from '/@/utils/tableColum'

const props = defineProps<{
  detailVisible: boolean
  id: number | undefined
  contractNumber: string | undefined
}>()
const dflag = ref<boolean>(false)
watchEffect(() => {
  dflag.value = props.detailVisible
  if (dflag.value) {    
    queryForm.id = props.id!
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
const headerCellStyle = (): CSSProperties => {
  return {
    textAlign: 'center'
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 13 || data.columnIndex === 14 || data.columnIndex === 15
    || data.columnIndex === 21 || data.columnIndex === 23 || data.columnIndex === 24) {
    return {
      textAlign: 'left'
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
  list.value.forEach((item: IGetTaxRefundBatchDetailList) => {
    if (Array.isArray(item.payRecordList)) {
      item.payRecordList = item.payRecordList.map((record: PayRecordList) => {
        const percentage = parseInt(record.percentage!.replace('%', '')) // 去掉%并转换为整数
        const createTime = record.createTime!.split(' ')[0]
        if (percentage < 0) {
          return `
            <span class="create-time">${createTime}</span>: 
            <span class="percentage-red">${percentage}%</span>
            <span class="pay-price">(${record.payPrice})</span>`
        } else {
          return `
            <span class="create-time">${createTime}</span>: 
            <span class="percentage">${percentage}%</span>
            <span class="pay-price">(${record.payPrice})</span>`
        }
      })
      .join('<br>')
    }
   
  })
  listLoading.value = false
}
</script>

<style lang="scss" scoped>
:deep() {
  .create-time {
    color: #4E88F3;
  }
  .percentage {
    color: #24ADA1;
  }
  .pay-price {
    color: #8D5FCC;
  }
  .percentage-red {
    color: var(--el-color-danger);
  }
}

</style>