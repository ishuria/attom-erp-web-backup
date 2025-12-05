<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-page-header style="margin-bottom: 0px" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span>
            <strong>供应商 | {{ route.query.componentName }} | 零件ID：{{ route.query.componentId }}</strong>
          </span>
        </div>
      </template>
    </el-page-header>
    <vab-query-form>
      <vab-query-form-left-panel style="margin-top: 20px">
        <el-button type="primary" @click="handleAddSupplier">新增供应商</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ 'text-align': 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <div class="image-cell">
            <!-- 有图片时显示 -->
            <div v-if="row.componentImage" class="image-preview">
              <img alt="" :src="row.componentImage" />
              <div class="image-actions">
                <el-icon @click="handlePreview(row.componentImage)"><zoom-in /></el-icon>
                <el-icon @click="handleComponentRemove(row)"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog(row)">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="componentUnit" width="60" />
      <el-table-column label="出厂单价" min-width="75" prop="unitPrice">
        <template #header>
          出厂
          <br />
          单价
        </template>
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.unitPrice" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.unitPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总未税价" min-width="75" prop="preTaxPrice">
        <template #header>
          总未
          <br />
          税价
        </template>
      </el-table-column>
      <el-table-column label="总含税价" min-width="75" prop="taxIncludedPrice">
        <template #header>
          总含
          <br />
          税价
        </template>
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.taxIncludedPrice" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.taxIncludedPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币" prop="currency" width="105px">
        <template #default="{ row }">
          <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%" @change="handleCurrencyChange(row)">
            <el-option v-for="dict in currencyNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="起订量" min-width="80" prop="minimumOrderQuantity">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.minimumOrderQuantity" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.minimumOrderQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="整箱数" min-width="80" prop="numberFullCartons">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.numberFullCartons" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.numberFullCartons }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')" />
      <el-table-column label="开票" prop="oem" width="130">
        <template #default="{ row }">
          <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%" @change="handleInvoicingChange(row)">
            <el-option v-for="dict in getFilteredInvoicingOptions(row)" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="实际税点" min-width="60" prop="actualTaxRate">
        <template #header>
          实际
          <br />
          税点
        </template>
      </el-table-column>

      <el-table-column label="开票税点" min-width="60" prop="invoicingTaxRate">
        <template #header>
          开票
          <br />
          税点
        </template>
      </el-table-column>

      <el-table-column label="默认采购方" min-width="160" prop="purchaseId">
        <template #default="{ row }">
          <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%" @change="handlePurchaseChange(row)">
            <el-option v-for="item in purchaseOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="采购链接" min-width="140" prop="purchaseLink">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.purchaseLink" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.purchaseLink }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="零件采购注意事项" min-width="200" prop="purchaseMatters">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="合同条款" min-width="200" prop="contractTerms">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ removeHtmlTags(row.contractTerms) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="添加日期" min-width="120" prop="createTime">
        <template #default="{ row }">
          <span>{{ row.createTime ? row.createTime.split(' ')[0] : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加人员" min-width="100" prop="createUserName" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <!-- 创建零件 -->
    <vab-dialog v-model="addSupplierVisible" :before-close="handlerCloseDialog" title="新增供应商" width="450">
      <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="rules" style="margin-left: 0; margin-right: 0">
        <el-form-item label="零件单位" prop="unit">
          <el-input v-model="form.unit" clearable placeholder="套, 个, 只, 片等" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="suppliser">
          <div class="supplier-select-container">
            <el-select
              v-model="form.suppliser"
              allow-create
              clearable
              default-first-option
              filterable
              :loading="loading"
              placeholder="点击输入和搜索"
              remote
              :remote-method="remoteMethod"
              @change="handleTaxDisabled"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button
              v-if="form.suppliser"
              circle
              class="copy-btn"
              :icon="CopyDocument"
              size="small"
              type="primary"
              @click="handleClip(form.suppliser)"
            />
          </div>
        </el-form-item>
        <el-form-item label="开票" prop="invoicing">
          <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%" @change="handleInvoicingTaxChange">
            <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="实际税点" prop="actualTaxRate">
          <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13" />
        </el-form-item>
        <el-form-item label="开票税点" prop="invoicingTaxRate">
          <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="addSupplierVisible = false">退出</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </vab-dialog>
    <wang-editor
      :classify="classify"
      :content="attentionCopy"
      :progress-id="detailId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorAttentionVisible"
      @click-boolean="clickAttentionCancel"
      @click-child="clickAttentionConfirm"
    />
    <wang-editor
      :classify="classify"
      :content="contractCopy"
      :progress-id="detailId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorContractVisible"
      @click-boolean="clickContractCancel"
      @click-child="clickContractConfirm"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadSkuComponentImage" />
  </div>
</template>

<script lang="ts" setup>
import { CopyDocument, Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { currencyNumList } from '../newProductDevelopment/indexCommon'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import {
  createConsumablesSupplier,
  createProductComponentSuppliser,
  delComponentImage,
  getProductAllSupplier,
  getProductComponentPurchase,
  getProductListSuppliser,
  getProductSupplier,
  saveProductContractTerms,
  saveProductPurchaseMatters,
  updateProductComponentSuppliser,
  uploadComponentImage,
} from '/@/api/devlocal/productInformation'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleClip } from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { handleActivePath } from '/@/utils/routes'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuSupplier',
})
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const listLoading = ref<boolean>(true)
const list = ref<any>([])
const invoicingNumList = [
  {
    value: 0,
    label: '专票',
  },
  {
    value: 1,
    label: '普票',
  },
  {
    value: 2,
    label: '无法开票',
  },
]
const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
const taxDisabled = ref<boolean>(false)
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
      suppliserName: query,
    })
    supplierList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = supplierList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}
