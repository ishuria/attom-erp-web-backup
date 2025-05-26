<template>
  <div class="container">
    <div class="table-container">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleCreateComponent">新增</el-button>
          <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
          <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
          <el-button type="primary" @click="repositoryAddVisible = true">新增收货仓库</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>

      <el-table
        ref="tableRef"
        border
        :cell-class-name="clearPadding" class="noneHoverTable"
        :data="componentList"
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
        @cell-click="changeInput"
      >
        <el-table-column fixed="left" label="属于变体" min-width="140">
          <template #default="{ row }">
            <el-select v-model="row.orderEntryId" placeholder="请选择变体" style="min-width: 100%;" @change="handleVariantChange(row)">
              <el-option v-for="item in variantsSelectList" :key="item.id" :label="item.label" :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column fixed="left" label="零件图片" width="76">
          <template #header>
            零件<br />图片
          </template>
          <template #default="{ row }">
            <div class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="row.componentImgUrl" class="image-preview">
                <img alt="" :src="row.componentImgUrl" />
                <div class="image-actions">
                  <el-icon @click="handlePictureCardPreview(row.componentImgUrl)"><zoom-in /></el-icon>
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
        <el-table-column align="center" label="零件ID" prop="existingPartsListId" width="90"/>

        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(componentList, '零件名', 'componentName')">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.componentName" autofocus :autosize="{ minRows: 2, maxRows: 7 }" type="textarea"
                @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)"
              />
            </div>
            <span>{{ row.componentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="零件明细" prop="componentSuitDetail" width="100">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.componentSuitDetail) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="每个SKU需要数量" prop="quantity" width="100">
          <template #header>
            每个SKU<br>需要数量
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.quantity" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="单位" min-width="70" prop="componentUnit">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.componentUnit" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.componentUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出厂单价" prop="unitPrice" :width="flexColumnWidth(componentList, '出厂', 'unitPrice', 35)">
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
        <el-table-column align="center" label="出厂总价" prop="totalPrice" :width="flexColumnWidth(componentList, '出厂', 'totalPrice')">
          <template #header>
            出厂<br>总价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.totalPrice" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="每个SKU运费(含税)" min-width="100" prop="freight">
          <template #header>
            每个SKU<br>运费(含税)
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.freight" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.freight }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总未税价" prop="preTaxPrice" :width="flexColumnWidth(componentList, '总未', 'preTaxPrice')">
          <template #header>
            总未<br>税价
          </template>
          <template #default="{ row }">
            <span>{{ row.preTaxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总含税价" prop="taxIncludedPrice" :width="flexColumnWidth(componentList, '总含', 'taxIncludedPrice')">
          <template #header>
            总含<br>税价
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.taxIncludedPrice" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.taxIncludedPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货币" prop="currency" width="110px">
          <template #default="{ row }">
            <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleCurrencyChange(row)">
              <el-option v-for="dict in currencyList" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="起订量" min-width="80" prop="minimumOrderQuantity">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.minimumOrderQuantity" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.minimumOrderQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="整箱数" min-width="80" prop="numberFullCartons">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.numberFullCartons" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.numberFullCartons }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="供应商" min-width="140" prop="supplier">
          <template #default="{row}">
            <div class="none">
              <el-input v-model="row.supplier" autofocus @blur="clickSupplierCancel($event, row)" @keyup.enter="clickSupplierCancel($event, row)" />
            </div>
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.supplier) }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.supplier) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票" prop="oem" width="140">
          <template #default = "{ row }">
            <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingChange(row)">
              <el-option v-for="dict in invoicingList" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="实际税点" min-width="60" prop="actualTaxRate">
          <template #header>
            实际<br>税点
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.actualTaxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.actualTaxRate ? row.actualTaxRate + '%' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="开票税点" min-width="60" prop="invoicingTaxRate">
          <template #header>
            开票<br>税点
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.invoicingTaxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.invoicingTaxRate ? row.invoicingTaxRate + '%' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column  label="采购链接" min-width="140" prop="purchaseLink">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.purchaseLink" type="text" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseLink) }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.purchaseLink) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  label="收货仓库" min-width="140" prop="defaultRepositoryId">
          <template #default="{ row }">
            <el-select v-model="row.defaultRepositoryId" filterable placeholder="输入和搜索默认收货仓库" style="min-width: 100%;" @change="handleCurrencyChange(row)">
              <el-option
                v-for="item in repositoryOption"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="零件采购注意事项" min-width="200" prop="purchaseMatters">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.purchaseMatters) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="合同条款" min-width="200" prop="contractTerms">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.contractTerms) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="130">
          <template #default="{ row }">
            <el-space :size="20">
              <el-link type="primary" :underline="false" @click="handleComponentCopy(row)">复制</el-link>
              <el-link type="danger" :underline="false" @click="handleComponentDel(row)">删除</el-link>
            </el-space>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
        </template>
      </el-table>

      <vab-alert type="error">
        <h3>--为了精准核算利润，运费需要准确填写。</h3>
      </vab-alert>
      <wang-editor
        :classify="classify"
        :content="editorContent"
        :title="wangEditorTitle"
        :wang-editor-visible="wangEditorVisible"
        @click-boolean="clickEditorCancel"
        @click-child="clickEditorConfirm"
      />

      <!-- 添加零件 -->
      <vab-add-component
        :create-component-visible="createComponentVisible"
        @update:create-component-visible="handleCloseCreateComponent"
        @update:table-value="handleSubmitComponent"
      />
      <!-- 添加耗材 -->
      <vab-add-consumable
        :create-consumable-visible="createConsumableVisible"
        @update:create-consumable-visible="handleCloseCreateConsumable"
        @update:table-value="handleSubmitConsumable"
      />
      <!-- 新增收货仓库 -->
      <vab-add-repository v-model="repositoryAddVisible" @submit="handleWarehouseSubmit" />
    </div>
    <div class="table-container">
      <el-table
        ref="tableRef"
        border :cell-style="cellStyle"
        :data="variantsList"
        :header-cell-style="{ 'text-align': 'center' }" stripe
        @cell-click="changeInput"
      >
        <el-table-column label="变体" prop="variant" :width="flexColumnWidth(variantsList, '变体', 'variant')"/>
        <el-table-column label="站点" prop="site" width="185">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%;" @change="handlerSiteChange(row)">
              <el-option v-for="dict in siteList" :key="dict.id" :label="dict.label" :value="dict.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="外汇币种" min-width="100" prop="currencyType"/>
        <el-table-column label="汇率" min-width="100" prop="foreignExchange"/>
        <el-table-column label="实际总成本￥" min-width="125" prop="actualTotalCost">
          <template #default="{ row }">
            {{ row.actualTotalCost!= null ? '￥' + row.actualTotalCost : '' }}
          </template>
        </el-table-column>
        <el-table-column label="长(cm)" min-width="90" prop="packagingLength">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packagingLength" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.packagingLength != null ? row.packagingLength : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="宽(cm)" min-width="90" prop="packagingWidth">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packagingWidth" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.packagingWidth != null ? row.packagingWidth : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="高(cm)" min-width="90" prop="packagingHeight">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packagingHeight" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.packagingHeight != null ? row.packagingHeight : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="重量(g)" prop="weight">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weight" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.weight != null ? row.weight : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="尾程" min-width="70" prop="lastMile" >
          <template #default="{ row }">
            {{ row.lastMile != null ? row.symbol + row.lastMile : '' }}
          </template>
        </el-table-column>
        <el-table-column label="头程￥" prop="firstMile" width="90" >
          <template #default="{ row }">
            {{ row.firstMile != null ? '￥' + row.firstMile : '' }}
          </template>
        </el-table-column>
        <el-table-column label="打包￥" prop="packagingPrice" width="90" >
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packagingPrice" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.packagingPrice != null ? '￥' + row.packagingPrice : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头程渠道" min-width="140" prop="firstMileChannel">
          <template #default="{ row }">
            <el-select
              v-model="row.firstMileChannel"
              placeholder="请选择头程渠道"
              style="min-width: 100%"
              @change="handlerEstimatendChange(row)"
            >
              <el-option v-for="dict in channelList" :key="dict.id" :label="dict.label" :value="dict.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="最终售价" min-width="100" prop="finalSellingPrice">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.finalSellingPrice" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.finalSellingPrice != null ? row.symbol + row.finalSellingPrice : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="毛利率" prop="grossMarginRate">
          <template #default="{ row }">
            <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate < 20" type="danger">{{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="ROI" prop="roi">
          <template #default="{ row }">
            {{ row.roi != null ? row.roi + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="重量系数" min-width="100" prop="weightCoefficient">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weightCoefficient" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.weightCoefficient }}</span>
          </template>
        </el-table-column>
        <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.volumeCoefficient" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.volumeCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column label="HTS" min-width="150" prop="volumeCoefficient">
          <template #default="{ row }">
            <el-select
              v-model="row.hts"
              clearable
              default-first-option
              filterable
              :loading="htsLoading"
              placeholder="点击输入和搜索HTS"
              remote
              :remote-method="(query: string) => remoteHTSMethod(query, row)"
              style="min-width: 100%"
              @change="handleUpdateHts(row)"
              @clear="handleClearHts(row)"
            >
              <el-option
                v-for="item in htsOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="关税%" prop="tariff">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.tariff" @blur="clickVariantsCancel($event, row)" @keyup.enter="clickVariantsCancel($event, row)" />
            </div>
            <span>{{ row.tariff != null ? row.tariff + '%' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台佣金" min-width="100" prop="platformCommission">
          <template #default="{ row }">
            {{ row.platformCommission != null ? row.symbol + row.platformCommission.toFixed(2) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="仓储费2个月" min-width="140" prop="storageFee">
          <template #default="{ row }">
            {{ row.storageFee != null ? row.symbol + row.storageFee.toFixed(2) : '' }}
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleCalculate(row)">逆算</el-link>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
        </template>
      </el-table>
      <vab-alert type="error">
        <h3>--请输入精确的产品包装尺寸（精确到小数点后1位），重量（精确到整数）和最终售价。</h3>
        <h3>--HTS请向头程管理专员咨询</h3>
      </vab-alert>
    </div>
    <div class="pay-button-group">
      <el-button @click="handleGoback">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">保存并继续</el-button>
    </div>
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { currencyList, invoicingList } from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { getChannelList } from '/@/api/devlocal/encasement'
import { getSalesSiteList } from '/@/api/devlocal/evaluation'
import {
  getReviewVariantHts,
  reverseCalculateReview,
  reviewStepNo3ComponentAdd,
  reviewStepNo3ComponentCopy,
  reviewStepNo3ComponentDel,
  reviewStepNo3ComponentImtDel,
  reviewStepNo3ComponentList,
  reviewStepNo3ComponentSuitDetail,
  reviewStepNo3ComponentUpdate,
  reviewStepNo3ComponentUpload,
  reviewStepNo3ContractTerms,
  reviewStepNo3GetSelectVariantList,
  reviewStepNo3PurchaseMatters,
  reviewStepNo3SaveTh,
  reviewStepNo3UpdateContractTerms,
  reviewStepNo3UpdatePurchaseMatters,
  reviewStepNo3VariantList,
  reviewStepNo3VariantUpdate,
  submitReviewComponent,
  submitReviewConsumable,
  updateReviewStepNo3ComponentSuitDetail
} from '/@/api/devlocal/orderProcess'
import { getProductComponentStore } from '/@/api/devlocal/productInformation'
import { addPurchaseRepository } from '/@/api/devlocal/purchase'
import type { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList } from '/@/type/orderProcess/orderProcessType'
import type { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { _setStepNo } from '/@/utils/stepNoState'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
defineOptions({
  name: 'OrderStep3',
})

const repositoryAddVisible = ref<boolean>(false)
const route: any = useRoute()
const props = defineProps<{ step1Data: number }>()

const emit = defineEmits<{
  (e: 'change-step', value: number): void
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
 }>()

const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否

const htsLoading = ref(false) //搜索SKU-loading
const htsOptions = ref<any[]>([]) //搜索选项
const htsList = ref<any[]>([]) //搜索列表

const remoteHTSMethod = async (query: string, row: any) => {
  query = query.trim()
  if (query) {
    const { data } = await getReviewVariantHts({
      hts: query,
      siteCode: row.site
    })

    htsList.value = data.map((item: any) => {
      return { value: item.id, label: `${item.label}` }
    })
    htsLoading.value = true
    setTimeout(() => {
      htsLoading.value = false
      htsOptions.value = htsList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    htsOptions.value = []
  }
}
const imageUploadVisible = ref<boolean>(false) // 图片上传弹窗显示与否
let copyImgRow: any = null // 复制的行
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyImgRow = row
}
const isValueAllInput = (row: IreviewStepNo3VariantList) => {
  if (row.site == null) {
    $baseMessage('站点不能为空，请选择后再进行逆算', 'warning')
    return false
  } else if (row.packagingLength == null) {
    $baseMessage('产品的长度(cm)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.packagingWidth== null) {
    $baseMessage('产品的宽度(cm)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.packagingHeight == null) {
    $baseMessage('产品的高度(cm)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.weight == null) {
    $baseMessage('产品的重量(g)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.packagingPrice == null) {
    $baseMessage('产品的打包价格不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.firstMileChannel == null) {
    $baseMessage('产品的头程渠道不能为空，请选择后再进行逆算', 'warning')
    return false
  } else if (row.weightCoefficient == null) {
    $baseMessage('产品的重量系数不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.volumeCoefficient == null) {
    $baseMessage('产品的体积系数不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.tariff == null) {
    $baseMessage('产品的关税不能为空，请填写后再进行逆算', 'warning')
    return false
  }
  return true
}
// 收货仓库提交新增
const handleWarehouseSubmit = async (formData: any) => {
  const { data } = await addPurchaseRepository(formData)
  if (data) {
    $baseMessage('新增成功', 'success', 'hey')
    await fetchRepository()
  } else {
    $baseMessage('新增失败', 'error', 'hey')
  }
}
const handleCalculate = async (row: IreviewStepNo3VariantList) => {
  const isInputAll = isValueAllInput(row)
  if (isInputAll) {
    const { data } = await reverseCalculateReview({ id: row.orderEntryId })
    if (data) {
      $baseMessage('逆算成功!', 'success')
      await fetchVariantsData()
    }
  }
}
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
// 提交添加零件传递的值
const handleSubmitComponent = async (value: any) => {

  let list: ISubmitPurchaseComponent[] = []
  const supplierList = componentList.value.map((item: any) => {
    return item.supplier
  })
  const hasConflict = value.some((item: any) => {
    if (item.suppliser && supplierList.includes(item.suppliser)) {
      $baseMessage('非耗材类零件的供应商不能重复，如果一个供应商有多个零件，将零件填写到零件明细里！', 'warning')
      return true
    }
    return false
  })
  if (hasConflict) {
    createComponentVisible.value = true
    return
  }
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        sku: item.sku,
        suppliserId: Number(item.suppliserId),
        count: Number(item.count)
      })
    }
 })
 let classReviewId: number | undefined = route.query.progressId ? props.step1Data : route.query.reviewId;
 try {
   const { data } = await submitReviewComponent({
    reviewId: classReviewId!,
     list
   })
   if (data === true) {
     $baseMessage('添加零件提交成功', 'success', 'hey')
     await fetchDataComponent()
     await fetchVariantsData()
   }
 } catch (error) {
   console.error(error)
 }
}
// 提交添加耗材传递的值
const handleSubmitConsumable = async (value: any) => {
  let list: ISubmitPurchaseConsumable[] = []
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),
        suppliserId: Number(item.suppliserId),
        count: Number(item.count)
      })
   }
 })
 let classReviewId: number | undefined = route.query.progressId ? props.step1Data : route.query.reviewId;
 try {
   const { data } = await submitReviewConsumable({
    reviewId: classReviewId!,
    list
   })
   if (data === true) {
     $baseMessage('添加耗材提交成功', 'success', 'hey')
     await fetchDataComponent()
     await fetchVariantsData()
   }
 } catch (error) {
   console.error(error)
 }
}
// 展示添加零件对话框
const handleAddComponent = () => {
  createComponentVisible.value = true
}
// 展示添加耗材对话框
const handleAddConsumable = () => {
  createConsumableVisible.value = true
}
// const listLoading = ref<boolean>(true)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])
// 变体列表
const variantsList = ref<IreviewStepNo3VariantList[]>([])
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
const wangEditorVisible = ref<boolean>(false)
// const attentionCopy = ref<string>('')
// const contractCopy = ref<string>('')
const editorContent = ref<string>('')

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickEditorConfirm = async (val: any) => {
  switch (classify.value) {
    case 'purchaseMatters': {
      const { data } = await reviewStepNo3UpdatePurchaseMatters({ reviewComponentId: clickRow.value.reviewComponentId, purchaseMatters: val})
      if (data === true) {
        editorContent.value = val
        clickRow.value.purchaseMatters = val
      }

      break;
    }
    case 'contractTerms': {
      const { data } = await reviewStepNo3UpdateContractTerms({ reviewComponentId: clickRow.value.reviewComponentId, contractTerms: val})
      if (data === true) {
        editorContent.value = val
        clickRow.value.contractTerms = val
      }

      break;
    }
    case 'componentSuitDetail': {
      const { data } = await updateReviewStepNo3ComponentSuitDetail({ reviewComponentId: clickRow.value.reviewComponentId, componentSuitDetail: val})
      if (data === true) {
        editorContent.value = val
        clickRow.value.componentSuitDetail = val
      }

      break;
    }
  // No default
  }
}

const clickEditorCancel = (val: any) => {
  wangEditorVisible.value = val
}
const handleUpdateHts = async (row: IreviewStepNo3VariantList) => {
  // console.log(row)
  let htsId = null
  if (row.hts.value) htsId = row.hts.value
  if (row.hts.id) htsId = row.hts.id
  await reviewStepNo3VariantUpdate({
    currencyType: row.currencyType,
    finalSellingPrice: row.finalSellingPrice!,
    firstMileChannel: row.firstMileChannel,
    foreignExchange: row.foreignExchange,
    orderEntryId: row.orderEntryId,
    packagingHeight: row.packagingHeight!,
    packagingLength: row.packagingLength!,
    packagingPrice: row.packagingPrice!,
    packagingWidth: row.packagingWidth!,
    site: row.site,
    tariff: row.tariff! / 100,
    volumeCoefficient: row.volumeCoefficient!,
    weight: row.weight!,
    weightCoefficient: row.weightCoefficient!,
    actualTotalCost: row.actualTotalCost!,
    htsId,
   
  })
  fetchVariantsData()
}
const handleClearHts = async (row: IreviewStepNo3VariantList) => {
  // console.log(row)
 
  await reviewStepNo3VariantUpdate({
    currencyType: row.currencyType,
    finalSellingPrice: row.finalSellingPrice!,
    firstMileChannel: row.firstMileChannel,
    foreignExchange: row.foreignExchange,
    orderEntryId: row.orderEntryId,
    packagingHeight: row.packagingHeight!,
    packagingLength: row.packagingLength!,
    packagingPrice: row.packagingPrice!,
    packagingWidth: row.packagingWidth!,
    site: row.site,
    tariff: row.tariff! / 100,
    volumeCoefficient: row.volumeCoefficient!,
    weight: row.weight!,
    weightCoefficient: row.weightCoefficient!,
    actualTotalCost: row.actualTotalCost!,
    htsId: null,
  })
  await fetchVariantsData()
}
// 零件信息完善与售价核对修改站点
const handlerSiteChange = async (row: IreviewStepNo3VariantList) =>{
  // 外币币种
  let htsId = null
  if (row.hts.value) htsId = row.hts.value
  if (row.hts.id) htsId = row.hts.id
  await reviewStepNo3VariantUpdate({
    currencyType: row.currencyType,
    finalSellingPrice: row.finalSellingPrice!,
    firstMileChannel: row.firstMileChannel,
    foreignExchange: row.foreignExchange,
    orderEntryId: row.orderEntryId,
    packagingHeight: row.packagingHeight!,
    packagingLength: row.packagingLength!,
    packagingPrice: row.packagingPrice!,
    packagingWidth: row.packagingWidth!,
    site: row.site,
    tariff: row.tariff! / 100,
    volumeCoefficient: row.volumeCoefficient!,
    weight: row.weight!,
    weightCoefficient: row.weightCoefficient!,
    actualTotalCost: row.actualTotalCost!,
    htsId,
  })
  await fetchVariantsData()
}
const handleVariantChange = async (row: any) => {
    let _variant: any = {}
    variantsSelectList.value.forEach((item: any) => {
        if(item.id == row.orderEntryId) {
            _variant.variant = item.label
        }
    })
  // console.log(_variant);
  const actualTaxRate = (row.actualTaxRate ?? 0) / 100
const invoicingTaxRate = (row.invoicingTaxRate ?? 0) / 100
    await reviewStepNo3ComponentUpdate({
        ...row,
      variant: _variant.variant,
      actualTaxRate,
      invoicingTaxRate,
    })

    await fetchDataComponent()
    await fetchVariantsData()
}
const handleCurrencyChange = async (row: any) => {
  const actualTaxRate = (row.actualTaxRate ?? 0) / 100
const invoicingTaxRate = (row.invoicingTaxRate ?? 0) / 100
    await reviewStepNo3ComponentUpdate({
        ...row,
      currency: parseInt(row.currency),
      actualTaxRate,
      invoicingTaxRate,
    })
    await fetchDataComponent()
    await fetchVariantsData()
}
const handleInvoicingChange = async (row: any) => {
  const actualTaxRate = (row.actualTaxRate ?? 0) / 100
const invoicingTaxRate = (row.invoicingTaxRate ?? 0) / 100
    await reviewStepNo3ComponentUpdate({
        ...row,
      invoicing: parseInt(row.invoicing),
      actualTaxRate,
      invoicingTaxRate,
    })
    await fetchDataComponent()
    await fetchVariantsData()
}
// 头程渠道修改
const handlerEstimatendChange = async (row: IreviewStepNo3VariantList) => {
  let htsId = null
  if (row.hts.value) htsId = row.hts.value
  if (row.hts.id) htsId = row.hts.id
  await reviewStepNo3VariantUpdate({
    currencyType: row.currencyType,
    finalSellingPrice: row.finalSellingPrice!,
    firstMileChannel: row.firstMileChannel,
    foreignExchange: row.foreignExchange,
    orderEntryId: row.orderEntryId,
    packagingHeight: row.packagingHeight!,
    packagingLength: row.packagingLength!,
    packagingPrice: row.packagingPrice!,
    packagingWidth: row.packagingWidth!,
    site: row.site,
    tariff: row.tariff! / 100,
    volumeCoefficient: row.volumeCoefficient!,
    weight: row.weight!,
    weightCoefficient: row.weightCoefficient!,
    actualTotalCost: row.actualTotalCost!,
    htsId,
  })
  await fetchVariantsData()
}

/**
 * 上传图片
 */
async function uploadImage(file: File) {
  try {
    let imageForm = new FormData()
    imageForm.append('file', file);
    imageForm.append('reviewComponentId', copyImgRow.reviewComponentId as any);

    const { data } = await reviewStepNo3ComponentUpload(imageForm)
    if (data) {
      copyImgRow.componentImgUrl = data
      $baseMessage('图片上传成功!','success', 'hey');
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败!','error', 'hey');
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 图片预览事件
 */
const handlePictureCardPreview = (url: string) => {
  emit("update:previewListValue", url)
  emit("update:imagePreviewVisible", true)
}
/**
 * 图片删除功能
 */
const handleRemove = async (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await reviewStepNo3ComponentImtDel({ reviewComponentId: row.reviewComponentId})
      if (data === true) {
        row.componentImgUrl = ''
        $baseMessage("此零件图片信息删除成功!", "success", "hey");
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 新增逻辑
const handleCreateComponent = async () => {
  const newComponent: any = {
    actualTaxRate: '',
    componentImgUrl: '',
    componentName: '',
    componentUnit: '',
    contractTerms: '',
    currency: null,
    freight: '',
    invoicing: null,
    invoicingTaxRate: '',
    minimumOrderQuantity: null,
    numberFullCartons: null,
    orderEntryId: 0,
    preTaxPrice: '',
    purchaseLink: '',
    purchaseMatters: '',
    quantity: null,
    reviewComponentId: null,
    reviewId: null,
    supplier: '',
    taxIncludedPrice: '',
    totalPrice: '',
    unitPrice: '',
    variant: '',
  }
  let classReviewId: number | undefined
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }
  const { data } = await reviewStepNo3ComponentAdd({ reviewId: classReviewId!})
  newComponent.reviewComponentId = data
  componentList.value.push(newComponent)
  fetchDataComponent()
  fetchVariantsData()
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
        fetchDataComponent()
        fetchVariantsData()
      }
    })
  } catch(error){
    console.log(error as Error)
  }
}
// 复制逻辑
const copyRow = ref<any>(null)
const handleComponentCopy = (row: IreviewStepNo3ComponentList) => {
  $baseConfirm('是否要复制本条零件信息？', '复制', async () => {
    const { data } = await reviewStepNo3ComponentCopy({ reviewComponentId: row.reviewComponentId! })
    if (data === true) {
      copyRow.value = JSON.parse(JSON.stringify(row))
      const index = componentList.value.indexOf(row)
      componentList.value.splice(index + 1, 0, copyRow.value)
      $baseMessage(`复制成功！`, "success", "hey")
      fetchDataComponent()
      fetchVariantsData()
    }
  })
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()

let _row: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {

  const { property } = column;
  switch (property) {
    case 'purchaseMatters': {
      // 查询零件采购注意事项
      clickRow.value = row;
      const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId });
      editorContent.value = data;
      row.purchaseMatters = data;
      wangEditorTitle.value = '零件采购注意事项';
      classify.value = 'purchaseMatters';
      wangEditorVisible.value = true

      break;
    }
    case 'contractTerms': {
      clickRow.value = row;
      const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId });
      editorContent.value = data;
      row.contractTerms = data;
      wangEditorTitle.value = '合同条款';
      classify.value = 'contractTerms';
      wangEditorVisible.value = true

      break;
    }
    case 'componentSuitDetail': {
      clickRow.value = row;
      const { data } = await reviewStepNo3ComponentSuitDetail({ reviewComponentId: row.reviewComponentId });
      editorContent.value = data;
      row.componentSuitDetail = data;
      wangEditorTitle.value = '零件明细';
      classify.value = 'componentSuitDetail';
      wangEditorVisible.value = true

      break;
    }
  // No default
  }
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  _row = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
// 修改供应商判断
const clickSupplierCancel = async (event:any,value:any) =>{
  // 判断新输入的供应商是否和其余的一样
  componentList.value.forEach((item: any) => {
    if (item.reviewComponentId !== value.reviewComponentId && item.supplier === value.supplier) {
      value.supplier = ''
      $baseMessage('非耗材类零件的供应商不能重复，如果一个供应商有多个零件，将零件填写到零件明细里！','error', 'hey')
      return
    }
  })

  // 获取根元素，避免重复调用 getRootElement
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }
  if (event.type === 'blur') {
    try {
      const actualTaxRate = (value.actualTaxRate ?? 0) / 100
      const invoicingTaxRate = (value.invoicingTaxRate ?? 0) / 100
      await reviewStepNo3ComponentUpdate({ ...value, actualTaxRate, invoicingTaxRate})
      await fetchDataComponent()
      await fetchVariantsData()
    } catch {
      Object.assign(value, _row)
    }
  }
}
// 零件table blur事件
const clickCancel = async (event:any,value:any) =>{

  // 获取根元素，避免重复调用 getRootElement
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }
  if (event.type === 'blur') {
    try {
      const actualTaxRate = (value.actualTaxRate ?? 0) / 100
const invoicingTaxRate = (value.invoicingTaxRate ?? 0) / 100
      await reviewStepNo3ComponentUpdate({ ...value, actualTaxRate, invoicingTaxRate})
      await fetchDataComponent()
      await fetchVariantsData()
    } catch {
      Object.assign(value, _row)
    }
  }
}
// 变体table blur事件
const clickVariantsCancel = async (event:any, value:any) => {
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      let htsId = null
      if (value.hts.value) htsId = value.hts.value
      if (value.hts.id) htsId = value.hts.id
      await reviewStepNo3VariantUpdate({ ...value, tariff: value.tariff / 100, grossMarginRate: value.grossMarginRate / 100, roi: value.roi / 100, htsId, })
      await fetchVariantsData()
    } catch {
      Object.assign(value, _row)
    }
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
    $baseMessage("当前信息已保存。", "success", "hey")
    _setStepNo(Number(classReviewId), 2)
  }
}

