<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-page-header  style="margin-bottom: 0px;" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span> <strong> 供应商 | {{ route.query.componentName }} | 零件ID：{{ route.query.componentId }} </strong></span>
        </div>
      </template>
    </el-page-header>
    <vab-query-form>
      <vab-query-form-left-panel style="margin-top: 20px;">
        <el-button type="primary" @click="handleAddSupplier">新增供应商</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table 
      ref="tableRef" 
      v-loading="listLoading" border 
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ 'text-align': 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column align="center" class="image-wall" label="图片" min-width="100">
          <template #default="{ row }">
              <el-upload 
                  :class="{ hide: row.hide }" 
                  :file-list="row.imageList" 
                  :http-request="(file) => uploadSkuComponentImage(file, row)"
                  list-type="picture-card"
              >
                  <el-icon ><plus /></el-icon>
                  <template #file="{ file }">
                      <div>
                          <img alt="" class="el-upload-list__item-thumbnail" :src="file.url" />
                          <span class="el-upload-list__item-actions">
                              <span
                                  class="el-upload-list__item-preview"
                                  @click="handlePreview(file)"
                              >
                                  <el-icon><zoom-in /></el-icon>
                              </span>
                              <span
                                  class="el-upload-list__item-delete"
                                  @click="handleComponentRemove(file, row)"
                              >
                                  <el-icon><delete /></el-icon>
                              </span>
                          </span>
                      </div>
                  </template>
              </el-upload>
          </template>
      </el-table-column>
      <el-table-column align="center" label="单位" prop="componentUnit" width="60">
          <template #default="{ row }">
              <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="出厂单价" min-width="75" prop="unitPrice">
          <template #header>
              出厂<br>单价
          </template>
          <template #default="{ row }">
              <div class="none">
                  <el-input v-model="row.unitPrice" type="text" @blur="clickCancle($event, row)" @keyup.enter="clickCancle($event, row)" />
              </div>
              <span>{{ row.unitPrice }}</span>
          </template>
      </el-table-column>

      <el-table-column align="center" label="总未税价" min-width="75" prop="preTaxPrice">
          <template #header>
              总未<br>税价
          </template>
          <template #default="{ row }">
              <span style="color: rgb(192, 192, 192)">{{ row.preTaxPrice }}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="总含税价" min-width="75" prop="taxIncludedPrice">
          <template #header>
              总含<br>税价
          </template>
          <template #default="{ row }">
              <div class="none">
                  <el-input v-model="row.taxIncludedPrice" type="text" @blur="clickCancle($event, row)" @keyup.enter="clickCancle($event, row)" />
              </div>
              <span>{{ row.taxIncludedPrice }}</span>
          </template>
      </el-table-column>    
      <el-table-column label="货币" prop="currency" width="105px">
          <template #default="{ row }">
              <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                  <el-option
v-for="dict in currencyNumList" :key="dict.value"
                      :label="dict.label" :value="dict.value"/>
              </el-select>
          </template>
      </el-table-column>
      <el-table-column align="center" label="起订量" min-width="80" prop="minimumOrderQuantity">
          <template #default="{ row }">
              <div class="none">
                      <el-input v-model="row.minimumOrderQuantity" type="text" @blur="clickCancle($event, row)" @keyup.enter="clickCancle($event, row)" />
                  </div>
              <span>{{ row.minimumOrderQuantity }}</span>
          </template>
      </el-table-column> 
      <el-table-column align="center" label="整箱数" min-width="80" prop="numberFullCartons">
          <template #default="{ row }">
              <div class="none">
                      <el-input v-model="row.numberFullCartons" type="text" @blur="clickCancle($event, row)" @keyup.enter="clickCancle($event, row)" />
                  </div>
              <span>{{ row.numberFullCartons }}</span>
          </template>
      </el-table-column> 
      <el-table-column align="center" label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')">
          <template #default="{row}">
              <span style="color: rgb(192, 192, 192)">{{ row.suppliser }}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="开票" prop="oem" width="130">
          <template #default = "{ row }">
              <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                  <el-option
