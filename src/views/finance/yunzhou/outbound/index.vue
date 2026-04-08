<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="10">
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button type="primary" @click="showWhVerify">入库核对</el-button>
        <el-button type="primary" @click="showSummary">导出未匹配发票汇总信息</el-button>
        <el-date-picker
          v-model="date"
          :clearable="false"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style="max-width: 20em; margin: 0 10px calc(var(--el-margin) / 2) 0"
          type="daterange"
          @change="queryDateData"
        />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
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
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      stripe
    >
      <el-table-column label="报关单出库日期" min-width="130" prop="outboundDate">
        <template #default="{ row }">
          {{ formatDate(new Date(row.outboundDate)) }}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" prop="suppliser" :width="flexColumnWidth(list, '供应商名称', 'suppliser')" />
      <el-table-column label="PO" min-width="90" prop="po" />
      <el-table-column label="产品名称/型号" prop="sku" :width="flexColumnWidth(list, '产品名称/型号', 'sku')" />
      <el-table-column label="报关品名" min-width="200" prop="customDeclarationName" />
      <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')" />
      <el-table-column label="零件数量" min-width="100" prop="quantity" />
      <el-table-column label="未税总价￥" min-width="110" prop="preTaxPrice" />
      <el-table-column label="含税总价￥" min-width="110" prop="taxInclusivePrice" />
      <el-table-column label="销售价格$" min-width="110" prop="salePrice" />
      <el-table-column label="Shipment ID" prop="shipmentId" :width="flexColumnWidth(list, 'Shipment ID', 'shipmentId')" />
      <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')" />
      <el-table-column label="操作时间" min-width="150" prop="createTime" />
      <el-table-column label="备注" min-width="150" prop="remark" />
      <!-- <el-table-column label="操作" prop="" width="140">
        <template #default="{ row }">
          <el-link type="primary" underline='never' @click="showModify(row)">修改</el-link>
          <el-link type="primary" underline='never' @click="showInOrDe(row)">调增调减</el-link>
        </template>
      </el-table-column> -->
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
    <!-- 修改 -->
    <!-- <vab-dialog
      title="修改"
      v-model="modifyVisible"
      width="20%"
    >
      <el-form ref="modifyFormRef" :model="modifyForm" :rules="modifyRules" label-position="top" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="未税总价" prop="price1">
          <el-input v-model="modifyForm.price1" type="number" clearable />
        </el-form-item>
        <el-form-item label="含税总价" prop="price2">
          <el-input v-model="modifyForm.price2" type="number" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModify">确认</el-button>
      </template>
    </vab-dialog> -->
    <!-- 调增调减 -->
    <!-- <vab-dialog
      title="调增调减"
      v-model="inOrDeVisible"
      width="25%"
      top="10vh"
    >
      <el-form class="inOrDeForm" label-position="top" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="到货日期">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="供应商">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="PO">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="SKU">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="品名">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="Shipment Id">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
        <el-form-item label="调整数量">
          <div style="width: 80%; margin-right: 20px;">
            <el-input type="number" />
          </div>
          <span style="width: 5%;">
            <el-checkbox>红冲</el-checkbox>
          </span>
        </el-form-item>
        <el-form-item label="调整未税总价￥">
          <div style="width: 80%">
            <el-input type="number" />
          </div>
        </el-form-item>
        <el-form-item label="调整销售价格$">
          <div style="width: 80%">
            <el-input type="number" />
          </div>
        </el-form-item>
        <el-form-item label="调整销售价格￥">
          <div style="width: 80%">
            <el-input disabled />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog> -->

    <!-- 入库核对 -->
    <vab-dialog v-model="whVerifyVisible" title="入库核对" width="60%">
      <vab-query-form>
        <vab-query-form-left-panel :span="6">
          <el-button type="primary" @click="toggleNotAllDeclared">
            {{ showNotAllDeclared ? '隐藏未全部报关' : '展示未全部报关' }}
          </el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel :span="18">
          <el-form inline :model="whVerifyForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="whVerifyForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="whQueryData"
                @keyup.enter="whQueryData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="whVerifyListLoading" native-type="submit" type="primary" @click="whQueryData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border :data="paginatedList" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column align="center" label="出库日期" min-width="110" prop="outboundDate">
          <template #default="{ row }">
            {{ formatDate(new Date(row.outboundDate)) }}
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" prop="suppliser" :width="flexColumnWidth(checkList, '供应商名称', 'suppliser')" />
        <el-table-column label="PO" min-width="100" prop="po" />
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(checkList, 'SKU', 'sku')" />
        <el-table-column label="品名" min-width="100" prop="customDeclarationName" />
        <el-table-column align="center" label="数量" min-width="90" prop="quantity" />
        <el-table-column label="Shipment ID" prop="shipmentId" :width="flexColumnWidth(checkList, 'Shipment ID', 'shipmentId')" />
        <el-table-column label="合同编号" min-width="140" prop="contractNumber" />
        <el-table-column
          label="错误类型"
          min-width="150"
          prop="remark"
          :width="calculateBrColumnWidth(checkList, (row: any) => row.remark, 100)"
        >
          <template #default="{ row }">
            <div v-html="row.remark"></div>
          </template>
        </el-table-column>
      </el-table>
      <vab-pagination
        :current-page="whVerifyForm.pageNo"
        :page-size="whVerifyForm.pageSize"
        :total="whTotal"
        @current-change="handleWhCurrentChange"
        @size-change="handleWhSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { downloadFilePD } from '/@/api/devlocal/download'
