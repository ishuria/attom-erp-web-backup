<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleAddConsumable">创建耗材</el-button>
        <el-button type="primary" @click="handleConsumableType">耗材种类</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      ref="tableRef" 
      border
      :cell-class-name="clearPadding" :cell-style="cellStyle" 
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
                <el-icon @click="handlePictureCardPreview(row.componentImage)"><zoom-in /></el-icon>
                <el-icon @click="handleRemove(row)"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog(row)">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="零件ID" min-width="70" prop="existingPartsListId" width="100" />
      <el-table-column label="耗材名" prop="componentName" :width="flexColumnWidth(list, '耗材名', 'componentName')">
        <template #default="{ row }">
          <div v-html="row.componentName"></div>
        </template>
      </el-table-column>
      <el-table-column label="按单采购" min-width="90" prop="status">
        <template #default = "{ row }">
          <el-checkbox v-model="row.status" class="custom-checkbox" :false-value="0" :true-value="1"  @change="handleConsumablesUpdate(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="单位"  min-width="70" prop="unit">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.unit" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出厂单价" min-width="70" prop="unitPrice" >
        <template #header>
          出厂<br>单价
        </template>
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.unitPrice" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未税价" min-width="80" prop="preTaxPrice" />
       
      <el-table-column label="含税价" min-width="80" prop="taxIncludedPrice">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.taxIncludedPrice" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.taxIncludedPrice }}</span>
        </template>
      </el-table-column>    
      <el-table-column label="货币" prop="currency" width="110px">
        <template #default="{ row }">
          <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
            <el-option v-for="dict in currencyNumList" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="起订量" min-width="100" prop="minimumOrderQuantity">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.minimumOrderQuantity" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.minimumOrderQuantity }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="整箱数" min-width="100" prop="numberFullCartons">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.numberFullCartons" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.numberFullCartons }}</span>
        </template>
      </el-table-column> 
      <el-table-column align="center" label="默认供应商" min-width="200" prop="suppliserId">
        <template #default="{row}">
          <el-select v-model="row.suppliserId" placeholder="请选择默认供应商" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
            <el-option 
              v-for="item in row.suppliserList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="开票" prop="oem" width="130">
        <template #default = "{ row }">
          <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
            <el-option v-for="dict in invoicingNumList" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column  label="实际税点" min-width="60" prop="actualTaxRate">
        <template #header>
          实际<br>税点
        </template>
      </el-table-column>
      <el-table-column  label="开票税点" min-width="60" prop="invoicingTaxRate">
        <template #header>
          开票<br>税点
        </template>
      </el-table-column>

      <el-table-column align="center" label="默认采购方" min-width="160" prop="purchaseId">
        <template #default="{row}">
          <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
            <el-option 
              v-for="item in purchaseOption"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column  label="采购链接" min-width="140" prop="purchaseLink" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.purchaseLink" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.purchaseLink }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.purchaseLink }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="零件采购注意事项" min-width="200" prop="purchaseMatters">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.purchaseMatters) }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="合同条款" min-width="200" prop="contractTerms">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.contractTerms) }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="handleSupplier(row)">
              供应商
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleSupplier(row)">
                  <el-link type="primary" :underline="false">供应商</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleAddOtherSku(row)">
                  <el-link type="primary" :underline="false" >添加到SKU</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
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
    <vab-dialog 
      v-model="consumableVisible" 
      :before-close="handlerCloseDialog" 
      class="moldDialog"
      title="耗材种类"
      width="33%"
    >
      <el-divider style="margin-top: 0; margin-bottom: 20px"/>
      <div id="table-height-container">
        <el-row :gutter="20" style="display: flex; margin-bottom: 20px;">
          <el-col style="flex: 6">
            <el-input v-model="consumableTypeForm.consumableType" clearable placeholder="请输入新增耗材种类" @keyup.enter="handleAddConsumableType" />      
          </el-col>
          <el-col style="flex: 0.5">
            <el-button type="primary" @click="handleAddConsumableType">新增</el-button>
          </el-col>          
        </el-row>
      
        <el-table 
          ref="tableRef" 
          border :data="consumableTypeData"   
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
        >
          <el-table-column label="耗材种类" prop="consumablesName"/>
          <el-table-column align="center" fixed="right" label="操作" width="120">
            <template #default="{ row, $index }">
              <el-link type="danger" :underline="false" @click="handleDelConsumableType(row, $index)">删除</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
      </div>
      <template #footer></template>
    </vab-dialog>
    <!-- 创建耗材 -->
    <vab-create-consumable v-model="addConsumableVisible" :consumable-types="consumableTypeOption" @submit="handleConsumableSubmit" />
    <!-- 添加到其它SKU -->
    <vab-dialog 
      v-model="addOtherSkuVisible" 
      :before-close="handlerOtherSkuCloseDialog" 
      class="moldDialog"
      title="零件复制到其他SKU"
      width="1525"
    >
      <el-divider style="margin-top: 0;"/>
      <div class="transfer-container">
        <el-transfer 
          v-model="transferValue" 
          :data="transferData" 
          filterable 
          :titles="['源列', '目的列']"
        />
      </div>
      <template #footer>
        <span>
          <el-button @click="addOtherSkuVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitOtherSku">确认</el-button>
        </span>
      </template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import wangEditor from '../../newProductDevelopment/newProductProgress/wangEditor.vue'
