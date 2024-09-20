<template>
    <div class="comprehensive-table-container auto-height-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> SKU供应商 </strong></span>
                </div>
            </template>
        </el-page-header>
        <vab-query-form>
            <vab-query-form-left-panel style="margin-top: 10px;">
                <el-button type="primary" @click="handleAddSupplier">新增供应商</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="tableData"
                :header-cell-style="{ 'text-align': 'center' }"
                @cell-click="changeInput"
            >
                <el-table-column align="center" label="图片" class="image-wall" min-width="100">
                    <template #default="{ row, $index }">
                        <el-upload list-type="picture-card" :auto-upload="false" :http-request="uploadImage">
                            <el-icon v-if="!row.imageUrl"><Plus /></el-icon>

                            <!-- 预先显示已经存在的图片 -->
                            <template v-if="row.imageUrl">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="row.imageUrl" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview">
                                            <el-icon @click.stop="handlePreview(row)"><zoom-in /></el-icon>
                                        </span>
                                        <span class="el-upload-list__item-delete">
                                            <el-icon @click.stop="handleRemove(row)"><Delete /></el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview">
                                        <el-icon @click.stop="handlePreview(row)"><zoom-in /></el-icon>
                                    </span>
                                    <span class="el-upload-list__item-delete">
                                        <el-icon @click.stop="handleRemove(row)"><Delete /></el-icon>
                                    </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload>
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="60" prop="componentUnit" align="center">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="出厂单价" prop="unitPrice" min-width="60" align="center">
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

                <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="60">
                    <template #header>
                        总未<br>税价
                    </template>
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.preTaxPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" min-width="60">
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
                <el-table-column label="货币" width="105px" prop="currency">
                    <template #default="{ row }">
                        <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
                            <el-option v-for="dict in currencyList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="起订量" prop="minimumOrderQuantity" align="center" min-width="80">
                    <template #default="{ row }">
                        <div class="none">
                                <el-input type="text" v-model="row.minimumOrderQuantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                            </div>
                        <span>{{ row.minimumOrderQuantity }}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="整箱数" prop="numberFullCartons" align="center" min-width="80">
                    <template #default="{ row }">
                        <div class="none">
                                <el-input type="text" v-model="row.numberFullCartons" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                            </div>
                        <span>{{ row.numberFullCartons }}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="供应商" min-width="140" prop="supplier">
                    <template #default="{row}">
                        <span style="color: rgb(192, 192, 192)">{{ row.supplier }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="130">
                    <template #default = "{ row }">
                        <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingChange(row)">
                            <el-option v-for="dict in invoicingList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
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
                        <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.contractTerms"  />
                        </div>
                        <span class="overflow-text">{{ removeHtmlTags(row.contractTerms) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="添加日期" prop="date" align="center" min-width="100">
                    <template #default = "{ row }">
                        <span style="color: rgb(192, 192, 192);">{{ row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="添加人员" prop="person" align="center" min-width="100">
                    <template #default = "{ row }">
                        <span style="color: rgb(192, 192, 192);">{{ row.person }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150" align="center">
                  <template #default="{ row }">
                        <el-button type="danger" text @click="">删除</el-button>
                  </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
                </template>
            </el-table>
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
        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
     </div>
 </template>
 
<script lang="ts" setup>
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

import { Delete, Plus, ZoomIn, Edit, CirclePlusFilled, ArrowDown } from '@element-plus/icons-vue'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import { reviewStepNo3ContractTerms, reviewStepNo3PurchaseMatters, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters } from '/@/api/devlocal/orderProcess';
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';
import { FormInstance, UploadFile } from 'element-plus';
import { currencyList, invoicingList } from '../newProductDevelopment/indexCommon';
import type { UploadProps } from 'element-plus'
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const tableData = ref([
  {
    imageUrl: "https://via.placeholder.com/75",
    reviewComponentId: 'R001',
    componentName: '零件A',
    quantity: 100,
    componentUnit: '个',
    unitPrice: 10.00,
    totalPrice: 1000.00,
    preTaxPrice: 950.00,
    taxIncludedPrice: 1050.00,
    currency: 'CNY',
    minimumOrderQuantity: 10,
    numberFullCartons: 5,
    supplier: '供应商A',
    invoicing: '增值税',
    actualTaxRate: '13%',
    invoicingTaxRate: '13%',
    purchaser: '采购方A',
    purchaseToOrder: '0',
    purchaseLink: 'http://example.com/purchaseA',
    componentInfo: null,
    purchaseMatters: '硅胶部分采购价格=0.57一个含税运，不含税=0.5一个。不锈钢吸管，吸管刷，和白卡纸盒全部采购好之后寄到五河县伟田塑胶制品有限公司，让伟田帮我们打包好发过来。',
    contractTerms: '硅胶吸管套产品色号：椰奶白11-0608TCX COCONUT MILK，冷灰Pantone Cool Grey 9C，粉色PANTONG 4064C，浅绿色PANTONE 9504 U，浅蓝色Pantone 290 C，深蓝色Pantone 2376 C；',
  },
  {
    imageUrl: "https://via.placeholder.com/150",
    reviewComponentId: 'R002',
    componentName: '零件B',
    quantity: 200,
    componentUnit: '箱',
    unitPrice: 20.00,
    totalPrice: 4000.00,
    preTaxPrice: 3700.00,
    taxIncludedPrice: 4200.00,
    currency: 'USD',
    minimumOrderQuantity: 5,
    numberFullCartons: 10,
    supplier: '供应商B',
    invoicing: '普通发票',
    actualTaxRate: '5%',
    invoicingTaxRate: '5%',
    purchaser: '采购方B',
    purchaseToOrder: '1',
    purchaseLink: 'http://example.com/purchaseB',
    componentInfo: null,
    purchaseMatters: '注意事项B',
    contractTerms: '合同条款B',
  },
  {
    imageUrl: "https://via.placeholder.com/150",
    reviewComponentId: 'R003',
    componentName: '零件C',
    quantity: 150,
    componentUnit: '套',
    unitPrice: 15.00,
    totalPrice: 2250.00,
    preTaxPrice: 2100.00,
    taxIncludedPrice: 2500.00,
    currency: 'EUR',
    minimumOrderQuantity: 2,
    numberFullCartons: 3,
    supplier: '供应商C',
    invoicing: '增值税',
    actualTaxRate: '10%',
    invoicingTaxRate: '10%',
    purchaser: '采购方C',
    purchaseToOrder: '0',
    purchaseLink: 'http://example.com/purchaseC',
    componentInfo: null,
    purchaseMatters: '注意事项C',
    contractTerms: '合同条款C',
  },
]);
const handleAddSupplier = () => {
    tableData.value.unshift({
        imageUrl: "https://via.placeholder.com/150",
        reviewComponentId: 'R003',
        componentName: '零件C',
        quantity: 150,
        componentUnit: '套',
        unitPrice: 15.00,
        totalPrice: 2250.00,
        preTaxPrice: 2100.00,
        taxIncludedPrice: 2500.00,
        currency: '0',
        minimumOrderQuantity: 2,
        numberFullCartons: 3,
        supplier: '供应商C',
        invoicing: '增值税',
        actualTaxRate: '10%',
        invoicingTaxRate: '10%',
        purchaser: '采购方C',
        purchaseToOrder: '0',
        purchaseLink: 'http://example.com/purchaseC',
        componentInfo: null,
        purchaseMatters: '注意事项C',
        contractTerms: '合同条款C',
    })
}
const uploadImage = async () => {
    
    
}
const handlePreview = (row: any) => {
    imagePreviewVisible.value = true
    imagePriviewList.value = []
    imagePriviewList.value.push(row.imageUrl)
}
/**
 * 图片删除功能
 */
const handleRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{

        row.imageUrl = ""

        // const delImgForm = new FormData()
        // delImgForm.append('type', '2')
        // delImgForm.append('imageId', file.name)

        // const { data } = await deleteImage(delImgForm)
        // if (data == true) {
        //     $baseMessage("此条产品图片信息删除成功!","success","hey")
        // }
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
        // fetchVariantsData()
    }
}
const handleCurrencyChange = async (row: any) => {
    // await reviewStepNo3ComponentUpdate({
    //     ...row,
    //     currency: parseInt(row.currency),
    // })
    // fetchDataComponent()
    // fetchVariantsData()
}
const handleInvoicingChange = async (row: any) => {
    // await reviewStepNo3ComponentUpdate({
    //     ...row,
    //     invoicing: parseInt(row.invoicing),
    // })
    // fetchDataComponent()
    // fetchVariantsData()
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
// back
const goBack = async () => {
    await delVisitedRoute(handleActivePath(route, true))
    history.back()
}
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
</style>