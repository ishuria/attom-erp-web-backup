<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待退税" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel >
            <el-button type="primary">出口发票生成（云舟）</el-button>
            <el-button type="primary" @click="handleExportAiTuoMu">出口发票生成（埃托姆）</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline @submit.prevent :model="queryForm">
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :data="list"
          class="noneHoveTable"
          @cell-click="cellClick"
          @selection-change="setSelectRows"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="发货日期" prop="shipmentDate" min-width="115">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : ''  }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" prop="exportDate" min-width="120">
            <template #default="{ row }">
              <el-date-picker
                type="date"
                style="width: 100%;"
                v-model="row.exportDate"
                value-format="YYYY-MM-DD"
                @change="handleUpdateDate(row)"
              >
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNumber" min-width="200"></el-table-column>
          <el-table-column label="未到发票" prop="notYetCount" min-width="100"></el-table-column>
          <el-table-column label="发票总数" prop="totalCount" min-width="100"></el-table-column>
          <el-table-column label="退税运费" prop="freightFee" min-width="100"></el-table-column>
          <el-table-column label="备注" prop="remark" min-width="300">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <span>{{ row.remark }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="290">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showFreightFee(row)">退税运费</el-link>
              <el-link type="primary" :underline="false" @click="showDetail(row)">明细</el-link>
              <el-link type="primary" :underline="false" @click="showInvoiceCollection(row)">发票归集</el-link>
              <el-link type="success" :underline="false" @click="handleUpdateStatus(row)">退税完成</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
      <el-tab-pane label="已退税" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel >
            <el-button type="primary">出口发票生成（云舟）</el-button>
            <el-button type="primary" @click="handleExportAiTuoMu">出口发票生成（埃托姆）</el-button>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table
          border
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :data="list"
          class="noneHoveTable"
          @selection-change="setSelectRows"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="发货日期" prop="shipmentDate" min-width="115">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : ''  }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" prop="exportDate" min-width="120">
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : ''  }}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNumber" min-width="200"></el-table-column>
          <el-table-column label="未到发票" prop="notYetCount" min-width="100"></el-table-column>
          <el-table-column label="发票总数" prop="totalCount" min-width="100"></el-table-column>
          <el-table-column label="退税运费" prop="freightFee" min-width="100"></el-table-column>
          <el-table-column label="备注" prop="remark" min-width="300">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <span>{{ row.remark }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showDetail(row)">明细</el-link>
              <el-link type="primary" :underline="false" @click="showInvoiceCollection(row)">发票归集</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
   
    <!-- 明细 -->
    <VabDetailDialog
      :detail-visible="detailVisible"
      :id="id"
      @update-detail-visible="closeDetail"
    />
    <!-- 发票归集 -->
    <vab-dialog
      title="发票归集"
      width="20%"
      v-model="invoiceCollectionVisible"
      @close="closeInvoiceCollection"
    >
      <el-form ref="invoiceCollectionFormRef" :model="invoiceCollectionForm" :rules="invoiceCollectionFormRules" label-position="top" style="margin-left: 10px; margin-right: 10px;">
        <el-form-item label="归档路径" prop="path">
          <el-input v-model="invoiceCollectionForm.path" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeInvoiceCollection">取消</el-button>
        <el-button type="primary" @click="confirmInvoiceCollection">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 修改备注 -->
    <vab-dialog
      title="备注"
      width="25%"
      v-model="updateRemarkVisible"
    >
      <el-input type="textarea" v-model="remark" :rows="20" />
      <template #footer>
        <el-button @click="updateRemarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 修改退税运费 -->
    <vab-dialog
      title="更新退税运费"
      width="20%"
      v-model="freightFeeVisible"
      @close="closeFreightFee"
    >
      <el-form ref="freightFeeFormRef" :model="freightFeeForm" :rules="freightFeeFormRules" style=" margin-right: 20px;margin-left: 20px;">
        <el-form-item label="退税运费$" prop="freightFee">
          <el-input v-model.trim="freightFeeForm.freightFee" type="number" :min="0" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeFreightFee">取消</el-button>
        <el-button type="primary" @click="confirmFreightFee">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TaxRefundBatch'
})
import { Search } from '@element-plus/icons-vue'
import { FormInstance, TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import { downloadFileP } from '~/src/api/devlocal/download'
import { getTaxRefundBatchList, updateTaxRefundBatchDate, updateTaxRefundBatchFreightFee, updateTaxRefundBatchRemark, updateTaxRefundBatchStatus } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetTaxRefundBatchList, IGetTaxRefundBatchListQuery } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { formatDate } from '/@/utils/dateUtils'

