<template>
  <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>已有零件库</h2>
        </vab-query-form-top-panel>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                  @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
      </vab-query-form>
          <el-table 
              ref="tableRef" 
              stripe border 
              :data="list" 
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
           
              :cell-style="cellStyle"
              class="noneHoveTable"
          >
              <el-table-column align="center" label="图片" class="image-wall" width="100">
                  <template #default="{ row, $index }">
                      <el-upload 
                          list-type="picture-card" 
                          :file-list="row.imageList" 
                          :class="{ hide: row.hide }"
                          :http-request="(File) => uploadImage(File, row)"
                      >
                          <el-icon ><Plus /></el-icon>
                          <template #file="{ file }">
                              <div>
                                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                  <span class="el-upload-list__item-actions">
                                      <span
                                          class="el-upload-list__item-preview"
                                          @click="handlePictureCardPreview(file, row)"
                                      >
                                          <el-icon><zoom-in /></el-icon>
                                      </span>
                                      <span
                                          class="el-upload-list__item-delete"
                                          @click="handleRemove(file, row)"
                                      >
                                          <el-icon><Delete /></el-icon>
                                      </span>
                                  </span>
                              </div>
                          </template>
                      </el-upload>
                  </template>
              </el-table-column>
              <el-table-column label="零件ID" align="center" min-width="70" prop="existingPartsListId" width="100">
                  <template #default="{ row }">
                      <span >{{ row.existingPartsListId }}</span>
                  </template>
              </el-table-column>   
              <el-table-column label="零件名" prop="componentName" min-width="200">
                  <template #default="{ row }">
                      <span >{{ row.componentName }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="使用的SKU" prop="status" align="center" min-width="200">
                <template #default = "{ row }">
                    <el-checkbox v-model="row.status" :true-value="1" :false-value="0" class="custom-checkbox"  @change="handleConsumablesUpdate(row)"/>
                </template>
              </el-table-column>
      
       
              <el-table-column align="center" label="默认供应商" min-width="200" prop="suppliserId">

              </el-table-column>
              <el-table-column label="不报关">
                <template #default="{ row }">
                  <el-checkbox :true-value="1" :false-value="0"ange=""></el-checkbox>
                  
                </template>
              </el-table-column>

              
              <el-table-column align="center" fixed="right" label="操作" width="150">
                  <template #default="{ row }">
                    <el-button text type="primary" @click="handleSupplier(row)">供应商</el-button>
                    <el-button text type="primary" @click="handleAddOtherSku(row)">添加到SKU</el-button>
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


           <!-- 添加到其它SKU -->
           <el-dialog 
            v-model="addOtherSkuVisible" 
            :close-on-click-modal="false" 
            title="零件复制到其他SKU" 
            width="800"
            class="moldDialog"
            :before-close="handlerOtherSkuCloseDialog"
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
        </el-dialog>
        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
  </div>

</template>

<script lang="ts" setup>
defineOptions({
  name: 'consumable',
})
import { Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance, UploadFile } from 'element-plus'

import { addConsumablesOtherSku, delComponentImage, getProductAllSupplier, getProductSkuList, getProductSupplier, updateConsumablesSupplier, uploadComponentImage } from '/@/api/devlocal/productInformation'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'

const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
    addOtherSkuVisible.value = false
}
const consumableTypeForm = reactive({
    consumableType: ''
})

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
   if  (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 6 || data.columnIndex === 13 || data.columnIndex === 14){        
   
       return {
            color: '#bbb',
            cursor: 'not-allowed',
            textAlign:'center'
        } 
   }
}
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
    // console.log(data);
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
        
        if(data!==null) {
            const {actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate, suppliserId } = data
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
        } else {
            taxDisabled.value = false
        }
   }
}
const handleInvoicingTaxChange = async (value: number) => {
   
   if(form.supplier) {
       handleTaxDisabled(form.supplier)
   }
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

const router = useRouter()
const listLoading = ref<boolean>(true)
const addConsumableVisible = ref<boolean>(false)
const handlerAddCloseDialog = () => {
  addConsumableVisible.value = false
}
const formRef = ref<FormInstance>()
const form = reactive<any>({
    componentName: '',
    unit: '',
    suppliser: '',
    invoicing: 0,
    actualTaxRate: '',
    invoicingTaxRate: '',
    status: 0,
})
const handleAddConsumable = () => {
  addConsumableVisible.value = true
  formRef.value?.resetFields()
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

const route: any = useRoute()
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
  // fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSupplier = (row: any) => {
    router.push({
        path: '/productInfomation/skuSupplier',
        query: {
          title: "SKU供应商",
          componentId: row.existingPartsListId,
          componentName: row.componentName,
          from: "consumable",
          timestamp: Date.now(),
        },
    })
}

// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};


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
      // fetchData()
}

