<template>
  <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>耗材信息</h2>
        </vab-query-form-top-panel>
          <vab-query-form-left-panel>
              <el-button type="primary">创建耗材</el-button>
              <el-button type="primary" @click="handleConsumableType">耗材种类</el-button>
          </vab-query-form-left-panel>
      </vab-query-form>
          <el-table 
              ref="tableRef" 
              stripe border 
              :data="fakeData" 
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
          >
              <el-table-column align="center" label="图片" class="image-wall" min-width="100">
                  <template #default="{ row, $index }">
                      <el-upload 
                          list-type="picture-card" 
                          :file-list="row.componentImgUrl" 
                          :class="{ hide: row.hide }"
                          :http-request="uploadImage"
                      >
                          <div 
                              style="width: 75px; height: 75px; display: flex; align-items: center; justify-content: center;"
                              @click="handleIconClick($index)"
                          >
                              <el-icon ><Plus /></el-icon>
                          </div>
                          <template #file="{ file }">
                              <div>
                                  <img class="el-upload-list__item-thumbnail"  :lazy="true" :src="file.url" alt="" />
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
              <el-table-column label="零件ID" align="center" min-width="70" prop="reviewComponentId" width="100">
                  <template #default="{ row }">
                      <span style="color: rgb(192, 192, 192)">{{ row.reviewComponentId }}</span>
                  </template>
              </el-table-column>   
              <el-table-column label="耗材名" prop="componentName" width="120">
                  <template #default="{ row }">
                      <span style="color: rgb(192, 192, 192)">{{ row.componentName }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="按单采购" prop="purchaseToOrder" align="center" min-width="90">
                <template #default = "{ row }">
                    <el-checkbox v-model="row.purchaseToOrder" :true-value="'1'" :false-value="'0'" class="custom-checkbox"/>
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
              <el-table-column label="未税价" prop="preTaxPrice" align="center" min-width="70">
                  <template #default="{ row }">
                      <span style="color: rgb(192, 192, 192)">{{ row.preTaxPrice }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="含税价" prop="taxIncludedPrice" align="center" min-width="70">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.taxIncludedPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.taxIncludedPrice }}</span>
                  </template>
              </el-table-column>    
              <el-table-column label="货币" width="110px" prop="currency">
                  <template #default="{ row }">
                      <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                          <el-option v-for="dict in currencyList" :key="dict.value"
                              :value="dict.value" :label="dict.label"></el-option>
                      </el-select>
                  </template>
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
              <el-table-column align="center" label="默认供应商" min-width="140" prop="supplier">
                  <template #default="{row}">
                      <el-select placeholder="请选择默认供应商" style="min-width: 100%;">
                        
                      </el-select>
                  </template>
              </el-table-column>
              <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
                  <template #header>
                      实际<br>税点
                  </template>
                  <template #default="{ row }">
                      <span style="color: rgb(192, 192, 192)">{{ row.actualTaxRate }}</span>
                  </template>
              </el-table-column>

              <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
                  <template #header>
                      开票<br>税点
                  </template>
                  <template #default="{ row }">
                      <span style="color: rgb(192, 192, 192)">{{ row.invoicingTaxRate }}</span>
                  </template>
              </el-table-column>

              <el-table-column align="center" label="默认采购方" min-width="140" prop="purchaser">
                <template #default="{row}">
                    <el-select placeholder="请选择默认采购方" style="min-width: 100%;">
                      
                    </el-select>
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
                    <el-dropdown>
                      <el-button text type="primary">
                        供应商
                        <el-icon class="el-icon--right">
                          <arrow-down />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">添加到SKU</el-link>
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
      <wangEditor
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
      </wangEditor>
    <el-dialog 
        v-model="consumableVisible" 
        :close-on-click-modal="false" 
        title="耗材种类" 
        width="33%"
        class="moldDialog"
        :before-close="handlerCloseDialog"
    >
        <el-divider style="margin-top: 0; margin-bottom: 20px"/>
        <div id="table-height-container">
            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="20">
                    <el-input v-model="consumableTypeForm.consumableType" @keyup.enter.native="" clearable placeholder="请输入新增耗材种类" />      
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="">新增</el-button>
                </el-col>          
            </el-row>
        
            <el-table 
                ref="tableRef" 
                stripe border   
                :header-cell-style="{ 'text-align': 'center' }"
                :data="consumableTypeData"
            >
                <el-table-column label="耗材种类" prop="consumableType">
                    
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="120">
                    <template #default="{ row }">
                        <el-link type="danger" :underline="false">删除</el-link>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" />
                </template>
            </el-table>
  
            <vab-pagination
                :current-page="consumableTypeQueryForm.pageNo"
                :page-size="consumableTypeQueryForm.pageSize"
                :total="consumableTypeTotal"
                @current-change="handleConsumableTypeSizeChange"
                @size-change="handleConsumableTypeCurrentChange"
            />
        </div>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