const queryForm = reactive<IGetTaxRefundBatchListQuery>({
  keyWord: '',
  status: 0,
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetTaxRefundBatchList[]>([])
const activeName = ref<number>(0)
let _row: IGetTaxRefundBatchList = {}
const selectRows = ref<IGetTaxRefundBatchList[]>([])
// 修改备注可见
const updateRemarkVisible = ref<boolean>(false)
// 备注
const remark = ref<string>('')
const invoiceCollectionVisible = ref<boolean>(false)
const invoiceCollectionForm = reactive<any>({
  path: ''
})
const invoiceCollectionFormRef = ref<FormInstance>()
const invoiceCollectionFormRules = reactive<any>({
  path: [{ required: 'true', message: '请输入归档路径', trigger: 'blur' }]
})
const detailVisible = ref<boolean>(false)
// 传递给明细的id
const id = ref<number>()

const setSelectRows = (value: IGetTaxRefundBatchList[]) => {
  selectRows.value = value
}
const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
  if (pane.props.name != undefined) {
    queryForm.status = Number(pane.props.name)
    activeName.value = Number(pane.props.name)
    queryData()
    selectRows.value = []
  }
}
const handleExportAiTuoMu = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行！', 'error')
    return
  }
  const ids = selectRows.value.map((item: IGetTaxRefundBatchList) => item.id).join(',')
  
  await downloadFileP('/taxRefund/batch/aiTuoMuExport', {
    ids
  }).then((res) => {
    console.log(res)
  }).catch((error) => {
    $baseMessage(error, 'error')
  })
}
// 更新报关单出口日期
const handleUpdateDate = async (row: IGetTaxRefundBatchList) => {
  await updateTaxRefundBatchDate({
    id: row.id!,
    date: row.exportDate!
  })
}
// 退税运费修改可见
const freightFeeVisible = ref<boolean>(false)
const freightFeeForm = reactive<any>({})
const freightFeeFormRef = ref<FormInstance>()
const freightFeeFormRules = reactive<any>({
  freightFee: [{ required: true, message: '请输入退税运费', trigger: 'blur' }]
})

const showFreightFee = (row: IGetTaxRefundBatchList) => {
  freightFeeVisible.value = true
  _row = row
  freightFeeForm.freightFee = row.freightFee
}
const closeFreightFee = () => {
  freightFeeVisible.value = false
}
const confirmFreightFee = async () => {
  const { data } = await updateTaxRefundBatchFreightFee({
    id: _row.id!,
    freightFee: freightFeeForm.freightFee
  })
  if (data) {
    $baseMessage('更新退税运费成功!', 'success')
    closeFreightFee()
    _row.freightFee = freightFeeForm.freightFee
  }
}


// 确认修改备注
const confirmUpdateRemark = async () => {
  updateRemarkVisible.value = false
  const { data } = await updateTaxRefundBatchRemark({
    id: _row.id!,
    remark: remark.value
  })
  if (data) {
    _row.remark = remark.value
  }
}
// 点击备注单元格
const cellClick = (row: IGetTaxRefundBatchList, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.property === 'remark') {
    updateRemarkVisible.value = true
    remark.value = row.remark!
    _row = row
  }
}
// 退税完成
const handleUpdateStatus = async (row: IGetTaxRefundBatchList) => {
  $baseConfirm('确定要完成退税吗？', null, async () => {
    const { data } = await updateTaxRefundBatchStatus({
      id: row.id!
    })
    if (data) {
      $baseMessage('退税完成成功！', 'success')
      fetchData()
    }
  })
}
// 明细显示
const showDetail = (row: IGetTaxRefundBatchList) => {
  detailVisible.value = true
  id.value = row.id
}
const closeDetail = (value: boolean) => {
  detailVisible.value = value
}

// 发票归集显示
const showInvoiceCollection = (row: any) => {
  invoiceCollectionVisible.value = true
}
const closeInvoiceCollection = (row: any) => {
  invoiceCollectionVisible.value = false
  invoiceCollectionFormRef.value?.resetFields()
}
const confirmInvoiceCollection = () => {
  invoiceCollectionFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      
    }
  })
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3 || data.columnIndex === 7) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
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
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundBatchList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
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

        .vab-query-form {
          .left-panel { //自加
            margin-bottom: 5px;
          }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
          }
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
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>
