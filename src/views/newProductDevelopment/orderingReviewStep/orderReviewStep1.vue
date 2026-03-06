<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center">
      <el-table
        ref="tableRef"
        border
        class="review-table"
        :data="variantList"
        :header-cell-style="{ 'text-align': 'right' }"
        :show-header="false"
        stripe
      >
        <!-- 第一列固定标签列 -->
        <el-table-column align="right" fixed :label="labelMap['column0']" :prop="'column0'" width="310">
          <template #default="{ row }">
            <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
          </template>
        </el-table-column>
        <el-table-column v-for="(prop, i) in columns" :key="i" align="center" :label="prop" min-width="240" :prop="prop">
          <template #default="{ row }">
            <template v-if="row['column0'] === 'variantImg'">
              <el-image fit="fill" :src="row[prop]" style="width: 75px; height: 75px" @click="showPreviewImage(row[prop])">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
            <template v-if="row['column0'] === 'productPosition'">
              <el-select v-model="row[prop]" class="center-select" :disabled="editDisabled" placeholder="请选择产品定位">
                <el-option v-for="item in productPositionOption" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </template>
            <template v-if="row['column0'] === 'oem'">
              <el-checkbox
                v-model="row[prop]"
                class="custom-checkbox"
                :disabled="editDisabled"
                :false-value="0"
                :true-value="1"
                @change="handleUpdateOEM(row, prop)"
              />
            </template>
            <template v-if="row['column0'] === 'graphicDesign'">
              <el-checkbox
                v-model="row[prop]"
                class="custom-checkbox"
                :disabled="editDisabled"
                :false-value="0"
                :true-value="1"
                @change="handleUpdateGraphicDesign(row, prop)"
              />
            </template>
            <template v-if="row['column0'] === 'sampleRetention'">
              <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center">
                <el-tag v-for="id in row[prop]" :key="id" style="font-size: var(--el-font-size-base)" type="info">
                  {{ packageSampleOption.find((item) => item.id === id)?.label }}
                </el-tag>
              </div>
            </template>
            <template v-if="row['column0'] === 'purchaseTotalPrice'">
              {{ Number(row[prop]).toFixed(2) }}
            </template>
            <template v-if="row['column0'] === 'magnetic'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" :disabled="editDisabled" :false-value="0" :true-value="1" />
            </template>
            <template v-if="row['column0'] === 'woodenProduct'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" :disabled="editDisabled" :false-value="0" :true-value="1" />
            </template>
            <template v-if="row['column0'] === 'toy'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" :disabled="editDisabled" :false-value="0" :true-value="1" />
            </template>
            <template v-if="row['column0'] === 'seasonal'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" :disabled="editDisabled" :false-value="0" :true-value="1" />
            </template>

            <template
              v-if="
                row['column0'] !== 'oem' &&
                row['column0'] !== 'variantImg' &&
                row['column0'] !== 'sampleRetention' &&
                row['column0'] !== 'purchaseTotalPrice' &&
                row['column0'] !== 'graphicDesign' &&
                row['column0'] !== 'productPosition' &&
                row['column0'] !== 'magnetic' &&
                row['column0'] !== 'woodenProduct' &&
                row['column0'] !== 'toy' &&
                row['column0'] !== 'seasonal'
              "
            >
              {{ row[prop] }}
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
        </template>
      </el-table>
    </div>

    <!-- <div style="padding-top: 50px;">
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
    </div> -->

    <div style="padding-top: 50px">
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        :data="variantDetialList"
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
      >
        <el-table-column label="变体" min-width="100" prop="variant" />
        <el-table-column label="站点" min-width="135" prop="site">
          <template #default="{ row }">
            {{ siteList.find((item) => item.id === row.site)?.label }}
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
        <el-table-column label="头程渠道" min-width="140" prop="firstMileChannel">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ channelList.find((item) => item.id === row.firstMileChannel)?.label }}</div>
              </template>
              <div class="multi-line-ellipsis">{{ channelList.find((item) => item.id === row.firstMileChannel)?.label }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="最终售价$" min-width="100" prop="finalSellingPrice" />
        <el-table-column label="毛利率" prop="grossMarginRate">
          <template #default="{ row }">
            <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate < 20" type="danger">
              {{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="ROI" prop="roi">
          <template #default="{ row }">
            {{ row.roi != null ? row.roi + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="重量系数" min-width="100" prop="weightCoefficient" />
        <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient" />
        <el-table-column label="HTS" min-width="150" prop="volumeCoefficient">
          <template #default="{ row }">
            {{ row.hts.label }}
          </template>
        </el-table-column>
        <el-table-column label="关税%" prop="tariff">
          <template #default="{ row }">
            {{ row.tariff != null ? row.tariff + '%' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="平台佣金$" min-width="100" prop="platformCommission" />
        <el-table-column label="仓储费2个月$" min-width="140" prop="storageFee">
          <template #default="{ row }">
            {{ row.storageFee ? row.storageFee.toFixed(2) : '' }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
    </div>
    <div class="pay-button-group">
      <el-button type="primary" @click="handleViewOrderApplication">查看订货申请</el-button>
      <el-button :disabled="editDisabled" type="danger" @click="handleOpenFailReason">不通过</el-button>
      <el-button :disabled="editDisabled" native-type="submit" type="primary" @click="handleSaveAndContinue">通过</el-button>
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <vab-remark-dialog
      v-model="failReasonVisible"
      :remark="failReason"
      title="填写审核不通过原因"
      @update:remark="handleReviewStepNo1Fail"
    />
  </div>
</template>

<script lang="ts" setup>
import { getChannelList } from '/@/api/devlocal/encasement'
import { getSalesSiteList } from '/@/api/devlocal/evaluation'
import { getProductPositionList, getReviewVariantPackageSampleList } from '/@/api/devlocal/orderProcess'
import {
  getReviewByReviewId,
  getVariantList,
  reviewStepNo1Fail,
  reviewStepNo1Pass,
  reviewStepSubmittedStatus,
} from '/@/api/devlocal/orderingReview'
import { updateBulkGoodsStatusByReviewId } from '/@/api/devlocal/progress'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IReviewCommonItem, IReviewStepNo1Req, IReviewStepNo1Variant, IVariantInfoItem } from '/@/type/review/review'
import { handleActivePath } from '/@/utils/routes'
import { useTableDataLineToColumn } from '/@/utils/tableColum'

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>()

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
// const moldData = ref<IReviewMoldItem[]>()
const channelList = ref<{ id: number; label: string }[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
const fetchChannelData = async () => {
  const { data } = await getChannelList()
  channelList.value = data
}
const fetchSalesSiteList = async () => {
  const { data } = await getSalesSiteList()
  siteList.value = data
}
const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  productPosition: '产品定位',
  graphicDesign: '平面设计',
  oem: 'OEM',
  quantity: '订货数量',
  purchaseTotalPrice: '总采购含税价',
  finalSellingPrice: '售价',
  actualTotalCost: '产品总实际成本',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  productSize: '产品尺寸(in)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  magnetic: '带磁',
  woodenProduct: '木制品',
  toy: '玩具',
  seasonal: '应季产品',
  moq: '起订量',
  fullCaseQty: '整箱数',
  variantSku: '合并变体的SKU',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  sampleRetention: '打包留样<br>(发布订货后系统自动增加数量和质检项)',
  productManager: '产品经理',
  productDesign: '产品设计',
}
const handleUpdateOEM = (row: any, prop: string) => {
  // console.log(row, prop)
  // console.log(variantList.value)
  // variantList.value[4][prop] = row[prop] === 1 ? 0 : 1
  if (variantList.value[4][prop] === 1 && row[prop] === 1) {
    // o 1 g 1
    row[prop] = 0
    $baseMessage('OEM和平面设计只能选一个', 'error', 'hey')
    return
  }
}
const handleUpdateGraphicDesign = (row: any, prop: string) => {
  if (variantList.value[5][prop] === 1 && row[prop] === 1) {
    // o 1 g 1
    row[prop] = 0
    $baseMessage('OEM和平面设计只能选一个', 'error', 'hey')
    return
  }
}
// 跳转到查看页面
const handleViewOrderApplication = () => {
  router.push({
    path: '/newProductDevelopment/orderingProcess',
    query: {
      reviewStatus: 1,
      reviewId: props.reviewId,
    },
  })
}
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
const buildParams = (reason: string): IReviewStepNo1Req => {
  let paramVArr: IReviewStepNo1Variant[] = []
  let vArr: any = []
  for (let i = 1; i < variantSize.value + 1; i++) {
    let n: any = {}
    variantList.value.map((item) => {
      n[item['column0']] = item[i]
    })
    vArr.push(n)
  }

  vArr.forEach((item: any) => {
    const v: IReviewStepNo1Variant = {
      orderEntryId: item.orderEntryId,
      oem: item.oem,
      productPosition: item.productPosition,
      graphicDesign: item.graphicDesign,
      magnetic: item.magnetic,
      woodenProduct: item.woodenProduct,
      toy: item.toy,
      seasonal: item.seasonal,
    }

    paramVArr.push(v)
  })

  const params: IReviewStepNo1Req = {
    reviewId: props.reviewId,
    variantList: paramVArr,
    reason: reason,
  }

  return params
}

// 当点击通过的时候
const handleSaveAndContinue = async () => {
  try {
    const deleteVNode = h('div', {}, [
      h(
        'p',
        {
          style: {
            color: 'origin',
          },
        },
        '请再次确认，是否需要通过审批！'
      ),
    ])
    $baseConfirm(deleteVNode, '系统提示', async () => {
      const params = buildParams('')
      const { data } = await reviewStepNo1Pass(params)
      if (data === true) {
        $baseMessage('审批通过成功！', 'success', 'hey')
        await delVisitedRoute(handleActivePath(route, true))
        router.push({
          path: '/newProductDevelopment/newProductApprovalAndRecords',
        })
      }
    })
  } catch (error) {
    console.error(error as Error)
  }
}
const failReason = ref<string>('')
const failReasonVisible = ref<boolean>(false)
const handleOpenFailReason = () => {
  failReason.value = ''
  failReasonVisible.value = true
}
// 当点击不通过的时候
const handleReviewStepNo1Fail = (reason: string) => {
  if (reason.trim() === '') {
    $baseMessage('请填写审核不通过原因', 'error', 'hey')
    return
  }
  try {
    const deleteVNode = h('div', {}, [
      h(
        'p',
        {
          style: {
            color: 'red',
          },
        },
        '确认要点击审核不通过吗？'
      ),
    ])
    $baseConfirm(deleteVNode, '系统提示', async () => {
      const params = buildParams(reason)
      const { data } = await reviewStepNo1Fail(params)
      if (data === true) {
        failReasonVisible.value = false
        await delVisitedRoute(handleActivePath(route, true))
        $baseMessage('审核不通过提交成功', 'success', 'hey')
        await updateBulkGoodsStatusByReviewId({ reviewId: Number(props.reviewId), status: 1 })
      }
    })
  } catch (error) {
    console.error(error as Error)
  }
}

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await getReviewByReviewId({ reviewId: props.reviewId })
  variantSize.value = data.length

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: `${index + 1}`,
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      productPosition: item.productPositon,
      graphicDesign: item.graphicDesign,
      oem: item.oem == undefined || item.oem == null ? 0 : item.oem,
      quantity: item.quantity,
      purchaseTotalPrice: item.purchaseTotalPrice,
      finalSellingPrice: item.finalSellingPrice,
      actualTotalCost: item.actualTotalCost,
      grossMarginRate: item.grossMarginRate,
      packagingSize: item.packagingSize,
      productSize: item.productSize,
      material: item.material,
      battery: item.battery,
      magnetic: item.magnetic || 0,
      woodenProduct: item.woodenProduct || 0,
      toy: item.toy || 0,
      seasonal: item.seasonal || 0,
      moq: item.moq,
      fullCaseQty: item.fullCaseQty,
      variantSku: item.variantSku,
      benchmarkAsin: item.benchmarkAsin,
      patent: item.patent,
      sampleRetention: item.sampleRetention.split(',').map(Number),
      productManager: item.productManager,
      productDesign: item.productDesign,
    }
    arr.push(n)
  })

  variantList.value = initData(arr)
}

// const fetchMoldData = async () => {
//   const { data } = await getMoldInfoByReviewId({ reviewId: props.reviewId })
//   moldData.value = data
// }

const fetchVariantData = async () => {
  const { data } = await getVariantList({ reviewId: props.reviewId })
  variantDetialList.value = data
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
  const { data } = await reviewStepSubmittedStatus({ reviewId: Number(props.reviewId), step: 1 })
  if (data === 1) {
    editDisabled.value = true
  }
}
onMounted(() => {
  fetchProductPositionOption()
  fetchPackagePositionOption()
  fetchData()
  // fetchMoldData()
  fetchChannelData()
  fetchSalesSiteList()
  fetchVariantData()
  fetchSubmittedStatus()
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
:deep(.center-input .el-input__inner) {
  text-align: center;
}
:deep(.center-select) {
  text-align: center;
  text-align-last: center;
}
.review-table {
  width: auto;
  table-layout: fixed;
}
</style>
