<template>
  <div class="step-form-container">
    <el-page-header  @back="goBack" style="margin-bottom: 0px;">
      <template #content>
        <div class="flex items-center">
          <span> <strong>{{ handlePoTitle() }}</strong></span>
          <el-button v-if="route.query.from !== 'plannedPoDetail' && route.query.from !== 'plannedPoCreate'" type="primary" style="margin-left: 10px">SKU替换</el-button>
        </div>
      </template>
    </el-page-header>
    <el-card class="product-details-card" shadow="never" >
      <el-row :gutter="20">
        <el-col :span="2" class="custom-upload" style="padding-right: 0px;width: 100%"> 
          <el-form label-position="top">
            <el-form-item label="订货套数" >
              <el-input v-model="poDetailData.quantity"></el-input>
            </el-form-item>
            <el-form-item >
              <el-upload 
                list-type="picture-card" 
                :file-list="poDetailData.imageList" 
                :class="{ hide: poDetailData.hide }"
                :http-request="uploadImage"
                class="upload-align"
              >
                <el-icon ><Plus /></el-icon>
                <template #file="{ file }">
                    <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                            <span
                                class="el-upload-list__item-preview"
                                @click="handlePreview(file)"
                            >
                                <el-icon><zoom-in /></el-icon>
                            </span>
                            <span
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file)"
                            >
                                <el-icon><Delete /></el-icon>
                            </span>
                        </span>
                    </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
          
        </el-col>
        <el-col :span="10" style="padding-right: 0px; padding-left: 0">
          <el-form label-position="top" :inline="true">
            <el-row style="width: 100%">
                <el-col :span="12">
                    <el-form-item label="SKU">
                        <el-select v-model="poDetailData.sku" placeholder="" :disabled="skuDisabled" filterable></el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="产品名称">
                        <el-input v-model="poDetailData.productName" @blur="handleUpdateSku" :disabled="productNameDisabled"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="width: 100%">
              <el-col :span="12">
                <el-form-item label="创建日期">
                  <el-input v-model="poDetailData.createTime" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品经理">
                  <el-input v-model="poDetailData.productManager" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="PO站点">
                    <el-select v-model="poDetailData.site" placeholder="请选择站点" @change="handleUpdateSku">
                      <el-option
                        v-for="item in siteList"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收货仓库">
                        <el-select v-model="poDetailData.repositoryId" placeholder="请选择收货仓库" @change="handleUpdateSku">
                            <el-option
                                v-for="item in repositoryOption"
                                :label="item.label"
                                :value="item.id"
                                :key="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="width: 100%">
              <el-col :span="4">
                <el-form-item label="SKU总含税价">
                  <el-input v-model="poDetailData.orderTotalPrice" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="起订量" >
                  <el-input v-model="poDetailData.minQuantity" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="整箱数" >
                  <el-input v-model="poDetailData.numCartons" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12"> 
                <el-form-item label="我方打包整箱数(近10次)">
                  <el-input v-model="poDetailData.packedTenRecord" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="12" style="padding-right: 0px;padding-left: 0px;">
          <el-form label-position="top" >
            <el-row>
              <el-col :span="12">
                <el-form-item label="">
                  <el-space>
                      <span style="font-size: var(--el-form-label-font-size);">SKU备注</span>
                  </el-space>
                  <el-input type="textarea" :rows="11" v-model="poDetailData.skuRemarks" disabled resize="none"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="">
                    <el-space>
                        <span style="font-size: var(--el-form-label-font-size);">PO备注</span>
                    </el-space>
                    <el-input type="textarea" :rows="11" v-model="poDetailData.poRemarks" @blur="handleRemarksChange" resize="none"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-page-header  @back="goBack" style="margin-bottom: 0px;">
      <template #content>
        <div class="flex items-center">
          <span> <strong> SKU零配件清单（与开票一致） </strong></span>
        </div>
      </template>
    </el-page-header>
    <div class="comprehensive-table-container">
      <vab-query-form>
        <vab-query-form-left-panel style="margin-top: 10px;" :span="24">
          <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
          <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
          <el-button v-if="route.query.from !== 'plannedPoCreate'" type="primary">价格更新</el-button>
          <el-button v-if="route.query.from !== 'plannedPoCreate'" type="primary">采购方和不报关更新</el-button>
          <el-text type="danger" class="text-center">注意：零件名修改仅限品名规范修正，严禁将一个零件的名字修改为另外一个零件</el-text>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table 
        ref="tableRef" 
        stripe border 
        :data="skuComponentList"
        :header-cell-style="{ 'text-align': 'center' }"
        @cell-click="changeInput"
        class="noneHoveTable"
        :cell-style="cellStyle"
      >
        <el-table-column align="center" label="图片" class="image-wall" min-width="100">
            <template #default="{ row, $index }">
                <el-upload 
                    list-type="picture-card" 
                    :file-list="row.imageList" 
                    :class="{ hide: row.hide }"
                    :http-request="(file) => uploadSkuComponentImage(file, row)"
                    class="component-upload"
                >
                    <el-icon ><Plus /></el-icon>
                    <template #file="{ file }">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
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
                                    <el-icon><Delete /></el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload>
            </template>
        </el-table-column>
        <el-table-column label="零件ID" prop="existingPartsListId" width="80"></el-table-column>   
        <el-table-column label="零件名" prop="componentName" width="200">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.componentName" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.componentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订货总数" width="60" prop="purchaseCount" align="center">
          <template #header>
            订货<br>总数
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.purchaseCount" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.purchaseCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="多订数量" width="60" prop="moreCount" align="center">
          <template #header>
            多订<br>数量
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.moreCount" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.moreCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用已有库存" width="75" prop="useStockCount" align="center">
          <template #header>
            使用已<br>有库存
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.useStockCount" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.useStockCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已有库存" width="60" prop="stock" align="center">
          <template #header>
            已有<br>库存
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60" prop="unit" align="center">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.unit" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出厂单价" prop="unitPrice" min-width="75" align="center">
          <template #header>
            出厂<br>单价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.unitPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出厂总价" prop="totalPrice" min-width="75" align="center">
          <template #header>
            出厂<br>总价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.totalPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="含税运费" prop="freight" align="center" min-width="75">
          <template #header>
              含税<br>运费
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.freight" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.freight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模具费含税" prop="moldCost" align="center" min-width="75">
          <template #header>
            模具费<br>含税
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.moldCost" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.moldCost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总未税价" prop="preTaxPrice" align="center" min-width="75">
          <template #header>
            总未<br>税价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.preTaxPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.preTaxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" min-width="75">
          <template #header>
              总含<br>税价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.taxIncludedPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.taxIncludedPrice }}</span>
          </template>
        </el-table-column>    
        <el-table-column label="货币" width="105px" prop="currency">
          <template #default="{ row }">
            <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="updateSkuComponent(row)">
              <el-option v-for="dict in currencyNumList" :key="dict.value"
                  :value="dict.value" :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="起订量" prop="minQuantity" align="center" min-width="73">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.minQuantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.minQuantity }}</span>
          </template>
        </el-table-column> 
        <el-table-column label="整箱数" prop="numCartons" align="center" min-width="73">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.numCartons" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.numCartons }}</span>
          </template>
        </el-table-column> 
        <el-table-column align="center" label="供应商" min-width="205" prop="suppliserId">
          <template #default="{row}">
            <el-select v-model="row.suppliserId" placeholder="" @change="handleSupplierAndInvoicingChange(row)">
              <el-option 
                v-for="item in row.suppliserList"
                :label="item.label"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="开票" prop="oem" align="center" width="130">
          <template #default = "{ row }">
            <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleSupplierAndInvoicingChange(row)">
              <el-option v-for="dict in invoicingNumList" :key="dict.value"
                  :value="dict.value" :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
          <template #header>
              实际<br>税点
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.actualTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
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
              <el-input v-model="row.invoicingTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.invoicingTaxRate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="采购方" min-width="130" prop="purchaseId">
          <template #default="{row}">
            <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleDefaultPurchase(row)">
              <el-option 
                v-for="item in purchaseOption"
                :label="item.label"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="不报关" prop="customsDeclarationStatus" align="center" min-width="75">
          <template #default = "{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleDeclareCustoms(row)"/>
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
        <el-table-column  label="订单号" prop="orderNo" min-width="100" align="center">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.orderNo" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="收货仓库" prop="repositoryId" min-width="160">
          <template #default="{ row }">
            <el-select v-model="row.repositoryId" placeholder="输入和搜索收货仓库" style="min-width: 100%;" filterable @change="updateSkuComponent(row)">
              <el-option 
                v-for="item in repositoryOption"
                :label="item.label"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
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
        <el-table-column fixed="right" label="操作" min-width="200" align="center">
          <template #default="{ row, $index }">
            <el-space>
              <el-button v-if="route.query.from !== 'plannedPoDetail' && route.query.from !== 'plannedPoCreate'" text type="primary">更新单价</el-button>
              <el-button text type="danger" @click="handleDelPoSKuComponent(row, $index)">删除</el-button>
            </el-space>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
        </template>
      </el-table>
      <el-footer class="button-center">
        <el-button type="primary">上一个</el-button>
        <el-button type="primary">下一个</el-button>
        <el-button type="warning">添加SKU</el-button>
        <el-button type="danger" @click="handleDelSKU">删除SKU</el-button>
      </el-footer>
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
    <!-- 添加零件 -->
    <VabCreateComponent 
      :createComponentVisible="createComponentVisible"
      @update:createComponentVisible="handleCloseCreateComponent"
      @update:tableValue="handleTableDataValue"
    />
    <!-- 添加耗材 -->
    <VabCreateConsumable 
      :createConsumableVisible="createConsumableVisible"
      @update:createConsumableVisible="handleCloseCreateConsumable"
      @update:tableValue="handleTableDataValue"
    />
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { FormInstance, UploadFile } from 'element-plus'
import VabCreateConsumable from './vabAutoComponents/vabCreateConsumable.vue'
import { delComponentImage, delSkuImage, getProductAllSupplier, getProductComponentPurchase, getProductComponentStore, uploadComponentImage, uploadSkuImage } from '/@/api/devlocal/productInformation'
import { deletePoSkuComponent, getPoContractTerms, getPoDetail, getPoPurchaseMatters, getPoSkuComponentList, getSupplierRate, updatePoContractTerms, updatePoPurchaseMatters, updatePoSkuComponent } from '/@/api/devlocal/purchasePo'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetPoSkuComponentList, IPurchaseOption, IRepositoryOption } from '/@/type/purchase/po'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { handleActivePath } from '/@/utils/routes'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import { currencyNumList, invoicingNumList, siteList } from '/@/views/purchase/constantOption.ts'

