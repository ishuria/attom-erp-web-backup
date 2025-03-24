<template>
  <div class="container">
    <div class="table-container">
      <el-table 
        ref="tableRef" 
        border :cell-class-name="clearPadding" 
        class="noneHoverTable"
        :data="componentList"
        :header-cell-style="{ 'text-align': 'center' }" 
        stripe
        @cell-click="changeInput"
      >
        <el-table-column align="center" fixed="left" label="属于变体" min-width="140" prop="variant">
          <template #default="{ row }">
            <el-select v-model="row.variant" disabled  placeholder="请选择变体" style="min-width: 100%;">
              <el-option
                v-for="item in variantsSelectList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="left" label="零件图片" width="75">
          <template #header>
            零件<br />图片
          </template>
          <template #default="{ row }">
            <el-image :src="row.componentImgUrl" style="display: block; width: 75px; height: 75px" @click="showPreviewImage(row.componentImgUrl)">
              <template #error><el-icon /></template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="零件ID" min-width="70" prop="" width="100"/>   
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(componentList, '零件名', 'componentName')"/>
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
        </el-table-column>
        <el-table-column align="center"  label="单位" min-width="70" prop="componentUnit"/>
        <el-table-column align="center" label="出厂单价" prop="unitPrice" :width="flexColumnWidth(componentList, '出厂', 'unitPrice')">
          <template #header>
            出厂<br>单价
          </template>
        </el-table-column>

        <el-table-column align="center" label="出厂总价" prop="totalPrice" :width="flexColumnWidth(componentList, '出厂', 'totalPrice')">
          <template #header>
            出厂<br>总价
          </template>
        </el-table-column>
        <el-table-column align="center" label="每个SKU运费(含税)" min-width="100" prop="freight">
          <template #header>
            每个SKU<br>运费(含税)
          </template>
        </el-table-column>    
        <el-table-column align="center" label="总未税价" prop="preTaxPrice" :width="flexColumnWidth(componentList, '总未', 'preTaxPrice')">
          <template #header>
            总未<br>税价
          </template>
        </el-table-column>
        <el-table-column align="center" label="总含税价" prop="taxIncludedPrice" :width="flexColumnWidth(componentList, '总含', 'taxIncludedPrice')">
          <template #header>
            总含<br>税价
          </template>
        </el-table-column>    
        <el-table-column label="货币" prop="currency" width="110px">
          <template #default="{ row }">
            <el-select v-model="row.currency" disabled placeholder="请选择货币" style="min-width: 100%;">
              <el-option v-for="dict in currencyList" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="起订量" min-width="90" prop="minimumOrderQuantity"/> 
        <el-table-column align="center" label="整箱数" min-width="90" prop="numberFullCartons"/> 
        <el-table-column align="left" label="供应商" prop="supplier" :width="flexColumnWidth(componentList, '供应商', 'supplier')"/>
        <el-table-column align="center" label="开票" prop="oem" width="140">
          <template #default = "{ row }">
            <el-select v-model="row.invoicing" disabled placeholder="请选择开票类型" style="min-width: 100%;">
              <el-option v-for="dict in invoicingList" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="实际税点" min-width="60" prop="actualTaxRate">
          <template #header>
            实际<br>税点
          </template>
        </el-table-column>
        <el-table-column  align="center" label="开票税点" min-width="60" prop="invoicingTaxRate">
          <template #header>
            开票<br>税点
          </template>
        </el-table-column>
        
        <el-table-column  label="采购链接" min-width="100" prop="purchaseLink">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseLink) }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ row.purchaseLink }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  label="收货仓库" min-width="150" prop="remarks">
          <el-select 
            v-model="list.componentInfo!" 
            allow-create
            clearable
            disabled
            filterable
            placeholder="请选择收货仓库"
            :reserve-keyword = "false"
            style="min-width: 100%"
            value-key="id"
          >
            <el-option v-for="val in list" :key="val.id!" :label="val.label!" :value="val"/>
          </el-select>
        </el-table-column>
        <el-table-column align="left" label="零件采购注意事项" min-width="200" prop="purchaseMatters">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.purchaseMatters) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合同条款" min-width="200" prop="contractTerms">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.contractTerms) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
        </template>
      </el-table>
      <vab-alert type="error">
        <h3>--上述产品配件必须和开票一致。如果同一个供应商的零件被分成多行，则每行都需要单独开票。相同供应商的零件尽量合并，实在无法合并的再拆分开。</h3>
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
    
    </div>
    <div class="table-container">
      <el-table 
          ref="tableRef" 
          border :cell-style="{ 'text-align': 'center' }" 
          :data="variantsList" 
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="changeInput"
      >
          <el-table-column align="center" label="变体" min-width="100" prop="variant"/>
          <el-table-column label="站点" min-width="135" prop="site">
              <template #default="{ row }">
                  <el-select v-model="row.site" disabled placeholder="请选择站点" style="min-width: 100%;">
                      <el-option
