<template>
  <!-- 分类编码设定 -->
  <div>
    <vab-dialog
      v-model="visible"
      title="分类编码设定"
      width="40%"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="addVisible = true">新增</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel >
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
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
    <!-- 新增 -->
    <vab-dialog v-model="addVisible" title="新增" width="20%" @close="handleCloseAdd">
      <el-form ref="addFormRef" label-position="top" :model="addForm" :rules="addFormRules">
        <el-form-item label="分类名" prop="name">
          <el-input v-model="addForm.name" clearable />
        </el-form-item>
        <el-form-item label="税收分类编码" prop="code">
          <el-input v-model="addForm.code" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

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
const addVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive({
  name: '',
  code: ''
})
const addFormRules = reactive({
  name: [
    { required: true, message: '请输入分类名', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入税收分类编码', trigger: 'blur' }
  ]
})
const handleCloseAdd = () => {
  addVisible.value = false
  addFormRef.value?.resetFields()
}
const handleConfirmAdd = () => {
  addFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      //
    }
  })
}
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