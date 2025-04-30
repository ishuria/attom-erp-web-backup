<template>
  <!-- 分类编码设定 -->
  <div>
    <vab-dialog
      v-model="visible"
      title="分类编码设定"
      width="40%"
    >
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="分类名" />
        <el-table-column label="税收分类编码" />
        <el-table-column label="操作" width="90">
          <template #default="{ row }">
            <el-button text type="danger" @click="handleDel(row)">删除</el-button>
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
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'


defineOptions({
  name: 'VabClassificationCodeSettings'
})
const props = defineProps<{
  modelValue: boolean
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref(0)
const listLoading = ref(false)
const handleDel = (row: any) => {
  console.log(row)
}
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