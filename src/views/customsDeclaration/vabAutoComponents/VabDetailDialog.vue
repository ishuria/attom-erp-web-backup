<template>
  <vab-dialog
    title="明细"
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
    <el-table>
      <el-table-column label="报关品名"></el-table-column>
      <el-table-column label="报关数量"></el-table-column>
      <el-table-column label="报关单位"></el-table-column>
      <el-table-column label="CIF售价$"></el-table-column>
      <el-table-column label="运费$"></el-table-column>
      <el-table-column label="FOB售价$"></el-table-column>
      <el-table-column label="汇率"></el-table-column>
      <el-table-column label="人民币售价￥"></el-table-column>
      <el-table-column label="含税成本￥"></el-table-column>
      <el-table-column label="退税后成本￥"></el-table-column>
      <el-table-column label="利润￥"></el-table-column>
      <el-table-column label="利润率"></el-table-column>
      <el-table-column label="退税额￥"></el-table-column>
      <el-table-column label="供应商"></el-table-column>
      <el-table-column label="供应商税号展示"></el-table-column>
      <el-table-column label="PO"></el-table-column>
      <el-table-column label="发票匹配日期"></el-table-column>
      <el-table-column label="发票代码"></el-table-column>
      <el-table-column label="发票号码"></el-table-column>
      <el-table-column label="发票数量"></el-table-column>
      <el-table-column label="发票文件"></el-table-column>
      <el-table-column label="SKU"></el-table-column>
      <el-table-column label="PO零件数"></el-table-column>
      <el-table-column label="shipmentID"></el-table-column>
      <el-table-column label="付款记录"></el-table-column>
    </el-table>
  </vab-dialog>

</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

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
</script>