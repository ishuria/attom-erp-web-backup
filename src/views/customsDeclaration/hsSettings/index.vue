<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addVisible = true">新增</el-button>
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
    <el-table
      border
      :cell-style="{ textAlign: 'center' }"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column label="法定单位有且仅有千克" min-width="25">
        <template #default="{ row }">
          <el-checkbox v-model="row.isKgFlag" @change="checkIsKgFlg(row)" />
        </template>
      </el-table-column>
      <el-table-column label="HS" min-width="" prop="hs" />
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
          <span>{{ row.taxRate >= 0 ? row.taxRate + '%' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" min-width="" prop="typeName">
        <template #default="{ row }">
          <el-tag v-if="row.typeName" :type="typeNameTagType(row.typeName)">{{ row.typeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="退税生效日" min-width="" prop="taxDate">
        <template #default="{ row }">
          <el-date-picker v-model="row.taxDate" type="date" value-format="YYYY-MM-DD" @focus="copyRow = JSON.parse(JSON.stringify(row))" @change="handleDateChange($event, row)" />
        </template>
      </el-table-column>
      <el-table-column label="征税生效日" min-width="" prop="refundDate">
        <template #default="{ row }">
          <el-date-picker v-model="row.refundDate" type="date" value-format="YYYY-MM-DD" @focus="copyRow = JSON.parse(JSON.stringify(row))" @change="handleDateChange($event, row)" />
        </template>
      </el-table-column>
      <el-table-column label="免税生效日" min-width="" prop="taxExemptionDate">
        <template #default="{ row }">
          <el-date-picker v-model="row.taxExemptionDate" type="date" value-format="YYYY-MM-DD" @focus="copyRow = JSON.parse(JSON.stringify(row))" @change="handleDateChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="征税率" min-width="" prop="levyRate">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.levyRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.levyRate >= 0 ? row.levyRate + '%' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="" prop="">
        <template #default="{ row, $index }">
          <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
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
    <vab-dialog v-model="addVisible" title="新增" width="20%" @close="handleCloseAdd">
      <el-form ref="addFormRef" label-position="right" label-width="auto" :model="addForm" :rules="addFormRules" style="margin: 0">
        <el-form-item label="HS" prop="hs">
          <el-input v-model="addForm.hs" />
        </el-form-item>
        <el-form-item label="法定第1单位" prop="statutoryUnit">
          <el-input v-model="addForm.statutoryUnit" />
        </el-form-item>
        <el-form-item label="出口退税税率" prop="taxRate">
          <el-input v-model="addForm.taxRate" type="number">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="退税生效日" prop="taxDate">
          <el-date-picker v-model="addForm.taxDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="征税生效日" prop="refundDate">
          <el-date-picker v-model="addForm.refundDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="免税生效日" prop="taxExemptionDate">
          <el-date-picker v-model="addForm.taxExemptionDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="征税率" prop="levyRate">
          <el-input v-model="addForm.levyRate" type="number">
            <template #append>%</template>
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
import { isEqual } from 'lodash-es'
import { addHSList, delHSList, getHSList, updateHSList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type { IAddHSListReq, IGetHSList, IGetHSListReq } from '/@/type/customsDeclarationAndTaxRefund/hsHts'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'HSettings',
})

const router = useRouter()
const route = useRoute()
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetHSList[]>([])
const queryForm = reactive<IGetHSListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
let copyRow: IGetHSList | null = null
const addVisible = ref<boolean>(false)
const addForm = reactive<any>({})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules<IAddHSListReq>>({
  hs: [{ required: true, message: '请输入HS', trigger: 'blur' }],
  statutoryCount: [{ required: true, message: '请输入每零件单位有多少个法定第1单位', trigger: 'blur' }],
})
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      if (!addForm.taxDate && !addForm.refundDate && !addForm.taxExemptionDate) {
        $baseMessage('退税生效日、征税生效日、免税生效日必须填一个', 'warning')
        return
      }

      const { data } = await addHSList({
        ...addForm,
        taxRate: addForm.taxRate / 100,
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        handleCloseAdd()
        queryData()
      }
    }
  })
}
const checkIsKgFlg = async (val: IGetHSList) => {
  try {
    await updateHSList({
      ...val,
      taxRate: val.taxRate / 100,
    })
  } catch {
    Object.assign(val, copyRow)
  }
}
const typeNameTagType = (name: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' => {
  const map: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = { 征税: 'danger', 退税: 'success', 免税: 'primary' }
  return map[name] ?? 'primary'
}

const handleDateChange = async (val: string | null, row: IGetHSList) => {
  if (!row.taxDate && !row.refundDate && !row.taxExemptionDate) {
    $baseMessage('退税生效日、征税生效日、免税生效日不能全部为空', 'warning')
    Object.assign(row, copyRow)
    return
  }
  try {
    await updateHSList({
      ...row,
      taxRate: row.taxRate / 100,
      levyRate: row.levyRate / 100,
    })
    fetchData()
  } catch {
    Object.assign(row, copyRow)
  }
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
  const rootElement = getRootElement(event.srcElement, '.cell')

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
    // 执行失去焦点处理逻辑
    try {
      await updateHSList({
        ...value,
        taxRate: value.taxRate / 100,
        levyRate: value.levyRate / 100,
      })
    } catch {
      Object.assign(value, copyRow)
    }
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
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getHSList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    item.taxRate = parseFloat((item.taxRate * 100).toFixed(2))
    item.levyRate = parseFloat((item.levyRate * 100).toFixed(2))
  })
  listLoading.value = false
}
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  fetchData()
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}

:deep(.el-table .cell) {
  height: 40px;
  line-height: 40px;
  padding: 0 4px;
  overflow: hidden;
}
</style>