const handleTaxDisabled = async (value: string) => {
  if (value) {
    const { data } = await getProductSupplier({ suppliserName: value })

    if (data === null) {
      taxDisabled.value = false
    } else {
      const { actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate } = data
      taxDisabled.value = true
      if (form.invoicing === 0) {
        form.actualTaxRate = actualZTaxRate
        form.invoicingTaxRate = invoicingZTaxRate
      } else if (form.invoicing === 1) {
        form.actualTaxRate = actualPTaxRate
        form.invoicingTaxRate = invoicingPTaxRate
      } else {
        form.actualTaxRate = 0
        form.invoicingTaxRate = 0
      }
    }
  }
}
const handleInvoicingTaxChange = async () => {
  if (form.suppliser) {
    handleTaxDisabled(form.suppliser)
  }
}
const addSupplierVisible = ref<boolean>(false)
const handlerCloseDialog = () => {
  addSupplierVisible.value = false
}
const formRef = ref<FormInstance>()
const form = reactive<any>({
  unit: '',
  suppliser: '',
  invoicing: 0,
  actualTaxRate: '',
  invoicingTaxRate: '',
})
const rules = reactive({
  unit: [{ required: true, message: '请填写零件单位', trigger: 'blur' }],
  suppliser: [{ required: true, message: '请填写供应商名称', trigger: 'blur' }],
  invoicing: [{ required: true, message: '请选择开票类型', trigger: 'change' }],
  actualTaxRate: [{ required: true, message: '请填写实际税点', trigger: 'blur' }],
  invoicingTaxRate: [{ required: true, message: '请填写开票税点', trigger: 'blur' }],
})
const handleSubmit = async () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      // addSupplierVisible.value = false
      const newComponent = {
        unit: form.unit,
        suppliser: form.suppliser,
        invoicing: form.invoicing,
        actualTaxRate: form.actualTaxRate,
        invoicingTaxRate: form.invoicingTaxRate,
      }
      try {
        if (route.query.from === 'sku') {
          const { data } = await createProductComponentSuppliser({
            skuId: parseInt(route.query.skuId),
            existingPartsListId: parseInt(route.query.componentId),
            unit: form.unit,
            suppliser: form.suppliser,
            invoicing: form.invoicing,
            actualTaxRate: form.actualTaxRate,
            invoicingTaxRate: form.invoicingTaxRate,
          })
          if (data) {
            list.value.push(newComponent)
            fetchData()
            addSupplierVisible.value = false
            $baseMessage('新增供应商提交成功', 'success', 'hey')
          }
        } else if (route.query.from === 'consumable') {
          const { data } = await createConsumablesSupplier({
            skuId: parseInt(route.query.skuId),
            existingPartsListId: parseInt(route.query.componentId),
            unit: form.unit,
            suppliser: form.suppliser,
            invoicing: form.invoicing,
            actualTaxRate: form.actualTaxRate,
            invoicingTaxRate: form.invoicingTaxRate,
          })
          if (data) {
            list.value.push(newComponent)
            fetchData()
            addSupplierVisible.value = false
            $baseMessage('新增供应商提交成功', 'success', 'hey')
          }
        } else if (route.query.from === 'allReadyComponents') {
          const { data } = await createProductComponentSuppliser({
            skuId: parseInt(route.query.skuId),
            existingPartsListId: parseInt(route.query.componentId),
            unit: form.unit,
            suppliser: form.suppliser,
            invoicing: form.invoicing,
            actualTaxRate: form.actualTaxRate,
            invoicingTaxRate: form.invoicingTaxRate,
          })
          if (data) {
            list.value.push(newComponent)
            fetchData()
            addSupplierVisible.value = false
            $baseMessage('新增供应商提交成功', 'success', 'hey')
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}
const handleAddSupplier = async () => {
  addSupplierVisible.value = true
  formRef.value?.resetFields()
}
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const imageUploadVisible = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyRow = row
}
async function uploadSkuComponentImage(file: File) {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('id', copyRow.id)

    const { data } = await uploadComponentImage(uploadImgForm)
    if (data) {
      copyRow.componentImage = data
      $baseMessage('图片上传成功', 'success', 'hey')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败', 'error', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
const handleComponentRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await delComponentImage({
        id: row.id,
      })
      if (data == true) {
        row.componentImage = ''
        $baseMessage('图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handlePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
let copyRow: any
const detailId = ref<number>(-1)
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    // const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId })
    attentionCopy.value = row.purchaseMatters
    // row.purchaseMatters = data
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    detailId.value = row.id
    wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms') {
    clickRow.value = row
    // const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId })
    contractCopy.value = row.contractTerms
    detailId.value = row.id
    // row.contractTerms = data
    wangEditorTitle.value = '合同条款'
    classify.value = 'contractTerms'
    wangEditorContractVisible.value = !wangEditorContractVisible.value
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
// 零件table blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

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
    // 执行失去焦点处理逻辑
    try {
      await updateProductComponentSuppliser({
        id: value.id,
        skuId: parseInt(route.query.skuId),
        componentId: parseInt(route.query.componentId),
        defaultSuppliserId: value.suppliserId,
        unitPrice: value.unitPrice,
        taxIncludedPrice: value.taxIncludedPrice,
        currency: value.currency,
        minimumOrderQuantity: value.minimumOrderQuantity,
        numberFullCartons: value.numberFullCartons,
        invoicing: value.invoicing,
        purchaseId: value.purchaseId,
        purchaseLink: value.purchaseLink,
        purchaseMatters: value.purchaseMatters,
        contractTerms: value.contractTerms,
      })
      await fetchData()
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
// 根据采购方过滤开票选项
const getFilteredInvoicingOptions = (row: any) => {
  if (!purchaseOption.value || !row.purchaseId) {
    return invoicingNumList
  }
  const purchaseItem = purchaseOption.value.find((item: any) => item.id === row.purchaseId)
  if (!purchaseItem) {
    return invoicingNumList
  }
  const purchaseLabel = purchaseItem.label
  // 只允许5种组合：
  // 1. 云舟+专票 (invoicing = 0)
  // 2. 云舟+普票 (invoicing = 1)
  // 3. 埃托姆+专票 (invoicing = 0)
  // 4. 埃托姆+普票 (invoicing = 1)
  // 5. attom+不开票 (invoicing = 2)
  if (purchaseLabel === '云舟' || purchaseLabel === '埃托姆') {
    // 云舟和埃托姆只能选择专票或普票
    return invoicingNumList.filter((item) => item.value === 0 || item.value === 1)
  } else if (purchaseLabel === 'Attom' || purchaseLabel === 'attom') {
    // attom只能选择不开票
    return invoicingNumList.filter((item) => item.value === 2)
  }
  return invoicingNumList
}

// 处理开票类型变更
const handleInvoicingChange = async (row: any) => {
  await handleCurrencyChange(row)
}

// 处理采购方变更
const handlePurchaseChange = async (row: any) => {
  const purchaseItem = purchaseOption.value?.find((item: any) => item.id === row.purchaseId)
  if (purchaseItem) {
    const purchaseLabel = purchaseItem.label
    // 验证并自动调整开票类型
    if (purchaseLabel === '云舟' || purchaseLabel === '埃托姆') {
      // 云舟和埃托姆只能选择专票或普票
      if (row.invoicing === 2) {
        $baseMessage('采购方为云舟或埃托姆，不能选择无法开票，已自动调整为普票', 'warning', 'hey')
        row.invoicing = 1
        await handleCurrencyChange(row)
        return
      }
    } else if (purchaseLabel === 'Attom') {
      // attom只能选择无法开票
      if (row.invoicing === 0 || row.invoicing === 1) {
        $baseMessage('采购方为Attom，只能选择无法开票', 'warning', 'hey')
        row.invoicing = 2
        await handleCurrencyChange(row)
        return
      }
    }
  }
  await handleCurrencyChange(row)
}

const handleCurrencyChange = async (row: any) => {
  await updateProductComponentSuppliser({
    ...row,
    defaultSuppliserId: row.suppliserId,
    skuId: parseInt(route.query.skuId),
    componentId: parseInt(route.query.componentId),
  })
  fetchData()
}

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
// 点击零件采购注意事项弹出富文本框是否显示
const wangEditorAttentionVisible = ref<boolean>(false)
// 点击合同条款弹出富文本框是否显示
const wangEditorContractVisible = ref<boolean>(false)
const attentionCopy = ref<string>('')
const contractCopy = ref<string>('')
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickAttentionConfirm = async (val: any) => {
  const { data } = await saveProductPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val })
  if (data === true) {
    attentionCopy.value = val
    clickRow.value.purchaseMatters = val
  }
}
const clickContractConfirm = async (val: any) => {
  const { data } = await saveProductContractTerms({ id: clickRow.value.id, contractTerms: val })
  if (data === true) {
    contractCopy.value = val
    clickRow.value.contractTerms = val
  }
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickAttentionCancel = (val: any) => {
  wangEditorAttentionVisible.value = val
}
const clickContractCancel = (val: any) => {
  wangEditorContractVisible.value = val
}

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
const formattedPrice = (price: string) => {
  return parseFloat(price).toFixed(2)
}
const purchaseOption = ref<any>()
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductListSuppliser({
    componentId: route.query.componentId,
  })
  list.value = data
  list.value.forEach((item: any) => {
    item.unitPrice = formattedPrice(item.unitPrice)
  })
  listLoading.value = false
}
const fetchPurchaseAndRepository = async () => {
  const { data: purchase } = await getProductComponentPurchase()
  purchaseOption.value = purchase
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  switch (index) {
    case 1:
    case 3:
    case 10:
    case 11:
    case 16:
    case 17: {
      return {
        color: '#999',
        cursor: 'not-allowed',
        textAlign: 'center',
      }
    }
    case 8: {
      return {
        color: '#999',
        cursor: 'not-allowed',
        textAlign: 'left',
      }
    }
    case 13:
    case 14:
    case 15: {
      return {
        cursor: 'pointer',
        textAlign: 'left',
      }
    }
    // No default
  }
  return {
    textAlign: 'center',
  }
}
onBeforeMount(() => {
  fetchData()
  fetchPurchaseAndRepository()
})
</script>

<style lang="scss" scoped>
// 供应商选择框容器样式
.supplier-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .el-select {
    flex: 1;
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

.none {
  display: none;
}
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.overflow-text {
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
// 图片样式
.image-cell {
  width: 100%;
  height: 75px;

  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45); // 悬停时的背景色
      opacity: 1; // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>
