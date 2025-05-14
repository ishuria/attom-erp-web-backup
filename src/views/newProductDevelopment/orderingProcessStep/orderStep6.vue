<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; ">
      <el-table
        ref="tableRef"
        border class="table1"
        :data="exchangeList"
        :header-cell-style="{ 'text-align': 'right' }"
        :show-header="false"
        stripe
        style="width: auto; table-layout: fixed;"
      >
        <!-- 第一列固定标签列 -->
        <el-table-column
          align="right"
          fixed
          :label="labelMap['column0']"
          :prop="'column0'"
          width="310"
        >
          <template #default="{ row }">
            <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(prop, i) in columnsChange"
          :key="i"
          align="center"
          :label="prop"
          min-width="260"
          :prop="prop"
        >
          <template #default="{ row }">
            <template v-if="row['column0'] === 'variantImg'">
              <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <el-image fit="fill" :src="row[prop]" style="display: block; width: 75px; height: 75px" @click="setPreviewImage(row[prop])">
                  <template #error><el-icon /></template>
                </el-image>
              </div>
            </template>
            <template v-if="row['column0'] === 'sampleRetention'">
              <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">
                <el-tag
                  v-for="id in row[prop]"
                  :key="id"
                  style="font-size: var(--el-font-size-base);"
                  type="info"
                >
                  {{ packageSampleOption.find(item => item.id === id)?.label }}
                </el-tag>
              </div>
            </template>
            <template v-if="row['column0'] === 'productPosition'">
              {{ productPositionOption.find(item => item.id === row[prop])?.label }}
            </template>
            <template v-if="row['column0'] === 'oem'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>
            <template v-if="row['column0'] === 'graphicDesign'">
              <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
            </template>
            <template
              v-if="row['column0'] !== 'variantImg' && row['column0'] !== 'sampleRetention'
              && row['column0'] !== 'oem' && row['column0'] !== 'productPosition' && row['column0'] !== 'graphicDesign'"
            >
              {{ row[prop] }}
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
        </template>
      </el-table>
    </div>

