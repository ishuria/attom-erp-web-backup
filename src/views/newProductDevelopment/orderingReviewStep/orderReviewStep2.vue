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
        <el-table-column align="right" fixed :label="labelMap['column0']" :prop="'column0'" width="310">
          <template #default="{ row }">
            <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
          </template>
        </el-table-column>
        <el-table-column v-for="(prop, i) in columns" :key="i" align="center" :label="prop" min-width="240" :prop="prop">
          <template #default="{ row }">
            <template v-if="row['column0'] === 'sku'">
              <el-tooltip :disabled="!row[prop]" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row[prop] }}</div>
                </template>
                <el-input
                  v-model.trim="row[prop]"
                  class="center-input sku-input"
                  :disabled="editDisabled"
                  placeholder="请输入SKU"
                  @click="inputHandleMouseOver($event)"
                  @keydown.enter="handleEffectiveCountInpute($event)"
                />
              </el-tooltip>
            </template>

            <template v-if="row['column0'] === 'variantImg'">
              <el-image fit="fill" :src="row[prop]" style="width: 75px; height: 75px" @click="showPreviewImage(row[prop])">
                <template #error>
                  <el-icon />
                </template>
              </el-image>
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
            <template v-if="row['column0'] === 'productPosition'">
              <el-select v-model="row[prop]" class="center-select" :disabled="editDisabled" placeholder="请选择产品定位">
                <el-option v-for="item in productPositionOption" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
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
              {{ row[prop] !== null ? '￥' + Number(row[prop]).toFixed(2) : '' }}
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
            <template v-if="row['column0'] === 'patentFlag'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" :disabled="editDisabled" :false-value="0" :true-value="1" />
            </template>
            <template v-if="row['column0'] === 'patent'">
              <span style="white-space: pre-line">{{ row[prop] }}</span>
            </template>
            <template v-if="row['column0'] === 'moq'">{{ row[prop] }} 套</template>
            <template v-if="row['column0'] === 'fullCaseQty'">{{ row[prop] }}套</template>
            <template v-if="row['column0'] === 'approvalBusinessId'">
              {{ approvalBusinessList.find((item) => item.id === row[prop])?.label }}
            </template>
            <template
              v-if="
                row['column0'] !== 'variantImg' &&
                row['column0'] !== 'sku' &&
                row['column0'] !== 'oem' &&
                row['column0'] !== 'sampleRetention' &&
                row['column0'] !== 'purchaseTotalPrice' &&
                row['column0'] !== 'productPosition' &&
                row['column0'] !== 'graphicDesign' &&
                row['column0'] !== 'magnetic' &&
                row['column0'] !== 'woodenProduct' &&
                row['column0'] !== 'toy' &&
                row['column0'] !== 'seasonal' &&
                row['column0'] !== 'patentFlag' &&
                row['column0'] !== 'patent' &&
                row['column0'] !== 'moq' &&
                row['column0'] !== 'fullCaseQty' &&
                row['column0'] !== 'approvalBusinessId'
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

    <!-- <div style="padding-top: 20px;">
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

    <div class="pay-button-group">
      <el-button :disabled="editDisabled" type="danger" @click="goBackToStep1">不通过</el-button>
      <el-button :disabled="editDisabled" native-type="submit" type="primary" @click="handleSaveAndContinue">终审通过</el-button>
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { getProductPositionList, getReviewVariantPackageSampleList, getReviewVineSelectList } from '/@/api/devlocal/orderProcess'
import { getSkuVariantList, reviewStepNo2Fail, reviewStepNo2Pass, reviewStepSubmittedStatus } from '/@/api/devlocal/orderingReview'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IReviewCommonItem, IReviewStep2Item, IReviewStep2Req } from '/@/type/review/review'
import { handleActivePath } from '/@/utils/routes'
import { inputHandleMouseOver, useTableDataLineToColumn } from '/@/utils/tableColum'

// const moldData = ref<IReviewMoldItem[]>()
const variantList = ref<any[]>([])
// 原始数组的长度
const variantSize = ref<number>(0)

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>()

