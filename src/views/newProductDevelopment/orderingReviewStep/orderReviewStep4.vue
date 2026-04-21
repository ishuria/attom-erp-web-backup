<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center">
      <el-table
        ref="tableRef"
        border
        :data="variantList"
        :header-cell-style="{ 'text-align': 'right' }"
        :show-header="false"
        stripe
        style="width: auto; table-layout: fixed"
      >
        <!-- 第一列固定标签列 -->
        <el-table-column align="right" fixed :label="labelMap['column0']" :prop="'column0'" width="260">
          <template #default="{ row }">
            <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
          </template>
        </el-table-column>
        <el-table-column v-for="(prop, i) in columns" :key="i" align="center" :label="prop" min-width="240" :prop="prop">
          <template #default="scope">
            <template v-if="scope.row['column0'] === 'variantImg'">
              <el-image fit="fill" :src="scope.row[prop]" style="width: 75px; height: 75px" @click="showPreviewImage(scope.row[prop])">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
            <template v-if="scope.row['column0'] === 'oem'">
              <el-checkbox v-model="scope.row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>
            <template v-if="scope.row['column0'] === 'vineSite'">
              {{ siteList.find((item) => item.id === scope.row[prop])?.label }}
            </template>
            <template v-if="scope.row['column0'] === 'vineCount'">
              {{ scope.row[prop] }}
            </template>
            <template v-if="scope.row['column0'] === 'productPosition'">
              {{ productPositionOption.find((item) => item.id === scope.row[prop])?.label }}
            </template>
            <template v-if="scope.row['column0'] === 'graphicDesign'">
              <el-checkbox v-model="scope.row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>

            <template
              v-if="
                scope.row['column0'] !== 'oem' &&
                scope.row['column0'] !== 'variantImg' &&
                scope.row['column0'] !== 'productPosition' &&
                scope.row['column0'] !== 'graphicDesign' &&
                scope.row['column0'] !== 'vineSite' &&
                scope.row['column0'] !== 'vineCount' &&
                scope.row['column0'] !== 'approvalBusinessId'
              "
            >
              {{ scope.row[prop] }}
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
        </template>
      </el-table>
      <vab-site-quantity-table :edit-disabled="editDisabled" :list="siteQuantityList" :step="4" />
    </div>
    <div class="pay-button-group">
      <el-button :disabled="editDisabled" :loading="releasePoLoading" native-type="submit" type="danger" @click="handleGoback">
        运营重新分货
      </el-button>
      <el-button :disabled="editDisabled" :loading="releasePoLoading" native-type="submit" type="success" @click="handleSaveAndContinue">
        提交采购审核
      </el-button>
    </div>
  </div>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import { getProductPositionList, getReviewVariantPackageSampleList } from '/@/api/devlocal/orderProcess'
import { reviewProductList, reviewStepNo4Fail, reviewStepNo5Pass, reviewStepSubmittedStatus } from '/@/api/devlocal/orderingReview'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IReviewCommonItem } from '/@/type/review/review'
import { handleActivePath } from '/@/utils/routes'
import { useTableDataLineToColumn } from '/@/utils/tableColum'

defineOptions({
  name: 'OrderReviewStep4',
})

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>()
// 发布Po的loading
const releasePoLoading = ref<boolean>(false)
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
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const router = useRouter()

const variantList = ref<any[]>([])
const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  effectiveCount: '有效计数',
  oemNumber: 'OEM数',
  productPosition: '产品定位',
  graphicDesign: '平面设计',
  oem: 'OEM',
  vineSite: 'Vine站点',
  vineCount: 'Vine数量',
}

// const buildParams = (idx: number): IReviewStepUpdateReq => {
//   let n: any = {}
//   variantList.value.map((item) => {
//     n[item['column0']] = item[idx]
//   })

