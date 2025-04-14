<template>
  <vab-dialog v-model="dflag" :draggable="false" title="发票匹配" top="10vh" width="90%" @close="closeInvoiceMatching">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showUploadInvoice">发票导入</el-button>
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
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      max-height="57vh"
      :span-method="objectSpanMethod"
      @cell-click="cellClick"
    >
      <el-table-column fixed="left" label="操作">
        <template #default="{ row }">
          <el-link type="danger" :underline="false" @click="handleDeleteInvoice(row)">删除</el-link>
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
          <el-image :src="row.invoicePath" style="display: block; width: 75px; height: 75px" @click="showImagePreview(row.url)">
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="发票代码" min-width="120" prop="invoiceCode">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceCode" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.invoiceCode }}</span>
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
            <el-input v-model="row.suppliser" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.suppliser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票品名" min-width="100" prop="invoiceName">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceName" @blur="clickDetailCancel($event, row)" @keyup.enter="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" min-width="100" prop="specificationModel">
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
      <el-table-column label="发票数量" min-width="100" prop="invoiceCount">
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
      <el-table-column label="发票单位" min-width="100" prop="invoiceUnit">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceUnit" @blur="clickDetailCancel($event, row)" @keyup.enter="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票含税金额" min-width="110" prop="includingTaxPrice">
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
      <el-table-column label="发票未税金额" min-width="110" prop="preTaxPrice">
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
      <el-table-column label="匹配合同号" min-width="110" prop="matchContractNumber" />
      <el-table-column label="匹配PO" min-width="100" prop="matchPo" />
      <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />
      <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit" />
      <el-table-column fixed="right" label="操作" width="130">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showMatch(row)">匹配</el-link>
          <el-link type="primary" :underline="false" @click="handleCleanInvoice(row)">清空</el-link>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="closeInvoiceMatching">取消</el-button>
        <el-button type="primary" @click="handleSubmitConfirm">确认</el-button>
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
  <vab-dialog v-model="uploadInvoiceVisible" title="上传发票" width="25%">
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
  <!-- 匹配 -->
  <vab-dialog v-model="matchVisible" title="匹配" width="80%">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0">
          供应商：{{ _supplier }}，开票品名：{{ _invoiceName }}，单位：{{ _invoiceUnit }}，数量：{{ _invoiceCount }}，发票含税金额: {{ _includingTaxPrice }}
        </el-text>
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
    <el-table border :cell-style="matchCellStyle" class="noneHoveTable" :data="matchList" :header-cell-style="{ textAlign: 'center' }" @row-click="handleRowClick">
      <el-table-column label="合同编号" min-width="100" prop="contractNumber" />
      <el-table-column label="未匹配发票数" min-width="120" prop="notYetInvoice" />
      <el-table-column label="CIF售价" min-width="100" prop="cifPrice" />
      <el-table-column label="运费" min-width="90" prop="freightFee" />
      <el-table-column label="FOB售价" min-width="100" prop="fobPrice" />
      <el-table-column label="利润率" min-width="100" prop="profitMargin" />
      <el-table-column label="汇率" min-width="90" prop="rate" />
      <el-table-column label="人民币售价" min-width="110" prop="salePrice" />
      <el-table-column label="报关数量" min-width="100" prop="customsDeclarationCount" />
      <el-table-column label="报关单位" min-width="100" prop="customsDeclarationUnit" />
      <el-table-column label="PO" min-width="100" prop="po" />
      <el-table-column label="含税成本价￥" min-width="130" prop="taxInclusiveCost" />
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(matchList, 'SKU', 'sku')" />
      <el-table-column label="零件名" min-width="100" prop="componentName" :width="flexColumnWidth(matchList, '零件名', 'componentName')" />
      <el-table-column label="shipment ID" min-width="120" prop="shipmentId" />
      <el-table-column label="匹配" min-width="80" prop="status">
        <template #default="{ row }">
          <el-radio v-model="matchStatus" class="custom-radio" :label="row.id" size="large">{{ '' }}</el-radio>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination
      :current-page="matchQueryForm.pageNo"
      :page-size="matchQueryForm.pageSize"
      :total="matchTotal"
      @current-change="handleMatchCurrentChange"
      @size-change="handleMatchSizeChange"
    />
    <template #footer>
      <div style="text-align: center">
        <el-button @click="matchVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="closeImagePreview" />
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import {
  cleanTaxRefundInvoice,
  deleteTaxRefundInvoice,
  finishTaxRefundInvoice,
  getTaxRefundInvoiceList,
  getTaxRefundInvoiceMatch,
  submitConfirmTaxRefundInvoiceMatch,
  submitTaxRefundInvoiceMatch,
  updateTaxRefundInvoice,
  updateTaxRefundInvoiceDetail,
  uploadTaxRefund,
} from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type {
  IGetTaxRefundInvoiceList,
  IGetTaxRefundInvoiceListQuery,
  IGetTaxRefundInvoiceMatchList,
  IGetTaxRefundInvoiceMatchQuery,
} from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
defineOptions({
  name: 'VabInvoiceMatching',
})

const dflag = ref<boolean>(false)
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
const closeInvoiceMatching = () => {
  emit('updateInvoiceMatchingVisible', false)
}

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const closeImagePreview = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 上传发票可见
const uploadInvoiceVisible = ref<boolean>(false)

const fileList = ref<any[]>([])

