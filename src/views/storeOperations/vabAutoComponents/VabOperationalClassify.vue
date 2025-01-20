<template>
  <vab-dialog
    v-model="dflag"
    title="运营分类"
    top="10vh"
    width="25%"
    @close="closeDialog"
    @open="fetchData"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addVisible = true">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" >
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border 
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column label="分类" prop="typeName"/>
      <el-table-column align="center" label="操作" width="170">
        <template #default="{ row }">
          <el-button text type="primary" @click="showModify(row)">修改</el-button>
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
  <vab-dialog
    v-model="modifyVisible"
    title="修改"
    width="20%"
  >
    <el-form ref="modifyFormRef" :model="modifyForm" :rules="modifyFormRules" style="margin: 0;">
      <el-form-item label="运营分类类型" prop="classify">
        <el-input v-model="modifyForm.classify" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="modifyVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirmModify">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 新增 -->
  <vab-dialog
    v-model="addVisible"
    title="新增"
    width="20%"
    @close="closeAdd"
  >
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" style="margin: 0">
      <el-form-item label="运营分类类型" prop="typeName">
        <el-input v-model="addForm.typeName" clearable />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeAdd">取消</el-button>
      <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>

import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { addOperationTypeList, delOperationTypeList, getOperationTypeList, updateOperationTypeList } from '/@/api/devlocal/productPerformance'
import type { IGetOperationTypeListReq } from '/@/type/storeOperation/productPerformanceType'
defineOptions({
  name: 'OperationalClassify',
})

const dflag = ref < boolean > (false)
const props = defineProps<{
  opeClassifyVisible: boolean
}>()
const emit = defineEmits<{
  updateVisible: [value: boolean]
}>()
const closeDialog = () => {
  emit('updateVisible', false)
}
watchEffect(() => {
  dflag.value = props.opeClassifyVisible
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const queryForm = reactive<IGetOperationTypeListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const addVisible = ref<boolean>(false)
const addForm = reactive<{ typeName: string }>({
  typeName: ''
})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules>({
  typeName: [{ required: true, message: '请输入运营分类类型', trigger: 'blur' }]
})
// 修改
const modifyVisible = ref<boolean>(false)
const modifyFormRef = ref<FormInstance>()
const modifyForm = reactive<{ classify: string }>({
  classify: ''
})
const modifyFormRules = reactive<FormRules<{ classify: string }>>({
  classify: [{ required: true, message: '请填写分类', trigger: 'blur' }]
})
const list = ref<{ id: number, typeName: string }[]>([])
const _id = ref<number>(0)

const handleDel = async ( row: { id: number, typeName: string }) => {
  $baseConfirm('确定要删除运营分类类型吗？', null, async () => {
    const { data } = await delOperationTypeList({ id: row.id })
    if (data) {
      $baseMessage('删除成功！', 'success')
      fetchData()
    }
  })
}
const handleConfirmModify = async () => {
  modifyFormRef.value?.validate(async (isValid) => {
    if (isValid) {
      const { data } = await updateOperationTypeList({
        id: _id.value,
        typeName: modifyForm.classify
      })
      if (data) {
        $baseMessage('修改运营分类类型成功！', 'success')
        modifyVisible.value = false
        fetchData()
      }
    }
  })
}
const showModify = (row: { id: number, typeName: string }) => {
  modifyForm.classify = row.typeName
  _id.value = row.id
  modifyVisible.value = true
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addOperationTypeList({
        typeName: addForm.typeName
      })
      if (data) {
        $baseMessage('新增运营分类类型成功！', 'success')
        closeAdd()
        fetchData()
      }
    }
  })
}
const closeAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getOperationTypeList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
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