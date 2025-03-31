<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <el-table
        ref="tableRef" border :data="variantList" :header-cell-style="{ 'text-align': 'right' }" :show-header="false"
        stripe style="width: auto; table-layout: fixed;" 
      >
        <!-- 第一列固定标签列 -->
        <el-table-column align="right" fixed :label="labelMap['column0']" :prop="'column0'" width="260">
          <template #default="{ row }">
            <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
          </template>
        </el-table-column>
        <el-table-column v-for="(prop, i) in columns" :key="i" align="center" :label="prop" min-width="240" :prop="prop">
          <template #default="{ row }">
            <template v-if="row['column0'] === 'variantImg'">
              <el-image fit="fill" :src="row[prop]" style="width: 105px;height: 105px;" @click="showPreviewImage(row[prop])">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
            <template v-if="row['column0'] === 'oem'">
              <el-checkbox 
                v-model="row[prop]" 
                class="custom-checkbox" 
                :false-value="0"
                size="large" 
                :true-value="1"
              />
            </template>
            <template v-if="row['column0'] === 'effectiveCount'">
              <el-input 
                v-model="row[prop]" 
                class="center-input"
                @blur="effectiveCountInputeHandle($event)"
                @click="inputHandleMouseOver($event)"
                @keydown.enter="effectiveCountInputeHandle($event)"
              />
            </template>
            <!-- <template v-if="row['column0'] === 'packagingSize'">
              {{ row[prop] }} cm
            </template>
            <template v-if="row['column0'] === 'productSize'">
              {{ row[prop] }} inch
            </template> -->
            <template v-if="row['column0'] === 'sampleRetentionStatus'">
              <span v-show="row[prop] === 0">已有拍照样品,大货无需留样</span>
              <span v-show="row[prop] === 1">大货需要留样拍照</span>
            </template>
            <template v-if="row['column0'] === 'purchaseTotalPrice'">
              {{ Number(row[prop]).toFixed(2) }}
            </template>
            <template v-if="row['column0'] !== 'effectiveCount' && row['column0'] !== 'oem' && row['column0'] !== 'variantImg' && row['column0'] !== 'sampleRetentionStatus' && row['column0'] !== 'purchaseTotalPrice'">
              {{ row[prop] }}
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
        </template>
      </el-table>
    </div>

    <div style="padding-top: 50px;">
      <el-table border :data="moldData" :header-cell-style="{ 'text-align': 'center' }" style="margin-top: 25px;">
        <el-table-column align="center" label="提交日期">
          <template #default="{ row }">
            {{ formatDate(new Date(row.createTime)) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="零件名" prop="component" />
        <el-table-column align="center" label="供应商" prop="suppliser" />
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <el-tag v-if="row.status == 0" type="info">审批中</el-tag>
            <el-tag v-if="row.status == 1" type="warning">待提交付款申请</el-tag>
            <el-tag v-if="row.status == 2" type="success">已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="开票类型">
          <template #default="{ row }">
            <span v-if="row.invoiceType == 0">专票</span>
            <span v-if="row.invoiceType == 1">普票</span>
            <span v-if="row.invoiceType == 2">不开票</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="付款金额" prop="payPrice"/>
        <el-table-column align="center" label="处理方式">
          <template #default="{ row }">
            <span v-if="row.dealMethod == 0">不含在PO</span>
            <span v-if="row.dealMethod == 1">含在该PO</span>
            <span v-if="row.dealMethod == 2">含在其他PO</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="padding-top:50px;">
      <el-table border :cell-style="{ textAlign: 'center' }" :data="variantDetialList" :header-cell-style="{ 'text-align': 'center' }" stripe>
        <el-table-column label="变体" min-width="100" prop="variant" />
        <el-table-column label="站点" min-width="135" prop="site">
          <template #default="{ row }">
            <span v-if="row.site == 0">亚马逊US</span>
            <span v-if="row.site == 1">亚马逊DE</span>
            <span v-if="row.site == 2">亚马逊UK</span>
            <span v-if="row.site == 3">沃尔玛US</span>
          </template>
        </el-table-column>
        <el-table-column label="外汇币种" min-width="100" prop="currencyType" />
        <el-table-column label="汇率" min-width="100" prop="foreignExchange" />
        <el-table-column label="实际总成本￥" min-width="120" prop="actualTotalCost" />
        <el-table-column label="长(cm)" min-width="90" prop="packagingLength" />
        <el-table-column label="宽(cm)" min-width="90" prop="packagingWidth" />
        <el-table-column label="高(cm)" min-width="90" prop="packagingHeight" />
        <el-table-column label="重量(g)" prop="weight" />
        <el-table-column label="尾程$" min-width="70" prop="lastMile" />
        <el-table-column label="头程￥" prop="firstMile" width="90" />
        <el-table-column label="打包￥" prop="packagingPrice" width="90" />
        <el-table-column label="头程渠道" min-width="140" prop="firstMileChannel" />
        <el-table-column label="最终售价$" min-width="100" prop="finalSellingPrice" />
        <el-table-column label="毛利率" prop="grossMarginRate">
          <template #default="{ row }">
            <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate < 20" type="danger">{{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="ROI" prop="roi" >
          <template #default="{ row }">
            {{ row.roi != null ? row.roi + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="重量系数" min-width="100" prop="weightCoefficient" />
        <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient" />
        <el-table-column label="关税%" prop="tariff">
          <template #default="{ row }">
            {{ row.tariff != null ? row.tariff + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="平台佣金$" min-width="100" prop="platformCommission" />
        <el-table-column label="仓储费2个月$" min-width="140" prop="storageFee" >
          <template #default="{ row }">
            {{ row.storageFee ? row.storageFee.toFixed(2): '' }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;" />
        </template>
      </el-table>
    </div>
    <div class="pay-button-group">
      <el-button type="danger" @click="handleGoback">不通过</el-button>
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">通过</el-button>
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
  </div>
</template>

<script lang="ts" setup>
import { getMoldInfoByReviewId, getReviewByReviewId, getVariantList, reviewStepNo1Fail, reviewStepNo1Pass } from '/@/api/devlocal/orderingReview'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IReviewCommonItem, IReviewMoldItem, IReviewStepNo1Req, IReviewStepNo1Variant, IVariantInfoItem } from '/@/type/review/review'
import { formatDate } from '/@/utils/dateUtils'
import { handleActivePath } from '/@/utils/routes'
import { effectiveCountInputeHandle, inputHandleMouseOver, useTableDataLineToColumn } from '/@/utils/tableColum'

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>();

defineOptions({
  name: 'OrderReviewStep1',
})

const router = useRouter()
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const variantDetialList = ref<IVariantInfoItem[]>([])
const variantList = ref<any[]>([])
// 原始数组的长度
const variantSize = ref<number>(0)
const moldData = ref<IReviewMoldItem[]>()

const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  effectiveCount: '有效计数',
  oem: 'OEM',
  amazonUsOrderQuantity: '订货数量(亚马逊US)',
  purchaseTotalPrice: '总采购含税价',
  finalSellingPrice: '售价',
  actualTotalCost: '产品总实际成本',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  productSize: '产品尺寸(in)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  variantSku: '合并变体的SKU',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  sampleRetentionStatus: '拍照留样情况',
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
const buildParams = (): IReviewStepNo1Req => {
  let paramVArr: IReviewStepNo1Variant[] = []
  let vArr: any = []
  for (let i = 1; i < variantSize.value + 1; i++) {
    let n: any = {}
    variantList.value.map((item) => {
        n[item["column0"]] = item[i]
    })
    vArr.push(n)
  }

  vArr.forEach((item: any) => {
    const v: IReviewStepNo1Variant = {
      orderEntryId: item.orderEntryId,
      effectiveCount: item.effectiveCount,
      oem: item.oem
    }

    paramVArr.push(v)
  })

  const params: IReviewStepNo1Req = {
    reviewId: props.reviewId,
    variantList: paramVArr
  }

  return params
}


// 当点击通过的时候
const handleSaveAndContinue = async () => {
  try {
    const deleteVNode = h('div', {}, [
      h('p', {
        style: {
          color: 'origin'
        }
      }, '请再次确认，是否需要通过审批！')
    ]);
    $baseConfirm(deleteVNode, "系统提示", async () => {
      const params = buildParams()
      const { data } = await reviewStepNo1Pass(params)
      if (data === true) {
        $baseMessage("审批通过成功！", "success", "hey")
        await delVisitedRoute(handleActivePath(route, true))
        router.push({
          path: '/newProductDevelopment/newProductApprovalAndRecords'
        })
      }
    })
  } catch (error) {
    console.error(error as Error)
  }
}
// 当点击不通过的时候
const handleGoback = () => {
  try {
    const deleteVNode = h('div', {}, [
      h('p', {
        style: {
          color: 'red'
        }
      }, '确认要点击审核不通过吗？')
    ]);
    $baseConfirm(deleteVNode, "系统提示", async () => {
      const params = buildParams()
      const { data } = await reviewStepNo1Fail(params)
      if (data === true) {
        await delVisitedRoute(handleActivePath(route, true))
        $baseMessage("审核不通过提交成功", "success", "hey")
      }
    })
  } catch (error) {
    console.error(error as Error)
  }
}

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await getReviewByReviewId({ reviewId: props.reviewId })
  variantSize.value = data.length;

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: `${index + 1  }`,
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
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

const fetchVariantData = async () => {
  const { data } = await getVariantList({ reviewId: props.reviewId })
  variantDetialList.value = data;
}

onMounted(() => {
  fetchData()
  fetchMoldData()
  fetchVariantData()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}

.custom-checkbox {
  transform: scale(1.3); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.center-input .el-input__inner ){
  text-align: center;
}
</style>