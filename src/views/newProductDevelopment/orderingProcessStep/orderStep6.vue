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
                    :prop="prop" 
                    :label="prop" 
                    v-for="(prop, i) in columns" 
                    :key="i" 
                    align="center" 
                >
                    <template #default = {row}>
                        
                        <template v-if="row['column0'] === 'imageUrl'">
                            <el-image style="width: 75px; height: 75px" :src="row[prop]" fit="fill" data-img="img"/>
                        </template>
                        <template v-if="row['column0'] !== 'imageUrl'">
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
            ref="tableRef" 

            stripe border 
            :data="POdata" 
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 25px;"
            height="90"
        >
            <!-- <el-table-column label="" width="160" prop="">
                <strong style="color: var(--el-table-header-text-color)">{{ "含在PO里的开模费" }}</strong>
            </el-table-column> -->
            <el-table-column label="提交日期" min-width="127" prop="date" align="center">
                <template #default="{ row }">
                   {{ row.date }}
                </template>
            </el-table-column>
            <el-table-column label="零件名" min-width="200" prop="name">
                    <template #default="{ row }">
                        <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                    </template>
                </el-table-column>
            <el-table-column label="供应商" min-width="127" prop="supplier">
      
            </el-table-column>
            <el-table-column label="状态" min-width="127" align="center" prop="status">
      
            </el-table-column>
            <el-table-column label="开票类型" min-width="127" align="center" prop="kaipiao">
      
            </el-table-column>
            <el-table-column label="付款金额" min-width="127" align="center" prop="cost">
      
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
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils';

defineOptions({
    name: 'OrderStep6',
})

const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()
// const listLoading = ref<boolean>(true)
const list = ref<any>([])
const exchangeList = ref<any>([])

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
  imageUrl: 'SKU图片',
  productName: '产品名称',
  orderQuantity: '订货数量(亚马逊US)',
  totalPrice: '总采购含税价',
  sellingPrice: '售价',
  cost: '产品实际总成本',
  grossProfit: '毛利率',
  packageDimensions: '包装尺寸(cm)',
  productDimensions: '产品尺寸(cm)',
  productMaterial: '产品材质',
  containsBattery: '是否含电池<br>(若有则填入电池类型)',
  asin: '对标竞品ASIN',
  patentStatus: '专利情况<br>(是否排查以及结果)',
  photoSampleStatus: '拍照留样情况',
  productManager: '产品经理',
  productDesign: '产品设计',
  certification: '证书',
  skuMerge: '合并变体的SKU',
}
const  tableData = [
    {
        column0: '变体名1',
        imageUrl: 'https://via.placeholder.com/75',
        productName: '产品名称1',
        orderQuantity: 100,
        totalPrice: '¥5000',
        sellingPrice: '$19.99',
        cost: '¥15',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productDimensions: '25x12x1',
        productMaterial: '棉',
        containsBattery: '锂电池',
        asin: 'ASIN123',
        patentStatus: '无专利',
        photoSampleStatus: '已有拍照样品',
        productManager: '王文青',
        productDesign: '任佳蓉',
        certification: 'SKU1',
        skuMerge: 'SKU123',
    },
    {
        column0: '变体名2',
        imageUrl: 'https://via.placeholder.com/85',
        productName: '产品名称1',
        orderQuantity: 100,
        totalPrice: '¥5000',
        sellingPrice: '$19.99',
        cost: '¥15',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productDimensions: '25x12x1',
        productMaterial: '棉',
        containsBattery: '锂电池',
        asin: 'ASIN123',
        patentStatus: '无专利',
        photoSampleStatus: '已有拍照样品',
        productManager: '王文青',
        productDesign: '任佳蓉',
        certification: 'SKU1',
        skuMerge: 'SKU123',
    },
]
const POdata = [
    {
        date: '2024-8-4',
        name: 'component',
        supplier: 'supplier1',
        status: '已通过',
        kaipiao: '专票',
        cost: '3600',
        dealMethod: '含在其它PO',
    }

]
interface FormattedData {
  [key: string]: any;
}
interface RowData {
  [key: string]: any;
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
    const list: FormattedData[] = []
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
  const initGroup = (list: RowData[]) => {
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
    initData: (data: RowData[] = []) => {
      // 初始化分组
      initGroup(data)
      // 向分组加入数据
      dataToGroupByKey(data)
      // 初始化分组内的数据，转为列数据
      return changeGroupData()
    }
  }
}
const { initData, columns } = useTableDataLineToColumn()
// console.log(columns) //'path-to-image.jpg', 'path-to-image.jpg'
exchangeList.value = initData(tableData)
// 当点击保存的时候
const handleSave = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击提交审核的时候
const handleSaveAndContinue = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 4)
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  