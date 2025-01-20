<template>
  <vab-dialog 
    v-model="dflag" 
    :before-close="handlerCloseDialog" 
    class="moldDialog"
    title="自动签收设定"
    width="30%"
  >
    <el-divider style="margin-top: 0; margin-bottom: 20px"/>
    <div id="table-height-container">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleShowAddDialog">新增</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
            </el-form-item>
            <el-form-item>
              <el-button
:icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"/>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>

      <el-table 
        ref="tableRef" 
        border :cell-style="cellStyle" 
        :data="list"
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
        @cell-click="changeInput"
      >
        <el-table-column label="零件ID" min-width="100" prop="existingPartsId"/>
        <el-table-column label="零件" min-width="350" prop="componentName"/>
        <el-table-column label="操作" min-width="100">
          <template #default="{ row, $index }">
            <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>

      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <vab-dialog
      v-model="addSignatureSettingsVisible"
      :before-close="closeAddDialog"
      title="新增零件"
      width="20%"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" style="margin: 0">
        <el-form-item label="零件名" prop="componentName">
          <el-select
            v-model="addForm.componentName"
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remotePeopleMethod"
          >
            <el-option
              v-for="item in skuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
      </template>
    </vab-dialog>
    <template #footer></template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance } from 'element-plus';
import { addSignatureSettings, delSignatureSettings, getSearchComponent, getSignatureSettingList } from '/@/api/devlocal/purchasePo'

defineOptions({
  name: 'VabAutomaticSignature'
})
let props = defineProps<{
  automaticSignatureVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
  dflag.value = props.automaticSignatureVisible
  if(dflag.value === true) {
      fetchData()
  }
}
)

const skuLoading = ref(false) //搜索SKU-loading
const skuOptions = ref<any[]>([]) //搜索选项
const nameList = ref<any[]>([]) //搜索列表
const remotePeopleMethod = async (query: string) => {
  if (query) {
    const { data } = await getSearchComponent({
      componentName: query
    })

    nameList.value = data.map((item: any) => {
        return { value: item.id, label: item.label }
    })
    skuLoading.value = true
    setTimeout(() => {
      skuLoading.value = false
      skuOptions.value = nameList.value.filter((item) => {
            return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    skuOptions.value = []
  }
}
/**
 * 分页
 */
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: ''
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const list = ref<any>([])
// 新增弹窗是否可见
const addSignatureSettingsVisible = ref<boolean>(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive<any>({
  componentName: ''
})
const addFormRules = reactive<any>({
  componentName: [
    { required: true, message: '请输入要新增的零件名', trigger: 'blur'}
  ]
})
const tableRef = ref<TableInstance>()

const emit = defineEmits(['update:automaticSignatureVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
  dflag.value = false
  emit('update:automaticSignatureVisible', dflag.value);
  emit('update:tableValue', list.value)
}

const handleShowAddDialog = () => {
  addSignatureSettingsVisible.value = true
}
const closeAddDialog = () => {
  addFormRef.value?.resetFields()
  addSignatureSettingsVisible.value = false
}
const handleConfirmAdd = async () => {
  try {
    const { data } = await addSignatureSettings({
      id: addForm.componentName
    })
    if (data) {
      closeAddDialog()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
const handleDel = async (row: any, index: number) => {
  try {
    const { data } = await delSignatureSettings({
      id: row.id
    })
    if (data === true) {
      $baseMessage('删除成功', 'success', 'hey')
      list.value.splice(index, 1)
    }
  } catch (error) {
    console.error(error)
  }
}
const cellStyle = ():any => {
  return { 'text-align': 'center'}
}

const changeInput = async () => {}

/**
* 获取自动签收设定数据
*/
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSignatureSettingList(queryForm)
  if (data) {
    total.value = data.total
    list.value = data.list
  }
  listLoading.value = false
}
onActivated(() => {
  tableRef.value?.doLayout()
})
</script>

<style lang="scss" scoped>
#table-height-container {
  display: flex;
  flex-direction: column;
  max-height: calc(80vh - 192px);
  height: calc(80vh - 192px);

  .el-table {
      flex: 1; // 使表格占据剩余空间
      overflow: auto; // 确保表格内容可以滚动
  }
}
// // 设置行高
// :deep(.el-table .el-table__body .cell) {
//   max-height: 69.8px !important;
// }
.none {
  display: none;
}

</style>
