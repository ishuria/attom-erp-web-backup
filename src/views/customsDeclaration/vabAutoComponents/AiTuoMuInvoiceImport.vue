<template>
  <vab-dialog
    v-model="dflag"
    :draggable="false"
    style="width: fit-content; max-height: 90vh"
    :title="title"
    top="10vh"
    @close="closeInvoiceMatching"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button v-if="invoiceFlag" type="primary" @click="showUploadInvoice">发票导入</el-button>
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
      max-height="80vh"
      @cell-click="cellClick"
    >
      <el-table-column v-if="!invoiceFlag" label="匹配" prop="status" width="70">
        <template #default="{ row }">
          <el-radio v-model="matchStatus" class="custom-radio" :label="row.detailId" size="large">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="购方名称" prop="purchaseName" :width="flexColumnWidth(list, '购方名称', 'purchaseName')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
            <el-input v-model="row.purchaseName" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.purchaseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票图片" prop="invoicePath" width="100">
        <!-- <template #header>
          发票
          <br />
          图片
        </template> -->
        <template #default="{ row }">
          <!-- <el-image :src="row.invoicePath" style="display: block; width: 75px; height: 75px" @click="showImagePreview(row.url)">
            <template #error>
              <el-icon />
            </template>
          </el-image> -->
          <el-button size="small" style="min-width: 70px; min-height: 35px" @click="showPdf(row.invoicePath)">PDF</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发票代码" prop="invoiceCode" :width="flexColumnWidth(list, '发票代码', 'invoiceCode')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
            <el-input v-model="row.invoiceCode" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.invoiceCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
            <el-input v-model="row.invoiceNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.invoiceNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
            <el-input v-model="row.suppliser" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.suppliser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票品名" prop="invoiceName" :width="flexColumnWidth(list, '开票品名', 'invoiceName')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
            <el-input v-model="row.invoiceName" @blur="clickDetailCancel($event, row)" @keyup.enter="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" prop="specificationModel" :width="flexColumnWidth(list, '规格型号', 'specificationModel')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
            <el-input
              v-model="row.specificationModel"
              @blur="clickDetailCancel($event, row)"
              @keyup.enter="clickDetailCancel($event, row)"
            />
          </div>
          <span>{{ row.specificationModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票数量" prop="invoiceCount" :width="flexColumnWidth(list, '发票数量', 'invoiceCount')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
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
          <div v-if="invoiceFlag" class="none">
            <el-input v-model="row.invoiceUnit" @blur="clickDetailCancel($event, row)" @keyup.enter="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票含税金额" prop="includingTaxPrice" :width="flexColumnWidth(list, '发票含税金额', 'includingTaxPrice')">
        <template #default="{ row }">
          <div v-if="invoiceFlag" class="none">
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
          <div v-if="invoiceFlag" class="none">
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

      <el-table-column v-if="invoiceFlag" fixed="right" label="操作" width="70">
        <template #default="{ row }">
          <el-link type="danger" underline='never' @click="handleDeleteInvoice(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="!invoiceFlag" #footer>
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
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="closeImagePreview" />
  <!-- 预览pdf -->
  <vab-dialog v-model="pdfVisible" top="5vh" @close="pdfVisible = false">
    <div v-loading="pdfLoading" class="pdf-container">
      <vab-pdf :source="source" />
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import VabPdf from '/@/plugins/VabPdf'

import {
    aiTuoMuInvoiceMatch,
    deleteAiTuoMuInvoice,
    finishAiTuoMuInvoice,
    getAiTuoMuInvoiceList,
    updateAiTuoMuInvoice,
    updateAiTuoMuInvoiceDetail,
    uploadAiTuoInvoice,
} from '/@/api/devlocal/aiTuoMu'
import { IAiTuoMuInvoiceItem, IAiTuoMuInvoiceReq } from '/@/type/aiTuoMu/aiTuoMuInvoice'

import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
defineOptions({
  name: 'AiTuoMuInvoiceImport',
})

const title = ref<string>('')
const dflag = ref<boolean>(false)
const invoiceFlag = ref<boolean>(false)
const props = defineProps<{
  invoiceMatchingVisible: boolean
  from: string
  idList?: number[]
}>()
watchEffect(() => {
  dflag.value = props.invoiceMatchingVisible
  if (dflag.value) {
    fetchData()
  }
  if (props.from === 'match') {
    title.value = '发票匹配'
    invoiceFlag.value = false
  } else {
    title.value = '发票导入'
    invoiceFlag.value = true
  }
})
const emit = defineEmits<{
  updateInvoiceMatchingVisible: [value: boolean]
  refresh: any
}>()
const closeInvoiceMatching = () => {
  emit('updateInvoiceMatchingVisible', false)
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
    const { data } = await uploadAiTuoInvoice(formData)

    if (data) {
      $baseMessage('上传成功', 'success')
      const { data: resData, msg } = await finishAiTuoMuInvoice(data)
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

// 删除发票
const handleDeleteInvoice = async (row: IAiTuoMuInvoiceItem) => {
  $baseConfirm('确定要删除吗？', null, async () => {
    const { data } = await deleteAiTuoMuInvoice({
      id: row.id!,
    })
    if (data) {
      $baseMessage('删除成功！', 'success')
      fetchData()
    }
  })
}

const matchStatus = ref<number>(-1)
const total = ref<number>(0)
const list = ref<IAiTuoMuInvoiceItem[]>([])

const queryForm = reactive<IAiTuoMuInvoiceReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const listLoading = ref<boolean>(false)

const handleSubmitConfirm = async () => {
  const invoiceId = list.value.find((item) => (item.detailId = matchStatus.value))?.id
  if (matchStatus.value) {
    const { data } = await aiTuoMuInvoiceMatch({
      idList: props.idList,
      invoiceDetailId: matchStatus.value,
      invoiceId,
    })
    if (data) {
      $baseMessage('确认成功！', 'success')
      closeInvoiceMatching()
      emit('refresh')
    }
  } else {
    $baseMessage('您未选择任何行！', 'warning')
  }
}

let copyRow: any

const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '发票图片') {
    showPdf(row.invoicePath)
    return
  }
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
const clickCancel = async (event: Event, value: IAiTuoMuInvoiceItem) => {
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
      await updateAiTuoMuInvoice({
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
const clickDetailCancel = async (event: Event, value: IAiTuoMuInvoiceItem) => {
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
      await updateAiTuoMuInvoiceDetail({
        detailId: value.detailId!,
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
  if (invoiceFlag.value) {
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
      // No default
    }
    return {
      textAlign: 'center',
    }
  } else {
    switch (label) {
      case '购方名称':
      case '发票代码':
      case '发票号码':
      case '供应商': {
        return {
          textAlign: 'left',
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
        }
      }
    }
    return {
      textAlign: 'center',
    }
    // 发票数量和发票单位与报关数量和报关单位不一致，报关数量和单位就标红
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 10) {
    return 'clear-padding'
  }
  return ''
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAiTuoMuInvoiceList(queryForm)
  total.value = data.total
  list.value = data.list
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
