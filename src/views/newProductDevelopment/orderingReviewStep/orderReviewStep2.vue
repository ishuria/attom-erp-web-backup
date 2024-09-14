<template>
  <div>
    <div>
      <el-table ref="tableRef" stripe border :data="variantList" :header-cell-style="{ 'text-align': 'right' }"
        height="750" :show-header="false">
        <!-- 第一列固定标签列 -->
        <el-table-column :prop="'column0'" :label="labelMap['column0']" fixed align="right" width="260">
          <template #default="{ row }">
            <strong v-html="labelMap[row['column0']]" style="color: var(--el-table-header-text-color)"></strong>
          </template>
        </el-table-column>
        <el-table-column :prop="prop" :label="prop" v-for="(prop, i) in columns" :key="i" align="center">
          <template #default="{ row }">

            <template v-if="row['column0'] === 'sku'">
              <el-input 
                v-model="row[prop]" 
                @click="inputHandleMouseOver($event)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </template>

            <template v-if="row['column0'] === 'variantImg'">
              <el-image style="width: 105px;height: 105px;" :src="row[prop]" fit="fill" />
            </template>

            <template v-if="row['column0'] === 'oem'">
              <el-checkbox v-model="row[prop]" :disabled="true":true-value="1" :false-value="0" size="large" class="custom-checkbox"/>
            </template>

            <template v-if="row['column0'] !== 'variantImg' && row['column0'] !== 'sku' && row['column0'] !== 'oem'">
              {{ row[prop] }}
            </template>
            
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
        </template>
      </el-table>
    </div>


    <div style="padding-top: 20px;">
      <el-table border :data="moldData" :header-cell-style="{ 'text-align': 'center' }" style="margin-top: 25px;">
        <el-table-column label="提交日期" align="center">
          <template #default="{ row }">
            {{ formatDate(new Date(row.createTime)) }}
          </template>
        </el-table-column>
        <el-table-column label="零件名" prop="component" align="center" />
        <el-table-column label="供应商" prop="suppliser" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="info" v-if="row.status == 0">审批中</el-tag>
            <el-tag type="warning" v-if="row.status == 1">待提交付款申请</el-tag>
            <el-tag type="success" v-if="row.status == 2">已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="开票类型" align="center">
          <template #default="{ row }">
            <span v-if="row.invoiceType == 0">专票</span>
            <span v-if="row.invoiceType == 1">普票</span>
            <span v-if="row.invoiceType == 2">不开票</span>
          </template>
        </el-table-column>

        <el-table-column label="付款金额" align="center" prop="payPrice">

        </el-table-column>
        <el-table-column label="处理方式" align="center">
          <template #default="{ row }">
            <span v-if="row.dealMethod == 0">不含在PO</span>
            <span v-if="row.dealMethod == 1">含在该PO</span>
            <span v-if="row.dealMethod == 2">含在其他PO</span>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="pay-button-group">
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">终审通过</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTableDataLineToColumn, inputHandleMouseOver, effectiveCountInputeHandle } from '/@/utils/tableColum'
import { getSkuVariantList, getMoldInfoByReviewId, reviewStepNo2Pass } from '/@/api/devlocal/orderingReview'
import { IReviewMoldItem, IReviewCommonItem, IReviewStep2Item, IReviewStep2Req } from '/@/type/review/review'
import { formatDate } from '/@/utils/dateUtils'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

const moldData = ref<IReviewMoldItem[]>()
const variantList = ref<any[]>([])
// 原始数组的长度
const variantSize = ref<number>(0)

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>();

defineOptions({
  name: 'OrderReviewStep2',
})

const router = useRouter()
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const emit = defineEmits(['change-step'])
const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  effectiveCount: '有效计数',
  oem: 'OEM',
  amazonUsOrderQuantity: '订货数量(亚马逊US)',
  purchaseTotalPrice: '总采购含税价',
  finalSellingPrice: '售价',
  actualTotalCost: '产品总实际成本',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  productSize: '产品尺寸(cm)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  variantSku: '合并变体的SKU',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  sampleRetentionStatus: '拍照留样情况',
  productManager: '产品经理',
  productDesign: '产品设计',
}

const buildParams = (): IReviewStep2Req => {
  let paramVArr: IReviewStep2Item[] = []
  let vArr: any = []
  for (let i = 1; i < variantSize.value + 1; i++) {
    let n: any = {}
    variantList.value.map((item, index) => {
      n[item["column0"]] = item[i]
    })
    vArr.push(n)
  }

  vArr.forEach((item: any, index: number) => {
    const v: IReviewStep2Item = {
      orderEntryId: item.orderEntryId,
      sku: item.sku
    }

    paramVArr.push(v)
  })

  const params: IReviewStep2Req = {
    reviewId: props.reviewId,
    variantList: paramVArr
  }
  return params
}

// 当点击通过的时候
const handleSaveAndContinue = async () => {
  const deleteVNode = h('div', {}, [
    h('p', {
      style: {
        color: 'origin'
      }
    }, '请再次确认，是否通过最终审批！')
  ]);
  $baseConfirm(deleteVNode, "系统提示", async () => {
    const params = buildParams()
    const { data } = await reviewStepNo2Pass(params)
    if (data === true) {
      $baseMessage("最终审批已通过成功！", "success", "hey")
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords'
      })
    }

  })
}

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await getSkuVariantList({ reviewId: props.reviewId })
  variantSize.value = data.length;

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: (index + 1) + "",
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
      effectiveCount: (item.effectiveCount == undefined || item.effectiveCount == null) ? "" : item.effectiveCount,
      oem: (item.oem == undefined || item.oem == null) ? 0 : item.oem,
      amazonUsOrderQuantity: item.amazonUsOrderQuantity,
      purchaseTotalPrice: item.purchaseTotalPrice,
      finalSellingPrice: item.finalSellingPrice,
      actualTotalCost: item.actualTotalCost,
      grossMarginRate: item.grossMarginRate,
      packagingSize: item.packagingSize,
      productSize: item.productSize,
      material: item.material,
      battery: item.battery,
      variantSku: item.variantSku,
      benchmarkAsin: item.benchmarkAsin,
      patent: item.patent,
      sampleRetentionStatus: item.sampleRetentionStatus,
      productManager: item.productManager,
      productDesign: item.productDesign,
    }
    arr.push(n)
  })

  variantList.value = initData(arr)
}

const fetchMoldData = async () => {
  const { data } = await getMoldInfoByReviewId({ reviewId: props.reviewId })
  moldData.value = data
}


onMounted(async () => {
  fetchMoldData()
  fetchData()
})
</script>

<style lang="scss" scoped>

// 选中且不被禁用的样式
:deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #4A62E7;
  border-color: #4A62E7;
}

// 选中且被禁用的样式
:deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background: rgb(10, 108, 245);
  border-color: rgb(10, 108, 245);
}

// 选中后中间的 “✔” 的样式
:deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
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
</style>