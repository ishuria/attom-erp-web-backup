<template>
  <vab-dialog title="产品明细"> 
    <vab-query-form>
      <vab-query-form-right-panel>
        <el-form>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable  />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
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
    <template #footer>
      <el-button type="danger">取消</el-button>
      <el-button type="success">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'


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
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
</script>