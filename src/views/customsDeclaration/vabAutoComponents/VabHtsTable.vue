<template>
  <div class="hts-table">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleShowAdd">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="localQueryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="localQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      style="flex: 1"
      @cell-click="changeInput"
    >
      <el-table-column label="HTS" min-width="110" prop="hts" :width="flexColumnWidth(list, 'HTS', 'hts')" />
      <el-table-column label="关税率" min-width="90" prop="tariffRate" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.tariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.tariffRate != null ? row.tariffRate + '%' : '' }}</span>
        </template>
      </el-table-column>
      <slot name="rate-columns"></slot>
      <el-table-column label="杂费" min-width="90" prop="extras" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.extras" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.extras != null ? row.extras + '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品大类" min-width="250" prop="productCategory">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.productCategory }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.productCategory }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="1级大类" min-width="250" prop="categoryOne">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.categoryOne }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.categoryOne }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="2级大类" min-width="250" prop="categoryTwo">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.categoryTwo }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.categoryTwo }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="3级大类" min-width="250" prop="categoryThree">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.categoryThree }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.categoryThree }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template #default="{ row, $index }">
          <el-button text type="primary" @click="handleShowView(row)">查看</el-button>
          <el-button text type="danger" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"/>
      </template>
    </el-table>
    <vab-pagination
      :current-page="localQueryForm.pageNo"
      :page-size="localQueryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { updateHTSList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type { IGetHTSList, IGetHTSListReq } from '/@/type/customsDeclarationAndTaxRefund/hsHts'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabHtsTable',
})

const props = defineProps<{
  list: IGetHTSList[]
  queryForm: IGetHTSListReq
  total: number
}>()
const emit = defineEmits<{
  (e: 'add'): void
  (e: 'current-change', pageNo: number): void
  (e: 'size-change', pageSize: number): void
  (e: 'query-data', keyWord?: string): void
  (e: 'view', row: IGetHTSList): void
  (e: 'delete', row: IGetHTSList, index: number): void
  (e: 'update:remark', row: IGetHTSList, prop: string): void
}>()
// 本地状态
const localQueryForm = reactive<IGetHTSListReq>({
  pageNo: 1,
  pageSize: 10,
  keyWord: '',
  type: 0,
})

// 监听 props 变化
watch(
  () => props.queryForm,
  (newVal) => {
    Object.assign(localQueryForm, newVal)
  },
  { 
    immediate: true,
    deep: true 
  }
)
// const router = useRouter()
const listLoading = ref<boolean>(false)
// const list = ref<IGetHTSList[]>([])
let copyRow: IGetHTSList | null = null
// 展示新增
const handleShowAdd = () => {
  emit('add')
}
// 展示查看
const handleShowView = (row: IGetHTSList) => {
  emit('view', row)
}
// 删除
const handleDelete = (row: IGetHTSList, index: number) => {
  emit('delete', row, index)
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  switch (column.label) {
    case '产品大类':
    case '1级大类':
    case '2级大类':
    case '3级大类': {
      emit('update:remark', row, column.property)

      break;
    }
   
    default: {
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
  }
}
// table blur事件
const clickCancel = async (event: any, value: IGetHTSList) => {
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
    try {
      await updateHTSList({
        id: value.id,
        tariffRate: value.tariffRate! / 100,
        threeZeroOne: value.threeZeroOne! / 100,
        extras: value.extras! / 100,
        type: props.queryForm.type
      })
    } catch {
      Object.assign(value, copyRow)
    }
    
    // else if (props.queryForm.type === 1) {
    //   try {
    //     await updateHTSList({
    //       id: value.id,
    //       deTariffRate: value.deTariffRate! / 100,
    //       ukTariffRate: value.ukTariffRate! / 100,
    //       extras: value.extras! / 100,
    //       type: 1
    //     })
    //   } catch {
    //     Object.assign(value, copyRow)
    //   }
    // }
  }
}
const handleCurrentChange = (value: number) => {
  emit('current-change', value)
}
const handleSizeChange = (value: number) => {
  emit('size-change', value)
}
const queryData = () => {
  emit('query-data', localQueryForm.keyWord)
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '关税率' || label === '301税率' || label === '杂费') {
    return {
      textAlign: 'center',
      cursor: 'pointer'
    }
  } else if (label === 'HTS') {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
    cursor: 'pointer'
  }
}

</script>

<style lang="scss" scoped>
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
.none {
  display: none;
}
</style>
