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
              <el-checkbox
                v-model="scope.row[prop]"
                class="custom-checkbox"
                disabled
                :false-value="0"
                :true-value="1"
              />
            </template>
            <template v-if="scope.row['column0'] === 'vineSite'">
              {{ siteList.find(item => item.id === scope.row[prop])?.label }}
            </template>
            <!-- <template v-if="['amazonUsOrderQuantity', 'amazonUkOrderQuantity', 'amazonDeOrderQuantity', 'walmartUsOrderQuantity', 'amazonCaOrderQuantity', 'amazonJpOrderQuantity', 'tiktokUsOrderQuantity'].includes(scope.row['column0'])">
              <el-input
                v-model="scope.row[prop]"
                class="center-input"
                @blur="updateHandlerNumber($event, scope, i)"
                @click="inputHandleMouseOver($event)"
                @keydown.enter="updateHandlerNumber($event, scope, i)"
              />
            </template> -->
            <template
              v-if="
                scope.row['column0'] !== 'oem' &&
                // scope.row['column0'] !== 'amazonUsOrderQuantity' &&
                // scope.row['column0'] !== 'amazonUkOrderQuantity' &&
                // scope.row['column0'] !== 'amazonDeOrderQuantity' &&
                // scope.row['column0'] !== 'amazonCaOrderQuantity' &&
                // scope.row['column0'] !== 'amazonJpOrderQuantity' &&
                // scope.row['column0'] !== 'walmartUsOrderQuantity' &&
                // scope.row['column0'] !== 'tiktokUsOrderQuantity' &&
                scope.row['column0'] !== 'variantImg'
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
      <vab-site-quantity-table :list="siteQuantityList" />
    </div>
    <div class="pay-button-group">
      <el-button :loading="releasePoLoading" native-type="submit" type="success" @click="handleSaveAndContinue">归档新品进度管理并发布采购计划</el-button>
    </div>
  </div>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import { releasePo, reviewProductList, updateStepNoQuantity } from '/@/api/devlocal/orderingReview'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IReviewCommonItem, IReviewStepUpdateReq } from '/@/type/review/review'
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
  oem: 'OEM',
  vineSite: 'Vine站点',
  vineCount: 'Vine数量'
  // amazonUsOrderQuantity: '订货数量(亚马逊US)',
  // amazonUkOrderQuantity: '订货数量(亚马逊UK)',
  // amazonDeOrderQuantity: '订货数量(亚马逊DE)',
  // amazonCaOrderQuantity: '订货数量(亚马逊CA)',
  // amazonJpOrderQuantity: '订货数量(亚马逊JP)',
  // walmartUsOrderQuantity: '订货数量(沃尔玛US)',
  // tiktokUsOrderQuantity: '订货数量(TiktokUS)',
}

const buildParams = (idx: number): IReviewStepUpdateReq => {
  let n: any = {}
  variantList.value.map((item) => {
    n[item['column0']] = item[idx]
  })

  const params: IReviewStepUpdateReq = {
    orderEntryId: n.orderEntryId,
    // amazonUsOrderQuantity: n.amazonUsOrderQuantity,
    // amazonUkOrderQuantity: n.amazonUkOrderQuantity,
    // amazonDeOrderQuantity: n.amazonDeOrderQuantity,
    // amazonCaOrderQuantity: n.amazonCaOrderQuantity,
    // amazonJpOrderQuantity: n.amazonJpOrderQuantity,
    // walmartUsOrderQuantity: n.walmartUsOrderQuantity,
    // tiktokUsOrderQuantity: n.tiktokUsOrderQuantity,
  }
  return params
}

const updateHandlerNumber = async (event: Event, scope: any, index: number) => {
  const updateParams = buildParams(scope.cellIndex)
  const targetElement = event.target as HTMLInputElement
  // 获取当前输入的值
  const currentValue = Number(targetElement.value)
  // 获取原始值
  const originalValue = scope.row[index + 1]
  // console.log(currentValue)
  // console.log(scope.row[index + 1])
  // 如果值没有变化，直接返回
  if (currentValue === originalValue) {
    targetElement.blur()
    return
  }
  
  targetElement.blur()

  if (event.type === 'blur') {
    const { data } = await updateStepNoQuantity(updateParams)
    if (data === true) {
      $baseMessage('分货数量成功！', 'success', 'hey')
      fetchData()
    }
  }
}

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
  try {
    $baseConfirm(deleteVNode, '系统提示', async () => {
      releasePoLoading.value = true
      const { data } = await releasePo({ reviewId: props.reviewId })
      if (data === true) {
        releasePoLoading.value = false
        $baseMessage('发布PO成功！', 'success', 'hey')
        await delVisitedRoute(handleActivePath(route, true))
        router.push({
          path: '/newProductDevelopment/newProductApprovalAndRecords',
        })
      }
    })
  } catch {
    releasePoLoading.value = false
  }
}
const siteQuantityList = ref<any[]>([])
const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await reviewProductList({ reviewId: props.reviewId })

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: `${index + 1}`,
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
      effectiveCount: item.effectiveCount == undefined || item.effectiveCount == null ? '' : item.effectiveCount,
      oem: item.oem == undefined || item.oem == null ? 0 : item.oem,
      vineSite: item.vineSite,
      vineCount: item.vineCount,
      // amazonUsOrderQuantity: item.amazonUsOrderQuantity,
      // amazonUkOrderQuantity: item.amazonUkOrderQuantity,
      // amazonDeOrderQuantity: item.amazonDeOrderQuantity,
      // amazonCaOrderQuantity: item.amazonCaOrderQuantity,
      // amazonJpOrderQuantity: item.amazonJpOrderQuantity,
      // walmartUsOrderQuantity: item.walmartUsOrderQuantity,
      // tiktokUsOrderQuantity: item.tiktokUsOrderQuantity,
    }
    arr.push(n)
  })
  siteQuantityList.value = data
  variantList.value = initData(arr)
}
const siteList = ref<{ id: number, label: string }[]>([])
const fetchSiteList = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
onMounted(() => {
  fetchSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
// 选中且不被禁用的样式
:deep() .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #4a62e7;
  border-color: #4a62e7;
}

// 选中且被禁用的样式
:deep() .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background: rgb(10, 108, 245);
  border-color: rgb(10, 108, 245);
}

// 选中后中间的 “✔” 的样式
:deep() .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
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
