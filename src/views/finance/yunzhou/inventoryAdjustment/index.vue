<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-button type="primary">导出</el-button>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <el-date-picker>

        </el-date-picker>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" native-type="submit" :loading="listLoading" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <!-- <el-table>
      <el-table-column label="调整日期"></el-table-column>
      <el-table-column label="供应商名称"></el-table-column>
      <el-table-column label="PO"></el-table-column>
      <el-table-column label="产品名称/型号"></el-table-column>
      <el-table-column label="品名"></el-table-column>
      <el-table-column label="调整数量"></el-table-column>
      <el-table-column label="调整未税价格"></el-table-column>
      <el-table-column label="含税总价￥"></el-table-column>
      <el-table-column label="销售价格￥"></el-table-column>
      <el-table-column label="Shipment ID"></el-table-column>
      <el-table-column label="合同编号"></el-table-column>
      <el-table-column label="备注"></el-table-column>
      <el-table-column label="操作"></el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table> -->
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
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
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
</script>
