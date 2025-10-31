<template>
  <div>
    <vab-dialog v-model="visible" title="调整明细" top="5%" width="55%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button v-if="!editDisabled" type="primary" @click="showAdd">新增</el-button>
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
        <el-table-column
          column-key="userName"
          :filter-method="filterNameHandler"
          :filters="filterProductManagerList"
          label="被调整人"
          prop="userName"
          width="100"
        />
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
        <el-table-column
          column-key="detailType"
          :filter-method="filterDetailHandler"
          :filters="[
            { text: '产品利润分', value: '0' },
            { text: '其他计分项', value: '1' },
            { text: '考核数加回', value: '2' },
          ]"
          label="细分类型"
          prop="detailType"
          width="120"
        >
          <template #default="{ row }">
            <span v-show="row.detailType === 0">产品利润分</span>
            <span v-show="row.detailType === 1">其他计分项</span>
            <span v-show="row.detailType === 2">考核数加回</span>
          </template>
        </el-table-column>
        <el-table-column label="调整数量" prop="adjustQuantity" width="100" />
        <el-table-column label="OEM" width="100">
          <template #default="{ row }">
            <el-checkbox v-model="row.oem" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="计分组名" prop="parent" width="130" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column
          column-key="source"
          :filter-method="filterSourceHandler"
          :filters="filterAdjustDetailSourceList"
          label="来源"
          prop="source"
          width="135"
        />
        <el-table-column label="创建时间" prop="createTime" width="130" />
        <el-table-column v-if="!editDisabled" label="操作" width="100">
          <template #default="{ row }">
            <el-link :disabled="row.ableDelete === 0" type="danger" underline="never" @click="deleteDetail(row)">删除</el-link>
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
          <el-date-picker
            v-model="addForm.month"
            :disabled-date="disabledDate"
            placeholder="请选择月份"
            type="month"
            value-format="YYYY-MM"
          />
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
        <el-form-item label="细分类型" prop="detailType">
          <el-select v-model="addForm.detailType" placeholder="请选择类型">
            <el-option v-for="item in detailTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="调整数量" prop="adjustQuantity">
          <el-input v-model.trim="addForm.adjustQuantity" placeholder="请输入调整数量" />
        </el-form-item>
        <el-form-item label="OEM选项" prop="oem">
          <el-radio-group v-model="addForm.oem">
            <el-radio :label="0">仅完成数</el-radio>
            <el-radio :label="1">仅OEM</el-radio>
            <el-radio :label="2">OEM和完成数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计分组名" prop="parent">
          <el-input v-model="addForm.parent" placeholder="请输入计分组名" />
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
import {
  addAdjustDetail,
  deleteAdjustDetail,
  getAdjustDetail,
  getAdjustDetailSource,
  getProductManager,
} from '/@/api/devlocal/performanceStatistics'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { IGetAdjustDetail, IGetAdjustDetailReq } from '/@/type/employeeManagement/performanceStatistics'

defineOptions({
  name: 'AdjustDetailDialog',
})

const props = defineProps<{
  modelValue: boolean
  editDisabled: boolean
}>()
const emit = defineEmits(['update:modelValue', 'query-data'])
const aclStore = useAclStore()

const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

// 判断当前用户是否为BOSS
const isBoss = computed(() => aclStore.getRole.includes(ROLE_BOSS_CODE))

// 日期选择器禁用日期的函数
const disabledDate = (date: Date) => {
  if (isBoss.value) {
    // BOSS无限制
    return false
  }

  // 其他用户只能选择上个月（含）之后的月份
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  // 将日期设置为该月的第一天进行比较
  const compareDate = new Date(date.getFullYear(), date.getMonth(), 1)

  return compareDate < lastMonth
}
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fetchAdjustDetailSourceList()
      fetchProductManagerList()
      fetchData()
    }
  },
  { immediate: true }
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
  detailType: 0,
})
const addRules = reactive<any>({
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  userId: [{ required: true, message: '请选择被调整人', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  detailType: [{ required: true, message: '请选择细分类型', trigger: 'change' }],
  adjustQuantity: [{ required: true, message: '请输入调整数量', trigger: 'blur' }],
})
const typeOption = [
  { label: '考核数', value: 0 },
  { label: '完成数', value: 1 },
]
const detailTypeOption = [
  { label: '产品利润分', value: 0 },
  { label: '其他计分项', value: 1 },
  { label: '考核数加回', value: 2 },
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
const filterProductManagerList = ref<{ text: string; value: string }[]>([])
const filterHandler = (value: string, row: IGetAdjustDetail, column: TableColumnCtx<IGetAdjustDetail>) => {
  const property = column.property as keyof IGetAdjustDetail | undefined
  if (!property) return false
  return Number(row[property] as unknown as number) === Number(value)
}

const filterNameHandler = (value: string, row: IGetAdjustDetail, column: TableColumnCtx<IGetAdjustDetail>) => {
  const property = column.property as keyof IGetAdjustDetail | undefined
  if (!property) return false
  return row[property] === value
}
const filterDetailHandler = (value: string, row: IGetAdjustDetail, column: TableColumnCtx<IGetAdjustDetail>) => {
  const property = column.property as keyof IGetAdjustDetail | undefined
  if (!property) return false
  return Number(row[property] as unknown as number) === Number(value)
}

const filterSourceHandler = (value: string, row: IGetAdjustDetail, column: TableColumnCtx<IGetAdjustDetail>) => {
  const property = column.property as keyof IGetAdjustDetail | undefined
  if (!property) return false
  return row[property] === value
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
const fetchProductManagerList = async () => {
  const { data } = await getProductManager()
  filterProductManagerList.value = data.map((item) => ({ text: item.label, value: item.label }))
}
const filterAdjustDetailSourceList = ref<{ text: string; value: string }[]>([])
const fetchAdjustDetailSourceList = async () => {
  const { data } = await getAdjustDetailSource()
  filterAdjustDetailSourceList.value = data.map((item) => ({ text: item, value: item }))
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
        adjustQuantity: Number(addForm.adjustQuantity)!,
        oem: addForm.oem,
        parent: addForm.parent,
        remark: addForm.remark,
        detailType: addForm.detailType,
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
