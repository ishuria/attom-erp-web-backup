<template>
  <vab-dialog
    v-model="dflag"
    title="运营分类"
    width="25%"
    @close="closeDialog"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">新增</el-button>
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
    >
      <el-table-column label="分类" prop="">

      </el-table-column>
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
</template>

<script lang="ts" setup>

defineOptions({
  name: 'OperationalClassify',
})
import { Search } from '@element-plus/icons-vue'
import { FormRules } from 'element-plus'

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
type IQueryForm = {
  keyWord: string
  pageNo: number
  pageSize: number
}
const queryForm = reactive<IQueryForm>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
// 修改
const modifyVisible = ref<boolean>(false)
const modifyForm = reactive<{ classify: string }>({
  classify: ''
})
const modifyFormRules = reactive<FormRules<{ classify: string }>>({
  classify: [{ required: true, message: '请填写分类', trigger: 'blur' }]
})
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
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