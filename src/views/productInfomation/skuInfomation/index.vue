<template>
  <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>SKU信息</h2>
        </vab-query-form-top-panel>
          <vab-query-form-left-panel>
              <el-button type="primary" @click="handleHideStopProduction">{{ queryForm.haltStatus === 0 ? '隐藏停产' : '展示停产' }}</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" native-type="submit" type="primary"
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
              :cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              v-loading="listLoading"
          >
              <el-table-column label="图片" class="image-wall" min-width="100">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" :src="row.skuImgUrl" fit="fill" data-img="img" />
                </template>
              </el-table-column>
              <el-table-column label="SKU" min-width="70" prop="sku" width="100"></el-table-column>   
              <el-table-column label="FNSKUUPC" prop="fnSkuUpc" width="120">
                <template #header>
                  FNSKU<br>UPC
                </template>
              </el-table-column>
              <el-table-column label="产品经理" prop="productManager" min-width="90"></el-table-column>
              <el-table-column label="停产" prop="productionHaltStatus">
                <template #default="{ row }">
                  <el-switch v-model="row.productionHaltStatus" @change="handleUpdateStatus(row)" active-value="1"
                  inactive-value="0" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"/>
                </template>
              </el-table-column>
              <el-table-column label="优先打包" prop="priorityPacking" min-width="90">
                <template #default="{ row }">
                  <el-switch v-model="row.priorityPacking" @change="handleUpdateStatus(row)" active-value="1"
                  inactive-value="0" style="--el-switch-on-color: #13ce66;"/>
                </template>
              </el-table-column>
              <el-table-column label="打包拍照" prop="packagePhotograph" min-width="90">
                <template #default="{ row }">
                  <el-switch v-model="row.packagePhotograph" @change="handleUpdateStatus(row)" active-value="1"
                  inactive-value="0" style="--el-switch-on-color: #13ce66;"/>
                </template>
              </el-table-column>
              <el-table-column label="总实际成本" prop="procurementCost" min-width="80" >
                  <template #header>
                      总实际<br>成本
                  </template>
              </el-table-column>
              <el-table-column label="" prop="dilapidationCost" min-width="100" >
                  <template #header>
                      损耗成本<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="" prop="packingCost" min-width="100" >
                  <template #header>
                      打包成本<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="" prop="freightFeeCost" min-width="100" >
                  <template #header>
                      运费<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="货币" width="110px" prop="currency">
              </el-table-column>
              <el-table-column label="" prop="avgTime" min-width="100" >
                  <template #header>
                    平均交期<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="" prop="avgFluctuation" min-width="100" >
                  <template #header>
                    交期平均<br>波动
                  </template>
              </el-table-column>
              <el-table-column prop="length" label="长(cm)" min-width="90">
              </el-table-column>

              <el-table-column prop="width" label="宽(cm)" min-width="90">
              </el-table-column>

              <el-table-column prop="height" label="高(cm)" min-width="90">
              </el-table-column>

              <el-table-column prop="weight" label="重量(g)">
              </el-table-column>
              <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
              </el-table-column>
              <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
              </el-table-column>
              <el-table-column  label="开票/报关品名" prop="customsDeclaration" min-width="140" >
              </el-table-column>

              <el-table-column  label="开票型号" prop="invoiceIssuType" min-width="100" >
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                  <template #default="{ row }">
                    <el-dropdown>
                      <el-button text type="primary" @click="handleSkuDetail(row)">
                        SKU详情
                        <el-icon class="el-icon--right">
                          <arrow-down />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">打包工时</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">交期查看</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">证书</el-link>
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
      <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
  </div>

</template>

<script lang="ts" setup>
defineOptions({
  name: 'consumable',
})
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';

import { reviewStepNo3ComponentAdd, reviewStepNo3ComponentCopy, reviewStepNo3ComponentDel, reviewStepNo3ComponentImtDel, reviewStepNo3ComponentList, reviewStepNo3ComponentUpdate, reviewStepNo3ComponentUpload, reviewStepNo3ContractTerms, reviewStepNo3GetSelectVariantList, reviewStepNo3PurchaseMatters, reviewStepNo3SaveTh, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters, reviewStepNo3VariantList, reviewStepNo3VariantUpdate } from '/@/api/devlocal/orderProcess';
import { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList, IreviewStepNo3VariantListResp } from '/@/type/orderProcess/orderProcessType';

import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { getProductList, updateProductStatus } from '~/src/api/devlocal/productInformation';
import { IgetProductList } from '~/src/type/productInformation/skuInformationType';



const listLoading = ref<boolean>(true)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])
const hideStopProduction = ref<boolean>(true) //false 展示停产 true 隐藏停产
const list = ref<any>([])
const route: any = useRoute()
const router = useRouter()
const handleSkuDetail = (row: any) => {
  router.push({
    path: '/productInfomation/skuDetailView',
    query: {
      title: "SKU详情",
      skuId: row.skuId,
      timestamp: Date.now(),
    },
  })
}
const handleHideStopProduction = () => {
  if (queryForm.haltStatus === 0) {
    queryForm.haltStatus = 1
  } else {
    queryForm.haltStatus = 0
  }
  fetchData()
}
// const rowClassName = (data: { row: any, rowIndex: number }) => {
//   if (hideStopProduction.value === true) {
//     if (data.row.switch) {
//       return 'none'
//     }
//   }
 