defineOptions({
  name: 'consumable',
})
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';
import { currencyList, firstLegChannelColumnsNum, invoicingList, estimatedCostAccountingSiteColumnsNum, siteReflectCurrencyAndExchangeRate } from '../../newProductDevelopment/indexCommon'
import wangEditor from '../../newProductDevelopment/newProductProgress/wangEditor.vue';
import { reviewStepNo3ComponentAdd, reviewStepNo3ComponentCopy, reviewStepNo3ComponentDel, reviewStepNo3ComponentImtDel, reviewStepNo3ComponentList, reviewStepNo3ComponentUpdate, reviewStepNo3ComponentUpload, reviewStepNo3ContractTerms, reviewStepNo3GetSelectVariantList, reviewStepNo3PurchaseMatters, reviewStepNo3SaveTh, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters, reviewStepNo3VariantList, reviewStepNo3VariantUpdate } from '/@/api/devlocal/orderProcess';
import { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList, IreviewStepNo3VariantListResp } from '/@/type/orderProcess/orderProcessType';
import { convertString } from '/@/utils/stringUtils';
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'


const consumableTypeForm = reactive({
    consumableType: ''
})

// const listLoading = ref<boolean>(true)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])
const consumableTypeData = ref([
    { consumableType: 'OPP袋' },
    { consumableType: '飞机盒' },
    { consumableType: '小白盒' },
    { consumableType: 'OPP袋' },
    { consumableType: '飞机盒' },
    { consumableType: '小白盒' },
    { consumableType: 'OPP袋' },
    { consumableType: '飞机盒' },
    { consumableType: '小白盒' },
    { consumableType: 'OPP袋' },
    { consumableType: '飞机盒' },
    { consumableType: '小白盒' },
    { consumableType: 'OPP袋' },
    { consumableType: '飞机盒' },
    { consumableType: '小白盒' },
    { consumableType: 'OPP袋' },
    { consumableType: '飞机盒' },
    { consumableType: '小白盒' },
])
const list = ref<any>([])
const consumableVisible = ref<boolean>(false)
const handlerCloseDialog = () => {
    consumableVisible.value = false
}
const handleConsumableType = () => {
    consumableVisible.value = true
}
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
  pageNo: 1,
  pageSize: 20,
})
const consumableTypeQueryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const consumableTypeTotal = ref<number>(0)
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleConsumableTypeSizeChange = (value: number) => {
    consumableTypeQueryForm.pageNo = 1
    consumableTypeQueryForm.pageSize = value
  // fetchData()
}

const handleConsumableTypeCurrentChange = (value: number) => {
    consumableTypeQueryForm.pageNo = value
  // fetchData()
}
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


