<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <el-table ref="tableRef" stripe border :data="variantList" :header-cell-style="{ 'text-align': 'right' }"
        height="895" :show-header="false" @cell-click="tableInputChange" style="width: auto; table-layout: fixed;">
        <!-- 第一列固定标签列 -->
        <el-table-column :prop="'column0'" :label="labelMap['column0']" fixed align="right" width="260">
          <template #default="{ row }">
            <strong v-html="labelMap[row['column0']]" style="color: var(--el-table-header-text-color)"></strong>
          </template>
        </el-table-column>
        <el-table-column :prop="prop" :label="prop" v-for="(prop, i) in columns" :key="i" align="center" min-width="240">
          <template v-slot="scope">
            <template v-if="scope.row['column0'] === 'variantImg'">
              <el-image style="width: 105px;height: 105px;" :src="scope.row[prop]" fit="fill" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
            <template v-if="scope.row['column0'] === 'packagingSize'">
                {{ scope.row[prop] }} cm
            </template>
            <template v-if="scope.row['column0'] === 'amazonUsOrderQuantity'">
              <el-input
                v-model="scope.row[prop]" 
                @click="inputHandleMouseOver($event)"
                @keydown.enter="updateHnadlerNumber($event, scope)" 
                @blur="updateHnadlerNumber($event, scope)" 
                class="center-input"
              />
            </template>
            <template v-if="scope.row['column0'] === 'amazonUkOrderQuantity'">
              <el-input 
                v-model="scope.row[prop]" 
                @click="inputHandleMouseOver($event)"
                @keydown.enter="updateHnadlerNumber($event, scope)"
                @blur="updateHnadlerNumber($event, scope)"
                class="center-input"
              />
            </template>
            <template v-if="scope.row['column0'] === 'amazonDeOrderQuantity'">
              <el-input
                v-model="scope.row[prop]"
                @click="inputHandleMouseOver($event)"
                @keydown.enter="updateHnadlerNumber($event, scope)"
                @blur="updateHnadlerNumber($event, scope)"
                class="center-input"
              />
            </template>
            <template v-if="scope.row['column0'] === 'walmartUsOrderQuantity'">
              <el-input
                v-model="scope.row[prop]"
                @click="inputHandleMouseOver($event)"
                @keydown.enter="updateHnadlerNumber($event, scope)"
                @blur="updateHnadlerNumber($event, scope)"
                class="center-input"
              />
            </template>
            <template v-if="scope.row['column0'] !== 'amazonUsOrderQuantity' && scope.row['column0'] !== 'amazonUkOrderQuantity'
              && scope.row['column0'] !== 'amazonDeOrderQuantity' && scope.row['column0'] !== 'walmartUsOrderQuantity'
              && scope.row['column0'] !== 'variantImg' && scope.row['column0'] !== 'packagingSize'">
              {{ scope.row[prop] }}
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
        </template>
      </el-table>
    </div>
    <vab-alert type="error" center="center">
      <h3>不分货则填0，不能留空</h3>
    </vab-alert>
    <div class="pay-button-group">
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交</el-button>
    </div>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
  </div>
</template>

<script lang="ts" setup>

import { useTableDataLineToColumn, inputHandleMouseOver } from '/@/utils/tableColum'
import { getDistributionList, updateStepNoQuantity,reviewStepNo3Save } from '/@/api/devlocal/orderingReview'
import { IReviewCommonItem, IReviewStepUpdateReq } from '/@/type/review/review'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils'
const router = useRouter()


defineOptions({
  name: 'OrderReviewStep3',
})

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>();
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const emit = defineEmits(['change-step'])
const variantList = ref<any[]>([])
// 原始数组的长度
const variantSize = ref<number>(0)
const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  amazonUsOrderQuantity: '订货数量(亚马逊US)',
  amazonUkOrderQuantity: '订货数量(亚马逊UK)',
  amazonDeOrderQuantity: '订货数量(亚马逊DE)',
  walmartUsOrderQuantity: '订货数量(沃尔玛US)',
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
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      imagePreviewVisible.value = true
      imagePreviewList.value = []
      imagePreviewList.value.push(el.src)
    }
}
const buildParams = (idx: number): IReviewStepUpdateReq => {
  let n: any = {}
  variantList.value.map((item, index) => {
    n[item["column0"]] = item[idx]
  })

  const params: IReviewStepUpdateReq = {
    orderEntryId: n.orderEntryId,
    amazonUsOrderQuantity: n.amazonUsOrderQuantity,
    amazonUkOrderQuantity: n.amazonUkOrderQuantity,
    amazonDeOrderQuantity: n.amazonDeOrderQuantity,
    walmartUsOrderQuantity: n.walmartUsOrderQuantity
  }
  return params
}

const updateHnadlerNumber = async (event: Event, row: any) => {
  const updateParmas = buildParams(row.cellIndex)
  console.log(updateParmas)

  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
  const { data } = await updateStepNoQuantity(updateParmas)
  if (data === true) {
    $baseMessage("分货数量成功！", "success", "hey")
    fetchData()
  }

}

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await getDistributionList({ reviewId: props.reviewId })
  variantSize.value = data.length;

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: (index + 1) + "",
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
      amazonUsOrderQuantity: item.amazonUsOrderQuantity,
      amazonUkOrderQuantity: item.amazonUkOrderQuantity,
      amazonDeOrderQuantity: item.amazonDeOrderQuantity,
      walmartUsOrderQuantity: item.walmartUsOrderQuantity,
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

  variantList.value = initData(arr)
}
// 当点击通过的时候
const handleSaveAndContinue = () => {
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

onMounted(() => {
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
</style>