<!--    <div>-->
<!--      <el-table-->
<!--        border :cell-style="{ 'text-align': 'center' }"-->
<!--        :data="moldCheckList"-->
<!--        :header-cell-style="{ 'text-align': 'center' }"-->
<!--        height="100"-->
<!--        stripe-->
<!--        style="margin-top: 25px;"-->
<!--      >-->
<!--        <el-table-column label="提交日期" min-width="100" prop="createTime">-->
<!--            <template #default="{ row }">-->
<!--              <span>{{ row.createTime.split(' ')[0] }}</span>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="零件名" min-width="200" prop="component"/>-->
<!--        <el-table-column label="供应商" min-width="127" prop="suppliser"/>-->
<!--        <el-table-column align="center" label="状态" min-width="127" prop="status">-->
<!--          <template #default="{ row }">-->
<!--              <span :class="generateStatus(row.status).color">-->
<!--                  {{ generateStatus(row.status).text }}-->
<!--              </span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="center" label="开票类型" min-width="127" prop="invoiceType">-->
<!--          <template #default="{ row }">-->
<!--            {{ generateInvoiceType(row.invoiceType) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="center" label="付款金额" min-width="127" prop="payPrice"/>-->
<!--        <el-table-column align="center" label="开模处理方式" min-width="127" prop="dealMethod">-->
<!--          <template #default="{ row }">-->
<!--            {{ generateDealMethod(row.dealMethod) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--    </div>-->
    <vab-dialog
      v-model="checkPersonListVisible"
      :before-close="handleCheckPersonClose"
      title="审批人选择"
      width="480"
    >
      <el-form style="margin: 0">
        <el-form-item label="审批人员列表">
          <el-select
            v-model="reviewPersonId"
            clearable
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择审批人员"
          >
            <el-option v-for="item in personList" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handlePersonSelectConfirm">提交</el-button>
      </template>
    </vab-dialog>
    <div class="pay-button-group">
      <el-button @click="handleGoback">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交审核</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getProductPositionList, getReviewVariantPackageSampleList, reviewStepNo6CheckGet, reviewStepNo6PersonList, reviewStepNo6SaveSix } from '/@/api/devlocal/orderProcess'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { convertString } from '/@/utils/stringUtils'

defineOptions({
  name: 'OrderStep6',
})

const emit = defineEmits<{
  (e: 'change-step', value: number): void
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
const checkPersonListVisible = ref<boolean>(false)
// 审批人列表
const personList = ref<{ userId: number; userName: string}[]>([])
// 审批人id
const reviewPersonId = ref<string>('')
// const moldCheckList = ref<any>([])
const exchangeList = ref<any>([])
const props = defineProps<{ step1Data: number }>()
const router = useRouter()
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const setPreviewImage = (url: string) => {
  emit("update:previewListValue", url)
  emit("update:imagePreviewVisible", true)
}
const handleCheckPersonClose = () => {
  checkPersonListVisible.value = false
}
const handlePersonSelectConfirm = async () => {
  checkPersonListVisible.value = false
  try {
    const { data } = await reviewStepNo6SaveSix({ reviewId: classReviewId!, reviewPersonId: reviewPersonId.value })
    if (data) {
      $baseMessage("提交审核成功! ", "success", "hey")
      await delVisitedRoute(handleActivePath(route, true))
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords'
      })
    }
  } catch (error) {
    console.error(error)
  }
}
const formattedPrice = (price: string) => {
  return parseFloat(price).toFixed(2)
}

const labelMap: Record<string, string> = {
  column0: '',
  variantImg: 'SKU图片',
  productName: '产品名称',
  productPosition: '产品定位',
  oem: 'OEM',
  graphicDesign: '平面设计',
  quantity: '订货数量',
  purchaseTotalPrice: '总采购含税价',
  finalSellingPrice: '售价',
  actualTotalCost: '产品实际总成本',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  productSize: '产品尺寸(in)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  sampleRetention: '打包留样<br>(发布订货后系统自动增加数量和质检项)',
  productManager: '产品经理',
  productDesign: '产品设计',
  certification: '证书',
  variantSku: '合并变体的SKU',
}

const useTableDataLineToColumn = () => {
  // 一条数据的所有字段数组
  let props = ref<string[]>([])
  // 每个字段的分组数据
  let groupData = ref<any[][]>([])
  // 计算表头
  const columns = computed(() => {
    return props.value.length > 0 ?  [...groupData.value[0]] : []
  })
  // 根据每条数据的字段对数据进行分组
  const dataToGroupByKey = (list: any) => {
    list.forEach((item: any) => {
      // 遍历每个字段
      props.value.forEach((key, index) => {
        // 把对应字段的值放到对应字段分组中
        groupData.value[index].push(item[key])
      })
    })
  }

  // 根据分组数据，转换成最终显示的数据个数
  const changeGroupData = () => {
    // 转换后的数据
    const list: any = []
    // 解构分组数据
    // console.log('groupData.value', groupData.value);

    const [column0, ...otherData] = groupData.value
    // 初始化每一行的数据, 除去表头，有几个key就算有几行
    props.value.slice(1).forEach((prop, i) => {
      list[i] = []
      // 设置第一列标题索引名称
      const data = { [props.value[0]]: prop }
      // 通过遍历每一列的日期，设置对应行的数据
      column0.forEach((column0, dateIndex) => {
        data[column0] = otherData[i][dateIndex]
      })
      list[i] = data
    })
    return list
  }

  // 初始化分组数据
  const initGroup = (list: any) => {
    const firstData = list[0] || {}
    // 获取一条数组的所有字段
    props.value = Object.keys(firstData)
    // 初始化每个字段的分组数据
    for(let i = 0; i < props.value.length; i++) {
      groupData.value[i] = []
    }
  }

  return {
    columns,
    initData: (data: any) => {
      // 初始化分组
      initGroup(data)
      // 向分组加入数据
      dataToGroupByKey(data)
      // 初始化分组内的数据，转为列数据
      return changeGroupData()
    }
  }
}

// 当点击提交审核的时候
const handleSaveAndContinue = async () => {
  checkPersonListVisible.value = true
  try {
    const { data: person }  = await reviewStepNo6PersonList()
    personList.value = person
  } catch (error) {
    console.error(error)
  }
}
// 当点击上一步的时候
const handleGoback = () => {
  emit('change-step', 4)
}
const checkTableData = ref([])
let columnsChange: any
const fetchData = async () => {
  const { data } = await reviewStepNo6CheckGet({ reviewId: classReviewId! })
  checkTableData.value = data.map((item: any, index: number) => {
    return {
      column0: convertString(index),
      variantImg: item.variantImg,
      productName: item.productName,
      productPosition: item.productPositon,
      oem: item.oem,
      graphicDesign: item.graphicDesign,
      quantity: item.quantity,
      purchaseTotalPrice: formattedPrice(item.purchaseTotalPrice),
      finalSellingPrice: item.finalSellingPrice,
      actualTotalCost: item.actualTotalCost,
      grossMarginRate: item.grossMarginRate,
      packagingSize: item.packagingSize,
      productSize: item.productSize,
      material: item.material,
      battery: item.battery,
      benchmarkAsin: item.benchmarkAsin,
      patent: item.patent,
      sampleRetention: item.sampleRetention,
      productManager: item.productManager,
      productDesign: item.productDesign,
      certification: '',
      variantSku: item.variantSku,
      orderEntryId: item.orderEntryId,
    }
  })
  const { initData, columns } = useTableDataLineToColumn();
  console.log(checkTableData.value)
  columnsChange = columns
  exchangeList.value = initData(checkTableData.value);
  console.log(exchangeList.value)
  Object.keys(exchangeList.value[16]).forEach((key, index) => {
    if (key !== 'column0') {
      exchangeList.value[16][key] = exchangeList.value[16][key].split(',').map(Number)
    }
  })
}
let classReviewId: number | undefined

// const fetchMoldData = async () => {
//   const { data } = await reviewStepNo6CheckGetMold({ reviewId: classReviewId! })
//   if (data) {
//     moldCheckList.value = data
//   }
// }
const productPositionOption = ref<{ id: number, label: string }[]>([])
const packageSampleOption = ref<{ id: number, label: string }[]>([])
const fetchProductPositionOption = async () => {
  const { data } = await getProductPositionList()
  productPositionOption.value = data
}
const fetchPackagePositionOption = async () => {
  const { data } = await getReviewVariantPackageSampleList()
  packageSampleOption.value = data
}
onMounted(() => {
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }
  fetchProductPositionOption()
  fetchPackagePositionOption()
  fetchData()
  // fetchMoldData()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
/* 只隐藏 class 为 table1 的 el-table 的最后一行 */
:deep(.table1 .el-table__body-wrapper tr:last-child ){
  display: none;
}
.status-pending {
  color: rgb(192, 192, 192, 1);
}
.status-in {
  color: orange;
}
.status-paid {
  color: black;
}
:deep(.shareSelectDialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
:deep(.center-select) {
 text-align: center;
 text-align-last: center;
}
.custom-checkbox {
  transform: scale(1.3); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
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
</style>
