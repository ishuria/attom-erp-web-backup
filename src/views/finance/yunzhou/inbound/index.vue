<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <span style="margin: 0 10px calc(var(--el-margin) / 2) 0;">
          <el-date-picker
            v-model="date"
            :clearable="false"
            :editable="false"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            @change="queryDateData"
          />
        </span>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="签收日期" min-width="120" prop="signDate">
        <template #default="{ row }">
          {{ formatDate(new Date(row.signDate)) }}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" min-width="130" prop="suppliser"/>
      <el-table-column label="PO" min-width="90" prop="po"/>
      <el-table-column label="产品名称/型号" min-width="130" prop="sku"/>
      <el-table-column label="品名" prop="componentName" :width="flexColumnWidth(list, '品名', 'componentName')" />
      <el-table-column label="数量" min-width="90" prop="purchaseCount"/>
      <el-table-column label="价格" min-width="90" prop="preTaxPrice"/>
      <el-table-column label="备注" min-width="90" prop="remark"/>
      <!-- <el-table-column label="操作" fixed="right" width="100">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showInOrDe">调增调减</el-link>
        </template>
      </el-table-column> -->
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
    <!-- 调增调减 -->
    <!-- <vab-dialog
      title="调增调减"
      v-model="inOrDeVisible"
      width="25%"
    >
      <el-form class="inOrDeForm" :model="inOrDeForm" label-position="top" style="margin-left: 20px; margin-right: 20px" >
        <el-form-item label="到货日期">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="供应商">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="PO">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="SKU">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="品名">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="shipmentID">
          <div style="width: 83%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="调整数量">
          <div style="width: 83%; margin-right: 30px">
            <el-input type="number" />
          </div>
          <span class="custom-checkbox" style="width: 10%;">
            <el-checkbox :true-value="1" :false-value="0">红冲</el-checkbox>
          </span>
        </el-form-item>
        <el-form-item label="调整价格">
          <div style="width: 83%">
            <el-input type="number" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { downloadFilePD } from '~/src/api/devlocal/download'
import { getInboundList } from '/@/api/devlocal/finance'
import type { IGetInBoundList, IGetOutBoundListReq } from '/@/type/finance/financeType'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

const date = ref<[string, string]>(getDefaultStringTime())
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetInBoundList[]>([])
const queryForm = reactive<IGetOutBoundListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  fromDate: date.value[0],
  toDate: date.value[1]
})

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: any
  rowIndex: number
}) => {
  if (row.purchaseCount < 0) {
    return 'danger-row'
  }
}
// 调增调减可见
// const inOrDeVisible = ref<boolean>(false)
// const inOrDeForm = reactive<any>({

// })
// 展示调增调减
// const showInOrDe = () => {
//   inOrDeVisible.value = true
// }
const handleExport = async () => {
  await downloadFilePD('/inbound/export', {
    fromDate: date.value[0],
    toDate: date.value[1]
  })
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const queryDateData = () => {
  queryForm.fromDate = date.value[0]
  queryForm.toDate = date.value[1]
  queryData()
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
const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 3 || data.columnIndex === 4) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getInboundList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  listLoading.value = false
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.inOrDeForm {
  :deep() {
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: var(--el-color-danger);
    }
    // .el-checkbox__input.is-checked .el-checkbox__inner {
    //   color: var(--el-color-danger);
    //   border-color: var(--el-color-danger);
    // }
  }
}
.noneHoverTable :deep(.danger-row) {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>