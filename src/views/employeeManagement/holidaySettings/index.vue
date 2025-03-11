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
    <el-table v-loading="listLoading" border :cell-style="{ textAlign: 'center' }" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe  >
      <el-table-column label="编号" prop="id" />
      <el-table-column label="日期" prop="createTime" >
        <template #default="{ row }">
          {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" />
      <el-table-column label="时段" prop="timeInterval" />
      <el-table-column label="人员" prop="staffs" />
      <el-table-column label="操作" >
        <template #default="{ row }">
          <el-link type="danger" :underline="false" @click="handleDel(row)">删除</el-link>
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
      <el-form ref="addFormRef" label-position="top" :model="addForm" :rules="addFormRules">
        <el-form-item label="假期时间" prop="date">
          <el-date-picker v-model="addForm.date" style="min-width: 100%;" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择日期类型">
            <el-option label="workday" value="workday" />
            <el-option label="vacation" value="vacation" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue"
import { addHolidaySettings, deleteHolidaySettings, getHolidaySettingsList } from '/@/api/devlocal/holidaySettings'
import type {
  IGetHolidaySettingsList,
  IGetHolidaySettingsReq
} from '/@/type/employeeManagement/holidaySettings'
import { getCurrentFormatDate } from "/@/utils/dateUtils"
import { type FormInstance, dayjs } from 'element-plus'

const addFormRef = ref<FormInstance>()
const addFormRules = reactive<any>({
  date: [{ required: true, message: "请选择假期时间", trigger: 'change' }],
  type: [{ required: true, message: "请选择类型", trigger: 'change' }],
})
const addForm = reactive<any>({
  type: 'workday',
  date: dayjs().format("YYYY-MM-DD")
})
console.log(getCurrentFormatDate())
const addVisible = ref<boolean>(false)
const listLoading = ref<boolean>(false)
const list = ref<IGetHolidaySettingsList[]>([])
const queryForm = reactive<IGetHolidaySettingsReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)

const confirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addHolidaySettings({
        holidayDate: addForm.date,
        type: addForm.type
      })
      if (data) {
        $baseMessage("新增假期时间成功！", 'success')
        addVisible.value = false
        queryData()
      }
    }
  })
}
const handleDel = async (row: IGetHolidaySettingsList) => {
  $baseConfirm("确定要删除本条假日记录吗？", null, async () => {
    const { data } = await deleteHolidaySettings({ id: row.id! })
    if(data) {
      $baseMessage("删除成功！", 'success')
      queryData()
    }
  })
}
const showAdd = () => {
  addVisible.value = true
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getHolidaySettingsList(queryForm)
  total.value = data.total
  list.value = data.list
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
onBeforeMount(() => {
  fetchData()
})
</script>