// // 零件信息完善与售价核对修改站点
// const handlerSiteChange = async (row: IreviewStepNo3VariantList) =>{
//   // 外币币种
//   row.currencyType = siteReflectCurrencyAndExchangeRate.get(convertString(row.site))!
//   const {data} = await getExchangeRate({currency:row.currencyType})
//   row.foreignExchange = data
//   row.site = row.site
//   await reviewStepNo3VariantUpdate({
//       currencyType: row.currencyType,
//       finalSellingPrice: row.finalSellingPrice!,
//       firstMileChannel: row.firstMileChannel,
//       foreignExchange: row.foreignExchange,
//       orderEntryId: row.orderEntryId,
//       packagingHeight: row.packagingHeight!,
//       packagingLength: row.packagingLength!,
//       packagingPrice: row.packagingPrice!,     
//       packagingWidth: row.packagingWidth!,     
//       site: row.site,
//       tariff: row.tariff!,
//       volumeCoefficient: row.volumeCoefficient!,
//       weight: row.weight!,
//       weightCoefficient: row.weightCoefficient!,
//   })
// }

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

// 点击图标的行的下标
const clickIconRowIndex = ref<number>()
/**
* 点击添加图标事件
*/
const handleIconClick = (index: number) => {
// 获得点击行的下标
clickIconRowIndex.value = index
}
/**
* 上传图片
*/
const imageForm = ref(new FormData()) as any;
async function uploadImage(params: any) {
try {
  const index = clickIconRowIndex.value!;
  const currentComponent = componentList.value[index];

  // 检查 params.file 是否有效
  if (!params.file) {
    throw new Error('文件无效');
  }

  // // 创建一个新的 Image 对象
  // const img = new Image();
  // const objectUrl = URL.createObjectURL(params.file); // 使用上传的文件
  // img.src = objectUrl;

  // img.onload = () => {
  //   const width = img.width;
  //   const height = img.height;

  //   if (width === 0 || height === 0) {
  //     console.error('加载的图片宽度或高度为0');
  //     $baseMessage('图片加载失败，宽度或高度为0', 'error', 'hey');
  //     return;
  //   }

      // // 检查图片比例
      // if (width !== height) {
      //     // 进行图片上传
      //     // 创建 FormData 对象并添加文件和组件 ID
      //     const imageForm = new FormData();
      //     imageForm.append('file', params.file);
      //     imageForm.append('reviewComponentId', currentComponent.reviewComponentId as any);

      //     // 上传图片
      //     reviewStepNo3ComponentUpload(imageForm)
      //         .then(({ data }) => {
      //         if (!data) {
      //             throw new Error('上传图片失败');
      //         }
      //         imgUrl.value = data;
      //         cropVisible.value = true; // 显示裁剪窗口
      //         const imageListCopy = [...(currentComponent.componentImgUrl || [])];
      //         imageListCopy.push({ url: data });

      //         componentList.value[clickIconRowIndex.value!].componentImgUrl = imageListCopy;
      //         componentList.value[clickIconRowIndex.value!].hide = imageListCopy.length > 0;
      //          componentList.value[clickIconRowIndex.value!].cropData = cropData.value
      //          console.log(componentList.value[clickIconRowIndex.value!].cropData);
               
      //             // 提示成功信息
      //             $baseMessage('图片上传成功!', 'success', 'hey');
              
      //         })
      //         .catch(error => {
      //             console.error(error);
      //             $baseMessage('图片上传失败!', 'error', 'hey');
      //         });
      // } else {
          const imageForm = new FormData();
          imageForm.append('file', params.file);
          imageForm.append('reviewComponentId', currentComponent.reviewComponentId as any);

          // 上传图片
          reviewStepNo3ComponentUpload(imageForm)
              .then(({ data }) => {
              if (!data) {
                  throw new Error('上传图片失败');
              }
              const imageListCopy = [...(currentComponent.componentImgUrl || [])];
              imageListCopy.push({ url: data });

              componentList.value[clickIconRowIndex.value!].componentImgUrl = imageListCopy;
              componentList.value[clickIconRowIndex.value!].hide = imageListCopy.length > 0;

                  // 提示成功信息
                  $baseMessage('图片上传成功!', 'success', 'hey');
              
              })
              .catch(error => {
                  console.error(error);
                  $baseMessage('图片上传失败!', 'error', 'hey');
              });
      

} catch (error) {
  console.error(error);
  $baseMessage('图片上传失败!', 'error', 'hey');
}
}

