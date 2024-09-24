<template>
  <div>
    <div class="comprehensive-table-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="exchangeList" 
                :header-cell-style="{ 'text-align': 'right' }"
                :show-header="false"
                @cell-click="tableInputChange"
                class="table1"
                style="width: auto; table-layout: fixed;"
            >
                <!-- 第一列固定标签列 -->
                <el-table-column 
                    :prop="'column0'" 
                    :label="labelMap['column0']" 
                    fixed
                    align="right"
                    width="260"
                >
                    <template #default="{ row }">
                        <strong v-html="labelMap[row['column0']]" style="color: var(--el-table-header-text-color)"></strong>
                    </template>
                </el-table-column>
                <el-table-column 
                    v-for="(prop, i) in columnsChange" 
                    :prop="prop" 
                    :label="prop" 
                    :key="i" 
                    align="center" 
                    min-width="260"
                >
                    <template #default = {row}>
                        
                        <template v-if="row['column0'] === 'variantImg'">
                            <el-image style="width: 75px; height: 75px" :src="row[prop]" fit="fill" data-img="img" />
                        </template>
                        <template v-if="row['column0'] === 'sampleRetentionStatus'">
                          <el-select v-model="row[prop]" placeholder="请选择拍照留样情况" disabled class="center-select">
                            <el-option 
                              v-for="item in photoSampleOptions"
                              :label="item.label"
                              :value="item.value"
                              :key="item.value"
                            >
                            </el-option>
                          </el-select>
                        </template>
                        <template v-if="row['column0'] !== 'variantImg' && row['column0'] !== 'sampleRetentionStatus'">
                          {{ row[prop] }}
                        </template>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
                </template>
            </el-table>
        </div>

      
          <div>
            <el-table 
              stripe border 
              :data="moldCheckList" 
              :header-cell-style="{ 'text-align': 'center' }"
              style="margin-top: 25px;"
              height="100"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="提交日期" min-width="100" prop="createTime">
                  <template #default="{ row }">
                    <span>{{ row.createTime.split(' ')[0] }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="零件名" min-width="200" prop="component">
              </el-table-column>
              <el-table-column label="供应商" min-width="127" prop="suppliser">
        
              </el-table-column>
              <el-table-column label="状态" min-width="127" align="center" prop="status">
                <template #default="{ row }">
                    <span :class="generateStatus(row.status).color">
                        {{ generateStatus(row.status).text }}
                    </span>
                </template>
              </el-table-column>
              <el-table-column label="开票类型" min-width="127" align="center" prop="invoiceType">
                <template #default="{ row }">
                  {{ generateInvoiceType(row.invoiceType) }}
                </template>
              </el-table-column>
              <el-table-column label="付款金额" min-width="127" align="center" prop="payPrice">
        
              </el-table-column>
              <el-table-column label="开模处理方式" min-width="127" align="center" prop="dealMethod">
                <template #default="{ row }">
                  {{ generateDealMethod(row.dealMethod) }}
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
              </template>
            </el-table>
          </div>
          <el-dialog 
            v-model="checkPersonListVisible" 
            :close-on-click-modal="false" 
            title="审批人选择" 
            width="480"
            class="moldDialog shareSelectDialog"
            :before-close="handleCheckPersonClose"
          >
            <el-space>
              <span>审批人员列表</span>
              <el-select 
                v-model="reviewPersonId" 
                placeholder="请选择审批人员"  
                collapse-tags
                collapse-tags-tooltip
                style="width: 250px;"
                clearable
              >
                <el-option v-for="item in personList" :key="item.userId" :label="item.userName" :value="item.userId" />
              </el-select>
            </el-space>
            <template #footer>
              <span>
                <el-button type="primary" @click="handlePersonSelectConfirm">提交</el-button>
              </span>
            </template>
          </el-dialog>
        <div class="pay-button-group">
            <el-button @click="handleGoback">上一步</el-button>
            <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交审核</el-button>
        </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reviewStepNo6CheckGet, reviewStepNo6CheckGetMold, reviewStepNo6PersonList, reviewStepNo6SaveSix } from '/@/api/devlocal/orderProcess';
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils';
import { convertString } from '/@/utils/stringUtils';