const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
// po详情
const poDetailData = ref<any>({})
// PoSku配件数据
const skuComponentList = ref<IGetPoSkuComponentList[]>([])
const formRef = ref<FormInstance>()
const qualityCheckList = ref<any>()

// 处理编辑框是否可编辑
const skuDisabled = ref<boolean>(false)
const productNameDisabled = ref<boolean>(false)
const handleInputDisabled = () => {
  if (route.query.from === 'plannedPoDetail') {
    skuDisabled.value = true
    productNameDisabled.value = false
  } else if (route.query.from === 'plannedPoCreate') {
    skuDisabled.value = false
    productNameDisabled.value = true
  } else {
    skuDisabled.value = true
    productNameDisabled.value = false
  }
}
// 处理订单详情、创建的标题
const handlePoTitle = () => {
  if (route.query.from === 'plannedPoDetail') {
     return '计划详情'
  } else if (route.query.from === 'plannedPoCreate') {
    return '采购计划创建'
  } else {
    return route.query.from
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



const handleDelSKU = () => {
  // 只有一个sku的 删除的是po 
  $baseConfirm('确定要删除PO吗', null, async () => {
    $baseMessage('发布到PO成功', 'success', 'hey')
  })
  // 有多个sku的 删除当前sku
}
// po-sku零配件删除
const handleDelPoSKuComponent = async (row: any, index: number) => {
  $baseConfirm('确定要删除该条零件信息吗', "系统提示", async () => {
    $baseConfirm('确定删除，是否继续？', '系统提示', async () => {
      try {
        const { data } = await deletePoSkuComponent({
          id: row.id
        });
        if (data === true) {
          skuComponentList.value.splice(index, 1)
          fetchSkuComponent()
          // fetchData()
          $baseMessage('该条零件删除成功', 'success', 'hey');
        }
      } catch (error) {
        console.error('删除失败:', error);
      }
    });
  })
}
// const handleDel = async (row: any, index: number) => {
//    $baseConfirm('确定要删除零件信息吗',"系统提示", async ()=>{
//        $baseConfirm('确定删除，是否继续？', '系统提示', async () => {
//            const { data } = await delProductComponent({
//                componentId: row.componentId
//            })
//            if (data) {
//                tableData.value.splice(index, 1)
//               //  fetchComponentData()
//                fetchData()
//                $baseMessage('SKU零配件删除成功', 'success', 'hey')
//            }
//        });
//    })
// }
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if  (data.columnIndex === 1 || data.columnIndex === 6){        
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign:'center'
    } 
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
// 图片预览事件
const handlePreview = (file: UploadFile) => {
   imagePreviewVisible.value = true
   imagePriviewList.value = []
   imagePriviewList.value.push(file.url!)
}
/**
* 图片删除功能
*/
const handleRemove = async (file: UploadFile) => {
 try {
   $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
       const { data } = await delSkuImage({
           skuId: poDetailData.value.skuId
       })
       if (data == true) {
        poDetailData.value.imageList = []
        poDetailData.value.hide = false
           $baseMessage("SKU图片删除成功!","success","hey")
       }
   })
   
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
           $baseMessage("SKU零配件图片删除成功!","success","hey")
       }
   })
   
 } catch (error) {
   console.error(error)
 }
}

