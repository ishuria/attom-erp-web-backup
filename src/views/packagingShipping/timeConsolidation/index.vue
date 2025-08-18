<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <!-- <vab-query-form-top-panel>
        <strong style="font-size: larger;">工时合并计算的SKU设定</strong>
      </vab-query-form-top-panel> -->
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleOpenAddClass">新增合并分类</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="listLoading" border :data="list" :header-cell-style="{ textAlign: 'center' }" :span-method="objectSpanMethod">
      <el-table-column align="center" fixed="left" label="操作" width="120">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleOpenAdd(row)">添加SKU</el-button>
          <el-button text type="danger" @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" prop="createTime">
        <template #default="{ row }">
          {{ row.createTime != null ? formatDate(new Date(row.createTime)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="合并分类组名" prop="groupName" />
      <el-table-column align="center" label="添加日期" prop="addDate">
        <template #default="{ row }">
          {{ row.addDate != null ? formatDate(new Date(row.addDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加人" prop="addPerson" />
      <el-table-column label="SKU" prop="sku" />
      <el-table-column label="产品" prop="desc" />
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button text type="danger" @click="handleDelSku(row, $index)">删除</el-button>
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
    <!-- 使用封装的SKU选择对话框组件 -->
    <sku-select-dialog
      v-model="addClassVisible"
      :group-name="groupName"
      :show-group-name="true"
      title="新增合并分类"
      @confirm="handleConfirmAddClass"
    />

    <sku-select-dialog v-model="addVisible" :show-group-name="false" title="添加SKU" @confirm="handleConfirmSku" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import {
  addPackagingTimeConsolidation,
  addSkuPackagingTimeConsolidation,
  deletePackagingTimeConsolidation,
  deleteSkuPackagingTimeConsolidation,
  getPackagingTimeConsolidationList,
} from '/@/api/devlocal/packagingShipping'
import { useUserStore } from '/@/store/modules/user'
import type {
  IGetPackagingTimeConsolidationList,
  IGetPackagingTimeConsolidationListReq,
} from '/@/type/packagingShipping/timeConsolidationType'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'TimeConsolidation',
})

const router = useRouter()
const route = useRoute()
// 这些变量现在由SkuSelectDialog组件内部管理
const addVisible = ref<boolean>(false)
const addClassVisible = ref<boolean>(false)
const queryForm = reactive<IGetPackagingTimeConsolidationListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<any[]>([])
let copyRow: IGetPackagingTimeConsolidationList
const useUser = useUserStore()
const currentUser = useUser.getUsername
const groupName = ref<string>('')

const handleOpenAddClass = async () => {
  addClassVisible.value = true
}
const handleConfirmSku = async (data: { transferValue: number[]; groupName?: string }) => {
  if (data.transferValue.length === 0) {
    $baseMessage('您未选择任何SKU', 'error')
    return
  }
  const { data: result } = await addSkuPackagingTimeConsolidation({
    groupId: copyRow.groupId!,
    skuIds: data.transferValue,
    addPerson: currentUser,
  })
  if (result) {
    $baseMessage('添加SKU成功！', 'success')
    addVisible.value = false
    queryData()
  }
}
const handleDel = async (row: IGetPackagingTimeConsolidationList) => {
  $baseConfirm('确定要删除此分类吗？', null, async () => {
    const { data } = await deletePackagingTimeConsolidation({ id: row.groupId! })
    if (data) {
      $baseMessage('删除此分类成功！', 'success')
      queryData()
    }
  })
}
const handleDelSku = async (row: IGetPackagingTimeConsolidationList, index: number) => {
  $baseConfirm('确定要删除此SKU吗？', null, async () => {
    const { data } = await deleteSkuPackagingTimeConsolidation({ id: row.skuId! })
    if (data) {
      $baseMessage('删除此SKU成功！', 'success')
      list.value.splice(index, 1)
    }
  })
}

const handleConfirmAddClass = async (data: { transferValue: number[]; groupName?: string }) => {
  if (!data.groupName) {
    $baseMessage('请输入分类名！', 'warning')
    return
  }
  if (data.transferValue.length === 0) {
    $baseMessage('您未选择任何SKU', 'error')
    return
  }
  const { data: result } = await addPackagingTimeConsolidation({
    groupName: data.groupName,
    skuIds: data.transferValue,
    addPerson: currentUser,
  })
  if (result) {
    $baseMessage('新增合并分类成功！', 'success')
    addClassVisible.value = false
    groupName.value = ''
    queryData()
  }
}

const handleOpenAdd = (row: IGetPackagingTimeConsolidationList) => {
  addVisible.value = true
  copyRow = row
}
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    // 获取当前row的零件id
    const groupId = row.groupId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].groupId === groupId) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].groupId !== groupId) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getPackagingTimeConsolidationList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const queryData = async () => {
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
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  fetchData()
})
</script>

<style lang="scss" scoped>
// Transfer Element
.transfer-container {
  :deep() {
    .el-transfer-panel {
      width: 43%;
      &__body {
        height: 500px !important;
      }
      &__footer {
        height: 72px;
      }
    }
  }
}
</style>