/**
* 上传图片
*/
async function uploadImage(params: any, row: any) {
    try {
        
        const uploadForm = new FormData(); // 每次上传前重置 FormData
        uploadForm.append('file', params.file);
        uploadForm.append('id', row.id);

        const { data } = await uploadComponentImage(uploadForm)
        row.hide = true
        if (data) {
          
          row.imageList = [{ url: data }]
          $baseMessage('图片上传成功', 'success', 'hey')
        }
    } catch (error) {
        console.error(error)
    }
}

// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
/**
* 图片预览事件
*/
const handlePictureCardPreview = (file: UploadFile, row: any) => {
  imagePreviewVisible.value = true
  imagePriviewList.value = []
  imagePriviewList.value.push(file.url!)
}
/**
* 图片删除功能
*/
const handleRemove = async (file: UploadFile, row: any) => {
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

/**
* 当点击时切换输入框，修改输入
*/
const clickRow = ref<any>()
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
      return
  }

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
  } else {
          cell.children[0].children[0].classList.remove('none')
          cell.children[0].children[1].classList.add('none')
  }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
      inputElement.select()
  } else {
      const textareaElement = getSpecificChildren(cell, "textarea")[0];
      if (textareaElement){
          textareaElement.focus()
          textareaElement.select()
      }
  }
}

// table blur事件
const clickCancle = async (event:any,value:any) =>{
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  
  if (event.type === 'blur') {
  
      // 执行失去焦点处理逻辑
      handleConsumablesUpdate(value)
  }
}

const purchaseOption = ref<any>()
const queryData = async () => {
  queryForm.pageNo = 1
  // fetchData()
  // if(queryForm.keyWord === '') {
  //   fetchData()
  // } else {
  //   listLoading.value = true
  //   let queryList: any = []
  //   queryList = list.value.filter((item: any) => item.componentName.includes(queryForm.keyWord, 0))
  //   list.value = queryList
  //   total.value = list.value.length
  //   listLoading.value = false
  // }
}
const formattedPrice = (price: string) => {
    return parseFloat(price).toFixed(2)
}
// const fetchData = async () => {
//     listLoading.value = true
//     const { data } = await getProductConsumables(queryForm)
//     list.value = data.list
//     total.value = data.total
//     list.value.forEach(async (item: any) => {
//       item.unitPrice = formattedPrice(item.unitPrice)
//         // 获取供应商列表
//       // if (!item.supplierList) {
//       //   const { data: suppliser } = await getProductComponentSuppliser({
//       //       componentId: item.existingPartsListId
//       //   })
//       //     item.suppliserList = suppliser
//       //     if(!item.componentImage) {
//       //         item.hide = false
//       //         item.imageList = []
//       //     } else if (item.componentImage){
//       //         item.hide = true
//       //         item.imageList = [{ url: item.componentImage }]
//       //     }
//       // }
   
      
//           if(!item.componentImage) {
//               item.hide = false
//               item.imageList = []
//           } else if (item.componentImage){
//               item.hide = true
//               item.imageList = [{ url: item.componentImage }]
//           }
        
//   })

//     listLoading.value = false
// }

// onBeforeMount(async ()=>{
//   fetchData()
// })
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
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
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}

.transfer-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中，如果需要 */
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>