// 当点击保存并继续的时候
// 校验每个组件项的函数
const validateComponent = (item: any) => {
  if (item.componentImgUrl.length === 0) {
    $baseMessage('请先上传零件图片！', 'warning', 'hey');
    return false;
  } else if (!item.componentName) {
    $baseMessage('请先填写零件名！', 'warning', 'hey');
    return false;
  } else if (!item.quantity) {
    $baseMessage('请先填写每个SKU需要的数量！', 'warning', 'hey');
    return false;
  } else if (!item.componentUnit) {
    $baseMessage('请先填写单位！', 'warning', 'hey');
    return false;
  } else if (!item.unitPrice) {
    $baseMessage('请先填写出厂单价！', 'warning', 'hey');
    return false;
  } else if (!item.totalPrice) {
    $baseMessage('请先填写出场总价！', 'warning', 'hey');
    return false;
  } else if (!item.freight) {
    $baseMessage('请先填写运费含税！', 'warning', 'hey');
    return false;
  } else if (!item.taxIncludedPrice) {
    $baseMessage('请先填写总含税价！', 'warning', 'hey');
    return false;
  } else if (!item.supplier) {
    $baseMessage('请先填写供应商！', 'warning', 'hey');
    return false;
  } else if (!item.actualTaxRate) {
    $baseMessage('请先填写实际税点！', 'warning', 'hey');
    return false;
  } else if (!item.invoicingTaxRate) {
    $baseMessage('请先填写开票税点！', 'warning', 'hey');
    return false;
  } else if (item.invoicing !== '0' && !item.purchaseLink) { //采购链接 必填的校验仅针对选择了普票和无法开票的
    $baseMessage('请填写所有无法开票和普票零件的采购链接！', 'warning', 'hey');
    return false;
  } else if (item.defaultRepositoryId === null) {
    $baseMessage('请选择收货仓库', 'warning')
    return false
  }
  return true; // 所有校验通过
};
const validateVariants = (item: any) => {
  if (!item.packagingLength) {
      $baseMessage('请先填写变体的长（cm）', 'warning', 'hey');
      return false;
  } else if (!item.packagingWidth) {
      $baseMessage('请先填写变体的宽（cm）', 'warning', 'hey');
      return false;
  } else if (!item.packagingHeight) {
      $baseMessage('请先填写变体的高（cm）', 'warning', 'hey');
      return false;
  } else if (!item.weight) {
      $baseMessage('请先填写重量', 'warning', 'hey');
      return false;
  } else if (!item.packagingPrice) {
      $baseMessage('请先填写打包价格', 'warning', 'hey');
      return false;
  } else if (!item.finalSellingPrice) {
      $baseMessage('请先填写最终售价', 'warning', 'hey');
      return false;
  } else if (!item.weightCoefficient) {
      $baseMessage('请先填写重量系数', 'warning', 'hey');
      return false;
  } else if (!item.volumeCoefficient) {
      $baseMessage('请先填写体积系数', 'warning', 'hey');
      return false;
  } else if (!item.tariff) {
      $baseMessage('请先填写关税', 'warning', 'hey');
      return false;
  } else if (!item.hts.label) {
      $baseMessage('请先选择HTS', 'warning', 'hey');
      return false;
  }
  return true; // 所有校验通过
};
const validateSame = () => {
  const grouped = componentList.value.reduce((acc: any, row: any) => {
    const key = `${row.supplier}-${row.invoicing}`
    acc[key] = (acc[key] || []).concat({
      actualTaxRate: row.actualTaxRate,
      invoicingTaxRate: row.invoicingTaxRate
    })
    return acc
  }, {})

  for(const key in grouped) {
    if(grouped[key].length > 1) {
      const firstRow = grouped[key][0]
      const valid = grouped[key].every((item: any) => item.actualTaxRate === firstRow.actualTaxRate && item.invoicingTaxRate === firstRow.invoicingTaxRate )
      if(valid) {
        return true
      }
      return false
    }
  }
  return true
}
// 当点击保存并继续的时候
const handleSaveAndContinue = async () => {
  let classReviewId: number | undefined = route.query.progressId ? props.step1Data : route.query.reviewId;

  const allValid = componentList.value.every((item) => validateComponent(item));
  const allVariantsValid = variantsList.value.every((item) => validateVariants(item))

  if (allValid && allVariantsValid) {
    if(validateSame()) {
      const { data } = await reviewStepNo3SaveTh({ reviewId: classReviewId! });
      if (data === true) {
        $baseMessage("当前信息已保存。", "success", "hey");
        emit('change-step', 3);
        _setStepNo(Number(classReviewId), 2)
      }
    } else {
      $baseMessage('同一供应商的同一开票类型的实际税点和开票税点必须是一样的', 'error', 'hey')
    }
  }
}