//   const params: IReviewStepUpdateReq = {
//     orderEntryId: n.orderEntryId,
//     // amazonUsOrderQuantity: n.amazonUsOrderQuantity,
//     // amazonUkOrderQuantity: n.amazonUkOrderQuantity,
//     // amazonDeOrderQuantity: n.amazonDeOrderQuantity,
//     // amazonCaOrderQuantity: n.amazonCaOrderQuantity,
//     // amazonJpOrderQuantity: n.amazonJpOrderQuantity,
//     // walmartUsOrderQuantity: n.walmartUsOrderQuantity,
//     // tiktokUsOrderQuantity: n.tiktokUsOrderQuantity,
//   }
//   return params
// }

// const updateHandlerNumber = async (event: Event, scope: any, index: number) => {
//   const updateParams = buildParams(scope.cellIndex)
//   const targetElement = event.target as HTMLInputElement
//   // 获取当前输入的值
//   const currentValue = Number(targetElement.value)
//   // 获取原始值
//   const originalValue = scope.row[index + 1]
//   // console.log(currentValue)
//   // console.log(scope.row[index + 1])
//   // 如果值没有变化，直接返回
//   if (currentValue === originalValue) {
//     targetElement.blur()
//     return
//   }

//   targetElement.blur()

//   if (event.type === 'blur') {
//     const { data } = await updateStepNoQuantity(updateParams)
//     if (data === true) {
//       $baseMessage('分货数量成功！', 'success', 'hey')
//       fetchData()
//     }
//   }
// }

// 当点击运营重新分货的时候
const handleGoback = async () => {
  $baseConfirm('确定要点击运营重新分货吗？', null, async () => {
    const { data } = await reviewStepNo4Fail({ reviewId: Number(props.reviewId) })
    if (data === true) {
      $baseMessage('回退到运营分货成功', 'success', 'hey')
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords',
      })
    }
  })
}
// 当点击通过的时候 采购审核通过
const handleSaveAndContinue = async () => {
  $baseConfirm('确定要点击提交采购审核吗？', null, async () => {
    const { data } = await reviewStepNo5Pass({ reviewId: Number(props.reviewId) })
    if (data === true) {
      $baseMessage('提交采购审核成功', 'success', 'hey')
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords',
      })
    }
  })
}
const siteQuantityList = ref<any[]>([])
const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await reviewProductList({ reviewId: props.reviewId })

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: any = {
      column0: `${index + 1}`,
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
      effectiveCount: item.effectiveCount === undefined || item.effectiveCount === null ? '' : item.effectiveCount,
      oemNumber: item.oemNumber === undefined || item.oemNumber === null ? '' : item.oemNumber,
      productPosition: item.productPosition,
      graphicDesign: item.graphicDesign,
      oem: item.oem === undefined || item.oem === null ? 0 : item.oem,
    }
    if (item.approvalBusinessId) {
      n.vineSite = item.vineSite
      n.vineCount = item.vineCount
    }
    arr.push(n)
  })
  siteQuantityList.value = data
  variantList.value = initData(arr)
}
const siteList = ref<{ id: number; label: string }[]>([])
const fetchSiteList = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}

const productPositionOption = ref<{ id: number; label: string }[]>([])
const packageSampleOption = ref<{ id: number; label: string }[]>([])
const fetchProductPositionOption = async () => {
  const { data } = await getProductPositionList()
  productPositionOption.value = data
}
const fetchPackagePositionOption = async () => {
  const { data } = await getReviewVariantPackageSampleList()
  packageSampleOption.value = data
}
const editDisabled = ref<boolean>(false)
const fetchSubmittedStatus = async () => {
  const { data } = await reviewStepSubmittedStatus({ reviewId: Number(props.reviewId), step: 4 })
  if (data === 1) {
    editDisabled.value = true
  }
}
onMounted(() => {
  fetchProductPositionOption()
  fetchPackagePositionOption()
  fetchSiteList()
  fetchData()
  fetchSubmittedStatus()
})
</script>

<style lang="scss" scoped>
// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
.custom-checkbox {
  transform: scale(1.3); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.center-input) {
  text-align: center;
  text-align-last: center;
}
</style>