const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
   
const handleTableDataValue = (value: any) => {
   qualityCheckList.value = value
       .map((item: any) => `${item.createTime.split(' ')[0]}: ${item.packagePrecautions}`)
       .join('\n');
}
const tableData = ref<any>([
  {
    componentName: '123',
    quantity: 33,
  },
  {
    componentName: '123',
    quantity: 33,
  },
    {
    componentName: '123',
    quantity: 33,
  },
])
const handleUpdateSku = async () => {
  //  await updateProductSku({
  //      skuId: sku.value.skuId,
  //      productName: sku.value.productName,
  //      productDesc: sku.value.productDesc,
  //      variantName: sku.value.variantName,
  //      defaultRepository: sku.value.defaultRepository,
  //      minQuantity: sku.value.minQuantity,
  //      numCartons: sku.value.numCartons,
  //      productManager: sku.value.productManager,
  //      productDesign: sku.value.productDesign,
  //  })
}
const handleRemarksChange = async () => {
  //  await updateProductSkuRemark({
  //      skuId: sku.value.skuId,
  //      remarks: sku.value.remarks
  //  })
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
   const { data } = await updatePoPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val})
   if (data === true) {
       attentionCopy.value = val
       clickRow.value.purchaseMatters = val
   }
}
const clickContractConfirm = async (val: any) => {
   const { data } = await updatePoContractTerms({ id: clickRow.value.id, contractTerms: val})
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



const addComponentVisible = ref<boolean>(false)



const consumableTypeOption = ref<any>()
//点击添加零件
const handleAddComponent = async () => { 
  createComponentVisible.value = true
}
//点击添加耗材
const handleAddConsumable = () => {
  createConsumableVisible.value = true
}


// const handleSubmitOtherSku = async () => {
//    addOtherSkuVisible.value = false
//    $baseConfirm('添加后不可逆，无法批量删除，是否继续？', '系统提示', async () => {
//        const { data } = await addProductComponentOtherSku({
//            skuIds: `${transferValue.value}`,
//            componentId: _compoenntId.value!
//        })
//        if(data === true) {
//            $baseMessage('添加到其他SKU成功', 'success', 'hey')
//        }
//    });
// }
interface Option2 {
  key: number
  label: string
  initial: number
}


/**
* 当点击时切换输入框，修改输入
*/
const clickRow = ref<any>()
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  
  if (!cell.children[0].children[0]
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList) {
    return
  }
  copyRow = JSON.parse(JSON.stringify(row))
  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    const { data } = await getPoPurchaseMatters({ id: row.id })
    attentionCopy.value = data
    row.purchaseMatters = data
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
    clickRow.value = row
    const { data } = await getPoContractTerms({ id: row.id })
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
// 修改po-sku零件信息
const updateSkuComponent = async (row: any) => {
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 零件table blur事件
const clickCancle = async (event:any,value:any) => {
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }
  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  if(JSON.stringify(value) === JSON.stringify(copyRow)) {
      return 
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    updateSkuComponent(value)
  }
}

// 获取供应商税点信息 不需要disabled?
const fetchSupplierRate = async (row: any) => {
  try {
    const { data: supplierTax } = await getSupplierRate({
      suppliserId: row.suppliserId
    })
    if (supplierTax) {
      const { suppliserId, actualZTaxRate, invoicingZTaxRate, actualPTaxRate, invoicingPTaxRate } = supplierTax
      if(row.invoicing === 0) {
        row.actualTaxRate = actualZTaxRate
        row.invoicingTaxRate = invoicingZTaxRate
      } else if(row.invoicing === 1) {
        row.actualTaxRate = actualPTaxRate
        row.invoicingTaxRate = invoicingPTaxRate
      } else {
        row.actualTaxRate = 0
        row.invoicingTaxRate = 0
      }
    }
  } catch (error) {
    console.error(error)
  }
}
// 修改默认供应商
const handleSupplierAndInvoicingChange = async (row: any) => {
  updateSkuComponent(row)
  fetchSupplierRate(row)
}
// // 修改开票类型
// const handleInvoicingChange = async (row: any) => {
//   updateSkuComponent(row)
//   fetchSupplierRate(row)
// }
// 修改默认采购方
const handleDefaultPurchase = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if(item!.type === 0) { //如果选择了为买单的采购方
    row.customsDeclarationStatus = 1 //自动勾选不报关
  } else if(row.purchaseId === 2) { //选择了埃托姆
    row.customsDeclarationStatus = 0
  } 
  updateSkuComponent(row)
}
// 处理不报关
const handleDeclareCustoms = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  if(item!.type === 0) { //如果选择了为买单的采购方
    if(row.customsDeclarationStatus === 0) {
      row.customsDeclarationStatus = 1
      $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
    }
  } else if(row.purchaseId === 2) { //选择了埃托姆
    if(row.customsDeclarationStatus === 1) {
      row.customsDeclarationStatus = 0
      $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
    } 
  } else {
    updateSkuComponent(row)
  }
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
* 上传图片
*/
const uploadImgForm = ref(new FormData()) as any;

