<template>
   <div class="step-form-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> SKU详情 </strong></span>
                </div>
            </template>
        </el-page-header>
        <el-card class="product-details-card" shadow="never">
            <el-row :gutter="20">
                <el-col :span="2">
                    <el-upload 
                        list-type="picture-card" 
                    >
                        <el-icon ><Plus /></el-icon>
                        <template #file="{ file }">
                            <div>
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-preview"
                                        
                                    >
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    <span
                                        class="el-upload-list__item-delete"
                                        
                                    >
                                        <el-icon><Delete /></el-icon>
                                    </span>
                                </span>
                            </div>
                        </template>
                    </el-upload>
                </el-col>
                <el-col :span="12" style="padding-right: 0px;">
                    <el-form label-position="top" :inline="true">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="SKU">
                                    <el-input v-model="sku.code" placeholder="" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品主品名">
                                    <el-input v-model="sku.productName" placeholder="可食用内粉" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品短描述">
                                    <el-input v-model="sku.shortDescription" placeholder="5g粗粉" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="北美FNSKU">
                                    <el-input v-model="sku.originalList" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="欧洲FNSKU">
                                    <el-input v-model="sku.originalList" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="变体名">
                                    <el-input v-model="sku.variantName" placeholder="斑色"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="UPC">
                                    <el-input v-model="sku.upc" placeholder="699035922947"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="默认收货仓库">
                                    <el-input v-model="sku.upc" placeholder="699035922947"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品经理">
                                    <el-input v-model="sku.productDesign" placeholder="王文育"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"> 
                                <el-form-item label="产品设计">
                                    <el-input v-model="sku.productDesign" placeholder="王文育"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="总实际成本">
                                    <el-input v-model="sku.totalCost"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="起订量">
                                    <el-input v-model="sku.moq"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="整箱数">
                                    <el-input v-model="sku.boxQuantity"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12"> 
                                <el-form-item label="近10次打包装箱数">
                                    <el-input v-model="sku.packagingQuantities" placeholder="25(150箱), 30(50箱), 50(10箱)"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
               
                <el-col :span="10" style="padding-right: 0px;padding-left: 0px;">
                    <el-form label-position="top" >
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="质检清单">
                                    <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 11 }"
                                placeholder="2024-7-29：检查产品配件是否齐全，外观是否有破损和划痕。
        2024-6-29：胶条和亚克力板放入槽里是否匹配。
        2024-5-29：检查小盖子磁铁和底座磁铁是否相吸和配套。
        2024-5-22：小盖变形（外翻），小盖和底座的色差有严重情况的需要挑选出来
        2024-2-29：放使用说明书，每片亚克力板上贴单面撕膜说明书。
        2023-7-29：如果飞机盒有空间，看是否可以加气泡袋。"
                            ></el-input>
                        </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="产品经理自己看的备注">
                                    <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 11 }"
                                placeholder="2024-06-26：亚克力板的售后问题需要在微信群里沟通。
        2024-05-20：硅胶压条的单价是0.21元/根，需要厂家剪切好。起订数量1800根。多余数量后续作为耗材备用。
        2024-05-15：底座更换供应商，税前15.9元/套，税后17.17元/套。
        磁铁和硅胶压条需要我司购买，并发到底座厂家，让他们安装到底座的槽中。
        底座工厂的地址如下：
        曹县杉盛木业有限公司：王先生 13793040890 山东省菏泽市曹县龙华店村 
        2024-05-15：硅胶压条是定制长度，1688链接中是现货长度，下单时要备注上【规格卡4mm 平底，每根长度，数量】
        2024-05-15：亚克力板涨价，涨价后：
        亚克力U形板-厚度1.5mm-5*7inch，3.2元一片
        亚克力U形板-厚度1.5mm-8.5*11inch，5.5元一片
        2024-04-26：税后底座涨价加1.5元/套，税后21元。
        2024-04-19：税后底座单套15元，涨价加4.5元，税后19.5元。
        2024-03-27：产品起订数量是170套，后续请按照此数量下单，可以分成2个PO。
        磁铁需要发到底座厂家，地址如下：
        收货人: 赖林斌
        手机号码: 13751577874
        所在地区: 广东省惠州市龙门县龙潭镇
        详细地址: 铁岗美宜佳（代收点）"
                            ></el-input>
                        </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <div class="comprehensive-table-container auto-height-container">
            <el-page-header  @back="goBack" style="margin-bottom: 0px;">
                <template #content>
                    <div class="flex items-center">
                        <span> <strong> SKU零配件清单（与开票一致） </strong></span>
                    </div>
                </template>
            </el-page-header>
            <vab-query-form>
                <vab-query-form-left-panel style="margin-top: 10px;">
                    <el-button type="primary">创建零件</el-button>
                    <el-button type="primary">添加零件</el-button>
                    <el-button type="primary">创建</el-button>
                    <el-button type="primary">添加耗材</el-button>
                </vab-query-form-left-panel>
            </vab-query-form>
            <el-table 
                ref="tableRef" 
                stripe border 
             
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
                <el-table-column label="零件名" prop="componentName" width="120">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.componentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量"  width="100" prop="quantity" align="center">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.quantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.quantity }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位"  min-width="70" prop="componentUnit" align="center">
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
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
                <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="70">
                    <template #header>
                        总未<br>税价
                    </template>
                    <template #default="{ row }">
                        <span style="color: rgb(192, 192, 192)">{{ row.preTaxPrice }}</span>
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
                        <el-select  placeholder="" clearable filterable>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="开票" prop="oem" align="center" width="140">
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
                <el-table-column label="不报关" prop="purchaseToOrder" align="center" min-width="90">
                    <template #default = "{ row }">
                        <el-checkbox v-model="row.purchaseToOrder" :true-value="'1'" :false-value="'0'" class="custom-checkbox" disabled/>
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
                <el-table-column  label="默认收货仓库" prop="remarks" min-width="120">
                    <template #default="{ row }">
                        <el-select 
                            v-model="row.componentInfo!" 
                            value-key="id"
                            placeholder="请选择收货仓库"
                            filterable
                            clearable
                            allow-create
                            :reserve-keyword = "false"
                            
                        >
                            
                        </el-select>
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
                <el-table-column fixed="right" label="操作" width="150">
                  <template #default="{ row }">
                    <el-dropdown>
                      <el-button text type="primary" v-permissions="{ permission: ['newProduct:evaluation:add'] }">
                        修改
                        <el-icon class="el-icon--right">
                          <arrow-down />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">供应商</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">添加到其他SKU</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="danger" :underline="false">删除</el-link>
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
        </div>
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
    </div>
