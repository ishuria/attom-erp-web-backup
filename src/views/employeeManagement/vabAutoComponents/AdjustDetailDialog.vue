<template>
  <div>
    <vab-dialog v-model="visible" title="调整明细" top="5%" width="45%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="showAdd">新增</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="queryData"
                @keyup.enter="queryData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="800" stripe>
        <el-table-column label="月份" prop="month" width="100" />
        <el-table-column label="被调整人" prop="userName" width="100" />
        <el-table-column
          column-key="type"
          :filter-method="filterHandler"
          :filters="[
            { text: '考核数', value: '0' },
            { text: '完成数', value: '1' },
          ]"
          label="类型"
          prop="type"
          width="110"
        >
          <template #default="{ row }">
            {{ row.type === 0 ? '考核数' : '完成数' }}
          </template>
        </el-table-column>
        <el-table-column label="调整数量" prop="adjustQuantity" width="100" />
        <el-table-column label="OEM" width="100">
          <template #default="{ row }">
            <el-checkbox v-model="row.oem" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="父体" prop="parent" width="100" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="来源" prop="source" />
        <el-table-column label="创建时间" prop="createTime" width="130" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-link type="danger" underline="never" @click="deleteDetail(row)">删除</el-link>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" style="min-height: 200px" />
        </template>
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
    <vab-dialog v-model="addVisible" title="新增" width="20%" @close="closeAdd">
      <el-form ref="addFormRef" label-width="auto" :model="addForm" :rules="addRules" style="margin-left: 0; margin-right: 0">
        <el-form-item label="月份" prop="month">
          <el-date-picker v-model="addForm.month" placeholder="请选择月份" type="month" value-format="YYYY-MM" />
        </el-form-item>
        <el-form-item label="被调整人" prop="userId">
          <el-select v-model="addForm.userId" filterable placeholder="请选择被调整人">
            <el-option v-for="item in productManagerList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="调整数量" prop="adjustQuantity">
          <el-input v-model.trim="addForm.adjustQuantity" placeholder="请输入调整数量" />
        </el-form-item>
        <el-form-item label="OEM" prop="oem">
          <el-checkbox v-model="addForm.oem" :false-value="0" :true-value="1" />
        </el-form-item>
        <el-form-item label="父体" prop="parent">
          <el-input v-model="addForm.parent" placeholder="请输入父体" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitAddForm">新增</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { FormInstance, TableColumnCtx } from 'element-plus'
import { CSSProperties } from 'vue'
import { addAdjustDetail, deleteAdjustDetail, getAdjustDetail, getProductManager } from '/@/api/devlocal/performanceStatistics'
import { IGetAdjustDetail, IGetAdjustDetailReq } from '/@/type/employeeManagement/performanceStatistics'

defineOptions({
  name: 'AdjustDetailDialog',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'query-data'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fetchData()
    }
  }
)
const addFormRef = ref<FormInstance>()
const addVisible = ref<boolean>(false)
const addForm = reactive({
  month: '',
  userId: undefined,
  type: 0,
  adjustQuantity: undefined,
  oem: 0,
  parent: '',
  remark: '',
})
const addRules = reactive<any>({
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  userId: [{ required: true, message: '请选择被调整人', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  adjustQuantity: [{ required: true, message: '请输入调整数量', trigger: 'blur' }],
})
const typeOption = [
  { label: '考核数', value: 0 },
  { label: '完成数', value: 1 },
]
const queryForm = reactive<IGetAdjustDetailReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const list = ref<IGetAdjustDetail[]>([])
const productManagerList = ref<{ id: number; label: string }[]>([])

const filterHandler = (value: string, row: IGetAdjustDetail, column: TableColumnCtx<IGetAdjustDetail>) => {
  const property = column['property']
  return row[property] === Number(value)
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.column.label === '类型') {
    return {
      color: data.row.type === 0 ? 'var(--el-color-primary)' : '#6C3483',
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'center',
  }
}
const showAdd = async () => {
  addVisible.value = true
  const { data } = await getProductManager()
  productManagerList.value = data
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAdjustDetail(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
const queryData = async () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const submitAddForm = async () => {
  addFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { data } = await addAdjustDetail({
        month: addForm.month,
        userId: addForm.userId!,
        type: addForm.type,
        adjustQuantity: addForm.adjustQuantity!,
        oem: addForm.oem,
        parent: addForm.parent,
        remark: addForm.remark,
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        closeAdd()
        queryData()
        emit('query-data')
      }
    }
  })
}
const closeAdd = () => {
  addVisible.value = false
  addFormRef.value?.resetFields()
}
const deleteDetail = async (row: IGetAdjustDetail) => {
  const { data } = await deleteAdjustDetail(row)
  if (data) {
    $baseMessage('删除成功！', 'success')
    queryData()
    emit('query-data')
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  transform: scale(1.2);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}
</style>
