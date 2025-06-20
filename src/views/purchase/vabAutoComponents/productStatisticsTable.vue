<template>
  <div>
    <el-table>
      <el-table-column label="产品名称" prop="name" />
      <el-table-column label="采购数量" prop="count" />
      <el-table-column label="采购金额" prop="amount" />
    </el-table>
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

const queryForm = reactive<any>({

})
const total = ref<number>(0)
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  // fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  // fetchData()
}
</script>