// function handleImageUpload(params: any, currentComponent: any) {

// }



/**
* 图片预览事件
*/
const handlePictureCardPreview = (file: UploadFile, row: any) => {
  
}
/**
* 图片删除功能
*/
const handleRemove = async (file: UploadFile, row: any) => {
  try {
      $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
          const { data } = await reviewStepNo3ComponentImtDel({ reviewComponentId: row.reviewComponentId})
          if (data === true) {
              $baseMessage("此零件图片信息删除成功!", "success", "hey");

              // 从 row.componentImgUrl 中删除对应的文件
              const fileIndex = row.componentImgUrl.findIndex((img: any) => img.url === file.url);
              if (fileIndex !== -1) {
                  row.componentImgUrl.splice(fileIndex, 1);
              }

              // 如果 componentImgUrl 为空，则设置 hide 为 false
              if (row.componentImgUrl.length === 0) {
                  row.hide = false;
              }
          }
      })
      
  } catch (error) {
      console.error(error)
  }
}
// 新增逻辑
const handleAddComponent = async () => {
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
      // await reviewStepNo3ComponentUpdate(value)
      // fetchDataComponent()
  }
}
// 变体table blur事件
const clickVariantsCancle = async (event:any,value:any) =>{
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
      // await reviewStepNo3VariantUpdate(value)
      // fetchVariantsData()
  }
}


// // 获取拿样零件添加数据
// const fetchDataComponent = async () =>{
//   if(route.query.progressId || (route.query.reviewStatus === '0' || route.query.reviewStatus === '2')) {
//       try {
//           // 拿样零件添加列表
//           let classReviewId: number | undefined
//           if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
//               classReviewId = props.step1Data
//           } else {
//               classReviewId = route.query.reviewId
//           }
//           const { data } = await reviewStepNo3ComponentList({reviewId: classReviewId!})
//           componentList.value = data
//           componentList.value.forEach((item: any, index: number) => {
//               item.currency = convertString(item.currency)
//               item.invoicing = convertString(item.invoicing)
//               if (item.componentImgUrl && item.componentImgUrl.trim() !== "") {
//                   item.hide = true;
//                   item.componentImgUrl = [{ url: item.componentImgUrl }];
//               } else {
//                   item.hide = false;
//                   item.componentImgUrl = []; // 如果没有图片,确保这是空的
//               }
//               // item.cropData = ''
//               // console.log(item.componentImgUrl);
//           })
//           // 获取下拉变体列表
//           const { data: variantSelectList }= await reviewStepNo3GetSelectVariantList({ reviewId: classReviewId! });
//           variantsSelectList.value = variantSelectList
//           variantsSelectList.value.unshift({ label: '变体共用', id: 0 })

//           // 排序
//           componentList.value.sort((a: any, b: any) => {
//           if (a.orderEntryId === 0 && b.orderEntryId !== 0) {
//               return -1; // a 在前
//           }
//           if (a.orderEntryId !== 0 && b.orderEntryId === 0) {
//               return 1; // b 在前
//           }
//               return 0; // 不排序
//           });
//       }catch(e){
//           console.error(e as Error)
//       }
//   }
// }
// onMounted(async ()=>{
//   fetchDataComponent()
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
#table-height-container {
    display: flex;
    flex-direction: column;
    max-height: calc(80vh - 130px);
    height: calc(80vh - 130px);
    padding-bottom: 20px;
    .el-table {
        flex: 1; // 使表格占据剩余空间
        overflow: auto; // 确保表格内容可以滚动
    }
}
</style>

