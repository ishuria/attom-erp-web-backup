<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="入库明细数据" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleExport">导出</el-button>
            <span style="margin: 0 10px calc(var(--el-margin) / 2) 0">
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
          <el-table-column label="供应商名称" min-width="130" prop="suppliser" />
          <el-table-column label="PO" min-width="90" prop="po" />
          <el-table-column label="产品名称/型号" min-width="130" prop="sku" />
          <el-table-column label="品名" prop="componentName" :width="flexColumnWidth(list, '品名', 'componentName')" />
          <el-table-column label="数量" min-width="90" prop="purchaseCount" />
          <el-table-column label="PO未税价格" min-width="90" prop="preTaxPrice" />
          <el-table-column label="备注" min-width="90" prop="remark" />
          <!-- <el-table-column label="操作" fixed="right" width="100">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showInOrDe">调增调减</el-link>
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
      </el-tab-pane>
      <el-tab-pane label="PO零件汇总" :name="1">

        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handlePoComponentExport">入库PO零件汇总导出</el-button>
            <span style="margin: 0 10px calc(var(--el-margin) / 2) 0">
              <el-date-picker
                v-model="componentSummaryDate"
                :clearable="false"
                :editable="false"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                @change="queryComponentSummaryData"
              />
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="componentSummaryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="componentSummaryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryComponentData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          border
          :data="componentSummaryList"
          class="noneHoverTable"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="componentSummaryRowClassName"
        >
          <el-table-column label="供应商名称" min-width="130" prop="suppliser" />
          <el-table-column label="PO" min-width="130" prop="po" />
          <el-table-column label="Sku" min-width="130" prop="sku" />
          <el-table-column label="零件名" min-width="130" prop="componentName" />
          <el-table-column label="已入库数量" min-width="130" prop="inboundCount" />
          <el-table-column label="PO零件总数" min-width="130" prop="purchaseCount" />
          <el-table-column label="零件单位" min-width="130" prop="unit" />
          <el-table-column label="已入库的零件未税价" min-width="130" prop="poPreTaxPrice" />
          <el-table-column label="发票未税价" min-width="130" prop="invoicePrice" />
          <el-table-column label="未匹配发票金额" min-width="130" prop="diffPrice" />

          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>

        <vab-pagination
          :current-page="componentSummaryForm.pageNo"
          :page-size="componentSummaryForm.pageSize"
          :total="componentSummaryTotal"
          @current-change="componentSummaryHandleCurrentChange"
          @size-change="componentSummaryHandleSizeChange"
        />

      </el-tab-pane>
      <el-tab-pane label="供应商汇总" :name="2">

        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleSuppliserExport">入库汇总导出</el-button>
            <span style="margin: 0 10px calc(var(--el-margin) / 2) 0">
              <el-date-picker
                v-model="supplierSummaryDate"
                :clearable="false"
                :editable="false"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                @change="querySupplierSummaryData"
              />
            </span>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="supplierSummaryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="supplierSummaryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="querySuppliserData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          border
          :data="supplierSummaryList"
          class="noneHoverTable"
          :header-cell-style="{ textAlign: 'center' }"
          :summary-method="handleSummaryMethod"
          show-summary
        >
          <el-table-column label="供应商名称" min-width="130" prop="supplierName" />
          <el-table-column label="PO未税价" min-width="130" prop="preTaxPrice" />
          <el-table-column label="发票未税价" min-width="130" prop="invoicePrice" />
          <el-table-column label="未匹配发票金额" min-width="130" prop="diffPrice" />

          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>

        <vab-pagination
          :current-page="supplierSummaryForm.pageNo"
          :page-size="supplierSummaryForm.pageSize"
          :total="supplierSummaryTotal"
          @current-change="supplierSummaryHandleCurrentChange"
          @size-change="supplierSummaryHandleSizeChange"
        />

      </el-tab-pane>
    </el-tabs>

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
import type { TabsPaneContext } from 'element-plus'
import type { TableColumnCtx } from 'element-plus'
import type { CSSProperties } from 'vue'
import { downloadFilePD } from '~/src/api/devlocal/download'
import { getInboundList,queryInboundSummaryList,queryInboundSummaryComponentList } from '/@/api/devlocal/finance'
import type { IGetInBoundList, IGetOutBoundListReq,IGetInboundSummaryItem,IGetInboundSummaryComponentItem } from '/@/type/finance/financeType'
import { formatDate, getDefaultStringTime, getThisYearStringTime } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Inbound',
})

const router = useRouter()
const activeName = ref<number>(0)
const date = ref<[string, string]>(getDefaultStringTime())
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetInBoundList[]>([])

const queryForm = reactive<IGetOutBoundListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  fromDate: date.value[0],
  toDate: date.value[1],
})

