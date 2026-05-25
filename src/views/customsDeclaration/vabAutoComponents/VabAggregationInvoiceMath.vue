<template>
  <vab-dialog
    v-model="dflag"
    :before-close="handleBeforeCloseInvoiceMatching"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="false"
    title="退税产品聚合发票匹配"
    top="10vh"
    width="97%"
  >
    <div style="max-width: fit-content; margin: 0 auto; width: 100%; display: flex; flex-direction: column; height: 100%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <!--          <el-button type="primary" @click="showPathImport">发票路径导入</el-button>-->
          <!--          <el-button type="primary" @click="showUploadInvoice('import')">发票导入</el-button>-->
          <el-button type="primary" @click="showUploadInvoice('repeat')">发票导入</el-button>
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
        :cell-class-name="tableCellClassName"
        :cell-style="cellStyle"
        class="noneHoveTable"
        :data="list"
        :header-cell-style="headerCellStyle"
        max-height="800"
        :span-method="objectSpanMethod"
        @cell-click="cellClick"
        @row-click="handleRowClick"
      >
        <el-table-column fixed="left" label="操作" width="70">
          <template #default="{ row }">
            <el-link type="danger" underline="never" @click.stop="handleDeleteInvoice(row)">删除</el-link>
          </template>
        </el-table-column>
        <el-table-column label="购方名称" prop="purchaseName" :width="flexColumnWidth(list, '购方名称', 'purchaseName')">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.purchaseName" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.purchaseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票图片" prop="invoicePath" width="75">
          <template #header>
            发票
            <br />
            图片
          </template>
          <template #default="{ row }">
            <el-button size="small" style="min-width: 20px; min-height: 35px" @click="showPdf(row.invoicePath)">PDF</el-button>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.invoiceNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.invoiceNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.suppliser" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.suppliser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票行次" prop="no" width="100" />
        <el-table-column label="开票品名" prop="invoiceName" :width="flexColumnWidth(list, '开票品名', 'invoiceName')">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.invoiceName" @blur="clickDetailCancel($event, row)" @keyup.enter="clickDetailCancel($event, row)" />
            </div>
            <span>{{ row.invoiceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" prop="specificationModel" :width="flexColumnWidth(list, '规格型号', 'specificationModel')">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.specificationModel"
                @blur="clickDetailCancel($event, row)"
                @keyup.enter="clickDetailCancel($event, row)"
              />
            </div>
            <span>{{ row.specificationModel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票数量" prop="invoiceCount" width="140">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.invoiceCount"
                type="number"
                @blur="clickDetailCancel($event, row)"
                @keyup.enter="clickDetailCancel($event, row)"
              />
            </div>
            <span>{{ row.invoiceCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票单位" prop="invoiceUnit" :width="flexColumnWidth(list, '发票单位', 'invoiceUnit')">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.invoiceUnit" @blur="clickDetailCancel($event, row)" @keyup.enter="clickDetailCancel($event, row)" />
            </div>
            <span>{{ row.invoiceUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票含税金额" prop="includingTaxPrice" :width="flexColumnWidth(list, '发票含税金额', 'includingTaxPrice')">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.includingTaxPrice"
                type="number"
                @blur="clickDetailCancel($event, row)"
                @keyup.enter="clickDetailCancel($event, row)"
              />
            </div>
            <span>{{ row.includingTaxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票未税金额" prop="preTaxPrice" :width="flexColumnWidth(list, '发票未税金额', 'preTaxPrice')">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.preTaxPrice"
                type="number"
                @blur="clickDetailCancel($event, row)"
                @keyup.enter="clickDetailCancel($event, row)"
              />
            </div>
            <span>{{ row.preTaxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="征免税类型" prop="hsTaxType" :width="110">
          <template #default="{ row }">
            <el-tag v-if="row.hsTaxType" :type="hsTaxTypeTagMap[row.hsTaxType]">{{ row.hsTaxType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配合同号"
          prop="matchContractNumber"
          :width="flexColumnWidth(list, '匹配合同号', 'matchContractNumber')"
        />
        <el-table-column label="匹配PO" prop="matchPo" :width="flexColumnWidth(list, '匹配PO', 'matchPo')" />
        <el-table-column label="发票匹配数" prop="customsDeclarationCount" width="110" />
        <el-table-column label="报关单位" prop="customsDeclarationUnit" width="95" />
        <el-table-column label="含税价" prop="taxInclusiveCost" width="95" />
        <el-table-column align="center" fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <div style="display: flex" @click.stop>
              <el-button :disabled="matchLoading === row.detailId" link type="primary" @click="showMatch(row)">匹配</el-button>
              <el-button :disabled="cleanLoading === row.detailId" link type="danger" @click="handleCleanInvoice(row)">清空</el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
        </template>
      </el-table>
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button :loading="closeLoading" @click="() => closeInvoiceMatching()">取消</el-button>
        <el-button :loading="confirmLoading" type="primary" @click="handleSubmitConfirm">确认</el-button>
      </div>
    </template>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
  <!-- 上传发票 -->
  <vab-dialog v-model="uploadInvoiceVisible" :title="uploadType == 'import' ? '上传发票' : '上传发票'" width="25%">
    <el-upload v-model:file-list="fileList" :auto-upload="false" drag multiple :show-file-list="true">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        将文件拖拽至此处或
        <em>点击上传</em>
      </div>
    </el-upload>
    <template #footer>
      <div style="text-align: center">
        <el-button :loading="finishLoading" type="success" @click="handleFinishUpload">完成</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 发票路径导入 -->
  <vab-dialog v-model="pathImportVisible" title="发票路径导入" width="20%" @close="pathImportForm.invoicePath = ''">
    <el-form ref="pathImportFormRef" label-width="100px" :model="pathImportForm" :rules="pathImportRules">
      <el-form-item label="发票路径" prop="invoicePath">
        <el-input v-model.trim="pathImportForm.invoicePath" placeholder="请输入发票路径" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: right">
        <el-button :loading="pathImportLoading" type="primary" @click="handlePathImport">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 匹配 -->
  <vab-dialog
    v-model="matchVisible"
    :draggable="false"
    style="width: fit-content; max-height: 90vh"
    title="匹配"
    @close="resetMatchDialogState"
  >
    <div style="max-width: fit-content; margin: 0 auto; width: 100%; display: flex; flex-direction: column; height: 100%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <div class="invoice-info-tags">
            <div class="invoice-info-tags-row">
              <el-tag size="large" type="info">
                <span style="font-weight: 500">供应商：</span>
                <span>{{ _supplier || '--' }}</span>
              </el-tag>
              <el-tag size="large" type="success">
                <span style="font-weight: 500">开票品名：</span>
                <span>{{ _invoiceName || '--' }}</span>
              </el-tag>
              <el-tag size="large" type="warning">
                <span style="font-weight: 500">单位：</span>
                <span>{{ _invoiceUnit || '--' }}</span>
              </el-tag>
            </div>
          </div>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form inline :model="matchQueryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="matchQueryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="queryMatchData"
                @keyup.enter="queryMatchData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="matchListLoading" native-type="submit" type="primary" @click="queryMatchData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        v-loading="matchListLoading"
        border
        :cell-style="matchCellStyle"
        class="noneHoveTable"
        :data="pagedData"
        :default-sort="{ prop: 'notYetInvoice', order: 'ascending' }"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="50vh"
        @row-click="handleRowClickMatch"
        @sort-change="handleSortChange"
      >
        <el-table-column
          label="合同编号"
          :min-width="flexColumnWidth(pagedData, '合同编号排序', 'contractNumber')"
          prop="contractNumber"
          sortable
        />
        <el-table-column label="报关数量" min-width="95" prop="customsDeclarationCount" />
        <el-table-column label="报关单位" min-width="95" prop="customsDeclarationUnit" />
        <el-table-column label="PO" min-width="100" prop="po" sortable />
        <el-table-column label="含税成本价￥" min-width="125" prop="taxInclusiveCost" />
        <el-table-column label="匹配" prop="status" width="70">
          <template #default="{ row }">
            <el-checkbox v-model="row.matchFlag" size="large" @change="handleMatchFlagChange" @click.stop />
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="matchQueryForm.pageNo"
        :page-size="matchQueryForm.pageSize"
        :total="matchList.length"
        @current-change="handleMatchCurrentChange"
        @size-change="handleMatchSizeChange"
      />
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="matchVisible = false">取消</el-button>
        <el-button :loading="matchInvoiceLoading" type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 预览pdf -->
  <vab-dialog v-model="pdfVisible" top="5vh" @close="pdfVisible = false">
    <div v-loading="pdfLoading" class="pdf-container">
      <vab-pdf :source="source" />
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import {
  cancelTaxRefundMainInvoice,
  cleanTaxRefundMainInvoice,
  dealTaxRefundInvoicePath,
  deleteTaxRefundInvoice,
  finishTaxRefundInvoice,
  finishTaxRefundInvoiceRepeat,
  getTaxRefundMainInvoiceList,
  getTaxRefundMainInvoiceMatch,
  submitConfirmTaxRefundInvoiceMatch,
  submitConfirmTaxRefundInvoiceMatchBefore,
  submitTaxRefundMainInvoiceMatch,
  taxRefundInvoiceMatchFlag,
  updateTaxRefundInvoice,
  updateTaxRefundInvoiceDetail,
  uploadTaxRefund,
} from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import VabPdf from '/@/plugins/VabPdf'
import type {
  IGetTaxRefundInvoiceMatchList,
  IGetTaxRefundMainInvoiceList,
  IGetTaxRefundMainInvoiceListQuery,
  IGetTaxRefundMainInvoiceMatchList,
  IGetTaxRefundMainInvoiceMatchQuery,
} from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabAggregationInvoiceMath',
})

const hsTaxTypeTagMap: Record<string, 'primary' | 'success' | 'danger'> = {
  退税: 'primary',
  征税: 'danger',
  免税: 'success',
}

const pdfVisible = ref<boolean>(false)
const pdfLoading = ref<boolean>(false)
const source = ref<string>('')
const showPdf = (path: string) => {
  pdfLoading.value = true
  source.value = path
  pdfVisible.value = true
  pdfLoading.value = false
}
const dflag = ref<boolean>(false)
const unitPriceSameFlag = ref<boolean>(false)
const matchInvoiceLoading = ref<boolean>(false)
const props = defineProps<{
  invoiceMatchingVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.invoiceMatchingVisible
  if (dflag.value) {
    fetchData()
  }
})
const emit = defineEmits<{
  updateInvoiceMatchingVisible: [value: boolean]
}>()
const closeLoading = ref<boolean>(false)
const finishCloseInvoiceMatching = () => {
  // 清空 detailIds，避免重复提交
  detailIds.value = []
  emit('updateInvoiceMatchingVisible', false)
}
const handleBeforeCloseInvoiceMatching = async (done: () => void) => {
  await closeInvoiceMatching(done)
}
const closeInvoiceMatching = async (done?: () => void) => {
  if (closeLoading.value) {
    return
  }

  closeLoading.value = true
  try {
    const { data } = await cancelTaxRefundMainInvoice()
    if (data) {
      if (typeof done === 'function') {
        done()
      }
      finishCloseInvoiceMatching()
      return
    }
  } catch {
  } finally {
    closeLoading.value = false
  }
}

// 上传发票可见
const uploadInvoiceVisible = ref<boolean>(false)

// 发票路径导入可见
const pathImportVisible = ref<boolean>(false)
const pathImportForm = reactive<{ invoicePath: string }>({ invoicePath: '' })
const pathImportLoading = ref<boolean>(false)
const pathImportFormRef = ref()
const pathImportRules = {
  invoicePath: [{ required: true, message: '请输入发票路径', trigger: 'blur' }],
}

const fileList = ref<any[]>([])

// 当前选中的行（用于高亮显示）
const selectedRowId = ref<number | null>(null)

// 检查当前行是否属于 selectedRowId 所属的 id 合并组（用于左边合并的列）
const isRowInSelectedIdGroup = (rowIndex: number): boolean => {
  if (selectedRowId.value === null) {
    return false
  }

  // 找到 selectedRowId 对应的行，获取其 id
  const selectedRow = list.value.find((row) => row.detailId === selectedRowId.value)
  if (!selectedRow) {
    return false
  }

  const selectedId = selectedRow.id
  const currentRow = list.value[rowIndex]
  const currentId = currentRow.id

  // 如果当前行的 id 等于选中行的 id，则属于同一个合并组
  return currentId === selectedId
}

// 检查单元格是否需要紫色标记（用于排除 hover 样式）
const shouldHighlightCell = (row: any, label: string): boolean => {
  const { customsDeclarationCount, customsDeclarationUnit, taxInclusiveCost } = row

  // 只有当报关数量、报关单位、po零件含税价都不为空时才生效
  const canCompare =
    customsDeclarationCount !== undefined &&
    customsDeclarationCount !== null &&
    customsDeclarationCount !== '' &&
    customsDeclarationUnit !== undefined &&
    customsDeclarationUnit !== null &&
    customsDeclarationUnit !== '' &&
    taxInclusiveCost !== undefined &&
    taxInclusiveCost !== null &&
    taxInclusiveCost !== ''

  if (!canCompare) {
    return false
  }

  // 检查是否需要紫色标记
  if (label === '发票单位' || label === '报关单位') {
    return String(row.invoiceUnit || '') !== String(row.customsDeclarationUnit || '')
  }

  return false
}

// 表格单元格类名（用于部分高亮显示）
const tableCellClassName = ({
  row,
  rowIndex,
  columnIndex,
  column,
}: {
  row: IGetTaxRefundMainInvoiceList
  rowIndex: number
  columnIndex: number
  column: any
}) => {
  const classes: string[] = []

  // 检查是否需要紫色标记
  if (column?.label && shouldHighlightCell(row, column.label)) {
    classes.push('highlight-cell')
  }

  // 检查是否需要选中高亮
  if (selectedRowId.value !== null) {
    // 左边合并的列（columnIndex 0-4）：基于 row.id 合并，如果当前行属于 selectedRowId 所属的 id 合并组，则高亮
    if (columnIndex >= 0 && columnIndex <= 4) {
      if (isRowInSelectedIdGroup(rowIndex)) {
        classes.push('warning-cell')
      }
    }
    // 右边合并的列（columnIndex 5+）：基于 detailId 合并，如果该行detailId 被选中，则高亮
    else if (columnIndex >= 5) {
      if (row.detailId !== undefined && row.detailId === selectedRowId.value) {
        classes.push('warning-cell')
      }
    }
  }

  return classes.join(' ')
}

const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowId.value = row.detailId ?? null
}
const handleRowClickMatch = (row: any, column: any, event: Event) => {
  row.matchFlag = !row.matchFlag
  // 触发勾选框变化逻辑（PO过滤、排序等）
  handleMatchFlagChange()
}
// 上传发票类型 import = 上传发票 repeat = 重复发票
const uploadType = ref<string>('')
// 展示上传发票
const showUploadInvoice = (type: string) => {
  uploadType.value = type
  fileList.value = []
  uploadInvoiceVisible.value = true
}
const showPathImport = () => {
  pathImportForm.invoicePath = ''
  pathImportFormRef.value?.clearValidate()
  pathImportVisible.value = true
}

const handlePathImport = async () => {
  await pathImportFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      pathImportLoading.value = true
      try {
        const { data } = await dealTaxRefundInvoicePath({ path: pathImportForm.invoicePath })
        if (data) {
          ElMessageBox({
            title: '提示',
            confirmButtonText: '确定',
            showClose: false,
            showCancelButton: false,
            type: 'info',
            message: '后台发票导入中，导入结果已邮件形式通知！请勿重复导入！',
          })
          pathImportVisible.value = false
          await fetchData()
        }
      } catch {
        $baseMessage('发票路径导入失败', 'error')
      } finally {
        pathImportLoading.value = false
        pathImportForm.invoicePath = ''
      }
    }
  })
}
const finishLoading = ref<boolean>(false)
// 完成发票导入
const handleFinishUpload = async () => {
  finishLoading.value = true
  const formData = new FormData()
  fileList.value.forEach((item: any) => {
    formData.append('files', item.raw)
  })
  if (uploadType.value === 'import') {
    try {
      const { data } = await uploadTaxRefund(formData)

      if (data) {
        $baseMessage('发票上传成功', 'success')
        const { data: resData, msg } = await finishTaxRefundInvoice(data)
        if (resData) {
          ElMessageBox({
            title: '重复发票提示',
            confirmButtonText: '关闭',
            showClose: false,
            showCancelButton: false,
            type: 'warning',
            dangerouslyUseHTMLString: true,
            message: resData,
          })
          await fetchData()
          // 清空发票上传文件
          fileList.value = []
        } else {
          $baseMessage('发票导入成功', 'success')
          uploadInvoiceVisible.value = false
          await fetchData()
        }
      }
    } catch {
      $baseMessage('发票文件上传失败', 'error')
    } finally {
      finishLoading.value = false
    }
  } else {
    // TODO 重复发票导入
    try {
      const { data } = await uploadTaxRefund(formData)
      if (data) {
        $baseMessage('发票上传成功', 'success')
        const { data: resData } = await finishTaxRefundInvoiceRepeat(data)
        if (resData) {
          $baseAlert(resData)
        }
        uploadInvoiceVisible.value = false
        await fetchData()
      }
    } catch {
      $baseMessage('发票文件上传失败', 'error')
    } finally {
      finishLoading.value = false
    }
  }
}
// 发票匹配清空
const handleCleanInvoice = async (row: IGetTaxRefundMainInvoiceList) => {
  if (!row.detailId) {
    $baseMessage('发票明细ID不存在', 'error')
    return
  }
  cleanLoading.value = row.detailId
  $baseConfirm(
    '确定要清空吗？',
    null,
    async () => {
      try {
        const { data } = await cleanTaxRefundMainInvoice({ detailId: row.detailId! })
        if (data) {
          $baseMessage('清空成功', 'success')
          await fetchData()
        }
      } catch {
        $baseMessage('清空失败', 'error')
      } finally {
        cleanLoading.value = null
      }
    },
    () => {
      cleanLoading.value = null
    }
  )
}
// 删除发票
const handleDeleteInvoice = async (row: IGetTaxRefundMainInvoiceList) => {
  // 保存当前选中的行
  selectedRowId.value = row.detailId!
  $baseConfirm('确定要删除吗？', null, async () => {
    const { data } = await deleteTaxRefundInvoice({
      id: row.id!,
    })
    if (data) {
      $baseMessage('删除成功！', 'success')
      fetchData()
    }
  })
}
// 匹配可见
const matchVisible = ref<boolean>(false)
const matchStatus = ref<number>(-1)
const total = ref<number>(0)
const list = ref<IGetTaxRefundMainInvoiceList[]>([])

const queryForm = reactive<IGetTaxRefundMainInvoiceListQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const listLoading = ref<boolean>(false)
const matchQueryForm = reactive<IGetTaxRefundMainInvoiceMatchQuery>({
  keyWord: '',
  detailId: -1,
  pageNo: 1,
  pageSize: 20,
})
const matchTotal = ref<number>(0)
const matchListLoading = ref<boolean>(false)
const matchList = ref<IGetTaxRefundMainInvoiceMatchList[]>([])
// 保存原始数据，用于搜索过滤
const originalMatchList = ref<IGetTaxRefundMainInvoiceMatchList[]>([])
// 排序状态
const sortState = ref<{ prop: string; order: 'ascending' | 'descending' | null } | null>(null)

const resetMatchDialogState = () => {
  matchStatus.value = -1
  matchQueryForm.keyWord = ''
  matchQueryForm.pageNo = 1
}

const queryMatchData = () => {
  applySortAndFilter()
}

// 处理排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
  sortState.value = order ? { prop, order } : null
  applySortAndFilter()
}

// 选中的PO，用于过滤
const selectedPo = ref<string | null>(null)

// 处理匹配复选框变化
const handleMatchFlagChange = () => {
  // 查找第一个选中的记录
  const selectedItem = originalMatchList.value.find((item) => item.matchFlag === true)

  if (selectedItem && selectedItem.po) {
    // 如果有选中的记录，获取其 PO 并过滤
    selectedPo.value = selectedItem.po
  } else {
    // 没有选中的记录，恢复显示全部
    selectedPo.value = null
  }
  // 重新应用过滤
  applySortAndFilter()
}

// 应用排序和过滤
const applySortAndFilter = () => {
  // 先应用关键词过滤
  const keyword = matchQueryForm.keyWord.trim().toLowerCase()
  let filteredData: IGetTaxRefundInvoiceMatchList[]

  if (keyword) {
    filteredData = originalMatchList.value.filter(
      (item: any) =>
        (item.contractNumber?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.po?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.sku?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.customsDeclarationCount?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.customsDeclarationName?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.taxInclusiveCost?.toString()?.toLowerCase() || '').includes(keyword)
    )
  } else {
    filteredData = [...originalMatchList.value]
  }

  // 应用PO过滤（如果有选中的记录）
  if (selectedPo.value) {
    filteredData = filteredData.filter((item: any) => item.po === selectedPo.value)
  }

  // 再应用排序
  if (sortState.value && sortState.value.order) {
    const { prop, order } = sortState.value
    filteredData.sort((a: any, b: any) => {
      const aVal = a[prop]
      const bVal = b[prop]

      // 处理 null/undefined 值
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      // 数字类型排序
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'ascending' ? aVal - bVal : bVal - aVal
      }

      // 字符串类型排序
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      if (order === 'ascending') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
  }

  matchList.value = filteredData
}

// 计算当前页的数据
const pagedData = computed(() => {
  const start = (matchQueryForm.pageNo - 1) * matchQueryForm.pageSize
  const end = start + matchQueryForm.pageSize
  return matchList.value.slice(start, end) // 获取当前页的数据
})

const handleMatchCurrentChange = (value: number) => {
  matchQueryForm.pageNo = value
}
const handleMatchSizeChange = (value: number) => {
  matchListLoading.value = true
  matchQueryForm.pageSize = value
  matchQueryForm.pageNo = 1
  matchListLoading.value = false
}

const detailIds = ref<number[]>([])

const handleConfirm = async () => {
  matchInvoiceLoading.value = true
  const taxRefundIdArr: number[] = []
  const selectedItems: IGetTaxRefundMainInvoiceMatchList[] = []

  // 从 originalMatchList 中查找所有勾选的行（确保包含所有数据，不受过滤影响）
  originalMatchList.value.forEach((el) => {
    if (el.matchFlag) {
      taxRefundIdArr.push(el.id)
      selectedItems.push(el)
    }
  })

  if (taxRefundIdArr.length === 0) {
    $baseMessage('请选择匹配项', 'warning')
    matchInvoiceLoading.value = false
    return
  }

  // 聚合退税产品发票匹配不能匹配多条
  if (taxRefundIdArr.length > 1) {
    $baseMessage('聚合退税产品发票匹配不能匹配多条！', 'error')
    matchInvoiceLoading.value = false
    return
  }

  try {
    const { data } = await submitTaxRefundMainInvoiceMatch({
      taxRefundMainIds: taxRefundIdArr,
      detailId: matchQueryForm.detailId,
    })
    if (data) {
      $baseMessage('提交成功！', 'success')
      resetMatchDialogState()
      matchVisible.value = false
      await fetchData()
      detailIds.value.push(matchQueryForm.detailId)
    }
  } catch (error) {
    console.error(error)
  } finally {
    matchInvoiceLoading.value = false
  }
}
const confirmLoading = ref<boolean>(false)
const handleSubmitConfirm = async () => {
  confirmLoading.value = true

  try {
    // 调用前置接口
    const { data: beforeData } = await submitConfirmTaxRefundInvoiceMatchBefore()
    if (!beforeData) {
      $baseMessage('前置校验未通过，无法提交', 'warning')
      return
    }

    // 前置接口返回 true，才正式调用提交接口
    const { data } = await submitConfirmTaxRefundInvoiceMatch({ type: 1 })
    if (data) {
      $baseMessage('确认成功！', 'success')
      // 清空 detailIds，避免重复提交
      detailIds.value = []
      finishCloseInvoiceMatching()
    }
  } catch (error) {
    finishCloseInvoiceMatching()
  } finally {
    confirmLoading.value = false
  }
}

const _supplier = ref<string>('')
const _invoiceName = ref<string>('')
const _invoiceUnit = ref<string>('')
const _invoiceCount = ref<number>(0)
const _includingTaxPrice = ref<number>(0)
let copyRow: any
// 展示匹配
const showMatch = async (row: IGetTaxRefundMainInvoiceList) => {
  // 保存当前选中的行
  selectedRowId.value = row.detailId!
  matchLoading.value = row.id! // 开始 loading
  resetMatchDialogState()
  matchQueryForm.detailId = row.detailId!
  matchListLoading.value = true

  try {
    const { data } = await getTaxRefundMainInvoiceMatch(matchQueryForm)
    // getInvoiceDetailInfo(row.detailId!)
    if (data) {
      // 使用响应式赋值
      _supplier.value = row.suppliser!
      _invoiceName.value = row.invoiceName!
      _invoiceUnit.value = row.invoiceUnit!
      _invoiceCount.value = row.invoiceCount!
      _includingTaxPrice.value = row.includingTaxPrice!
      // 默认按未开票数量从小到大排序
      sortState.value = { prop: 'notYetInvoice', order: 'ascending' }
      // 如果传入的 row 有 matchPo，则只显示相同 PO 的记录
      if (row.matchPo && row.matchPo.trim() !== '') {
        selectedPo.value = row.matchPo
      } else {
        selectedPo.value = null
      }
      // 保存原始数据
      originalMatchList.value = data?.list! || []
      // 显示过滤后的数据
      applySortAndFilter()
      matchVisible.value = true
      matchListLoading.value = false
    } else {
      matchVisible.value = false
    }
  } catch (error) {
    matchVisible.value = false
  } finally {
    matchLoading.value = null // 结束 loading
  }
}

// const getInvoiceDetailInfo = async (id: number) => {
//   const { data } = await getInvoiceDetail({ detailId: id })
//   _remainingCount.value = data.matchableCount
//   _remainingAmount.value = data.matchablePrice
// }

const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
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
const clickCancel = async (event: Event, value: IGetTaxRefundMainInvoiceList) => {
  const rootElement = getRootElement(event.target, '.cell')

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
    try {
      await updateTaxRefundInvoice({
        id: value.id!,
        purchaseName: value.purchaseName,
        invoiceCode: value.invoiceCode,
        invoiceNumber: value.invoiceNumber,
        suppliser: value.suppliser,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const clickDetailCancel = async (event: Event, value: IGetTaxRefundMainInvoiceList) => {
  const rootElement = getRootElement(event.target, '.cell')

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
    try {
      await updateTaxRefundInvoiceDetail({
        id: value.detailId!,
        invoiceName: value.invoiceName!,
        specificationModel: value.specificationModel!,
        invoiceCount: value.invoiceCount!,
        invoiceUnit: value.invoiceUnit!,
        preTaxPrice: value.preTaxPrice!,
        includingTaxPrice: value.includingTaxPrice!,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
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
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label

  const {
    invoiceCount,
    customsDeclarationCount,
    invoiceUnit,
    customsDeclarationUnit,
    includingTaxPrice,
    taxInclusiveCost,
    matchPo,
    matchContractNumber,
  } = data.row

  // 只有当报关数量、报关单位、po零件含税价都不为空时才生效
  const canCompare =
    customsDeclarationCount !== undefined &&
    customsDeclarationCount !== null &&
    customsDeclarationCount !== '' &&
    customsDeclarationUnit !== undefined &&
    customsDeclarationUnit !== null &&
    customsDeclarationUnit !== '' &&
    taxInclusiveCost !== undefined &&
    taxInclusiveCost !== null &&
    taxInclusiveCost !== ''

  if (canCompare) {
    // 比较发票单位和报关单位
    if (label === '发票单位' || label === '报关单位') {
      if (data.row.invoiceUnit !== data.row.customsDeclarationUnit) {
        if (label === '报关单位') {
          return {
            backgroundColor: 'rgba(142, 161, 231, 0.5)',
            textAlign: 'center',
            color: '#999',
          }
        } else {
          return {
            backgroundColor: 'rgba(142, 161, 231, 0.5)',
            textAlign: 'center',
          }
        }
      } else if (label === '报关单位') {
        return {
          textAlign: 'center',
          color: '#999',
        }
      } else {
        return {
          textAlign: 'center',
        }
      }
    }
  }
  switch (label) {
    case '购方名称':
    case '发票号码':
    case '供应商': {
      return {
        textAlign: 'left',
        cursor: 'pointer',
      }
    }
    case '开票品名':
    case '规格型号':
    case '发票数量':
    case '发票单位':
    case '发票含税金额':
    case '发票未税金额': {
      return {
        textAlign: 'center',
        cursor: 'pointer',
      }
    }
    case '匹配合同号':
    case '匹配PO':
    case '报关单位':
    case '报关数量':
    case '发票匹配数':
    case '含税价': {
      return {
        textAlign: 'center',
        cursor: 'not-allowed',
        color: '#999',
      }
    }
  }
  return {
    textAlign: 'center',
  }
}
const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column?.label
  if (
    label === '匹配合同号' ||
    label === '匹配PO' ||
    label === '发票匹配数' ||
    label === '报关单位' ||
    label === '报关数量' ||
    label === '含税价'
  ) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-primary-light-9)',
      color: 'var(--el-color-primary)',
      fontWeight: 600,
    }
  } else if (label !== '操作') {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-danger-light-9)',
      color: 'var(--el-color-danger)',
      fontWeight: 600,
    }
  }
  return {
    textAlign: 'center',
  }
}
const matchCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column?.label
  if (label === '合同编号' || label === 'SKU') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
// col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    // 获取当前row的零件id
    const id = row.id
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

const fetchData = async () => {
  listLoading.value = true
  getTaxRefundInvoiceFlag()
  const { data } = await getTaxRefundMainInvoiceList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  selectedRowId.value = null
  listLoading.value = false
}

const getTaxRefundInvoiceFlag = async () => {
  const { data } = await taxRefundInvoiceMatchFlag()
  unitPriceSameFlag.value = data
}

const cleanLoading = ref<number | null>(null) // 存储当前 loading 的行 id
const matchLoading = ref<number | null>(null) // 当前 loading 的匹配行 id
</script>

<style lang="scss" scoped>
.invoice-info-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 10px calc(var(--el-margin) / 2) 0;

  .invoice-info-tags-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  :deep(.el-tag) {
    font-size: 15px;
    padding: 8px 12px;
  }
}

.remaining-value {
  display: inline-block;
  padding: 2px 8px;
  margin: 0 2px;
  background-color: #fef0f0;
  color: #f56c6c;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #fbc4c4;
  font-size: 15px;
}

.none {
  display: none;
}
.noneHoveTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;

      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
    .custom-radio {
      margin-right: -10px;
      transform: scale(1.3);
      transform-origin: center;
    }
    // 选中单元格高亮样式
    .warning-cell {
      background-color: #7bddde !important;
    }

    // 普通行hover时保持白色（排除高亮单元格和选中单元格）
    .el-table__body tr {
      &.hover-row > td:not(.warning-cell):not(.highlight-cell),
      &:hover > td:not(.warning-cell):not(.highlight-cell) {
        background-color: #ffffff !important;
      }
    }
  }
}

.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
</style>