async function uploadImage(params: any) {
  poDetailData.value.hide = true
   try {
       uploadImgForm.value = new FormData(); // 每次上传前重置 FormData
       uploadImgForm.value.append('file', params.file);
       uploadImgForm.value.append('skuId', poDetailData.value.skuId);

       const { data } = await uploadSkuImage(uploadImgForm.value)
       
       poDetailData.value.imageList = [{ url: data }]
   } catch (error) {
       console.error(error)
   }
}
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
// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}


const formattedPrice = (price: string) => {
   return parseFloat(price).toFixed(2)
}

// 获取采购方和收货仓库
const repositoryOption = ref<IRepositoryOption[]>([])
const purchaseOption = ref<IPurchaseOption[]>([])
const fetchPurchaseAndRepository = async () => {
  const { data: purchase } = await getProductComponentPurchase()
  purchaseOption.value = purchase
  const { data: repository } = await getProductComponentStore()
  repositoryOption.value = repository
}
// 获取PoSKU配件详情表
const fetchSkuComponent = async () => {
  try {
    const { data } = await getPoSkuComponentList({
      poSkuId: route.query.poSkuId
    })
    if (data) {
      skuComponentList.value = data
      skuComponentList.value.forEach((item: any) => {
        item.unitPrice = formattedPrice(item.unitPrice)
        if(!item.componentUrl) {
            item.hide = false
            item.imageList = []
        } else if (item.componentUrl){
            item.hide = true
            item.imageList = [{ url: item.componentUrl }]
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
// po详情数据
const fetchData = async () =>{
  try {
    const { data } = await getPoDetail({
      id: route.query.poSkuId
    })
    if (data) {
      poDetailData.value = data
      poDetailData.value.createTime = data.createTime.split(' ')[0]
    }
  } catch (error) {
    console.error(error)
  }
  if (!poDetailData.value.skuImgUrl) {
    poDetailData.value.hide = false
    poDetailData.value.imageList = []
  } else {
    poDetailData.value.hide = true
    poDetailData.value.imageList = [{ url: poDetailData.value.skuImgUrl }]
  }
}
onBeforeMount(()=>{
  handleInputDisabled()
  fetchData()
  fetchPurchaseAndRepository()
  fetchSkuComponent()
})
</script>

<style scoped>
/* :deep(.el-upload--picture-card) {
   --el-upload-picture-card-size: 89.164px;
} */
:deep(.el-form-item) {
   margin-right: 10px;
}
:deep(.el-card__body) {
   padding-bottom: 2px;
   padding-right: 0;
   padding-left: 0;
}
.product-details-card {
   border: 0;
}

:deep(.moldDialog .el-dialog__body) { 
 padding-top: 0;
}
.custom-checkbox {
 transform: scale(1.2); 
 transform-origin: center;
}
.none {
   display: none;
}
:deep(.component-upload .el-upload-list--picture-card .el-upload-list__item) {
 width: 75px;
 height: 75px;
 transition: none;
}
:deep(.component-upload .el-upload--picture-card) {
 width: 75px;
 height: 75px;
}
:deep(.el-table .el-table__body .cell) {
 max-height: 81.2px;
}
.overflow-text {
 max-height: 81.2px; /* 设置文本的最大高度 */
 overflow-y: auto; /* 溢出时显示垂直滚动条 */
 display: block;
}
.custom-upload {
   display: flex;
   justify-content: center;
   align-items: flex-start; 
}
.transfer-container {
   display: flex;
   justify-content: center; /* 水平居中 */
   align-items: center; /* 垂直居中，如果需要 */
}
/* :deep(.custom-upload .el-upload-list--picture-card .el-upload-list__item) {
   transition: none;  
}
:deep(.el-upload) {
  width: 100%;
  height: 150px;
} */
/* :deep(.el-upload) {
  position: relative;
  width: 100%; 
  padding-top: 100%; 
}

:deep(.el-upload .el-upload-list--picture-card) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
:deep(.el-upload .el-icon) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
} */
/*图片上传框对齐*/
.upload-align {
  margin-top: 30px;
  width: 100%;
}
:deep(.upload-align .el-upload-list--picture-card) {
  width: 100%;
}

.hide :deep(.el-upload--picture-card) {
 display: none
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
 background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
 background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.text-center {
  line-height: 1; 
  text-align: center;
  margin: 0 10px calc(var(--el-margin) / 2) 0 !important;
}
.button-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>