v-for="dict in invoicingNumList" :key="dict.value"
                      :label="dict.label" :value="dict.value"/>
              </el-select>
          </template>
      </el-table-column>
      <el-table-column  align="center" label="实际税点" min-width="60" prop="actualTaxRate">
          <template #header>
              实际<br>税点
          </template>
          <template #default="{ row }">
              <span style="color: rgb(192, 192, 192)">{{ row.actualTaxRate }}</span>
          </template>
      </el-table-column>

      <el-table-column  align="center" label="开票税点" min-width="60" prop="invoicingTaxRate">
          <template #header>
              开票<br>税点
          </template>
          <template #default="{ row }">
              <span style="color: rgb(192, 192, 192)">{{ row.invoicingTaxRate }}</span>
          </template>
      </el-table-column>

      <el-table-column align="center" label="默认采购方" min-width="160" prop="purchaseId">
          <template #default="{row}">
              <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                  <el-option 
                      v-for="item in purchaseOption"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                  />
              </el-select>
          </template>
      </el-table-column>
      <el-table-column  label="采购链接" min-width="140" prop="purchaseLink">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.purchaseLink" type="text" @blur="clickCancle($event, row)" @keyup.enter="clickCancle($event, row)" />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.purchaseLink }}</div>
            </template>
            <el-text truncated>{{ row.purchaseLink }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="零件采购注意事项" min-width="200" prop="purchaseMatters">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
            </template>
            <span>{{ removeHtmlTags(row.purchaseMatters) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="合同条款" min-width="200" prop="contractTerms">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
            </template>
            <span>{{ removeHtmlTags(row.contractTerms) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加日期" min-width="120" prop="createTime">
          <template #default = "{ row }">
              <span>{{ row.createTime ? row.createTime.split(' ')[0] : '' }}</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="添加人员" min-width="100" prop="createUserName">
          <template #default = "{ row }">
              <span>{{ row.createUserName }}</span>
          </template>
      </el-table-column>
      <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
      </template>
    </el-table>
    <!-- 创建零件 -->
    <vab-dialog 
      v-model="addSupplierVisible" 
      :before-close="handlerCloseDialog" 
      class="moldDialog"
      title="新增供应商"
      width="450"
    >
        <el-divider style="margin-top: 0;"/>
        <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" :rules="rules" style="max-width: 340px; margin: 0 auto;" >
            <el-form-item label="零件单位" prop="unit">
                <el-input v-model="form.unit" clearable placeholder="套, 个, 只, 片等" />
            </el-form-item>
            <el-form-item label="供应商名称" prop="suppliser">
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
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="开票" prop="invoicing">
                <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingTaxChange">
                    <el-option
v-for="dict in invoicingNumList" :key="dict.value"
                        :label="dict.label" :value="dict.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="实际税点" prop="actualTaxRate">
                <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13"/>
            </el-form-item>
            <el-form-item label="开票税点" prop="invoicingTaxRate">
                <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13"/>
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
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorAttentionVisible"
      @click-boolean="clickAttentionCancel"
      @click-child="clickAttentionConfirm"
    />
    <wang-editor
      :classify="classify"
      :content="contractCopy"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorContractVisible"
      @click-boolean="clickContractCancel"
      @click-child="clickContractConfirm"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePriviewList" @close="imagePreviewClose"/>
  </div>
 </template>
 
<script lang="ts" setup>
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance, UploadFile } from 'element-plus'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import { currencyNumList } from '../newProductDevelopment/indexCommon'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import { createConsumablesSupplier, createProductComponentSuppliser, delComponentImage, getProductAllSupplier, getProductComponentPurchase, getProductListSuppliser, getProductSupplier, saveProductContractTerms, saveProductPurchaseMatters, updateProductComponentSuppliser, uploadComponentImage } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { isEqual } from 'lodash'

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
        suppliserName: query
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
   if(value) {
        const { data } = await getProductSupplier({ suppliserName: value })
        
        if(data===null) {
            taxDisabled.value = false
        } else {
            const {actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate } = data
            taxDisabled.value = true
            if(form.invoicing === 0) {
                form.actualTaxRate = actualZTaxRate
                form.invoicingTaxRate = invoicingZTaxRate
            } else if(form.invoicing === 1) {
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
   
    if(form.suppliser) {
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
    unit: [
        { required: true, message: '请填写零件单位', trigger: 'blur' },
    ],
    suppliser: [
        { required: true, message: '请填写供应商名称', trigger: 'blur' },
    ],
    invoicing: [
        { required: true, message: '请选择开票类型', trigger: 'change' },
    ],
    actualTaxRate: [
        { required: true, message: '请填写实际税点', trigger: 'blur' },
    ],
    invoicingTaxRate: [
        { required: true, message: '请填写开票税点', trigger: 'blur' },
    ],
});
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
            } else if (route.query.from === 'consumable' ) {
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
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const uploadImgForm = ref(new FormData()) as any;
async function uploadSkuComponentImage(params: any, row: any) {
    row.hide = true
    try {
        uploadImgForm.value = new FormData(); // 每次上传前重置 FormData
        uploadImgForm.value.append('file', params.file);
        uploadImgForm.value.append('id', row.id);

        const { data } = await uploadComponentImage(uploadImgForm.value)
        
        row.imageList = [{ url: data }]
    } catch (error) {
        console.error(error)
    }
}
const handleComponentRemove = async (file: UploadFile, row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{

        const { data } = await delComponentImage({
            id: row.id
        })
        if (data == true) {
            row.imageList = []
            row.hide = false
            $baseMessage("图片删除成功!","success","hey")
        }
    })
    
  } catch (error) {
    console.error(error)
  }
}


const handlePreview = (file: any) => {
    imagePreviewVisible.value = true
    imagePriviewList.value = []
    imagePriviewList.value.push(file.url)
}

/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    // const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId })
    attentionCopy.value = row.purchaseMatters
    // row.purchaseMatters = data
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
    clickRow.value = row
    // const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId })
    contractCopy.value = row.contractTerms
    // row.contractTerms = data
    wangEditorTitle.value = '合同条款'
    classify.value = 'contractTerms'
    wangEditorContractVisible.value = !wangEditorContractVisible.value
  }
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
// 零件table blur事件
const clickCancle = async (event:any,value:any) =>{
  const rootElement = getRootElement(event.srcElement, ".cell");

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
      // 执行失去焦点处理逻辑
    await updateProductComponentSuppliser({
      id: value.id,
      skuId: parseInt(route.query.skuId),
      componentId:  parseInt(route.query.componentId),
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
      contractTerms: value.contractTerms
    })
    fetchData()
  }
}
const handleCurrencyChange = async (row: any) => {
    await updateProductComponentSuppliser({...row, defaultSuppliserId: row.suppliserId, skuId: parseInt(route.query.skuId), componentId: parseInt(route.query.componentId)})
    fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
     
     if  (data.columnIndex === 1 || data.columnIndex === 3 || data.columnIndex === 8 || data.columnIndex === 10 || data.columnIndex === 11 || data.columnIndex === 16 || data.columnIndex === 17){        
     
         return {
              color: '#bbb',
              cursor: 'not-allowed',
              textAlign:'center'
          } 
     }else {
         return {
             textAlign:'center'
         }
     }
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
    const { data } = await saveProductPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val})
    if (data === true) {
        attentionCopy.value = val
        clickRow.value.purchaseMatters = val
    }
}
const clickContractConfirm = async (val: any) => {
    const { data } = await saveProductContractTerms({ id: clickRow.value.id, contractTerms: val})
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
      componentId: route.query.componentId
  })
  list.value = data
  list.value.forEach((item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
      if(!item.componentImage) {
          item.hide = false
          item.imageList = []
      } else if(item.componentImage) {
          item.hide = true
          item.imageList = [{ url: item.componentImage}]
      }
  })
  listLoading.value = false
}
const fetchPurchaseAndRepository = async () => {
    const { data: purchase } = await getProductComponentPurchase()
    purchaseOption.value = purchase
}
onBeforeMount(() => {
  fetchData()
  fetchPurchaseAndRepository()
})
</script>

<style lang="scss" scoped>
.none {
    display: none;
}
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.overflow-text {
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
  display: block;
}
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  margin: 0 8px 0 0;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
.hide :deep(.el-upload--picture-card) {
  display: none
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
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>