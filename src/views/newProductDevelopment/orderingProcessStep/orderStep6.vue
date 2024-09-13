<template>
  <div>
        <div>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="exchangeList" 
                :header-cell-style="{ 'text-align': 'right' }"
                height="430"
                :show-header="false"
                @cell-click="tableInputChange"
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
                >
                    <template #default = {row}>
                        
                        <template v-if="row['column0'] === 'variantImg'">
                            <el-image style="width: 75px; height: 75px" :src="row[prop]" fit="fill" data-img="img" />
                        </template>
                        <template v-if="row['column0'] !== 'variantImg'">
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
            >
              <el-table-column label="提交日期" min-width="127" prop="createTime" align="center">
                  <template #default="{ row }">
                    {{ row.createTime }}
                  </template>
              </el-table-column>
              <el-table-column label="零件名" min-width="200" prop="component">
              </el-table-column>
              <el-table-column label="供应商" min-width="127" prop="suppliser">
        
              </el-table-column>
              <el-table-column label="状态" min-width="127" align="center" prop="status">
        
              </el-table-column>
              <el-table-column label="开票类型" min-width="127" align="center" prop="invoiceType">
        
              </el-table-column>
              <el-table-column label="付款金额" min-width="127" align="center" prop="payPrice">
        
              </el-table-column>
              <el-table-column label="处理方式" min-width="127" align="center" prop="dealMethod">
        
              </el-table-column>
              <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
              </template>
            </el-table>
        </div>
        <div class="pay-button-group">
            <el-button @click="handleGoback">上一步</el-button>
            <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交审核</el-button>
        </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reviewStepNo6CheckGet, reviewStepNo6CheckGetMold, reviewStepNo6SaveSix } from '~/src/api/devlocal/orderProcess';
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils';
import { convertString } from '~/src/utils/stringUtils';

defineOptions({
    name: 'OrderStep6',
})

const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
const moldCheckList = ref<any>([])
const exchangeList = ref<any>([])
const props = defineProps<{ step1Data: number }>()
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      emit("update:priviewListValue", el.src)
      emit("update:imagePreviewVisibale", true)
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
    const { data } = await reviewStepNo6SaveSix({ reviewId: props.step1Data })
    if (data === true) {
      $baseMessage("当前信息已保存。","success","hey")
    }
  } catch (error) {
    console.error(error)
  }
}
// 当点击提交审核的时候
const handleSaveAndContinue = async () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 4)
}
const checkTableData = ref([])
let columnsChange: any
const fetchData = async () => {
  const { data } = await reviewStepNo6CheckGet({ reviewId: props.step1Data })
  checkTableData.value = data.map((item: any, index: number) => ({
        column0: convertString(index),
        variantImg: item.variantImg,
        productName: item.productName,
        amazonUsOrderQuantity: item.amazonUsOrderQuantity,
        purchaseTotalPrice: item.purchaseTotalPrice,
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

const fetchMoldData = async () => {
  const { data } = await reviewStepNo6CheckGetMold({ reviewId: props.step1Data })
  if (data) {
    moldCheckList.value = data
    console.log(moldCheckList.value);
  }
}
onMounted(async () => {
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
:deep(.el-table__body-wrapper tr:last-child ){
  display: none;
}
</style>
  