import { addConsumablesOtherSku, addConsumablesType, createConsumables, delComponentImage, delConsumablesType, getProductComponentPurchase, getProductConsumables, getProductConsumablesType, getProductSkuList, saveProductContractTerms, saveProductPurchaseMatters, updateConsumablesSupplier, uploadComponentImage } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
defineOptions({
  name: 'Consumable',
})

const router = useRouter()
const route = useRoute()
const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
    addOtherSkuVisible.value = false
}
const consumableTypeForm = reactive({
    consumableType: ''
})
const handleAddConsumableType = async () => {
  const { data } = await addConsumablesType({
    consumablesType: consumableTypeForm.consumableType
  })
  if(data) {
    consumableTypeData.value.push({ consumablesName: consumableTypeForm.consumableType, id: data})
    await getProductConsumablesType()
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  switch (index) {
    case 1: 
    case 6: 
    case 13: 
    case 14: {        
      return {
        color: '#999',
        cursor: 'not-allowed',
        textAlign:'center'
      } 
    }
    case 2: {
      return {
        color: '#999',
        cursor: 'not-allowed',
        textAlign:'left'
      }
    }
    case 17: 
    case 18: {
      return {
        textAlign: 'left',
        cursor: 'pointer'
      }
    }
    // No default
  }
  return {
    textAlign: 'center'
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
interface Option2 {
  key: number
  label: string
  initial: number
}

let states = ref<string[]>([])
let initials = ref<number[]>([])
const transferData = ref<Option2[]>([]) // 初始化为空数组
const transferValue = ref([])
// 生成数据
const generateData2 = () => {
  const data: Option2[] = []
  states.value.forEach((sku, index) => {
    data.push({
      label: sku,
      key: initials.value[index],
      initial: initials.value[index],
    })
  })
  return data
}
let _compoenntId = ref<number>()
// 添加其他 SKU 的逻辑
const handleAddOtherSku = async (row: any) => {
  // console.log(row);
  
  states.value = []
  initials.value = []
  transferData.value = []
  transferValue.value = []
  const { data } = await getProductSkuList({existingPartsListId: row.existingPartsListId})
  data.forEach((item: any) => {
    states.value.push(item.sku)
    initials.value.push(item.skuId)
  })
  transferData.value = generateData2()
  _compoenntId.value = row.existingPartsListId
  
  addOtherSkuVisible.value = true
}
const handleSubmitOtherSku = async () => {
    addOtherSkuVisible.value = false
    $baseConfirm('添加后不可逆，无法批量删除，是否继续？', '系统提示', async () => {
        const { data } = await addConsumablesOtherSku({
            skuIds: `${transferValue.value}`,
            componentId: _compoenntId.value!
        })
        if(data === true) {
            $baseMessage('添加到其他SKU成功', 'success', 'hey')
        }
    });
}

const listLoading = ref<boolean>(true)
const addConsumableVisible = ref<boolean>(false)
const consumableTypeOption = ref<{ consumablesName: string, id: number }[]>([])
const handleAddConsumable = async () => {
  addConsumableVisible.value = true
  const { data } = await getProductConsumablesType() //获取耗材种类
  consumableTypeOption.value = data  
}
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

const handleConsumableSubmit = async (formData: any) => {
  try {
    const { data } = await createConsumables(formData)
    if (data) {
      // list.value.push(formData)
      fetchData()
      addConsumableVisible.value = false
      $baseMessage('创建耗材提交成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}

interface consumableType {
  consumablesName: string
  id: number
}
const consumableTypeData = ref<consumableType[]>([])
const currencyNumList = [
  {
    value: 0,
    label: 'RMB',
  },
  {
    value: 1,
    label: 'USD',
  },
  {
    value: 2,
    label: 'EUR',
  },
]

const list = ref<any>([])
const consumableVisible = ref<boolean>(false)
const handlerCloseDialog = () => {
  consumableVisible.value = false
}
const handleConsumableType = async () => {
  consumableVisible.value = true
  const { data } = await getProductConsumablesType() //获取耗材种类
  consumableTypeForm.consumableType = ''
  consumableTypeData.value = data
}
const handleDelConsumableType = async (row: any, index: number) => {
  $baseConfirm('确定要删除耗材种类吗', '系统提示', async () => {
    const { data } = await delConsumablesType({
      id: row.id
    })
    if (data === true) {
      consumableTypeData.value.splice(index, 1)
      $baseMessage('删除耗材种类成功', 'success', 'hey')
    }
  })
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
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const total = ref<number>(0)

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value,
    }
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
     ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
    }
  })
  fetchData()
}
const handleSupplier = (row: any) => {
  router.push({
    path: '/productInfomation/skuSupplier',
    query: {
      title: "SKU供应商",
      componentId: row.existingPartsListId,
      componentName: row.componentName,
      from: "consumable",
    },
  })
}
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

const handleConsumablesUpdate = async (row: any) => {
  await updateConsumablesSupplier({
    id: row.id,
    componentId:row.existingPartsListId,
    componentUnit:row.unit,
    defaultSuppliserId: row.suppliserId,
    unitPrice: row.unitPrice,
    taxIncludedPrice: row.taxIncludedPrice,
    currency: row.currency,
    minimumOrderQuantity: row.minimumOrderQuantity,
    numberFullCartons: row.numberFullCartons,
    invoicing: row.invoicing,
    purchaseId: row.purchaseId,
    purchaseLink: row.purchaseLink,
    purchaseMatters: row.purchaseMatters,
    contractTerms: row.contractTerms,
    status:row.status
  })
  fetchData()
}
const imageUploadVisible = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyRow = row
}
/**
* 上传图片
*/
async function uploadImage(file: File) {
  try {
    const uploadForm = new FormData(); // 每次上传前重置 FormData
    uploadForm.append('file', file);
    uploadForm.append('id', copyRow.id);

    const { data } = await uploadComponentImage(uploadForm)
    if (data) {
      copyRow.componentImage = data
      imageUploadVisible.value = false
      $baseMessage('图片上传成功', 'success', 'hey')
    } else {
      $baseMessage('图片上传失败', 'error', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
/**
* 图片预览事件
*/
const handlePictureCardPreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
/**
* 图片删除功能
*/
const handleRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await delComponentImage({
        id: row.id
      })
      if (data == true) {
        row.componentImage = ''
        $baseMessage("图片删除成功!","success","hey")
      }
    })
    
  } catch (error) {
    console.error(error)
  }
}

/**
* 当点击时切换输入框，修改输入
*/
let copyRow: any
const clickRow = ref<any>()
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

// table blur事件
const clickCancel = async (event:any,value:any) =>{
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
    try {
      await handleConsumablesUpdate(value)
    } catch {
      Object.assign(value, copyRow)
    }
  }
}

const purchaseOption = ref<any>()
const queryData = async () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize,
    }
  })
  fetchData()
}
const formattedPrice = (price: string) => {
  return parseFloat(price).toFixed(2)
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductConsumables(queryForm)
  list.value = data.list
  total.value = data.total
  list.value.forEach((item: any) => {
    item.unitPrice = formattedPrice(item.unitPrice)
  })
  listLoading.value = false
}

const fetchPurchase = async () => { //获取默认采购方
    const { data: purchase } = await getProductComponentPurchase()
    purchaseOption.value = purchase
}
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  fetchPurchase()
  fetchData()
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}

.transfer-container {
  display: flex;
  align-items: center; /* 垂直居中，如果需要 */
  justify-content: center; /* 水平居中 */
  :deep() {
    .el-transfer-panel {
      width: 660px;
      &__body {
        height: 500px;
      }
    }
  }
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
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
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
      background: rgba(0, 0, 0, 0.45);  // 悬停时的背景色
      opacity: 1;  // 悬停时完全显示
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
