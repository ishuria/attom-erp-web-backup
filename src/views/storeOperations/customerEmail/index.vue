<template>
  <div class="custom-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline>
          <el-form-item>
            <el-input />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column align="center" label="Date" prop="createTime" />
      <el-table-column align="center" label="客服来源" prop="customerServiceSourceId">
        <template #default="{ row }">
          <el-select v-model="row.customerServiceSourceId" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点" prop="siteId" >
        <template #default="{ row }">
          <el-select v-model="row.siteId" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已回复" prop="isReplied" >
        <template #default="{ row }">
          <el-checkbox v-model="row.isReplied" :false-value="0" :true-value="1" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" />
      <el-table-column label="Order ID" prop="orderId" />
      <el-table-column label="Customer Name" prop="customerId" />
      <el-table-column label="Issue" prop="issue" />
      <el-table-column label="解决方案" prop="solution" />
      <el-table-column label="Tracking #/New Order ID" prop="trackNewOrder" />
      <el-table-column label="Follow Up" prop="followUp" />
      <el-table-column align="center" label="操作" >
        <template #default="{ row }">
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination 
      :page-no="queryForm.pageNo"
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
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
</script>
