<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showAdd">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :header-cell-style="{ textAlign: 'center' }" stripe  >
      <el-table-column label="编号" />
      <el-table-column align="center" label="日期" />
      <el-table-column align="center" label="类型" />
      <el-table-column label="时段" />
      <el-table-column label="人员" />
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
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 假期时间新增 -->
    <vab-dialog
      v-model="addVisible"
      title="新增假期时间"
      width="20%"
    >
      <el-form label-position="top">
        <el-form-item label="假期时间">
          <el-date-picker v-model="addForm.date" style="min-width: 100%;" type="date"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="addForm.type" placeholder="请选择日期类型">
            <el-option label="workday" value="workday" />
            <el-option label="vacation" value="vacation" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue"
import { getCurrentFormatDate } from "/@/utils/dateUtils"

const addForm = reactive<any>({
  type: 'workday',
  date: getCurrentFormatDate()
})
const addVisible = ref<boolean>(false)
const listLoading = ref<boolean>(false)
const list = ref<any>([])
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)

const showAdd = () => {
  addVisible.value = true
}
const fetchData = async () => {
  //
}
const queryData = () => {
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
</script>


