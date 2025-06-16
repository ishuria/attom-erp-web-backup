<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="">
      <el-tab-pane label="未匹配" :name="0">
        <AiTuoMuTable
          :showButtons="true"
          :showActions="false"
          :list="list"
          :loading="listLoading"
          :query-form="queryForm"
          :total="total"
          @export="atmExportVisible = true"
          @import="importVisible = true"
          @match="checkMatch"
          @query="queryData"
          @page-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @obtain-id-list="handleAiTuoMuTabelData"
        />
      </el-tab-pane>
      <el-tab-pane label="已匹配" :name="1">
        <AiTuoMuTable
          :showButtons="false"
          :showActions="true"
          :list="list"
          :loading="listLoading"
          :query-form="queryForm"
          :total="total"
          @query="queryData"
          @page-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @delete-match="deleteMatch"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 发票导入 -->
    <AiTuoMuInvoiceImport from="import" :invoice-matching-visible="importVisible" @update-invoice-matching-visible="updateImportVisible" />
    <!-- 发票匹配 -->
    <AiTuoMuInvoiceImport
      from="match"
      :invoice-matching-visible="matchVisible"
      @update-invoice-matching-visible="updateMatchVisible"
      :idList="selectChildIdList"
    />
    <!-- 催票文件导出 -->
    <vab-dialog title="催票文件导出" v-model="atmExportVisible" width="20%">
      <el-form label-position="top">
        <el-form-item label="发货日期">
          <el-date-picker v-model="date" type="daterange" :disabled-date="(time: Date) => time.getTime() > Date.now()" :clearable="false" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="atmExportVisible = false">取消</el-button>
        <el-button type="primary" :loading="exportLoading" @click="handleExportATM">导出</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getDefaultStringTime } from '/@/utils/dateUtils'
import { downloadFilePD } from '/@/api/devlocal/download'
import { getAiTuoMuList } from '/@/api/devlocal/aiTuoMu'

import { IAiTuoMuItem, IAiTuoMuListReq } from '/@/type/aiTuoMu/aiTuoMuList'

defineOptions({
  name: 'AituomuFapiaoManagement',
})

const date = ref<[string, string]>(getDefaultStringTime())
const activeName = ref<number>(0)
const queryForm = reactive<IAiTuoMuListReq>({
  keyWord: '',
  status: activeName.value,
  pageNo: 1,
  pageSize: 20,
})
const list = ref<IAiTuoMuItem[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const importVisible = ref<boolean>(false)
const matchVisible = ref<boolean>(false)
const atmExportVisible = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const selectChildIdList = ref<number[]>([])
// 打开导出弹窗
// const showExport = () => {
//   atmExportVisible.value = true
// }
const deleteMatch = () => {
  //
}

// 埃托姆发票导出
const handleExportATM = async () => {
  exportLoading.value = true
  await downloadFilePD('/taxRefund/invoice/export', {
    fromDate: date.value[0],
    toDate: date.value[1],
  }).then(() => {
    exportLoading.value = false
  })
}

const checkMatch = () => {
  if (selectChildIdList.value.length === 0) {
    $baseMessage('请选择需要匹配埃托姆发票的零件！！', 'error')
    return
  }
  matchVisible.value = true
}

const updateMatchVisible = () => {
  matchVisible.value = false
}
const updateImportVisible = () => {
  importVisible.value = false
}
const queryData = () => {
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
const fetchData = async () => {
  const { data } = await getAiTuoMuList(queryForm)
  list.value = data.list
}

const handleAiTuoMuTabelData = (data: IAiTuoMuItem[]) => {
  selectChildIdList.value = []
  for (const item of data) {
    selectChildIdList.value.push(item.id)
  }
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;
      }
    }
  }
}
</style>