defineOptions({
    name: 'OrderStep6',
})
const photoSampleOptions = [
    { label: '已有拍照样品,大货无需留样', value: 0 },
    { label: '大货需要留样拍照', value: 1 }
];
const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
const checkPersonListVisible = ref<boolean>(false)
// 审批人列表
const personList = ref<{ userId: number; userName: string}[]>([])
// 审批人id
const reviewPersonId = ref<string>('')
const moldCheckList = ref<any>([])
const exchangeList = ref<any>([])
const props = defineProps<{ step1Data: number }>()
const route: any = useRoute()
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      emit("update:priviewListValue", el.src)
      emit("update:imagePreviewVisibale", true)
    }
}
const handleCheckPersonClose = () => {
  checkPersonListVisible.value = false
}
const handlePersonSelectConfirm = () => {
  checkPersonListVisible.value = false
}
const formattedPrice = (price: string) => {
    return parseFloat(price).toFixed(2)
}
const generateStatus = (value: number) => {
  switch (value) {
    case 0:
      return { text: "审批中", color: "status-pending" };
    case 1:
      return { text: "待提交付款申请", color: "status-in" };
    case 2:
      return { text: "已付款", color: "status-paid" };
    default:
      return { text: "未知", color: "status-pending" };
  }
}
const generateInvoiceType = (value: number) => {
    if (value === 0) {
        return "专票"
    } else if (value === 1) {
        return "普票"
    } else if (value === 2) {
        return "不开票"
    }
}
const generateDealMethod = (value: number) => {
    if (value === 0) {
        return "不含在PO"
    } else if (value === 1) {
        return "含在PO"
    } else if (value === 2) {
        return "含在其他PO"
    }
}
const labelMap: Record<string, string> = {
  column0: '',
  variantImg: 'SKU图片',
  productName: '产品名称',
  amazonUsOrderQuantity: '订货数量(亚马逊US)',
  purchaseTotalPrice: '总采购含税价',
  finalSellingPrice: '售价',
  actualTotalCost: '产品实际总成本',
  grossMarginRate: '毛利率',
  packagingSize: '包装尺寸(cm)',
  productSize: '产品尺寸(cm)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  sampleRetentionStatus: '拍照留样情况',
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
// 当点击保存的时候
const handleSave = async () => {
  try {
    const { data } = await reviewStepNo6SaveSix({ reviewId: classReviewId!, reviewPersonId: reviewPersonId.value })
    if (data === true) {
      $baseMessage("当前信息已保存。","success","hey")
    }
  } catch (error) {
    console.error(error)
  }
}
// 当点击提交审核的时候
const handleSaveAndContinue = async () => {
    checkPersonListVisible.value = true
    const { data }  = await reviewStepNo6PersonList()
    personList.value = data
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 4)
}
const checkTableData = ref([])
let columnsChange: any
const fetchData = async () => {
  const { data } = await reviewStepNo6CheckGet({ reviewId: classReviewId! })
  checkTableData.value = data.map((item: any, index: number) => ({
        column0: convertString(index),
        variantImg: item.variantImg,
        productName: item.productName,
        amazonUsOrderQuantity: item.amazonUsOrderQuantity,
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
        sampleRetentionStatus: item.sampleRetentionStatus,
        productManager: item.productManager,
        productDesign: item.productDesign,
        certification: '',
        variantSku: item.variantSku,
        orderEntryId: item.orderEntryId,
  }))
  const { initData, columns } = useTableDataLineToColumn();
  columnsChange = columns 
  exchangeList.value = initData(checkTableData.value);
  
}
let classReviewId: number | undefined

const fetchMoldData = async () => {
  const { data } = await reviewStepNo6CheckGetMold({ reviewId: classReviewId! })
  if (data) {
    moldCheckList.value = data
  }

}
onMounted(() => {
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
      classReviewId = props.step1Data
  } else {
      classReviewId = route.query.reviewId
  }
  fetchData()
  fetchMoldData()
  
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
</style>
  