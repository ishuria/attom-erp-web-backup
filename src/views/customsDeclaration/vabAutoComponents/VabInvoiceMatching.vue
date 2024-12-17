<template>
  <vab-dialog
    title="发票匹配"
    v-model="dflag"
    @close="closeInvoiceMatching"
    width="90%"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showUploadInvoice">发票导入</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="listLoading" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="list"
      @cell-click="cellClick"
      class="noneHoveTable"
      :cell-class-name="clearPadding"
      max-height="57vh"
      :span-method="objectSpanMethod"
    >
      <el-table-column label="操作" fixed="left">
        <template #default="{ row }">
          <el-link :underline="false" type="danger" @click="handleDeleteInvoice(row)">删除</el-link>
        </template>
      </el-table-column>
      <el-table-column label="购方名称" prop="purchaseName" :width="flexColumnWidth(list, '购方名称', 'purchaseName')">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.purchaseName" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.purchaseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票图片" prop="invoicePath" width="75">
        <template #header>
          发票<br />图片
        </template>
        <template #default="{ row }">
          <el-image :src="row.invoicePath" style="width: 75px; height: 75px; display: block" @click="showImagePreview(row.url)">
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="发票代码" prop="invoiceCode" min-width="120">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceCode" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.invoiceCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票号码" prop="invoiceNumber" :width="flexColumnWidth(list, '发票号码', 'invoiceNumber')">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceNumber" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.invoiceNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.suppliser" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.suppliser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票品名" prop="invoiceName" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceName" @keyup.enter="clickDetailCancel($event, row)" @blur="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" prop="specificationModel" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.specificationModel" @keyup.enter="clickDetailCancel($event, row)" @blur="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.specificationModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票数量" prop="invoiceCount" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceCount" type="number" @keyup.enter="clickDetailCancel($event, row)" @blur="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票单位" prop="invoiceUnit" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.invoiceUnit" @keyup.enter="clickDetailCancel($event, row)" @blur="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.invoiceUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票含税金额" prop="includingTaxPrice" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.includingTaxPrice" type="number" @keyup.enter="clickDetailCancel($event, row)" @blur="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.includingTaxPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票未税金额" prop="preTaxPrice" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.preTaxPrice" type="number" @keyup.enter="clickDetailCancel($event, row)" @blur="clickDetailCancel($event, row)" />
          </div>
          <span>{{ row.preTaxPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="匹配合同号" prop="matchContractNumber" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.matchContractNumber" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.matchContractNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="匹配PO" prop="matchPo" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.matchPo" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.matchPo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关数量" prop="customsDeclarationCount" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.customsDeclarationCount" type="number" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.customsDeclarationCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关单位" prop="customsDeclarationUnit" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.customsDeclarationUnit" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.customsDeclarationUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="{ row }">
          <el-link :underline="false" type="primary" @click="showMatch(row)">匹配</el-link>
          <el-link :underline="false" type="primary" @click="handleCleanInvoice(row)">清空</el-link>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div style="text-align: center;">
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
  <vab-dialog
    title="上传发票"
    width="25%"
    v-model="uploadInvoiceVisible"
  >
    <el-upload 
      drag multiple 
      :show-file-list="true" 
      :auto-upload="false"
      v-model:file-list="fileList"
    >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或
          <em>点击上传</em>
        </div>
      </el-upload>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="success" @click="handleFinishUpload">完成</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 匹配 -->
  <vab-dialog
    title="匹配"
    v-model="matchVisible"
    width="80%"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0;">
          供应商：{{ _row.suppliser}}，开票品名：{{ _row.invoiceName }}，单位：{{ _row.invoiceUnit }}，数量：{{ _row.invoiceCount }}，发票含税金额: {{ _row.includingTaxPrice }}
        </el-text>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="matchQueryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="matchQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryMatchData" @keyup.enter.native="queryMatchData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="matchListLoading" native-type="submit" @click="queryMatchData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="matchCellStyle"
      :data="matchList"
      class="noneHoveTable"
    >
      <el-table-column label="合同编号" prop="contractNumber" min-width="100"></el-table-column>
      <el-table-column label="未匹配发票数" prop="" min-width="120"></el-table-column>
      <el-table-column label="CIF售价" prop="cifPrice" min-width="100"></el-table-column>
      <el-table-column label="运费" prop="freightFee" min-width="90"></el-table-column>
      <el-table-column label="FOB售价" prop="fobPrice" min-width="100"></el-table-column>
      <el-table-column label="利润率" prop="profitMargin" min-width="100"></el-table-column>
      <el-table-column label="汇率" prop="" min-width="90"></el-table-column>
      <el-table-column label="人民币售价" prop="salePrice" min-width="110"></el-table-column>
      <el-table-column label="报关数量" prop="customsDeclarationCount" min-width="100"></el-table-column>
      <el-table-column label="报关单位" prop="customsDeclarationUnit" min-width="100"></el-table-column>
      <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
      <el-table-column label="含税成本价￥" prop="taxInclusiveCost" min-width="130"></el-table-column>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(matchList, 'SKU', 'sku')"></el-table-column>
      <el-table-column label="零件名" prop="" min-width="100"></el-table-column>
      <el-table-column label="shipment ID" prop="shipmentId" min-width="120"></el-table-column>
      <el-table-column label="匹配" prop="status" min-width="80">
        <template #default="{ row }">
          <el-radio class="custom-radio" v-model="matchStatus" :label="row.id" size="large">{{ '' }}</el-radio>
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
      <div style="text-align: center;">
        <el-button>取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="closeImagePreview" hide-on-click-modal />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabInvoiceMatching'
})
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import { cleanTaxRefundInvoice, deleteTaxRefundInvoice, finishTaxRefundInvoice, getTaxRefundInvoiceList, getTaxRefundInvoiceMatch, submitConfirmTaxRefundInvoiceMatch, submitTaxRefundInvoiceMatch, updateTaxRefundInvoice, updateTaxRefundInvoiceDetail, uploadTaxRefund } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetTaxRefundInvoiceList, IGetTaxRefundInvoiceListQuery, IGetTaxRefundInvoiceMatchList, IGetTaxRefundInvoiceMatchQuery } from '/@/type/customsDeclarationAndTaxRefund/refundTax'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

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