v-for="dict in estimatedCostAccountingSiteColumnsNum" :key="dict.value"
                              :label="dict.label" :value="dict.value"/>
                  </el-select>
              </template>
          </el-table-column>
          <el-table-column label="外汇币种" min-width="100" prop="currencyType"/>
          <el-table-column label="汇率" min-width="100" prop="foreignExchange"/>
          <el-table-column label="实际总成本￥" min-width="120" prop="actualTotalCost"/>
          <el-table-column label="长(cm)" min-width="90" prop="packagingLength"/>

          <el-table-column label="宽(cm)" min-width="90" prop="packagingWidth"/>

          <el-table-column label="高(cm)" min-width="90" prop="packagingHeight"/>

          <el-table-column label="重量(g)" prop="weight"/>
          <el-table-column label="尾程$"  min-width="70" prop="lastMile" />
          <el-table-column label="头程￥"  prop="firstMile" width="90" />    
          <el-table-column label="打包￥"  prop="packagingPrice" width="90" />
          <el-table-column label="头程渠道" min-width="140" prop="firstMileChannel">
              <template #default="{ row }">
                  <el-select 
                      v-model="row.firstMileChannel" 
                      disabled
                      placeholder="请选择头程渠道"
                      style="min-width: 100%"
                  >
                      <el-option 
                          v-for="dict in firstLegChannelColumnsNum" 
                          :key="dict.value" 
                          :label="dict.label"
                          :value="dict.value"
                      />
                  </el-select>
              </template>
          </el-table-column>
          <el-table-column label="最终售价$" min-width="100" prop="finalSellingPrice"/>
          <el-table-column label="毛利率" prop="grossMarginRate"/>
          <el-table-column label="ROI" prop="roi"/>
          <el-table-column label="重量系数" min-width="100" prop="weightCoefficient"/>
          <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient"/>
          <el-table-column label="关税%" prop="tariff">
              <template #default="{row}">
                  {{ row.tariff ? row.tariff+'%' : '' }}
              </template>
          </el-table-column>
          <el-table-column label="平台佣金" min-width="100" prop="platformCommission"/>
          <el-table-column label="仓储费2个月$" min-width="140" prop="storageFee"/>
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
      </el-table>
      <vab-alert type="error">
        <h3>--请输入精确的产品包装尺寸（精确到小数点后1位），重量（精确到整数）和最终售价。</h3>
        <h3>--如果开专票则实际产品成本=总含税价/(1+开票税点)；如果开普票则则实际产品成本=总含税价</h3>
      </vab-alert>
    </div>
    <div class="pay-button-group">
      <el-button @click="handleGoback">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSave">下一步</el-button>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { currencyList, estimatedCostAccountingSiteColumnsNum, firstLegChannelColumnsNum, invoicingList } from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { reviewStepNo3ComponentList, reviewStepNo3ComponentSuitDetail, reviewStepNo3ContractTerms, reviewStepNo3GetSelectVariantList, reviewStepNo3PurchaseMatters, reviewStepNo3VariantList } from '/@/api/devlocal/orderProcess'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IGetSelectVariantsList, IreviewStepNo3ComponentList, IreviewStepNo3VariantList } from '/@/type/orderProcess/orderProcessType'
import { handleActivePath } from '/@/utils/routes'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
defineOptions({
    name: 'OrderCheckStep2',
})
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const emit = defineEmits<{ 
  (e: 'changeCheck-step', value: number): void
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])
// 变体列表
const variantsList = ref<IreviewStepNo3VariantList[]>([])
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
const list = ref<any>([])

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
const wangEditorVisible = ref<boolean>(false)
const editorContent = ref<string>('')

const clickEditorConfirm = async () => {
    wangEditorVisible.value = false
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickEditorCancel = (val: any) => {
  wangEditorVisible.value = val
}


/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>()
const changeInput = async (row: any, column: any) => { 

  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId })
    editorContent.value = data
    row.purchaseMatters = data
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorVisible.value = true
  } else if (column.property == 'contractTerms'){
    clickRow.value = row
    const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId })
    editorContent.value = data
    row.contractTerms = data
    wangEditorTitle.value = '合同条款'
    classify.value = 'contractTerms'
    wangEditorVisible.value = true
  } else if (column.property == 'componentSuitDetail') {
    clickRow.value = row
    const { data } = await reviewStepNo3ComponentSuitDetail({ reviewComponentId: row.reviewComponentId })
    editorContent.value = data
    row.componentSuitDetail = data
    wangEditorTitle.value = '零件明细'
    classify.value = 'componentSuitDetail'
    wangEditorVisible.value = true
  }
}
const showPreviewImage = (url: string) => {
  emit("update:previewListValue", url)
  emit("update:imagePreviewVisible", true)
}
// 当点击下一步的时候
const handleSave = async () => {
  emit('changeCheck-step', 2)
  await delVisitedRoute(handleActivePath(route, true))
  router.replace({ query: { ...route.query, stepNo: 2 }});
}

// 当点击上一步的时候
const handleGoback = () => {
    emit('changeCheck-step', 0)
}

// 获取拿样零件添加数据
const fetchDataComponent = async () =>{
    try {
        // 拿样零件添加列表
        const { data } = await reviewStepNo3ComponentList({reviewId: parseInt(route.query.reviewId)})
        componentList.value = data
        componentList.value.forEach((item: any) => {
            item.currency = convertString(item.currency)
            item.invoicing = convertString(item.invoicing)
        })
        // console.log(componentList.value);
        
        // 获取下拉变体列表
        const { data: variantSelectList }= await reviewStepNo3GetSelectVariantList({ reviewId: parseInt(route.query.reviewId) })
        variantsSelectList.value = variantSelectList
    }catch(error){
        console.error(error as Error)
    }
}
// 获取变体列表
const fetchVariantsData = async () => {
    try {
        const { data } = await reviewStepNo3VariantList({ reviewId: parseInt(route.query.reviewId) })
        variantsList.value = data
        variantsList.value.forEach((item: any) => {
                item.tariff = (item.tariff * 100).toFixed(0)
            })
    } catch (error) {
        console.error(error)
    }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
onMounted(async ()=>{
    fetchDataComponent()
    fetchVariantsData()
})
</script>
  
<style lang="scss" scoped>
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
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
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
</style>
  