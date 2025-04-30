<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <el-table
        ref="tableRef" border :data="variantList" :header-cell-style="{ 'text-align': 'right' }"
        :show-header="false" stripe style="width: auto; table-layout: fixed;"
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
              <el-image fit="fill" :src="scope.row[prop]" style="width: 75px; height: 75px;" @click="showPreviewImage(scope.row[prop])">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
            <template v-if="scope.row['column0'] === 'vineSite'">
              <el-select v-model="scope.row[prop]" class="center-select" clearable placeholder="请选择Vine站点" @change="handleUpdate(scope)">
                <el-option
                  v-for="item in siteList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </template>
            <template v-if="scope.row['column0'] === 'vineCount'">
              <!-- <el-input
                v-model.trim="scope.row[prop]"
                class="center-input"
                :min="0"
                placeholder="请输入Vine数量"
                type="number"
                @change="handleUpdate(scope)"
              /> -->
              <el-input-number
                v-model="scope.row[prop]"
                controls-position="right"
               :min="0"
                placeholder="请输入Vine数量"
                style="min-width: 100%;"
                @change="handleUpdate(scope)"
              />
            </template>
            <!-- <template v-if="scope.row['column0'] === 'packagingSize'">
                {{ scope.row[prop] }} cm
            </template> -->
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
              v-if="scope.row['column0'] !== 'variantImg' && scope.row['column0'] !== 'vineSite'
              && scope.row['column0']!== 'vineCount'
              // && scope.row['column0'] !== 'amazonUsOrderQuantity' && scope.row['column0'] !== 'amazonUkOrderQuantity'
              // && scope.row['column0'] !== 'amazonDeOrderQuantity' && scope.row['column0']!== 'amazonCaOrderQuantity'
              // && scope.row['column0'] !== 'amazonJpOrderQuantity' && scope.row['column0'] !== 'walmartUsOrderQuantity'
              // && scope.row['column0']!== 'tiktokUsOrderQuantity'
              ">
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
    <vab-alert center="center" type="error">
      <h3>不分货则填0，不能留空</h3>
    </vab-alert>
    <div class="pay-button-group">
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交</el-button>
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
  </div>
</template>

<script lang="ts" setup>

import { getDistributionList, reviewStepNo3Save, updateReviewStepNo3Vine } from '/@/api/devlocal/orderingReview'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IReviewCommonItem, IUpdateReviewStepNo3Vine } from '/@/type/review/review'
import { handleActivePath } from '/@/utils/routes'
import { useTableDataLineToColumn } from '/@/utils/tableColum'

const router = useRouter()

defineOptions({
  name: 'OrderReviewStep3',
})

const siteQuantityList = ref<any[]>([])
const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>();
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const variantList = ref<any[]>([])
// 原始数组的长度
const variantSize = ref<number>(0)
const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  vineSite: 'Vine站点',
  vineCount: 'Vine数量',
  finalSellingPrice: '售价',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  weight: '包装重量(g)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  variantSku: '合并变体的SKU',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  productManager: '产品经理',
  productDesign: '产品设计',
}
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const buildParams = (idx: number): IUpdateReviewStepNo3Vine => {
  let n: any = {}
  variantList.value.map((item) => {
    n[item["column0"]] = item[idx]
  })

  const params: IUpdateReviewStepNo3Vine = {
    orderEntryId: n.orderEntryId,
    vineSite: n.vineSite,
    vineCount: n.vineCount,
  }
  return params
}
const handleUpdate = async (scope: any) => {
  const updateParams = buildParams(scope.cellIndex)
  // console.log(updateParams)
  await updateReviewStepNo3Vine(updateParams)
}
// const updateHandlerNumber = async (event: Event, scope: any, index: number) => {
//   const updateParams = buildParams(scope.cellIndex)
//   console.log(updateParams)
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
//       $baseMessage("分货数量成功！", "success", "hey")
//       fetchData()
//     }
//   }
// }

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await getDistributionList({ reviewId: props.reviewId })
  variantSize.value = data.length;
  
  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: `${index + 1}`,
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
      vineSite: item.vineSite,
      vineCount: item.vineCount,
      finalSellingPrice: item.finalSellingPrice,
      grossMarginRate: item.grossMarginRate,
      packagingSize: item.packagingSize,
      material: item.material,
      battery: item.battery,
      variantSku: item.variantSku,
      benchmarkAsin: item.benchmarkAsin,
      patent: item.patent,
      productManager: item.productManager,
      productDesign: item.productDesign,
    }
    arr.push(n)
  })
  siteQuantityList.value = data
  // console.log(siteQuantityList.value)
  variantList.value = initData(arr)
}
const validate = (): boolean => {
  // console.log(variantList.value)
  for (let i = 1; i <= variantSize.value; i++) {
    let value1 = variantList.value[4][i]
    let value2 = variantList.value[5][i]
    // 如果一个有值一个没值，说明填写不完整 0是可以的 ‘’ null undefined是不行的
    if ((value1 != null && value2 == null) || (value1 == null && value2 != null)) {
      return false
    }
  }
  // 所有数据都检查完毕，都符合要求（要么都填了，要么都没填）
  return true
}
// 当点击通过的时候
const handleSaveAndContinue = () => {
  const valid = validate()
  if (!valid) {
    $baseMessage("Vine站点和数量必须成对填写，要么都填写，要么都不填！", "warning", "hey")
    return
  }
  const deleteVNode = h('div', {}, [
    h('p', {
      style: {
        color: 'origin'
      }
    }, '请再次确认，只有所有的站点都分货后才能进行提交！')
  ]);
  $baseConfirm(deleteVNode, "系统提示", async () => {

    const { data } = await reviewStepNo3Save({reviewId:props.reviewId})
    if (data === true) {
      $baseMessage("分货提交成功！", "success", "hey")
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords'
      })
    }

  })
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
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
:deep(.center-input .el-input__inner ){
    text-align: center;
}
:deep(.center-select) {
  text-align: center;
  text-align-last: center;
}
</style>