// 展示上传发票
const showUploadInvoice = () => {
  uploadInvoiceVisible.value = true
}
// 完成发票导入
const handleFinishUpload = async () => {
  const formData = new FormData()
  fileList.value.forEach((item: any) => {
    formData.append("files", item.raw)
  })
  try {
    const { data } = await uploadTaxRefund(formData)

    if (data) {
      $baseMessage('上传成功', 'success')
      const { data: resData, msg } = await finishTaxRefundInvoice(data)
      if (msg) {
        $baseMessage(resData, 'error')
        uploadInvoiceVisible.value = false
      }
    }
  } catch (err) {
    $baseMessage('上传失败', 'error')
  }
  
}
// 发票匹配清空
const handleCleanInvoice = async (row: IGetTaxRefundInvoiceList) => {
  $baseConfirm('确定要清空吗？', null, async () => {
    const { data } = await cleanTaxRefundInvoice({
      detailId: row.detailId!
    })
    if (data) {
      $baseMessage('清空成功！', 'success')
    }
  })
}
// 删除发票
const handleDeleteInvoice = async (row: IGetTaxRefundInvoiceList) => {
  $baseConfirm('确定要删除吗？', null, async () => {
    const { data } = await deleteTaxRefundInvoice({
      id: row.id!
    })
    if (data) {
      $baseMessage('删除成功！', 'success')
    }
  })
}
// 匹配可见
const matchVisible = ref<boolean>(false)
const matchStatus = ref<number>(0)
const total = ref<number>(0)
const list = ref<IGetTaxRefundInvoiceList[]>([])

// const invoiceList = ref<UploadUserFile[]>([])
const queryForm = reactive<IGetTaxRefundInvoiceListQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const listLoading = ref<boolean>(false)
const matchQueryForm = reactive<IGetTaxRefundInvoiceMatchQuery>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  detailId: -1
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
  const { data } = await submitTaxRefundInvoiceMatch({
    id: matchStatus.value,
    detailId: matchQueryForm.detailId
  })
  if (data) {
    $baseMessage('提交成功！', 'success')
    matchVisible.value = false
  }
}
const handleSubmitConfirm = async () => {
  const { data } = await submitConfirmTaxRefundInvoiceMatch()
  if (data) {
    $baseMessage('确认成功！', 'success')
    closeInvoiceMatching()
  }
}
let _row: IGetTaxRefundInvoiceList = {}

// 展示匹配
const showMatch = async (row: IGetTaxRefundInvoiceList) => {
  matchQueryForm.detailId = row.detailId!
  matchListLoading.value = true
  const { data } = await getTaxRefundInvoiceMatch(matchQueryForm)
  if (data) {
    _row = row
    matchTotal.value = data?.total!
    matchList.value = data?.list!
    matchVisible.value = true
    matchListLoading.value = false
  } else {
    matchVisible.value = false
  }
}

// 清空全部PO
const clearAllPO = async () => {
  $baseConfirm('确定要清空全部PO吗？', null, async () => {
    console.log(1);
    
  })
}
const handleDelAll = async () => {
  $baseConfirm('确定要全部删除吗？', null, async () => {
console.log(2);

  })
}
let copyRow: any
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  copyRow = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
const clickCancel = async (event: Event, value: IGetTaxRefundInvoiceList) => {
  const rootElement = getRootElement(event.target, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    await updateTaxRefundInvoice({
      id: value.id!,
      purchaseName: value.purchaseName,
      invoiceCode: value.invoiceCode,
      invoiceNumber: value.invoiceNumber,
      suppliser: value.suppliser
    })
  }
}
const clickDetailCancel = async (event: Event, value: IGetTaxRefundInvoiceList) => {
  const rootElement = getRootElement(event.target, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    await updateTaxRefundInvoiceDetail({
      id: value.detailId!,
      invoiceName: value.invoiceName!,
      specificationModel: value.specificationModel!,
      invoiceCount: value.invoiceCount!,
      invoiceUnit: value.invoiceUnit!,
      preTaxPrice: value.preTaxPrice!,
      includingTaxPrice: value.includingTaxPrice!
    })
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
const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4 || data.columnIndex === 5) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
  // 发票数量和发票单位与报关数量和报关单位不一致，报关数量和单位就标红
}
const matchCellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 12 || data.columnIndex === 13 || data.columnIndex === 14) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const clearPadding = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): string => {
  if (data.columnIndex === 10) {
    return 'clear-padding'
  }
  return ''
}
// col合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
    // 获取当前row的零件id
    const id = row.id;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
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
        padding-left: 0;
        padding-right: 0;
      }
    }
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
    .custom-radio {
      transform: scale(1.3);
      transform-origin: center;
      margin-right: -10px;
    }
  }
}
</style>