// 当点击上一步的时候
const handleGoback = () => {
  emit('change-step', 1)
}

// 获取拿样零件添加数据
const fetchDataComponent = async () =>{

  if (route.query.progressId || (route.query.reviewStatus === '0' || route.query.reviewStatus === '2')) {
    try {
      // 拿样零件添加列表
      let classReviewId: number | undefined
      if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
        classReviewId = props.step1Data
      } else {
        classReviewId = route.query.reviewId
      }
      const { data } = await reviewStepNo3ComponentList({ reviewId: classReviewId! })
      componentList.value = data
      componentList.value.forEach((item: any) => {
        item.currency = convertString(item.currency)
        item.invoicing = convertString(item.invoicing)
        item.actualTaxRate = item.actualTaxRate * 100
        item.invoicingTaxRate = item.invoicingTaxRate * 100
      })
      // 获取下拉变体列表
      const { data: variantSelectList }= await reviewStepNo3GetSelectVariantList({ reviewId: classReviewId! });
      variantsSelectList.value = variantSelectList
      variantsSelectList.value.unshift({ label: '变体共用', id: 0 })
    }catch(error){
      console.error(error as Error)
    }
  }
}
// 获取变体列表
const fetchVariantsData = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }
  try {
    if (route.query.progressId || (route.query.reviewStatus === '0' || route.query.reviewStatus === '2')) {
      const { data } = await reviewStepNo3VariantList({ reviewId: classReviewId! })
      variantsList.value = data
    }
  } catch (error) {
    console.error(error)
  }
}
const repositoryOption = ref<any>()
const channelList = ref<{ id: number, label: string }[]>([])
const siteList = ref<{ id: number, label: string }[]>([])
const fetchChannelData = async () => {
  const { data } = await getChannelList()
  channelList.value = data
}
const fetchSalesSiteList = async () => {
  const { data } = await getSalesSiteList()
  siteList.value = data
}
const fetchRepository = async () => { //获取收货仓库
    const { data: repository } = await getProductComponentStore()
    repositoryOption.value = repository
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['长(cm)', '宽(cm)', '高(cm)', '重量(g)', '打包￥', '最终售价', '重量系数', '体积系数', '关税%'].includes(label)) { 
    return {
      textAlign: 'center',
      cursor: 'pointer'
    }
  }
  return {
    cursor: 'not-allowed',
    textAlign: 'center',
  }
}
onMounted(()=>{
  fetchDataComponent()
  fetchVariantsData()
  fetchRepository()
  fetchChannelData()
  fetchSalesSiteList()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}

.container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
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
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding  .cell) {
  padding-right: 0;
  padding-left: 0;
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
</style>
