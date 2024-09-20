<template>
  <div class="container">
      <div class="table-container">
          <vab-query-form>
              <vab-query-form-top-panel>
                <h2>采购计划</h2>
              </vab-query-form-top-panel>
              <vab-query-form-left-panel>
                  <el-button type="primary">批量删除</el-button>
                  <el-button type="primary">创建</el-button>
              </vab-query-form-left-panel>
          </vab-query-form>
          <el-table 
              ref="tableRef" 
              stripe border 
              :data="componentList" 
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              height="400"
          >

              <el-table-column align="center" label="零件图片" class="image-wall" min-width="100">
                  <template #default="{ row, $index }">
                    
                  </template>
              </el-table-column>
              <el-table-column label="零件ID" align="center" min-width="70" prop="reviewComponentId" width="100">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.reviewComponentId" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.reviewComponentId }}</span>
                  </template>
              </el-table-column>   
              <el-table-column label="零件名" prop="componentName" width="120">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="textarea" autofocus v-model="row.componentName" :autosize="{ minRows: 2, maxRows: 7 }"
                          @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.componentName }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="每个SKU需要数量"  width="100" prop="quantity" align="center">
                  <template #header>
                      每个SKU<br>需要数量
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.quantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.quantity }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="单位"  min-width="70" prop="componentUnit" align="center">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.componentUnit" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.componentUnit }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="出厂单价" prop="unitPrice" min-width="70" align="center">
                  <template #header>
                      出厂<br>单价
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.unitPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.unitPrice }}</span>
                  </template>
              </el-table-column>

              <el-table-column label="出厂总价" prop="totalPrice" min-width="70" align="center">
                  <template #header>
                      出厂<br>总价
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.totalPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row,)" />
                      </div>
                      <span>{{ row.totalPrice }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="每个SKU运费(含税)" prop="freight" align="center" min-width="100">
                  <template #header>
                      每个SKU<br>运费(含税)
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.freight" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.freight }}</span>
                  </template>
              </el-table-column>    
              <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="70">
                  <template #header>
                      总未<br>税价
                  </template>
                  <template #default="{ row }">
                      <span>{{ row.preTaxPrice }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" min-width="70">
                  <template #header>
                      总含<br>税价
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.taxIncludedPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.taxIncludedPrice }}</span>
                  </template>
              </el-table-column>    
              <el-table-column label="货币" width="110px" prop="currency">
               
              </el-table-column>
              <el-table-column label="起订量" prop="minimumOrderQuantity" align="center" min-width="100">
                  <template #default="{ row }">
                      <div class="none">
                              <el-input type="text" v-model="row.minimumOrderQuantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                          </div>
                      <span>{{ row.minimumOrderQuantity }}</span>
                  </template>
              </el-table-column> 
              <el-table-column label="整箱数" prop="numberFullCartons" align="center" min-width="100">
                  <template #default="{ row }">
                      <div class="none">
                              <el-input type="text" v-model="row.numberFullCartons" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                          </div>
                      <span>{{ row.numberFullCartons }}</span>
                  </template>
              </el-table-column> 
              <el-table-column align="center" label="供应商" min-width="140" prop="supplier">
                  <template #default="{row}">
                      <div class="none">
                          <el-input type="text" autofocus v-model="row.supplier" 
                          @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>
                          <el-text truncated>
                              {{ row.supplier }}
                          </el-text>
                      </span>
                  </template>
              </el-table-column>
              <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
                  <template #header>
                      实际<br>税点
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.actualTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.actualTaxRate }}</span>
                  </template>
              </el-table-column>

              <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
                  <template #header>
                      开票<br>税点
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.invoicingTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.invoicingTaxRate }}</span>
                  </template>
              </el-table-column>

              
              <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.purchaseLink" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>
                          <el-text truncated>
                              {{ row.purchaseLink }}
                          </el-text>
                      </span>
                  </template>
              </el-table-column>
              <el-table-column  label="收货仓库" prop="remarks" min-width="100">
                  <el-select 
                      v-model="list.componentInfo!" 
                      value-key="id"
                      placeholder="请选择收货仓库"
                      filterable
                      clearable
                      allow-create
                      :reserve-keyword = "false"
                      
                  >
                      <el-option v-for="val,idx in list" :label="val.label!" :value="val" :key="val.id!"/>
                  </el-select>
              </el-table-column>
              <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.purchaseMatters"  />
                      </div>
                      <span>{{ removeHtmlTags(row.purchaseMatters) }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.contractTerms"  />
                      </div>
                      <span>{{ removeHtmlTags(row.contractTerms) }}</span>
                  </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" width="150">
                  <template #default="{ row }">
                     
                  </template>
              </el-table-column>
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
      </el-table>
 
      <!-- <wangEditor
          :title="wangEditorTitle"
          :wangEditorVisible="wangEditorAttentionVisible"
          :content="attentionCopy"
          @clickChild="clickAttentionConfirm"
          @clickBoolean="clickAttentionCancel"
          :classify="classify"
      >
      </wangEditor>
      <wangEditor
          :title="wangEditorTitle"
          :wangEditorVisible="wangEditorContractVisible"
          :content="contractCopy"
          @clickChild="clickContractConfirm"
          @clickBoolean="clickContractCancel"
          :classify="classify"
      >
      </wangEditor> -->

  </div>
  </div>

</template>

<script lang="ts" setup>
defineOptions({
  name: 'plannedPo',
})
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';


import { reviewStepNo3ComponentAdd, reviewStepNo3ComponentCopy, reviewStepNo3ComponentDel, reviewStepNo3ComponentImtDel, reviewStepNo3ComponentList, reviewStepNo3ComponentUpdate, reviewStepNo3ComponentUpload, reviewStepNo3ContractTerms, reviewStepNo3GetSelectVariantList, reviewStepNo3PurchaseMatters, reviewStepNo3SaveTh, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters, reviewStepNo3VariantList, reviewStepNo3VariantUpdate } from '/@/api/devlocal/orderProcess';
import { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList, IreviewStepNo3VariantListResp } from '/@/type/orderProcess/orderProcessType';
import { convertString } from '/@/utils/stringUtils';
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'


const props = defineProps<{ step1Data: number }>()

const emit = defineEmits<{ 
  (e: 'change-step', value: number): void
  (e: 'update:imagePreviewVisibale', value: boolean): void
  (e: 'update:priviewListValue', value: string): void
}>()
const cropRef = ref<any>(null)
const autoCropArea = ref<number>(0.5)
const aspectRatio = ref<number>(1 / 1)
const cropVisible = ref<boolean>(false)
const cropData = ref<any>('')
const imgUrl = ref<string>(`https://res.hc-cdn.com/tiny-vue-web-doc/3.10.5.20230903162611/static/images/mountain.png`)
const cropdata = (data: any) => {
cropData.value = data

$baseConfirm('裁剪完成，您是否要关闭弹窗？', null, () => {
  cropRef.value.closeCrop()
})
}
// const listLoading = ref<boolean>(true)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])
// 变体列表
const variantsList = ref<IreviewStepNo3VariantList[]>([])
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
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
/**
* 当点击确认时，子组件传递给父组件的新的val
*/
const clickAttentionConfirm = async (val: any) => {
  const { data } = await reviewStepNo3UpdatePurchaseMatters({ reviewComponentId: clickRow.value.reviewComponentId, purchaseMatters: val})
  if (data === true) {
      attentionCopy.value = val
      clickRow.value.purchaseMatters = val
  }
}
const clickContractConfirm = async (val: any) => {
  const { data } = await reviewStepNo3UpdateContractTerms({ reviewComponentId: clickRow.value.reviewComponentId, contractTerms: val})
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
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
const div = document.createElement('div');
div.innerHTML = html;
return div.textContent || div.innerText || '';
};




// // 新增逻辑
// const handleAddComponent = async () => {
//   const newComponent: IreviewStepNo3ComponentList = {
//       actualTaxRate: '',
//       componentImgUrl: '',
//       componentName: '',
//       componentUnit: '',
//       contractTerms: '',
//       currency: null,
//       freight: '',
//       invoicing: null,
//       invoicingTaxRate: '',
//       minimumOrderQuantity: null,
//       numberFullCartons: null,
//       orderEntryId: 0,
//       preTaxPrice: '',
//       purchaseLink: '',
//       purchaseMatters: '',
//       quantity: null,
//       reviewComponentId: null,
//       reviewId: null,
//       supplier: '',
//       taxIncludedPrice: '',
//       totalPrice: '',
//       unitPrice: '',
//       variant: '',
//   }
//   let classReviewId: number | undefined
//   if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
//       classReviewId = props.step1Data
//   } else {
//       classReviewId = route.query.reviewId
//   }
//   const { data } = await reviewStepNo3ComponentAdd({ reviewId: classReviewId!})
//   newComponent.reviewComponentId = data
//   componentList.value.push(newComponent)
//   fetchDataComponent()
//   fetchVariantsData()
// }
// 删除逻辑
// const handleComponentDel = (row: IreviewStepNo3ComponentList) => {
//   try {
//       $baseConfirm('确定要删除零件信息吗',"系统提示", async ()=>{

//           const {data} = await reviewStepNo3ComponentDel({ reviewComponentId: row.reviewComponentId! })
//               if (data === true){
//                   const index = componentList.value.findIndex((item: IreviewStepNo3ComponentList) => item.reviewComponentId === row.reviewComponentId);
//                   if (index !== -1) {
//                       componentList.value.splice(index, 1);
//                   }
//                   $baseMessage("零件信息删除成功！","success","hey")
//                   fetchDataComponent()
//                   fetchVariantsData()
//               }
//       })
     
//   } catch(e){
//       console.log(e as Error)
//  }
// }

/**
* 当点击时切换输入框，修改输入
*/
const clickRow = ref<any>()
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  
  // let el = getSpecificChildren(cell, "img")[0];
  // if (getDataAttribute(el,'img') && el){
  //   emit("update:priviewListValue", row.componentImg.url)
  //   emit("update:imagePreviewVisibale", true)
  // }
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
      return
  }

  if (column.property == 'purchaseMatters') {
      // 查询零件采购注意事项
      clickRow.value = row
      const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId })
      attentionCopy.value = data
      row.purchaseMatters = data
      wangEditorTitle.value = '零件采购注意事项'
      classify.value = 'purchaseMatters'
      wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
          clickRow.value = row
          const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId })
          contractCopy.value = data
          row.contractTerms = data
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

// 零件table blur事件
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
     
 
  }
}

// 当点击保存的时候
const handleSave = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
      classReviewId = props.step1Data
  } else {
      classReviewId = route.query.reviewId
  }
  const { data } = await reviewStepNo3SaveTh({ reviewId: classReviewId! })
  if (data === true) {
      $baseMessage("当前信息已保存。","success","hey")
  }
}
const router = useRouter()




</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}

.container {
width: 100%;
display: flex;
flex-direction: column;
box-sizing: border-box;
}

.table-container {
flex: 1;

}
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

</style>

