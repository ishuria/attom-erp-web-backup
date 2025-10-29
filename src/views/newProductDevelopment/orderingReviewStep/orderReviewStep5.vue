<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center">
      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        border
        :cell-class-name="clearPadding"
        class="noneHoverTable"
        :data="componentList"
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
      >
        <el-table-column align="center" fixed="left" label="属于变体" min-width="140" prop="variant">
          <template #default="{ row }">
            {{ row.variant }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="left" label="零件图片" width="75">
          <template #header>
            零件
            <br />
            图片
          </template>
          <template #default="{ row }">
            <el-image
              :src="row.componentImgUrl"
              style="display: block; width: 75px; height: 75px"
              @click="showPreviewImage(row.componentImgUrl)"
            >
              <template #error><el-icon /></template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="零件ID" min-width="70" prop="existingPartsListId" width="100" />
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(componentList, '零件名', 'componentName')" />
        <el-table-column align="center" label="耗材勾选" prop="consumable" width="70">
          <template #default="{ row }">
            <el-checkbox
              v-model="row.consumableCheck"
              :disabled="editDisabled"
              :false-value="0"
              :true-value="1"
              @change="handleConsumableChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="零件明细" prop="componentSuitDetail" width="100">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
              </template>
              <div class="multi-line-ellipsis-1">{{ removeHtmlTags(row.componentSuitDetail) }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="每个SKU需要数量" prop="quantity" width="100">
          <template #header>
            每个SKU
            <br />
            需要数量
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位" min-width="70" prop="componentUnit" />
        <el-table-column align="center" label="出厂单价" prop="unitPrice" :width="flexColumnWidth(componentList, '出厂单', 'unitPrice')">
          <template #header>
            出厂
            <br />
            单价
          </template>
        </el-table-column>

        <el-table-column align="center" label="出厂总价" prop="totalPrice" :width="flexColumnWidth(componentList, '出厂总', 'totalPrice')">
          <template #header>
            出厂
            <br />
            总价
          </template>
        </el-table-column>
        <el-table-column align="center" label="每个SKU运费(含税)" min-width="100" prop="freight">
          <template #header>
            每个SKU
            <br />
            运费(含税)
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="总未税价"
          prop="preTaxPrice"
          :width="flexColumnWidth(componentList, '总未税', 'preTaxPrice')"
        >
          <template #header>
            总未
            <br />
            税价
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="总含税价"
          prop="taxIncludedPrice"
          :width="flexColumnWidth(componentList, '总含税', 'taxIncludedPrice')"
        >
          <template #header>
            总含
            <br />
            税价
          </template>
        </el-table-column>
        <el-table-column align="center" label="货币" prop="currency" width="110px">
          <template #default="{ row }">
            {{ currencyList.find((item) => item.value === row.currency)?.label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="起订量" min-width="90" prop="minimumOrderQuantity" />
        <el-table-column align="center" label="整箱数" min-width="90" prop="numberFullCartons" />
        <el-table-column align="left" label="供应商" prop="supplier" :width="flexColumnWidth(componentList, '供应商', 'supplier')" />
        <el-table-column align="center" label="开票" prop="oem" width="140">
          <template #default="{ row }">
            <el-select
              v-model="row.invoicing"
              :disabled="editDisabled"
              placeholder="请选择开票类型"
              style="min-width: 100%"
              @change="updateReviewComponent(row)"
            >
              <el-option v-for="dict in invoicingList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实际税点" min-width="60" prop="actualTaxRate">
          <template #header>
            实际
            <br />
            税点
          </template>
          <template #default="{ row }">
            <span>{{ row.actualTaxRate != null ? row.actualTaxRate + '%' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票税点" min-width="60" prop="invoicingTaxRate">
          <template #header>
            开票
            <br />
            税点
          </template>
          <template #default="{ row }">
            <span>{{ row.invoicingTaxRate != null ? row.invoicingTaxRate + '%' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="采购方" prop="purchase" width="120">
          <template #default="{ row }">
            <el-select
              v-model="row.purchaseId"
              :disabled="editDisabled"
              placeholder="请选择默认采购方"
              style="min-width: 100%"
              @change="updateReviewComponent(row)"
            >
              <el-option v-for="b in purchaseOption" :key="b.id" :label="b.label" :value="b.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="不报关" prop="consumable" width="70">
          <template #default="{ row }">
            <el-checkbox
              v-model="row.customsDeclarationStatus"
              :disabled="editDisabled"
              :false-value="0"
              :true-value="1"
              @change="updateReviewComponent(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="采购链接" min-width="100" prop="purchaseLink">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseLink) }}</div>
              </template>
              <div class="multi-line-ellipsis-1">{{ row.purchaseLink }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="收货仓库" min-width="150" prop="remarks">
          <template #default="{ row }">
            <el-select
              v-model="row.defaultRepositoryId"
              :disabled="editDisabled"
              filterable
              placeholder="输入和搜索默认收货仓库"
              style="min-width: 100%"
              @change="updateReviewComponent(row)"
            >
              <el-option v-for="item in repositoryOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="left" label="零件采购注意事项" min-width="200" prop="purchaseMatters">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.purchaseMatters) }}</div>
              </template>
              <div class="multi-line-ellipsis">{{ removeHtmlTags(row.purchaseMatters) }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合同条款" min-width="200" prop="contractTerms">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.contractTerms) }}</div>
              </template>
              <div class="multi-line-ellipsis">{{ removeHtmlTags(row.contractTerms) }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 700px" />
        </template>
      </el-table>
      <div class="pay-button-group">
        <el-button :disabled="editDisabled" :loading="releasePoLoading" native-type="submit" type="success" @click="handleSaveAndContinue">
          发布采购计划
        </el-button>
      </div>
    </div>
  </div>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import { currencyList, invoicingList } from '../indexCommon'
import { releasePo, reviewStepSubmittedStatus } from '/@/api/devlocal/orderingReview'
import {
  reviewStepNo3ComponentList,
  reviewStepNo3GetSelectVariantList,
  reviewStepNo3UpdateConsumableCheck,
  updateReviewComponentPurchaseIdAndInvoiceCustomstatus,
} from '/@/api/devlocal/orderProcess'
import { getProductComponentPurchase, getProductComponentStore } from '/@/api/devlocal/productInformation'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetSelectVariantsList, IreviewStepNo3ComponentList } from '/@/type/orderProcess/orderProcessType'
import { handleActivePath } from '/@/utils/routes'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'OrderReviewStep5',
})

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>()
const tableLoading = ref<boolean>(false)
// 零件列表
const componentList = ref<IreviewStepNo3ComponentList[]>([])

// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}

// 发布Po的loading
const releasePoLoading = ref<boolean>(false)
const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
// 当点击通过的时候
const handleSaveAndContinue = async () => {
  const deleteVNode = h('div', {}, [
    h(
      'p',
      {
        style: {
          color: 'origin',
        },
      },
      '请再次确认，是否要真的发布PO！'
    ),
  ])
  $baseConfirm(deleteVNode, '系统提示', async () => {
    try {
      releasePoLoading.value = true
      const { data } = await releasePo({ reviewId: props.reviewId })
      if (data === true) {
        $baseMessage('发布PO成功！', 'success', 'hey')
        await delVisitedRoute(handleActivePath(route, true))
        router.push({
          path: '/newProductDevelopment/newProductApprovalAndRecords',
        })
      }
      releasePoLoading.value = false
    } catch {
      releasePoLoading.value = false
    } finally {
      releasePoLoading.value = false
    }
  })
}
const purchaseOption = ref<any>()
const repositoryOption = ref<any>()
const fetchPurchaseAndRepository = async () => {
  const { data: purchase } = await getProductComponentPurchase()
  purchaseOption.value = purchase
  //获取收货仓库
  const { data: repository } = await getProductComponentStore()
  repositoryOption.value = repository
}
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
// 获取拿样零件添加数据
const fetchDataComponent = async () => {
  try {
    const { data } = await reviewStepNo3ComponentList({ reviewId: Number(props.reviewId) })
    componentList.value = data
    componentList.value.forEach((item: any) => {
      item.currency = convertString(item.currency)
      item.invoicing = convertString(item.invoicing)
      item.actualTaxRate = item.actualTaxRate * 100
      item.invoicingTaxRate = item.invoicingTaxRate * 100
    })
    // 获取下拉变体列表
    const { data: variantSelectList } = await reviewStepNo3GetSelectVariantList({ reviewId: Number(props.reviewId) })
    variantsSelectList.value = variantSelectList
    variantsSelectList.value.unshift({ label: '变体共用', id: 0 })
  } catch (error) {
    console.error(error as Error)
  }
}

const handleConsumableChange = async (row: any) => {
  tableLoading.value = true
  try {
    await reviewStepNo3UpdateConsumableCheck({
      reviewComponentId: row.reviewComponentId,
      consumableCheck: row.consumableCheck,
    })
    await fetchDataComponent()
  } catch (error) {
    console.error(error as Error)
  } finally {
    tableLoading.value = false
  }
}

const updateReviewComponent = async (row: any) => {
  const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)

  // 买单采购方：强制不报关
  if (item.type === 0) {
    row.customsDeclarationStatus = 1
    if (row.customsDeclarationStatus === 0) {
      $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
    }
  }

  // 埃托姆采购方：必须报关，不能无法开票
  if (item.label === '埃托姆') {
    row.customsDeclarationStatus = 0
    if (row.invoicing === '2') {
      row.invoicing = '1'
    }
    if (row.customsDeclarationStatus === 1) {
      row.customsDeclarationStatus = 0
      $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
    }
  }

  // Attom采购方：强制无法开票
  if (item.label === 'Attom') {
    row.invoicing = '2'
    if (row.invoicing !== '2') {
      $baseMessage('采购方为attom，无法开票', 'error')
    }
  }

  // 云舟采购方：普票+不报关组合
  if (item.label === '云舟') {
    if (row.invoicing === '2') {
      row.invoicing = '1'
      $baseMessage('采购方为云舟，不能选择无法开票', 'error', 'hey')
    }
    if (row.invoicing === '1') {
      row.customsDeclarationStatus = 1
      if (row.customsDeclarationStatus === 0) {
        $baseMessage('采购方为云舟，开票类型为普票，无法取消不报关勾选', 'error', 'hey')
      }
    }
  }

  // 通用规则：云舟和埃托姆不能选择无法开票
  if (row.invoicing === '2' && (item.label === '云舟' || item.label === '埃托姆')) {
    $baseMessage('采购方为云舟或埃托姆，不能选择无法开票', 'error', 'hey')
    row.invoicing = '1'
  }
  const { data } = await updateReviewComponentPurchaseIdAndInvoiceCustomstatus({
    reviewComponentId: row.reviewComponentId,
    purchaseId: row.purchaseId,
    invoice: row.invoicing,
    customsDeclarationStatus: row.customsDeclarationStatus,
    defaultRepositoryId: row.defaultRepositoryId,
  })

  if (data) {
    $baseMessage('零件信息修改成功！', 'success', 'hey')
  }
}
const editDisabled = ref<boolean>(false)
const fetchSubmittedStatus = async () => {
  const { data } = await reviewStepSubmittedStatus({ reviewId: Number(props.reviewId), step: 5 })
  if (data === 1) {
    editDisabled.value = true
  }
}
onBeforeMount(() => {
  fetchPurchaseAndRepository()
  fetchDataComponent()
  fetchSubmittedStatus()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.el-checkbox {
  transform: scale(1.2);
}
</style>