const handleRowClick = (row: any, column: any, event: Event) => {
  matchStatus.value = row.id
}
// 展示上传发票
const showUploadInvoice = () => {
  fileList.value = []
  uploadInvoiceVisible.value = true
}
const finishLoading = ref<boolean>(false)
// 完成发票导入
const handleFinishUpload = async () => {
  finishLoading.value = true
  const formData = new FormData()
  fileList.value.forEach((item: any) => {
    formData.append('files', item.raw)
  })
  try {
    const { data } = await uploadTaxRefund(formData)

    if (data) {
      $baseMessage('上传成功', 'success')
      const { data: resData, msg } = await finishTaxRefundInvoice(data)
      if (resData) {
        $baseMessage(resData, 'error')
      } else {
        uploadInvoiceVisible.value = false
        fetchData()
      }
    }
  } catch {
    $baseMessage('上传失败', 'error')
  } finally {
    finishLoading.value = false
  }
}
// 发票匹配清空
const handleCleanInvoice = async (row: IGetTaxRefundInvoiceList) => {
  $baseConfirm('确定要清空吗？', null, async () => {
    const { data } = await cleanTaxRefundInvoice({
      detailId: row.detailId!,
    })
    if (data) {
      $baseMessage('清空成功！', 'success')
      fetchData()
    }
  })
}
// 删除发票
const handleDeleteInvoice = async (row: IGetTaxRefundInvoiceList) => {
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
const list = ref<IGetTaxRefundInvoiceList[]>([])

// const invoiceList = ref<UploadUserFile[]>([])
const queryForm = reactive<IGetTaxRefundInvoiceListQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const listLoading = ref<boolean>(false)
const matchQueryForm = reactive<IGetTaxRefundInvoiceMatchQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  detailId: -1,
})
const matchTotal = ref<number>(0)
const matchListLoading = ref<boolean>(false)
const matchList = ref<IGetTaxRefundInvoiceMatchList[]>([])
const queryMatchData = () => {
  matchQueryForm.pageNo = 1
  fetchMatchData()
}
const handleMatchCurrentChange = (value: number) => {
  matchQueryForm.pageNo = value
  fetchMatchData()
}
const handleMatchSizeChange = (value: number) => {
  matchQueryForm.pageSize = value
  matchQueryForm.pageNo = 1
  fetchMatchData()
}

const handleConfirm = async () => {
  if (matchStatus.value === -1){
    $baseMessage('请选择匹配项','warning')
    return
  }
  const { data } = await submitTaxRefundInvoiceMatch({
    id: matchStatus.value,
    detailId: matchQueryForm.detailId,
  })
  if (data) {
    $baseMessage('提交成功！', 'success')
    matchVisible.value = false
    fetchData()
  }
}
const handleSubmitConfirm = async () => {
  let detailIds: number[] = []
  let isNotNull = false
  list.value.forEach((item) => {
    if (item.matchContractNumber || item.matchPo || item.customsDeclarationCount || item.customsDeclarationUnit ) {
      isNotNull = true
      detailIds.push(item.detailId!)
    }
  })
  if (isNotNull) {
    const { data } = await submitConfirmTaxRefundInvoiceMatch(detailIds)
    if (data) {
      $baseMessage('确认成功！', 'success')
      closeInvoiceMatching()
    }
  } else {
    closeInvoiceMatching()
  }
}

const _supplier = ref<string>('')
const _invoiceName = ref<string>('')
const _invoiceUnit = ref<string>('')
const _invoiceCount = ref<number>(0)
const _includingTaxPrice = ref<number>(0)
let copyRow: any
// 展示匹配
const showMatch = async (row: IGetTaxRefundInvoiceList) => {
  matchQueryForm.detailId = row.detailId!
  matchListLoading.value = true
  const { data } = await getTaxRefundInvoiceMatch(matchQueryForm)
  if (data) {
    // 使用响应式赋值
    _supplier.value = row.suppliser!
    _invoiceName.value = row.invoiceName!
    _invoiceUnit.value = row.invoiceUnit!
    _invoiceCount.value = row.invoiceCount!
    _includingTaxPrice.value = row.includingTaxPrice!
    matchTotal.value = data?.total!
    matchList.value = data?.list!
    matchVisible.value = true
    matchListLoading.value = false
  } else {
    matchVisible.value = false
  }
}

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
const clickCancel = async (event: Event, value: IGetTaxRefundInvoiceList) => {
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
const clickDetailCancel = async (event: Event, value: IGetTaxRefundInvoiceList) => {
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
  switch (label) {
    case '购方名称': 
    case '发票代码': 
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
    case '报关数量': 
    case '报关单位': {
      return {
        textAlign: 'center',
        cursor: 'not-allowed',
        color: '#999'
      }
    }
    // No default
  }
  return {
    textAlign: 'center',
  }
  // 发票数量和发票单位与报关数量和报关单位不一致，报关数量和单位就标红
}
const matchCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 12 || data.columnIndex === 13 || data.columnIndex === 14) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 10) {
    return 'clear-padding'
  }
  return ''
}
// col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
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
const fetchMatchData = async () => {
  matchListLoading.value = true
  const { data } = await getTaxRefundInvoiceMatch(matchQueryForm)
  matchTotal.value = data?.total!
  matchList.value = data?.list!
  matchListLoading.value = false
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundInvoiceList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  listLoading.value = false
}
</script>

<style lang="scss" scoped>
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
  }
}
</style>
