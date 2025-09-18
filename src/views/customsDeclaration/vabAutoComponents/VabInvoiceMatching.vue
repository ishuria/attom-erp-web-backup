<template>
  <vab-dialog v-model="dflag" :draggable="false" title="发票匹配" top="10vh" width="90%" @close="closeInvoiceMatching">
    <div style="max-width: fit-content; margin: 0 auto; width: 100%; display: flex; flex-direction: column; height: 100%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="showUploadInvoice('import')">发票导入</el-button>
          <el-button type="primary" @click="showUploadInvoice('repeat')">多页发票导入</el-button>
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
        max-height="800"
        :span-method="objectSpanMethod"
        @cell-click="cellClick"
      >
        <el-table-column fixed="left" label="操作" width="70">
          <template #default="{ row }">
            <el-link type="danger" underline="never" @click="handleDeleteInvoice(row)">删除</el-link>
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
            <!-- <el-image :src="row.invoicePath" style="display: block; width: 75px; height: 75px" @click="showImagePreview(row.url)">
            <template #error>
              <el-icon />
            </template>
          </el-image> -->
            <el-button size="small" style="min-width: 20px; min-height: 35px" @click="showPdf(row.invoicePath)">PDF</el-button>
          </template>
        </el-table-column>
        <el-table-column label="发票代码" prop="invoiceCode" :width="flexColumnWidth(list, '发票代码', 'invoiceCode')">
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
              <el-input v-model.trim="row.suppliser" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.suppliser }}</span>
          </template>
        </el-table-column>
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
        <el-table-column label="发票数量" prop="invoiceCount" :width="flexColumnWidth(list, '发票数量', 'invoiceCount')">
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
        <el-table-column
          label="匹配合同号"
          prop="matchContractNumber"
          :width="flexColumnWidth(list, '匹配合同号', 'matchContractNumber')"
        />
        <el-table-column label="匹配PO" prop="matchPo" :width="flexColumnWidth(list, '匹配PO', 'matchPo')" />
        <el-table-column label="零件PO含税价" prop="taxInclusiveCost" width="100">
          <template #header>
            零件PO
            <br />
            含税价
          </template>
        </el-table-column>
        <el-table-column
          label="实际报关数"
          prop="customsDeclarationCount"
          :width="flexColumnWidth(list, '实际报关数', 'customsDeclarationCount')"
        />
        <el-table-column
          label="PO总报关数"
          prop="customsDeclarationCountTotal"
          :width="flexColumnWidth(list, 'PO总报关数', 'customsDeclarationCountTotal')"
        />
        <el-table-column
          label="报关单位"
          prop="customsDeclarationUnit"
          :width="flexColumnWidth(list, '报关单位', 'customsDeclarationUnit')"
        />
        <el-table-column align="center" fixed="right" label="操作" width="130">
          <template #default="{ row }">
            <div style="display: flex">
              <el-button :disabled="matchLoading === row.detailId" link type="primary" @click="showMatch(row)">匹配</el-button>
              <el-button :disabled="cleanLoading === row.detailId" link type="danger" @click="handleCleanInvoice(row)">清空</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  <vab-dialog v-model="uploadInvoiceVisible" :title="uploadType == 'import' ? '上传发票' : '上传多页发票'" width="25%">
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
  <vab-dialog v-model="matchVisible" :draggable="false" style="width: fit-content; max-height: 90vh" title="匹配" @close="matchStatus = -1">
    <div style="max-width: fit-content; margin: 0 auto; width: 100%; display: flex; flex-direction: column; height: 100%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0">
            供应商：{{ _supplier }}，开票品名：{{ _invoiceName }}，单位：{{ _invoiceUnit }}，数量：{{ _invoiceCount }}，发票含税金额:
            {{ _includingTaxPrice }}
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
      <el-table
        v-loading="matchListLoading"
        border
        :cell-style="matchCellStyle"
        class="noneHoveTable"
        :data="pagedData"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="50vh"
        @row-click="handleRowClick"
      >
        <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(pagedData, '合同编号', 'contractNumber')" />
        <el-table-column label="未匹配发票数" prop="notYetInvoice" width="125" />
        <el-table-column label="CIF售价" prop="cifPrice" :width="flexColumnWidth(pagedData, 'CIF售价', 'cifPrice')" />
        <el-table-column label="运费" prop="freightFee" :width="flexColumnWidth(pagedData, '运费', 'freightFee')" />
        <el-table-column label="FOB售价" prop="fobPrice" :width="flexColumnWidth(pagedData, 'FOB售价', 'fobPrice')" />
        <el-table-column label="利润率" prop="profitMargin" :width="flexColumnWidth(pagedData, '利润率', 'profitMargin')" />
        <el-table-column label="汇率" prop="rate" width="80" />
        <el-table-column label="人民币售价" prop="salePrice" :width="flexColumnWidth(pagedData, '人民币售价', 'salePrice')" />
        <el-table-column label="报关数量" prop="customsDeclarationCount" width="95" />
        <el-table-column label="报关单位" prop="customsDeclarationUnit" width="95" />
        <el-table-column label="PO" prop="po" width="100" />
        <el-table-column label="含税成本价￥" prop="taxInclusiveCost" width="125" />
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(pagedData, 'SKU', 'sku')" />
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(pagedData, '零件名', 'componentName')" />
        <el-table-column label="Shipment ID" prop="shipmentId" :width="flexColumnWidth(pagedData, 'Shipment ID-', 'shipmentId')" />
        <el-table-column label="匹配" prop="status" width="70">
          <template #default="{ row }">
            <el-radio v-model="matchStatus" class="custom-radio" :label="row.uniqId" size="large">{{ '' }}</el-radio>
          </template>
        </el-table-column>
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
import { ElMessageBox } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import {
  cleanTaxRefundInvoice,
  deleteTaxRefundInvoice,
  finishTaxRefundInvoice,
  finishTaxRefundInvoiceRepeat,
  getTaxRefundInvoiceList,
  getTaxRefundInvoiceMatch,
  submitConfirmTaxRefundInvoiceMatch,
  submitTaxRefundInvoiceMatch,
  updateTaxRefundInvoice,
  updateTaxRefundInvoiceDetail,
  uploadTaxRefund,
} from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import VabPdf from '/@/plugins/VabPdf'
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
const closeInvoiceMatching = () => {
  // 清空 detailIds，避免重复提交
  detailIds.value = []
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
  matchStatus.value = row.uniqId
}
// 上传发票类型 import = 上传发票 repeat = 重复发票
const uploadType = ref<string>('')
// 展示上传发票
const showUploadInvoice = (type: string) => {
  uploadType.value = type
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
        const { data: resData, msg } = await finishTaxRefundInvoiceRepeat(data)
        if (resData) {
          $baseMessage('发票导入成功', 'success')
          await fetchData()
        } else {
          uploadInvoiceVisible.value = false
          await fetchData()
        }
      }
    } catch {
      $baseMessage('发票文件上传失败', 'error')
    } finally {
      finishLoading.value = false
    }
  }
}
// 发票匹配清空
const handleCleanInvoice = async (row: IGetTaxRefundInvoiceList) => {
  cleanLoading.value = row.id!
  $baseConfirm(
    '确定要清空吗？',
    null,
    async () => {
      const { data } = await cleanTaxRefundInvoice({
        detailId: row.detailId!,
      })
      if (data) {
        $baseMessage('清空成功！', 'success')
        fetchData()
      }
      cleanLoading.value = null // 结束 loading
    },
    () => {
      cleanLoading.value = null // 取消时也结束 loading
    }
  )
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
// 保存原始数据，用于搜索过滤
const originalMatchList = ref<IGetTaxRefundInvoiceMatchList[]>([])
const queryMatchData = () => {
  matchQueryForm.pageNo = 1
  applyKeywordFilter()
}
// 计算当前页的数据
const pagedData = computed(() => {
  const start = (matchQueryForm.pageNo - 1) * matchQueryForm.pageSize
  const end = start + matchQueryForm.pageSize
  return matchList.value.slice(start, end) // 获取当前页的数据
})
// 根据关键词过滤数据
const applyKeywordFilter = () => {
  const keyword = matchQueryForm.keyWord.trim().toLowerCase()
  if (keyword) {
    // 基于原始数据进行过滤
    matchList.value = originalMatchList.value.filter(
      (item: any) =>
        (item.contractNumber?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.po?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.sku?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.customsDeclarationCount?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.customsDeclarationName?.toString()?.toLowerCase() || '').includes(keyword) ||
        (item.taxInclusiveCost?.toString()?.toLowerCase() || '').includes(keyword)
    )
  } else {
    // 如果关键词为空，显示所有原始数据
    matchList.value = [...originalMatchList.value]
  }
}
const handleMatchCurrentChange = (value: number) => {
  matchQueryForm.pageNo = value
  // fetchMatchData()
}
const handleMatchSizeChange = (value: number) => {
  matchListLoading.value = true
  matchQueryForm.pageSize = value
  matchQueryForm.pageNo = 1
  matchListLoading.value = false
  // fetchMatchData()
}

const detailIds = ref<number[]>([])

const handleConfirm = async () => {
  matchInvoiceLoading.value = true
  if (matchStatus.value === -1) {
    $baseMessage('请选择匹配项', 'warning')
    return
  }
  try {
    // 勾选匹配的value
    const matchedItem = matchList.value.find((item: IGetTaxRefundInvoiceMatchList) => item.uniqId === matchStatus.value)

    const { data } = await submitTaxRefundInvoiceMatch({
      id: matchedItem!.id,
      detailId: matchQueryForm.detailId,
    })
    if (data) {
      $baseMessage('提交成功！', 'success')
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

const handleSubmitConfirm = async () => {
  const setIds = new Set(detailIds.value)

  list.value.forEach((item) => {
    if (item.matchContractNumber || item.matchPo || item.customsDeclarationCount || item.customsDeclarationUnit) {
      setIds.add(item.detailId!)
    }
  })
  if (setIds.size > 0) {
    const { data } = await submitConfirmTaxRefundInvoiceMatch(Array.from(setIds))
    if (data) {
      $baseMessage('确认成功！', 'success')
      // 清空 detailIds，避免重复提交
      detailIds.value = []
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
  matchLoading.value = row.id! // 开始 loading
  if (row.matchContractNumber) {
    $baseMessage('请先清空再进行匹配！', 'warning')
    matchLoading.value = null
    return
  }
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
    // 保存原始数据
    originalMatchList.value = data?.list! || []
    // 显示过滤后的数据
    matchList.value = [...originalMatchList.value]
    matchVisible.value = true
    matchListLoading.value = false
  } else {
    matchVisible.value = false
  }
  matchLoading.value = null // 结束 loading
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

  const flag = matchContractNumber == '' && matchPo !== '' && matchPo !== undefined
  if (flag) {
    if (label === 'PO总报关数' || label === '发票数量') {
      if (data.row.invoiceCount !== data.row.customsDeclarationCountTotal) {
        return {
          backgroundColor: 'rgba(142, 198, 231, 0.5)', // 红色背景，可自定义
          textAlign: 'center',
        }
      }
      return {
        textAlign: 'center',
      }
    }
  }

  if (canCompare) {
    // 比较发票数量和报关数量
    if (label === '发票数量' || label === '实际报关数') {
      if (data.row.invoiceCount !== data.row.customsDeclarationCount) {
        return {
          backgroundColor: 'rgba(142, 198, 231, 0.5)', // 红色背景，可自定义
          textAlign: 'center',
        }
      }
      return {
        textAlign: 'center',
      }
    }

    // 比较发票单位和报关单位
    if (label === '发票单位' || label === '报关单位') {
      if (data.row.invoiceUnit !== data.row.customsDeclarationUnit) {
        return {
          backgroundColor: 'rgba(142, 161, 231, 0.5)',
          textAlign: 'center',
        }
      }
      return {
        textAlign: 'center',
      }
    }

    // 比较发票含税金额和零件po含税价
    if (label === '发票含税金额' || label === '零件PO含税价') {
      if (data.row.includingTaxPrice !== data.row.taxInclusiveCost) {
        return {
          backgroundColor: 'rgba(172, 142, 253, 0.5)',
          textAlign: 'center',
        }
      }
      return {
        textAlign: 'center',
      }
    }
  }
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
    case '实际报关数':
    case '报关单位': {
      return {
        textAlign: 'center',
        cursor: 'not-allowed',
        color: '#999',
      }
    }
    case '零件PO含税价': {
      if (data.row.preTaxPrice !== data.row.taxInclusiveCost) {
        return {
          textAlign: 'center',
          cursor: 'not-allowed',
          color: 'var(--el-color-danger)',
        }
      } else {
        return {
          textAlign: 'center',
          cursor: 'not-allowed',
          color: '#999',
        }
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
  // 保存原始数据
  originalMatchList.value = data?.list! || []
  // 显示过滤后的数据
  matchList.value = [...originalMatchList.value]
  matchListLoading.value = false
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getTaxRefundInvoiceList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  listLoading.value = false
}
const cleanLoading = ref<number | null>(null) // 存储当前 loading 的行 id
const matchLoading = ref<number | null>(null) // 当前 loading 的匹配行 id
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
