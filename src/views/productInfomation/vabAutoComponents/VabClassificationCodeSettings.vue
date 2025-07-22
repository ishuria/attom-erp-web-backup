<template>
  <!-- 分类编码设定 -->
  <div>
    <vab-dialog
      v-model="visible"
      title="分类编码设定"
      top="5vh"
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
      <el-table border :cell-style="{ cursor: 'pointer' }" :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="70vh" stripe @cell-click="cellClick">
        <el-table-column label="分类名" prop="typeName" >
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.typeName" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="税收分类编码" prop="encodingCode" >
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.encodingCode" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.encodingCode }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template #default="{ row, $index }">
            <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
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
        <el-form-item label="分类名" prop="typeEncodingName">
          <el-input v-model="addForm.typeEncodingName" clearable />
        </el-form-item>
        <el-form-item label="税收分类编码" prop="encodingCode">
          <el-input v-model="addForm.encodingCode" clearable />
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
import { isEqual } from 'lodash-es'
import { addComponentEncoding, delComponentEncoding, getComponentEncodingList, updateComponentEncoding } from '/@/api/devlocal/productInformation'
import { IGetComponentEncodingList } from '/@/type/productInformation/skuInformationType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

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
watch(() => props.modelValue, (val) => {
  if (val) {
    fetchData()
  }
})
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref(0)
const list = ref<IGetComponentEncodingList[]>([])
const listLoading = ref(false)
const addVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive({
  typeEncodingName: '',
  encodingCode: ''
})
const addFormRules = reactive({
  typeEncodingName: [
    { required: true, message: '请输入分类名', trigger: 'blur' }
  ],
  encodingCode: [
    { required: true, message: '请输入税收分类编码', trigger: 'blur' }
  ]
})
let copyRow: any
const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const clickCancel = async (event: Event, value: any) => {
  const rootElement = getRootElement(event?.target, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
    await updateComponentEncoding({
      id: value.id,
      taxationEncoding: value.encodingCode,
      typeName: value.typeName
    })
  }
}
const handleCloseAdd = () => {
  addVisible.value = false
  addFormRef.value?.resetFields()
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addComponentEncoding({
        typeEncodingName: addForm.typeEncodingName,
        encodingCode: addForm.encodingCode
      })
      if (data) {
        $baseMessage("添加分类编码成功！", 'success')
        addVisible.value = false
        addFormRef.value?.resetFields()
        fetchData()
      }
    }
  })
}
const handleDel = async (row: any, index: number) => {
  $baseConfirm("确定要删除此项分类编码吗？", null, async () => {
    const { data } = await delComponentEncoding({
      id: row.id
    })
    if (data) {
      $baseMessage("删除分类编码成功！", 'success')
      list.value.splice(index, 1)
      total.value --
    }
  })
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
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getComponentEncodingList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
</style>