</template>

<script lang="ts" setup>
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import wangEditor from '../newProductDevelopment/newProductProgress/wangEditor.vue'
import { reviewStepNo3ContractTerms, reviewStepNo3PurchaseMatters, reviewStepNo3UpdateContractTerms, reviewStepNo3UpdatePurchaseMatters } from '/@/api/devlocal/orderProcess';
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { UploadFile } from 'element-plus';
import { currencyList, invoicingList } from '../newProductDevelopment/indexCommon';

const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const sku = ref({
  code: 'NHome-X003UMLWLX',
  productName: '可食用内粉',
  shortDescription: '5g粗粉',
  originalList: '2024-7-29: 检查产品配件是否齐全, 外观是否有破损和刮痕。\n2024-6-29: 胶条和亚克力板嵌入槽里集中定配。\n2024-5-29: 检查人偶底座是否能与配套支架完美契合。\n2024-5-22: 小塞宝贝（外翻）：几滴和薄薄的色差有严重问题的需要返厂处理。\n2024-2-29: 软皮使用说明书，每片或每方板上贴单面高透明胶。',
  variantName: '斑色',
  productDesign: '王文育',
  supplier: '云舟-川桥路',
  upc: '699035922947',
  totalCost: 12.5,
  moq: 100,
  boxQuantity: 100,
  packagingQuantities: '25(150箱), 30(50箱), 50(10箱)',
  managerNotes: '2024-06-26: 亚克力板的薄后问题要在敲定群里沟通。\n2024-05-20: 往外不在安的单价提高0.21元/爿。需要厂家努力好，应订\n2024-05-16: 去秋杭来做底 单价提高0.3元/双。\n2024-05-15: 南通息换供应商，成本15.97元/套。税后17.17元/套。\n底托和插扣压条需要我司购买，并发到厂家产加工，让他们安装到底座\n应压工厂的地址如下：\n曹县彭意不业有限公司：王先生 13793040890 山东省菏泽市曹县仙明\n2024-05-15: 往胶压条是走到长度，1688挂账中是现货长度，下单\n时要考虑上（视情长4mm 平方，看根长度，数量）\n2024-05-15: 胶带我司需要收到供应商'
})
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
 * 图片预览事件
 */
 const handlePictureCardPreview = (file: UploadFile, row: any) => {
    
}
/**
 * 上传图片
 */
const imageForm = ref(new FormData()) as any;
async function uploadImage(params: any) {
//   try {
//     const index = clickIconRowIndex.value!;
//     const currentComponent = componentList.value[index];

//     // 检查 params.file 是否有效
//     if (!params.file) {
//       throw new Error('文件无效');
//     }

//     const imageForm = new FormData();
//     imageForm.append('file', params.file);
//     imageForm.append('reviewComponentId', currentComponent.reviewComponentId as any);

//     // 上传图片
//     reviewStepNo3ComponentUpload(imageForm)
//         .then(({ data }) => {
//         if (!data) {
//             throw new Error('上传图片失败');
//         }
//         const imageListCopy = [...(currentComponent.componentImgUrl || [])];
//         imageListCopy.push({ url: data });

//         componentList.value[clickIconRowIndex.value!].componentImgUrl = imageListCopy;
//         componentList.value[clickIconRowIndex.value!].hide = imageListCopy.length > 0;

//             // 提示成功信息
//             $baseMessage('图片上传成功!', 'success', 'hey');
        
//         })
//         .catch(error => {
//             console.error(error);
//             $baseMessage('图片上传失败!', 'error', 'hey');
//         });
        

//   } catch (error) {
//     console.error(error);
//     $baseMessage('图片上传失败!', 'error', 'hey');
//   }
}
/**
 * 图片删除功能
 */
 const handleRemove = async (file: UploadFile, row: any) => {
    // try {
    //     $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
    //         const { data } = await reviewStepNo3ComponentImtDel({ reviewComponentId: row.reviewComponentId})
    //         if (data === true) {
    //             $baseMessage("此零件图片信息删除成功!", "success", "hey");

    //             // 从 row.componentImgUrl 中删除对应的文件
    //             const fileIndex = row.componentImgUrl.findIndex((img: any) => img.url === file.url);
    //             if (fileIndex !== -1) {
    //                 row.componentImgUrl.splice(fileIndex, 1);
    //             }

    //             // 如果 componentImgUrl 为空，则设置 hide 为 false
    //             if (row.componentImgUrl.length === 0) {
    //                 row.hide = false;
    //             }
    //         }
    //     })
        
    // } catch (error) {
    //     console.error(error)
    // }
}
// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}


</script>

<style scoped>
:deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 89.164px;
}
:deep(.el-form-item) {
    margin-right: 10px;
}
:deep(.el-card__body) {
    padding-bottom: 2px;
}
.product-details-card {
    border: 0;
}
</style>