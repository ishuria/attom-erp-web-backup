<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addVisible = true">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      border :cell-style="{ textAlign: 'center' }" 
      class="noneHoverTable"
      :data="list" :header-cell-style="{ textAlign: 'center'}"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column label="HS" min-width="" prop="hs"/>
      <el-table-column label="法定第1单位" min-width="" prop="statutoryUnit">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.statutoryUnit" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.statutoryUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出口退税税率" min-width="" prop="taxRate">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.taxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.taxRate ? row.taxRate + '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="" prop="">
        <template #default="{ row, $index }">
          <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"/>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <vab-dialog
      v-model="addVisible"
      title="新增"
      width="20%"
      @close="handleCloseAdd"
    >
      <el-form ref="addFormRef" label-position="right" label-width="auto" :model="addForm" :rules="addFormRules" style="margin: 0;">
        <el-form-item label="HS" prop="hs">
          <el-input v-model="addForm.hs" />
        </el-form-item>
        <el-form-item label="法定第1单位" prop="statutoryUnit">
          <el-input v-model="addForm.statutoryUnit" />
        </el-form-item>
        <el-form-item label="出口退税税率" prop="taxRate">
          <el-input v-model="addForm.taxRate" type="number" >
            <template #append>
              %
            </template>
          </el-input>
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
import type { FormInstance, FormRules } from 'element-plus'
import { isEqual } from 'lodash'
import { addHSList, delHSList, getHSList, updateHSList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type { IAddHSListReq, IGetHSList, IGetHSListReq } from '/@/type/customsDeclarationAndTaxRefund/hsHts'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'HS'
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetHSList[]>([])
const queryForm = reactive<IGetHSListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
let copyRow: IGetHSList | null = null
const addVisible = ref<boolean>(false)
const addForm = reactive<any>({})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules<IAddHSListReq>>({
  hs: [{ required: true, message: '请输入HS', trigger: 'blur' }],
  statutoryCount: [{ required: true, message: '请输入每零件单位有多少个法定第1单位', trigger: 'blur' }],
  taxRate: [{ required: true, message: '请输入出口退税税率', trigger: 'blur' }],
})
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addHSList({
        ...addForm,
        taxRate: addForm.taxRate / 100
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        handleCloseAdd()
        queryData()
      }
    }
  })
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {

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
// table blur事件
const clickCancel = async (event: any, value: IGetHSList) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateHSList({
      ...value,
      taxRate: value.taxRate / 100
    })
  }
}
const handleDel = async (row: IGetHSList, index: number) => {
  $baseConfirm('确定要删除HS吗？', null, async () => {
    const { data } = await delHSList({ id: row.id })
    if (data) {
      $baseMessage('删除HS成功！', 'success')
      list.value.splice(index, 1)
    }
  })
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
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getHSList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    item.taxRate = parseFloat((item.taxRate * 100).toFixed(2))
  })
  listLoading.value = false
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

</style>