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
      :data="fakeData"
    >
      <el-table-column label="报关品名" prop="" min-width="100"></el-table-column>
      <el-table-column label="报关数量" prop="" min-width="100"></el-table-column>
      <el-table-column label="报关单位" prop="" min-width="100"></el-table-column>
      <el-table-column label="CIF售价$" prop="" min-width="105"></el-table-column>
      <el-table-column label="运费$" prop="" min-width="95"></el-table-column>
      <el-table-column label="FOB售价$" prop="" min-width="105"></el-table-column>
      <el-table-column label="汇率" prop="" min-width="90"></el-table-column>
      <el-table-column label="人民币售价￥" prop="" min-width="130">
        <template #header>
          人民币<br />售价￥
        </template>
      </el-table-column>
      <el-table-column label="含税成本￥" prop="" min-width="110">
        <template #header>
          含税<br />成本￥
        </template>
      </el-table-column>
      <el-table-column label="退税后成本￥" prop="" min-width="130">
        <template #header>
          退税后<br />成本￥
        </template>
      </el-table-column>
      <el-table-column label="利润￥" prop="" min-width="100"></el-table-column>
      <el-table-column label="利润率" prop="" min-width="100"></el-table-column>
      <el-table-column label="退税额￥" prop="" min-width="100"></el-table-column>
      <el-table-column label="供应商" prop="" min-width="100"></el-table-column>
      <el-table-column label="供应商税号展示" prop="" min-width="110">
        <template #header>
          供应商<br />税号展示
        </template>
      </el-table-column>
      <el-table-column label="PO" prop="po" min-width="90"></el-table-column>
      <el-table-column label="发票匹配日期" prop="" min-width="100">
        <template #header>
          发票匹<br />配日期
        </template>
      </el-table-column>
      <el-table-column label="发票代码" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票号码" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票数量" prop="" min-width="100"></el-table-column>
      <el-table-column label="发票文件" prop="" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="" min-width="90"></el-table-column>
      <el-table-column label="PO零件数" prop="" min-width="110"></el-table-column>
      <el-table-column label="shipmentID" prop="" min-width="130"></el-table-column>
      <el-table-column label="付款记录" prop="" min-width="100"></el-table-column>
    </el-table>
    <template #footer></template>
  </vab-dialog>

</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'

const props = defineProps<{
  detailVisible: boolean
}>()
const dflag = ref<boolean>(false)
watchEffect(() => {
  dflag.value = props.detailVisible
})
const emit = defineEmits<{
  updateDetailVisible: [value: boolean]
}>()
const closeDetail = () => {
  emit('updateDetailVisible', false)
}
const fakeData = [
  {
    po: 'PO333'
  }
]
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 13 && data.columnIndex !== 14 && data.columnIndex !== 15 && data.columnIndex !== 21 && data.columnIndex !== 24) {
    return {
      color: 'rgb(83, 186, 177)',
      textAlign: 'center'
    }
  }
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
</script>