defineOptions({
  name: 'OrderReviewStep2',
})
// 输入键盘enter失去焦点h
const handleEffectiveCountInpute = (event: Event) => {
  const targetElement = event.target as HTMLInputElement
  const sku = targetElement.value.trim()
  if (sku.length > 40) {
    $baseMessage('SKU长度不能超过40个字符', 'error', 'hey')
    event.preventDefault() // 防止提交或其他默认行为
  } else {
    targetElement.blur()
  }
}
const router = useRouter()
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  productPosition: '产品定位',
  graphicDesign: '平面设计',
  oem: 'OEM',
  quantity: '订货数量',
  purchaseTotalPrice: '总采购含税价',
  finalSellingPrice: '售价',
  actualTotalCost: '产品实际单价',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  productSize: '产品尺寸(in)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  magnetic: '带磁',
  woodenProduct: '木制品',
  toy: '玩具',
  seasonal: '应季产品',
  patentFlag: '专利申请',
  variantSku: '合并变体的SKU',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  sampleRetention: '打包留样<br>(发布订货后系统自动增加数量和质检项)',
  productManager: '产品经理',
  productDesign: '产品设计',
  moq: '起订量',
  fullCaseQty: '整箱数',
  approvalBusinessId: '匹配飞书Vine审批',
}
const handleUpdateOEM = (row: any, prop: string) => {
  // console.log(row, prop)
  // console.log(variantList.value)
  // variantList.value[4][prop] = row[prop] === 1 ? 0 : 1
  if (variantList.value[5][prop] === 1 && row[prop] === 1) {
    // o 1 g 1
    row[prop] = 0
    $baseMessage('OEM和平面设计只能选一个', 'error', 'hey')
    return
  }
}
const handleUpdateGraphicDesign = (row: any, prop: string) => {
  if (variantList.value[6][prop] === 1 && row[prop] === 1) {
    // o 1 g 1
    row[prop] = 0
    $baseMessage('OEM和平面设计只能选一个', 'error', 'hey')
    return
  }
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
const buildParams = (): IReviewStep2Req => {
  let paramVArr: IReviewStep2Item[] = []
  let vArr: any = []
  for (let i = 1; i < variantSize.value + 1; i++) {
    let n: any = {}
    variantList.value.map((item) => {
      n[item['column0']] = item[i]
    })
    vArr.push(n)
  }

  vArr.forEach((item: any) => {
    const v: IReviewStep2Item = {
      orderEntryId: item.orderEntryId,
      sku: item.sku,
      productPosition: item.productPosition,
      graphicDesign: item.graphicDesign,
      oem: item.oem,
      magnetic: item.magnetic,
      woodenProduct: item.woodenProduct,
      toy: item.toy,
      seasonal: item.seasonal,
      patentFlag: item.patentFlag,
    }

    paramVArr.push(v)
  })

  const params: IReviewStep2Req = {
    reviewId: props.reviewId,
    variantList: paramVArr,
  }
  return params
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
      '请再次确认，是否通过最终审批！'
    ),
  ])
  $baseConfirm(deleteVNode, '系统提示', async () => {
    const params = buildParams()
    const { data } = await reviewStepNo2Pass(params)
    if (data === true) {
      $baseMessage('最终审批已通过成功！', 'success', 'hey')
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords',
      })
    }
  })
}
// 当点击不通过
const goBackToStep1 = () => {
  $baseConfirm('确定要点击审核不通过吗？', null, async () => {
    // 发送链接不通过
    const { data } = await reviewStepNo2Fail({ reviewId: Number(props.reviewId) })
    if (data === true) {
      $baseMessage('审核不通过提交成功', 'success', 'hey')
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords',
      })
    }
  })
}
const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await getSkuVariantList({ reviewId: props.reviewId })
  variantSize.value = data.length

  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: `${index + 1}`,
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
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
      patentFlag: item.patentFlag || 0,
      variantSku: item.variantSku,
      benchmarkAsin: item.benchmarkAsin,
      patent: item.patent,
      sampleRetention: item.sampleRetention.split(',').map(Number),
      productManager: item.productManager,
      productDesign: item.productDesign,
      moq: item.moq,
      fullCaseQty: item.fullCaseQty,
      approvalBusinessId: item.approvalBusinessId,
    }
    arr.push(n)
  })

  variantList.value = initData(arr)
  // console.log(variantList.value)
}

// const fetchMoldData = async () => {
//   const { data } = await getMoldInfoByReviewId({ reviewId: props.reviewId })
//   moldData.value = data
// }
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
  const { data } = await reviewStepSubmittedStatus({ reviewId: Number(props.reviewId), step: 2 })
  if (data === 1) {
    editDisabled.value = true
  }
}
const approvalBusinessList = ref<{ id: number; label: string }[]>([])
const fetchApprovalBusinessList = async () => {
  const { data } = await getReviewVineSelectList(Number(props.reviewId))
  approvalBusinessList.value = data
}
onMounted(async () => {
  fetchApprovalBusinessList()
  fetchProductPositionOption()
  fetchPackagePositionOption()
  // fetchMoldData()
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
:deep(.center-input .el-input__inner) {
  text-align: center;
}
:deep(.sku-input .el-input__inner) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.center-select) {
  text-align: center;
  text-align-last: center;
}
</style>