const supplierSummaryDate = ref<[string, string]>(getThisYearStringTime())
const supplierSummaryTotal = ref<number>(0)
const supplierSummaryList = ref<IGetInboundSummaryItem[]>([])
const  supplierSummaryForm = reactive<IGetOutBoundListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  fromDate: supplierSummaryDate.value[0],
  toDate: supplierSummaryDate.value[1],
})

const componentSummaryDate = ref<[string, string]>(getThisYearStringTime())
const componentSummaryTotal = ref<number>(0)
const componentSummaryList = ref<IGetInboundSummaryComponentItem[]>([])
const componentSummaryForm = reactive<IGetOutBoundListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  fromDate: componentSummaryDate.value[0],
  toDate: componentSummaryDate.value[1],
})

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.purchaseCount < 0) {
    return 'danger-row'
  }
}

const componentSummaryRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.status === false) {
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
    toDate: date.value[1],
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

/** po零件汇总 start */
const queryComponentSummaryData = () => {
  componentSummaryForm.fromDate = date.value[0]
  componentSummaryForm.toDate = date.value[1]
  fetchComponentSummaryData()
}

const componentSummaryHandleCurrentChange = (value: number) => {
  componentSummaryForm.pageNo = value
  fetchComponentSummaryData()
}
const componentSummaryHandleSizeChange = (value: number) => {
  componentSummaryForm.pageNo = 1
  componentSummaryForm.pageSize = value
  fetchComponentSummaryData()
}

const queryComponentData = async () =>{
  componentSummaryForm.pageNo = 1
  fetchComponentSummaryData()
}

const handlePoComponentExport = async () =>{
  await downloadFilePD('/inbound/export/component', {
    fromDate: componentSummaryDate.value[0],
    toDate: componentSummaryDate.value[1],
  })
}

/** po零件汇总 end */


/** 供应商汇总 start */
const querySupplierSummaryData = () => {
  supplierSummaryForm.fromDate = date.value[0]
  supplierSummaryForm.toDate = date.value[1]
  fetchSupplierSummaryData()
}

const supplierSummaryHandleCurrentChange = (value: number) => {
  supplierSummaryForm.pageNo = value
  fetchSupplierSummaryData()
}
const supplierSummaryHandleSizeChange = (value: number) => {
  supplierSummaryForm.pageNo = 1
  supplierSummaryForm.pageSize = value
  fetchSupplierSummaryData()
}

const querySuppliserData  = async()=>{
  supplierSummaryForm.pageNo = 1
  fetchSupplierSummaryData()
}

const handleSuppliserExport = async () =>{
  await downloadFilePD('/inbound/export/supplier', {
    fromDate: supplierSummaryDate.value[0],
    toDate: supplierSummaryDate.value[1],
  })
}


const handleSummaryMethod = ({ columns, data }: { columns: any[], data: any[] }): any[] => {

  const sums: string[] = [];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'; // 第一列显示“合计”字样
      return;
    }

    // 对特定字段执行求和
    if (['invoicePrice', 'preTaxPrice', 'diffPrice'].includes(column.property)) {
      const total = data.reduce((sum, row) => {
        const value = Number(row[column.property]);
        return isNaN(value) ? sum : sum + value;
      }, 0);
      sums[index] = total.toFixed(2); // 保留两位小数
    } else {
      // 其他列不显示合计
      sums[index] = '';
    }
  });

  return sums;
}
/** 供应商汇总 end */


const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const handleTabClick = (pane: TabsPaneContext) => {
  if (pane.props.name != undefined) {
    const tabValue = Number(pane.props.name)
    activeName.value = tabValue
    if (tabValue === 1){
      fetchComponentSummaryData()

    }else if (tabValue === 2){

      fetchSupplierSummaryData()
    }else{
      fetchData()
    }
    router.push({
      query: {
        tab: tabValue,
        pageNo: '1',
        pageSize: queryForm.pageSize,
      },
    })
  }
}

const fetchSupplierSummaryData = async () => {
  const { data } = await queryInboundSummaryList(supplierSummaryForm)
  supplierSummaryTotal.value = data?.total!
  supplierSummaryList.value = data?.list!
}

const fetchComponentSummaryData = async () => {
  const { data } = await queryInboundSummaryComponentList(componentSummaryForm)
  componentSummaryTotal.value = data?.total!
  componentSummaryList.value = data?.list!
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

        .vab-query-form {
          .left-panel {
            //自加
            margin-bottom: 5px;
          }

          .right-panel {
            margin-bottom: 5px;

            .el-input {
              width: 13em;
            }
          }

          // .el-form {
          //   .el-form-item:first-child {
          //     margin: 0 !important;

          //     .el-check-tag,
          //     .el-form-item__label {
          //       margin: 0 10px 5px 0;
          //       border-radius: 99px;
          //     }
          //   }
          // }
        }

        .noneHoveTable .el-checkbox {
          transform: scale(1.3);
          transform-origin: center;
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
</style>
