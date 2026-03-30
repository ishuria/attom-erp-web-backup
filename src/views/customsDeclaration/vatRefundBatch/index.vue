<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待退税" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <!-- <el-button type="primary">出口发票生成（云舟）</el-button> -->
            <el-button type="primary" @click="handleExportAiTuoMu">出口发票生成（埃托姆）</el-button>
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
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="cellClick"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
        >
          <el-table-column type="selection" />
          <el-table-column label="发货日期" min-width="115" prop="shipmentDate">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" min-width="120" prop="exportDate">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.exportDate"
                style="width: 100%"
                type="date"
                value-format="YYYY-MM-DD"
                @change="handleUpdateDate(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="合同编号" min-width="200" prop="contractNumber" />
          <el-table-column label="CIF" min-width="100" prop="cif" />
          <el-table-column label="FOB" min-width="100" prop="fob" />
          <el-table-column label="未到发票" min-width="100" prop="notYetCount" />
          <el-table-column label="发票总数" min-width="100" prop="totalCount" />
          <el-table-column label="退税运费" min-width="100" prop="totalFreightFee" />
          <el-table-column label="备注" min-width="250" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.remark }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="出库归档" min-width="100" prop="outboundStatus">
            <template #default="{ row }">
              <el-tag :type="row.outboundStatus === 1 ? 'success' : 'danger'">
                {{ row.outboundStatus === 1 ? '已出库归档' : '未出库归档' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="560">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="showFreightFee(row)">退税运费</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="showDetail(row)">明细</el-link>
              <!--   https://applink.feishu.cn/client/todo/detail?guid=27bf6430-7fe3-4ade-a2d1-46319bc8ff73&suite_entity_num=t111570           -->
              <!--              <span style="margin: 0 5px"></span>-->
              <!--              <el-link underline="never" @click="showContractValidate(row)">采购合同校验</el-link>-->
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="showInvoiceCollection(row)">发票归集</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="showSummaryDetail(row)">汇总明细</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="handleArchiveOutbound(row)">出库归档</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="success" underline="never" @click="handleUpdateStatus(row)">退税完成</el-link>
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
      </el-tab-pane>
      <el-tab-pane label="已退税" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">出口发票生成（云舟）</el-button>
            <el-button type="primary" @click="handleExportAiTuoMu">出口发票生成（埃托姆）</el-button>
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
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
        >
          <el-table-column type="selection" />
          <el-table-column label="发货日期" min-width="115" prop="shipmentDate">
            <template #default="{ row }">
              {{ row.shipmentDate ? formatDate(new Date(row.shipmentDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="报关单出口日期" min-width="120" prop="exportDate">
            <template #default="{ row }">
              {{ row.exportDate ? formatDate(new Date(row.exportDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" min-width="200" prop="contractNumber" />
          <el-table-column label="CIF" min-width="100" prop="cif" />
          <el-table-column label="FOB" min-width="100" prop="fob" />
          <el-table-column label="未到发票" min-width="100" prop="notYetCount" />
          <el-table-column label="发票总数" min-width="100" prop="totalCount" />
          <el-table-column label="退税运费" min-width="100" prop="totalFreightFee" />
          <el-table-column label="备注" min-width="300" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.remark }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="380">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="showDetail(row)">明细</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="cancleToWaitTaxRefund(row)">撤销到待退税</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="showInvoiceCollection(row)">发票归集</el-link>
              <span style="margin: 0 5px"></span>
              <el-link type="primary" underline="never" @click="showSummaryDetail(row)">汇总明细</el-link>
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
      </el-tab-pane>
    </el-tabs>

    <!-- 明细 -->
    <vab-detail-dialog :id="id" :contract-number="contractNumber" :detail-visible="detailVisible" @update-detail-visible="closeDetail" />
    <vab-batch-summary-detail-dialog
      :visible="summaryDetailVisible"
      :contract-number="summaryContractNumber"
      @update-visible="closeSummaryDetail"
    />
    <!-- 发票归集 -->
    <vab-dialog v-model="invoiceCollectionVisible" title="发票归集" width="20%" @close="closeInvoiceCollection">
      <el-form
        ref="invoiceCollectionFormRef"
        label-position="top"
        :model="invoiceCollectionForm"
        :rules="invoiceCollectionFormRules"
        style="margin-right: 10px; margin-left: 10px"
      >
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
    <vab-dialog v-model="updateRemarkVisible" title="备注" width="25%">
      <el-input v-model="remark" :rows="20" type="textarea" />
      <template #footer>
        <el-button @click="updateRemarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 修改退税运费 -->
    <vab-dialog v-model="freightFeeVisible" title="更新退税运费" width="20%" @close="closeFreightFee">
      <el-form ref="freightFeeFormRef" :model="freightFeeForm" :rules="freightFeeFormRules" style="margin-right: 20px; margin-left: 20px">
        <el-form-item label="退税运费$" prop="freightFee">
          <el-input v-model.trim="freightFeeForm.freightFee" clearable :min="0" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeFreightFee">取消</el-button>
        <el-button type="primary" @click="confirmFreightFee">确认</el-button>
      </template>
    </vab-dialog>

    <!-- 采购合同校验 -->
    <vab-dialog v-model="contractValidateVisible" title="采购合同校验" width="20%" @close="closeFreightFee">
      <el-form ref="contractFormRef" :model="contractForm" :rules="contractFormRules" style="margin-right: 20px; margin-left: 20px">
        <el-form-item label="采购合同路径" prop="path">
          <el-input v-model.trim="contractForm.path" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="contractValidateVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmContractValidate">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import {
  archiveTaxRefundBatchInvoice,
  archiveTaxRefundBatchOutbound,
  checkTaxRefundBatchAiTuoMuExport,
  getTaxRefundBatchList,
  updateCancleTaxRefundBatchStatus,
  updateTaxRefundBatchDate,
  updateTaxRefundBatchFreightFee,
  updateTaxRefundBatchRemark,
  updateTaxRefundBatchStatus,
  validateTaxRefundBatchContract,
} from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { downloadFileP } from '/@/api/devlocal/download'
import type { IGetTaxRefundBatchList, IGetTaxRefundBatchListQuery } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { formatDate } from '/@/utils/dateUtils'
import VabBatchSummaryDetailDialog from '../vabAutoComponents/VabBatchSummaryDetailDialog.vue'

defineOptions({
  name: 'VatRefundBatch',
})

const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}

const router = useRouter()
const route = useRoute()
const activeName = ref<number>(0)
const queryForm = reactive<IGetTaxRefundBatchListQuery>({
  keyWord: '',
  status: 0,
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetTaxRefundBatchList[]>([])
let _row: IGetTaxRefundBatchList = {}
const selectRows = ref<IGetTaxRefundBatchList[]>([])
// 修改备注可见
const updateRemarkVisible = ref<boolean>(false)
// 备注
const remark = ref<string>('')
const invoiceCollectionVisible = ref<boolean>(false)
const invoiceCollectionForm = reactive<any>({
  path: '',
})
const invoiceCollectionFormRef = ref<FormInstance>()
const invoiceCollectionFormRules = reactive<any>({
  path: [{ required: 'true', message: '请输入归档路径', trigger: 'blur' }],
})
const detailVisible = ref<boolean>(false)
const summaryDetailVisible = ref<boolean>(false)
// 传递给明细的id
const id = ref<number>()
const contractNumber = ref<string>()
const summaryContractNumber = ref<string>('')
const setSelectRows = (value: IGetTaxRefundBatchList[]) => {
  selectRows.value = value
}

const handleArchiveOutbound = async (row: any) => {
  const { data } = await archiveTaxRefundBatchOutbound({ contractNumber: row.contractNumber })
  if (data) {
    ElMessageBox({
      title: '出库归档提示',
      confirmButtonText: '关闭',
      showClose: false,
      showCancelButton: false,
      type: 'warning',
      dangerouslyUseHTMLString: true,
      message: data,
    })
  } else {
    $baseMessage('出库归档成功!', 'success')
  }
}
const handleTabClick = (pane: TabsPaneContext) => {
  if (pane.props.name != undefined) {
    queryForm.status = Number(pane.props.name)
    activeName.value = Number(pane.props.name)
    selectRows.value = []
    router.push({
      query: {
        ...route.query,
        tab: pane.props.name,
        pageNo: '1',
        pageSize: queryForm.pageSize,
      },
    })
    fetchData()
  }
}
const handleExportAiTuoMu = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行！', 'error')
    return
  }
  const ids = selectRows.value.map((item: IGetTaxRefundBatchList) => item.id).join(',')

  const { data } = await checkTaxRefundBatchAiTuoMuExport({ ids })
  if (data) {
    await downloadFileP('/taxRefund/batch/aiTuoMuExport', {
      ids,
    })
    // .then((res) => {
    //   console.log(res)
    // }).catch((error) => {
    //   $baseMessage(error, 'error')
    // })
  }
}
// 更新报关单出口日期
const handleUpdateDate = async (row: IGetTaxRefundBatchList) => {
  await updateTaxRefundBatchDate({
    id: row.id!,
    date: row.exportDate!,
  })
}
// 退税运费修改可见
const freightFeeVisible = ref<boolean>(false)
const freightFeeForm = reactive<any>({})
const freightFeeFormRef = ref<FormInstance>()
const freightFeeFormRules = reactive<any>({
  freightFee: [{ required: true, message: '请输入退税运费', trigger: 'blur' }],
})

const showFreightFee = (row: IGetTaxRefundBatchList) => {
  freightFeeVisible.value = true
  _row = row
  freightFeeForm.freightFee = row.totalFreightFee
}
const closeFreightFee = () => {
  freightFeeVisible.value = false
}
const confirmFreightFee = async () => {
  const { data } = await updateTaxRefundBatchFreightFee({
    id: _row.id!,
    freightFee: freightFeeForm.freightFee,
  })
  if (data) {
    $baseMessage('更新退税运费成功!', 'success')
    closeFreightFee()
    _row.totalFreightFee = freightFeeForm.freightFee
  }
}

// 采购合同校验

const contractValidateVisible = ref<boolean>(false)
const contractForm = reactive<any>({})
const contractFormRef = ref<FormInstance>()
const contractFormRules = reactive<any>({
  path: [{ required: true, message: '请输入采购合同路径', trigger: 'blur' }],
})
const showContractValidate = (row: IGetTaxRefundBatchList) => {
  contractValidateVisible.value = true
  _row = row
}

const confirmContractValidate = async () => {
  const { data } = await validateTaxRefundBatchContract({
    id: _row.id!,
    path: contractForm.path,
  })
  if (data) {
    $baseMessage('采购合同校验成功!', 'success')
    closeFreightFee()
    contractValidateVisible.value = false
  }
}

// 确认修改备注
const confirmUpdateRemark = async () => {
  updateRemarkVisible.value = false
  const { data } = await updateTaxRefundBatchRemark({
    id: _row.id!,
    remark: remark.value,
  })
  if (data) {
    _row.remark = remark.value
  }
}
// 点击备注单元格
const cellClick = (row: IGetTaxRefundBatchList, column: any) => {
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
      id: row.id!,
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
  contractNumber.value = row.contractNumber
}
const closeDetail = (value: boolean) => {
  detailVisible.value = value
}

const showSummaryDetail = (row: IGetTaxRefundBatchList) => {
  summaryContractNumber.value = row.contractNumber || ''
  summaryDetailVisible.value = true
}

const closeSummaryDetail = (value: boolean) => {
  summaryDetailVisible.value = value
  if (!value) {
    summaryContractNumber.value = ''
  }
}

// 发票归集显示
const showInvoiceCollection = (row: IGetTaxRefundBatchList) => {
  invoiceCollectionVisible.value = true
  _row = row
}
const closeInvoiceCollection = () => {
  invoiceCollectionVisible.value = false
  invoiceCollectionFormRef.value?.resetFields()
}
const confirmInvoiceCollection = async () => {
  invoiceCollectionFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await archiveTaxRefundBatchInvoice({
        path: invoiceCollectionForm.path,
        id: _row.id!,
      })
      if (data) {
        $baseMessage('发票归集成功！', 'success')
        closeInvoiceCollection()
      }
    }
  })
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3 || data.columnIndex === 7) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
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

const cancleToWaitTaxRefund = async (row: IGetTaxRefundBatchList) => {
  const { data } = await updateCancleTaxRefundBatchStatus({
    id: row.id!,
  })
  if (data) {
    fetchData()
    $baseMessage('撤销到待退税成功！', 'success')
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundBatchList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
onBeforeMount(() => {
  queryForm.status = activeName.value
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    activeName.value = Number(tab)
    queryForm.status = Number(tab)
  }
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