// }
const handleUpdateStatus = async (row: IgetProductList) => {  
  await updateProductStatus({
    skuId: row.skuId,
    haltStatus: row.productionHaltStatus,
    photographStatus: row.packagePhotograph,
    priorityStatus: row.priorityPacking
  })
}
const queryForm = reactive<any>({
  keyWord: '',
  haltStatus: 1, // 0展示停产 1隐藏停产
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fakeData = [
  {
    reviewComponentId: "RC-001",
    componentName: "零件A",
    purchaseToOrder: '1',
    componentUnit: "个",
    unitPrice: 100.00,
    preTaxPrice: 90.00,
    taxIncludedPrice: 110.00,
    currency: "CNY",
    minimumOrderQuantity: 10,
    numberFullCartons: 5,
    supplier: "供应商A",
    actualTaxRate: 13,
    invoicingTaxRate: 13,
    purchaseLink: "http://example.com/purchase-a",
    purchaser: "仓库A",
    purchaseMatters: "注意事项A",
    contractTerms: "合同条款A",
    componentImgUrl: [],
  },
  {
    reviewComponentId: "RC-002",
    componentName: "零件B",
    purchaseToOrder: '0',
    componentUnit: "箱",
    unitPrice: 200.00,
    preTaxPrice: 180.00,
    taxIncludedPrice: 220.00,
    currency: "USD",
    minimumOrderQuantity: 5,
    numberFullCartons: 10,
    supplier: "供应商B",
    actualTaxRate: 15,
    invoicingTaxRate: 15,
    purchaseLink: "http://example.com/purchase-b",
    purchaser: "仓库B",
    purchaseMatters: "注意事项B",
    contractTerms: "合同条款B",
    componentImgUrl: [],
  },
  {
    reviewComponentId: "RC-003",
    componentName: "零件C",
    purchaseToOrder: '1',
    componentUnit: "件",
    unitPrice: 150.00,
    preTaxPrice: 135.00,
    taxIncludedPrice: 160.00,
    currency: "EUR",
    minimumOrderQuantity: 8,
    numberFullCartons: 4,
    supplier: "供应商C",
    actualTaxRate: 10,
    invoicingTaxRate: 10,
    purchaseLink: "http://example.com/purchase-c",
    purchaser: "仓库C",
    purchaseMatters: "注意事项C",
    contractTerms: "合同条款C",
    componentImgUrl: [],
  },
];

const handleCurrencyChange = async (row: any) => {
  await reviewStepNo3ComponentUpdate({
      ...row,
      currency: parseInt(row.currency),
  })
  // fetchDataComponent()
}
// const handleInvoicingChange = async (row: any) => {
//   await reviewStepNo3ComponentUpdate({
//       ...row,
//       invoicing: parseInt(row.invoicing),
//   })
//   fetchDataComponent()
// }



// 新增逻辑
const handleAddComponent = async () => {
  // const newComponent: IreviewStepNo3ComponentList = {
  //     actualTaxRate: '',
  //     componentImgUrl: '',
  //     componentName: '',
  //     componentUnit: '',
  //     contractTerms: '',
  //     currency: null,
  //     freight: '',
  //     invoicing: null,
  //     invoicingTaxRate: '',
  //     minimumOrderQuantity: null,
  //     numberFullCartons: null,
  //     orderEntryId: 0,
  //     preTaxPrice: '',
  //     purchaseLink: '',
  //     purchaseMatters: '',
  //     quantity: null,
  //     reviewComponentId: null,
  //     reviewId: null,
  //     supplier: '',
  //     taxIncludedPrice: '',
  //     totalPrice: '',
  //     unitPrice: '',
  //     variant: '',
  // }
  // let classReviewId: number | undefined
  // if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
  //     classReviewId = props.step1Data
  // } else {
  //     classReviewId = route.query.reviewId
  // }
  // const { data } = await reviewStepNo3ComponentAdd({ reviewId: classReviewId!})
  // newComponent.reviewComponentId = data
  // componentList.value.push(newComponent)
  // fetchDataComponent()
}
// 删除逻辑
const handleComponentDel = (row: IreviewStepNo3ComponentList) => {
  try {
      $baseConfirm('确定要删除零件信息吗',"系统提示", async ()=>{

          const {data} = await reviewStepNo3ComponentDel({ reviewComponentId: row.reviewComponentId! })
              if (data === true){
                  const index = componentList.value.findIndex((item: IreviewStepNo3ComponentList) => item.reviewComponentId === row.reviewComponentId);
                  if (index !== -1) {
                      componentList.value.splice(index, 1);
                  }
                  $baseMessage("零件信息删除成功！","success","hey")
                  // fetchDataComponent()
              }
      })
     
  } catch(e){
      console.log(e as Error)
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
* 当点击时切换输入框，修改输入
*/
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && el){
    imagePreviewVisible.value = true
    imagePriviewList.value = []
    imagePriviewList.value.push(row.imageUrl)
  }
}

// 获取拿样零件添加数据
const fetchData = async () =>{
  listLoading.value = true
  const { data } = await getProductList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
onMounted(async ()=>{
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
</style>