import { checkOutboundNotMatchInvoiceExport, getOutBoundList, getOutboundInventoryCheck } from '/@/api/devlocal/finance'
import type { IGetOutBoundList, IGetOutboundInventoryCheckList } from '/@/type/finance/financeType'
import { formatDate, getDefaultStringTime } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Outbound',
})
const date = ref<[string, string]>(getDefaultStringTime())
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const list = ref<IGetOutBoundList[]>([])
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
// 入库核对
const checkList = ref<IGetOutboundInventoryCheckList[]>([])
const whVerifyVisible = ref<boolean>(false)
const whVerifyForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 10,
})
const filteredList = computed(() => {
  // 如果有关键词则过滤数据
  if (whVerifyForm.keyWord) {
    return checkList.value.filter((item) => item.suppliser.toLowerCase().includes(whVerifyForm.keyWord.toLowerCase()))
  }
  return checkList.value
})

// 计算分页后的数据
const paginatedList = computed(() => {
  const start = (whVerifyForm.pageNo - 1) * whVerifyForm.pageSize
  const end = start + whVerifyForm.pageSize
  return filteredList.value.slice(start, end)
})

const whVerifyListLoading = ref<boolean>(false)
const showNotAllDeclared = ref<boolean>(false)
const whQueryData = () => {
  whVerifyForm.pageNo = 1
}
const whTotal = ref<number>(0)
const handleWhCurrentChange = (value: number) => {
  whVerifyForm.pageNo = value
}
const handleWhSizeChange = (value: number) => {
  whVerifyForm.pageNo = 1
  whVerifyForm.pageSize = value
}
const showWhVerify = async () => {
  whVerifyVisible.value = true
  const { data } = await getOutboundInventoryCheck(showNotAllDeclared.value ? 1 : 0)
  if (data) {
    checkList.value = data
    whTotal.value = data.length
  }
}
const toggleNotAllDeclared = async () => {
  showNotAllDeclared.value = !showNotAllDeclared.value
  await showWhVerify()
}

const showSummary = async () => {
  const { data } = await checkOutboundNotMatchInvoiceExport({
    fromDate: formatDate(new Date(date.value[0])),
    toDate: formatDate(new Date(date.value[1])),
  })
  if (data) {
    await downloadFilePD('/outbound/notMatch/invoiceExport', {
      fromDate: formatDate(new Date(date.value[0])),
      toDate: formatDate(new Date(date.value[1])),
    })
  }
}

// 调增调减展示
// const inOrDeVisible = ref<boolean>(false)

// 修改false
// const modifyVisible = ref<boolean>(false)
// const modifyForm = reactive<any>({

// })
// const modifyFormRef = ref<FormInstance>()
// const modifyRules = reactive<any>({
//   price1: [{ required: 'true', message: '请输入未税总价', trigger: 'blur' }],
//   price2: [{ required: 'true', message: '请输入含税总价', trigger: 'blur' }]
// })
// const confirmModify = () => {
//   modifyFormRef.value?.validate((isValid: boolean) => {
//     if (isValid) {

//     }
//   })
// }
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.redStatus === 1) {
    return 'danger-row'
  }
  return ''
}

// 导出
const handleExport = async () => {
  await downloadFilePD('/outbound/export', {
    fromDate: formatDate(new Date(date.value[0])),
    toDate: formatDate(new Date(date.value[1])),
  })
    .then(() => {})
    .catch((error) => {
      $baseMessage(error, 'error')
    })
}
// 展示修改
// const showModify = (row: any) => {
//   modifyVisible.value = true
// }
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}
const queryDateData = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 监听日期变化，确保数据及时更新
watch(
  () => date.value,
  () => {
    queryDateData()
  },
  { deep: true }
)
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (
    data.columnIndex === 1 ||
    data.columnIndex === 3 ||
    data.columnIndex === 4 ||
    data.columnIndex === 5 ||
    data.columnIndex === 10 ||
    data.columnIndex === 11
  ) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const fetchData = async () => {
  queryForm.fromDate = formatDate(new Date(date.value[0]))
  queryForm.toDate = formatDate(new Date(date.value[1]))
  listLoading.value = true
  const { data } = await getOutBoundList(queryForm)
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

.noneHoveTable {
  :deep() {
    .danger-row > td {
      background-color: var(--el-color-danger-light-9) !important;
    }

    td {
      background-color: #ffffff !important;
    }
  }
}
</style>
