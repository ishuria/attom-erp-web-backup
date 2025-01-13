<template>
  <vab-dialog
    v-model="dflag"
    title="运营分类"
    width="25%"
    @open="fetchData"
    @close="closeDialog"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addVisible = true">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" >
          <el-form-item>
            <el-input placeholder="请输入搜索关键词" v-model.trim="queryForm.keyWord" clearable @keyup.enter="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border 
      :header-cell-style="{ textAlign: 'center' }"
      :data="list"
    >
      <el-table-column label="分类" prop="typeName"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" @click="modifyVisible = true">修改</el-button>
          <el-button type="danger">删除</el-button>
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
    title="修改"
    v-model="modifyVisible"
    width="20%"
  >
    <el-form :model="modifyForm" :rules="modifyFormRules" label-position="top" style="margin-left: 20px; margin-right: 20px;">
      <el-form-item label="分类">
        <el-input v-model="modifyForm.classify" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 新增 -->
  <vab-dialog
    title="新增"
    width="20%"
    v-model="addVisible"
    @close="closeAdd"
  >
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" style="margin: 0">
      <el-form-item label="运营分类类型" prop="typeName">
        <el-input v-model="addForm.typeName" clearable />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="closeAdd">取消</el-button>
      <el-button type="primary">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'OperationalClassify',
})
import { Search } from '@element-plus/icons-vue'
import { FormInstance, FormRules } from 'element-plus'
import { getOperationTypeList } from '/@/api/devlocal/productPerformance'
import { IGetOperationTypeListReq } from '/@/type/storeOperation/productPerformanceType'

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
const modifyForm = reactive<{ classify: string }>({
  classify: ''
})
const modifyFormRules = reactive<FormRules<{ classify: string }>>({
  classify: [{ required: true, message: '请填写分类', trigger: 'blur' }]
})
const list = ref<{ id: number, typeName: string }[]>([])

const closeAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const fetchData = async () => {
  const { data } = await getOperationTypeList(queryForm)
  list.value = data
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